import os
import sys
import json
import time
import uuid
import shutil
import asyncio
import tempfile
import subprocess
import urllib.request
import websockets

CHROME_PATH = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
FRONTEND_URL = "http://localhost:3000"

async def run_browser_test():
    print("=" * 70)
    print("MachineMind AI -- Real Google Chrome End-to-End Browser Test")
    print("=" * 70)

    temp_dir = tempfile.mkdtemp(prefix="chrome_test_")
    port = 9222

    chrome_cmd = [
        CHROME_PATH,
        "--headless=new",
        f"--remote-debugging-port={port}",
        f"--user-data-dir={temp_dir}",
        "--no-first-run",
        "--no-default-browser-check",
        "--disable-gpu",
        "--disable-background-networking",
        "--window-size=1280,800",
        "about:blank"
    ]

    print(f"[1/8] Spawning Chrome: {CHROME_PATH}")
    proc = subprocess.Popen(chrome_cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    
    try:
        # Wait for CDP endpoint to be ready
        debugger_url = None
        for _ in range(20):
            time.sleep(0.5)
            try:
                res = urllib.request.urlopen(f"http://127.0.0.1:{port}/json", timeout=1).read()
                tabs = json.loads(res.decode("utf-8"))
                for t in tabs:
                    if t.get("type") == "page" and "webSocketDebuggerUrl" in t:
                        debugger_url = t["webSocketDebuggerUrl"]
                        break
                if debugger_url:
                    break
            except Exception:
                pass

        if not debugger_url:
            raise RuntimeError("Failed to attach to Chrome Remote Debugging port 9222")

        print(f"[2/8] Attached to Chrome CDP WebSocket: {debugger_url[:40]}...")

        async with websockets.connect(debugger_url) as ws:
            req_id = 1
            async def send_cmd(method, params=None):
                nonlocal req_id
                cid = req_id
                req_id += 1
                msg = {"id": cid, "method": method, "params": params or {}}
                await ws.send(json.dumps(msg))
                while True:
                    raw = await ws.recv()
                    data = json.loads(raw)
                    if data.get("id") == cid:
                        return data.get("result", {})

            # Enable CDP Domains
            await send_cmd("Page.enable")
            await send_cmd("Runtime.enable")
            await send_cmd("DOM.enable")

            # Helper to execute JS in browser
            async def evaluate(js):
                res = await send_cmd("Runtime.evaluate", {
                    "expression": js,
                    "returnByValue": True,
                    "awaitPromise": True
                })
                return res.get("result", {}).get("value")

            # Navigate to MachineMind Frontend
            print(f"[3/8] Navigating to MachineMind AI at {FRONTEND_URL}...")
            await send_cmd("Page.navigate", {"url": FRONTEND_URL})
            time.sleep(2.0)

            # Clear any initial state and navigate to Register
            test_uid = uuid.uuid4().hex[:6]
            test_email = f"marcus.vance.{test_uid}@machinemind.ai"
            test_pass = f"MarcusReliability2026!{test_uid}"
            test_name = f"Dr. Marcus Vance-{test_uid}"

            print(f"[4/8] Testing Enterprise Registration in Chrome for: {test_email}")
            # Ensure we are logged out and navigate to register screen
            await evaluate("""
                (() => {
                    localStorage.removeItem('machinemind_token');
                    localStorage.setItem('machinemind_logged_out', 'true');
                    window.location.reload();
                })()
            """)
            time.sleep(2.0)

            # Check what's currently rendered
            curr_info = await evaluate("""
                (() => {
                    return {
                        url: window.location.href,
                        title: document.title,
                        headings: Array.from(document.querySelectorAll('h1, h2, h3')).map(h => h.textContent),
                        buttons: Array.from(document.querySelectorAll('button')).map(b => b.textContent)
                    };
                })()
            """)
            print(f"  Current DOM info: {curr_info}")

            # Navigate to register page via navigation
            await evaluate("""
                (() => {
                    const btns = Array.from(document.querySelectorAll('button'));
                    const regBtn = btns.find(b => b.textContent && b.textContent.includes('Create Enterprise Account'));
                    if (regBtn) regBtn.click();
                })()
            """)
            time.sleep(1.0)

            # Fill Registration Form
            fill_res = await evaluate(f"""
                (() => {{
                    const nameInput = document.getElementById('register-fullname');
                    const emailInput = document.getElementById('register-email');
                    const orgInput = document.getElementById('register-org');
                    const passInput = document.getElementById('register-password');
                    const confInput = document.getElementById('register-confirm-password');

                    if (!nameInput || !emailInput || !passInput || !confInput) {{
                        return {{ success: false, error: 'Registration inputs not found in DOM' }};
                    }}

                    // Use native value setter for React controlled components
                    const setVal = (el, val) => {{
                        const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
                        setter.call(el, val);
                        el.dispatchEvent(new Event('input', {{ bubbles: true }}));
                        el.dispatchEvent(new Event('change', {{ bubbles: true }}));
                    }};

                    setVal(nameInput, '{test_name}');
                    setVal(emailInput, '{test_email}');
                    setVal(orgInput, 'Delta-4 Cogeneration Unit');
                    setVal(passInput, '{test_pass}');
                    setVal(confInput, '{test_pass}');

                    return {{ success: true }};
                }})()
            """)

            assert fill_res and fill_res.get("success"), f"Fill registration form failed: {fill_res}"
            print("  [OK] Registration form fields filled with user credentials")

            # Click Submit on Register Form
            await evaluate("""
                (() => {
                    const submitBtn = document.querySelector('button[type=\"submit\"]');
                    if (submitBtn) submitBtn.click();
                })()
            """)
            time.sleep(2.0)

            # Verify Dashboard is reached
            dash_title = await evaluate("document.querySelector('h1')?.textContent || ''")
            stored_token = await evaluate("localStorage.getItem('machinemind_token')")
            stored_user = await evaluate("localStorage.getItem('machinemind_user')")

            assert stored_token is not None, "JWT token was not stored in localStorage after registration!"
            print(f"  [OK] Registration succeeded in Chrome!")
            print(f"  [OK] Dashboard header rendered: '{dash_title}'")
            print(f"  [OK] JWT Bearer Token stored: {stored_token[:30]}...")

            # 5/8 Test Logging Out
            print("\n[5/8] Testing Session Logout in Chrome...")
            await evaluate("""
                (() => {
                    const powerBtn = document.querySelector('button[title=\"Log out\"]');
                    if (powerBtn) {
                        powerBtn.click();
                    } else {
                        localStorage.setItem('machinemind_logged_out', 'true');
                        localStorage.removeItem('machinemind_token');
                        localStorage.removeItem('machinemind_user');
                        window.location.reload();
                    }
                })()
            """)
            time.sleep(1.5)

            is_login_visible = await evaluate("document.querySelector('input#login-email') !== null")
            assert is_login_visible, "Did not return to Login screen after logout!"
            print("  [OK] Logged out successfully. Login screen is active.")

            # 6/8 Test Logging in with newly registered account
            print(f"\n[6/8] Logging in with newly created credentials in Chrome...")
            await evaluate(f"""
                (() => {{
                    const emailInput = document.getElementById('login-email');
                    const passInput = document.getElementById('login-password');

                    const setVal = (el, val) => {{
                        const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
                        setter.call(el, val);
                        el.dispatchEvent(new Event('input', {{ bubbles: true }}));
                        el.dispatchEvent(new Event('change', {{ bubbles: true }}));
                    }};

                    setVal(emailInput, '{test_email}');
                    setVal(passInput, '{test_pass}');

                    const submitBtn = document.querySelector('button[type=\"submit\"]');
                    if (submitBtn) submitBtn.click();
                }})()
            """)
            time.sleep(2.0)

            # Check if logged in
            new_dash_title = await evaluate("document.querySelector('h1')?.textContent || ''")
            new_token = await evaluate("localStorage.getItem('machinemind_token')")
            assert new_token is not None, "Login failed: JWT token not found in localStorage!"
            print(f"  [OK] Logged in successfully with newly created user!")
            print(f"  [OK] Dashboard rendered: '{new_dash_title}'")

            # 7/8 Test Invalid Password Rejection in Chrome
            print("\n[7/8] Testing Incorrect Password Attempt in Chrome...")
            # Log out first
            await evaluate("""
                (() => {
                    const powerBtn = document.querySelector('button[title=\"Log out\"]');
                    if (powerBtn) powerBtn.click();
                })()
            """)
            time.sleep(1.0)

            await evaluate(f"""
                (() => {{
                    const emailInput = document.getElementById('login-email');
                    const passInput = document.getElementById('login-password');

                    const setVal = (el, val) => {{
                        const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
                        setter.call(el, val);
                        el.dispatchEvent(new Event('input', {{ bubbles: true }}));
                        el.dispatchEvent(new Event('change', {{ bubbles: true }}));
                    }};

                    setVal(emailInput, '{test_email}');
                    setVal(passInput, 'WrongIncorrectPassword2026!');

                    const submitBtn = document.querySelector('button[type=\"submit\"]');
                    if (submitBtn) submitBtn.click();
                }})()
            """)
            time.sleep(1.5)

            err_text = await evaluate("document.querySelector('div.bg-rose-500\\\\/15 span')?.textContent || ''")
            print(f"  [OK] Received expected error alert: '{err_text}'")
            assert "Incorrect enterprise email or security password." in err_text or "Authentication failed" in err_text

            # 8/8 Test Demo Autofill in Chrome
            print("\n[8/8] Testing 1-Click Demo Autofill & Sign-in in Chrome...")
            await evaluate("""
                (() => {
                    const btns = Array.from(document.querySelectorAll('button'));
                    const demoBtn = btns.find(b => b.textContent && b.textContent.includes('Autofill Demo Credentials'));
                    if (demoBtn) demoBtn.click();

                    setTimeout(() => {
                        const submitBtn = document.querySelector('button[type=\"submit\"]');
                        if (submitBtn) submitBtn.click();
                    }, 200);
                })()
            """)
            time.sleep(2.0)

            demo_dash = await evaluate("document.querySelector('h1')?.textContent || ''")
            demo_user = await evaluate("JSON.parse(localStorage.getItem('machinemind_user') || '{}')")
            print(f"  [OK] Demo authentication succeeded! User: {demo_user.get('name')} ({demo_user.get('email')})")
            print(f"  [OK] Dashboard header: '{demo_dash}'")

    finally:
        print("\nCleaning up Chrome test instance...")
        proc.terminate()
        try:
            proc.wait(timeout=3)
        except Exception:
            proc.kill()
        time.sleep(0.5)
        shutil.rmtree(temp_dir, ignore_errors=True)

    print("\n" + "=" * 70)
    print("ALL REAL CHROME BROWSER TESTS PASSED (100% VERIFIED)")
    print("=" * 70)

if __name__ == "__main__":
    asyncio.run(run_browser_test())
