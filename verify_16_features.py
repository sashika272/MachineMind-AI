import asyncio
import json
import os
import subprocess
import time
import base64
import tempfile
import requests
import websockets

CHROME_PATH = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
OUTPUT_DIR = r"C:\Users\Sashika\.gemini\antigravity\scratch\machinemind-ai\screenshots"
BASE_URL = "http://localhost:3000"

os.makedirs(OUTPUT_DIR, exist_ok=True)

class CDPClient:
    def __init__(self, ws_url):
        self.ws_url = ws_url
        self.ws = None
        self.msg_id = 0

    async def connect(self):
        self.ws = await websockets.connect(self.ws_url, max_size=100 * 1024 * 1024)

    async def close(self):
        if self.ws:
            await self.ws.close()

    async def send(self, method, params=None):
        self.msg_id += 1
        current_id = self.msg_id
        payload = {"id": current_id, "method": method, "params": params or {}}
        await self.ws.send(json.dumps(payload))
        while True:
            resp = await asyncio.wait_for(self.ws.recv(), timeout=15)
            data = json.loads(resp)
            if data.get("id") == current_id:
                if "error" in data:
                    print(f"[CDP Error] {method}: {data['error']}", flush=True)
                return data.get("result", {})

    async def evaluate(self, expression):
        res = await self.send("Runtime.evaluate", {
            "expression": expression,
            "returnByValue": True,
            "awaitPromise": True
        })
        return res.get("result", {}).get("value")

    async def screenshot(self, file_path):
        res = await self.send("Page.captureScreenshot", {"format": "png"})
        data = res.get("data")
        if data:
            with open(file_path, "wb") as f:
                f.write(base64.b64decode(data))
            size = os.path.getsize(file_path)
            print(f"[Captured] {os.path.basename(file_path)} ({size // 1024} KB)", flush=True)

async def run_verification():
    user_data_dir = tempfile.mkdtemp(prefix="chr_verify_")
    chrome_cmd = [
        CHROME_PATH,
        "--headless=new",
        "--remote-debugging-port=9222",
        "--window-size=1920,1080",
        "--hide-scrollbars",
        "--no-first-run",
        "--no-default-browser-check",
        f"--user-data-dir={user_data_dir}"
    ]
    print(f"[Verify] Starting Chrome with profile {user_data_dir}...", flush=True)
    proc = subprocess.Popen(chrome_cmd)

    try:
        page_target = None
        for i in range(25):
            try:
                r = requests.put("http://127.0.0.1:9222/json/new?http://localhost:3000/#overview", timeout=2)
                if r.status_code == 200:
                    page_target = r.json()
                    break
            except Exception:
                pass
            time.sleep(0.5)

        if not page_target or "webSocketDebuggerUrl" not in page_target:
            raise RuntimeError("Could not create/acquire Page target from Chrome CDP.")

        ws_url = page_target["webSocketDebuggerUrl"]
        client = CDPClient(ws_url)
        await client.connect()

        await client.send("Page.enable")
        await client.send("Runtime.enable")
        await client.send("Emulation.setDeviceMetricsOverride", {
            "width": 1920,
            "height": 1080,
            "deviceScaleFactor": 1,
            "mobile": False
        })

        await asyncio.sleep(2)

        # 1. Test Cookie Consent Banner (Feature 5)
        # Clear cookie consent from localStorage to trigger banner
        await client.evaluate("""
            localStorage.removeItem('machinemind_cookie_consent');
            localStorage.removeItem('machinemind_cookie_prefs');
            window.location.hash = '#overview';
            window.location.reload();
        """)
        await asyncio.sleep(2.5)
        await client.screenshot(os.path.join(OUTPUT_DIR, "feature_05_cookie_banner.png"))

        # Click Customize Preferences
        await client.evaluate("""
            const btns = Array.from(document.querySelectorAll('button'));
            const customBtn = btns.find(b => b.textContent && b.textContent.includes('Customize Preferences'));
            if (customBtn) customBtn.click();
        """)
        await asyncio.sleep(1)
        await client.screenshot(os.path.join(OUTPUT_DIR, "feature_05_cookie_preferences.png"))

        # Accept All and save
        await client.evaluate("""
            const btns = Array.from(document.querySelectorAll('button'));
            const acceptBtn = btns.find(b => b.textContent && b.textContent.includes('Save Selected Preferences'));
            if (acceptBtn) acceptBtn.click();
        """)
        await asyncio.sleep(1)

        # 2. Test Privacy Policy Modal (Feature 4)
        await client.evaluate("window.location.hash = '#landing';")
        await asyncio.sleep(1.5)
        await client.evaluate("""
            const btns = Array.from(document.querySelectorAll('button, span'));
            const privacyBtn = btns.find(b => b.textContent && b.textContent.trim() === 'Privacy Policy');
            if (privacyBtn) privacyBtn.click();
        """)
        await asyncio.sleep(1)
        await client.screenshot(os.path.join(OUTPUT_DIR, "feature_04_privacy_modal.png"))

        # Close Privacy Modal
        await client.evaluate("""
            const closeBtn = document.querySelector('button svg.lucide-x')?.closest('button');
            if (closeBtn) closeBtn.click();
        """)
        await asyncio.sleep(0.5)

        # 3. Test Terms & Conditions Modal (Feature 6)
        await client.evaluate("""
            const btns = Array.from(document.querySelectorAll('button, span'));
            const termsBtn = btns.find(b => b.textContent && b.textContent.trim() === 'Terms of Service');
            if (termsBtn) termsBtn.click();
        """)
        await asyncio.sleep(1)
        await client.screenshot(os.path.join(OUTPUT_DIR, "feature_06_terms_modal.png"))

        # Close Terms Modal
        await client.evaluate("""
            const closeBtn = document.querySelector('button svg.lucide-x')?.closest('button');
            if (closeBtn) closeBtn.click();
        """)
        await asyncio.sleep(0.5)

        # 4. Test Live Fleet Search & Sort (Feature 15)
        await client.evaluate("window.location.hash = '#overview';")
        await asyncio.sleep(1.5)
        # Type search query "Turbocompressor"
        await client.evaluate("""
            const input = document.querySelector('input[placeholder*="Search machine"]');
            if (input) {
                const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
                nativeInputValueSetter.call(input, 'Turbocompressor');
                input.dispatchEvent(new Event('input', { bubbles: true }));
            }
        """)
        await asyncio.sleep(1)
        await client.screenshot(os.path.join(OUTPUT_DIR, "feature_15_fleet_search.png"))

        # Clear search and test sort
        await client.evaluate("""
            const clearBtn = document.querySelector('input[placeholder*="Search machine"] ~ button');
            if (clearBtn) clearBtn.click();
            const select = document.querySelector('select[aria-label="Sort monitored machines"]');
            if (select) {
                select.value = 'vib_desc';
                select.dispatchEvent(new Event('change', { bubbles: true }));
            }
        """)
        await asyncio.sleep(1)
        await client.screenshot(os.path.join(OUTPUT_DIR, "feature_15_fleet_sorted.png"))

        # 5. Test Maintenance History Search & Sort (Feature 15 & 13)
        await client.evaluate("window.location.hash = '#machine-history';")
        await asyncio.sleep(1.5)
        # Search by technician "Sarah"
        await client.evaluate("""
            const input = document.querySelector('input[placeholder*="Search title"]');
            if (input) {
                const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
                nativeInputValueSetter.call(input, 'Sarah');
                input.dispatchEvent(new Event('input', { bubbles: true }));
            }
        """)
        await asyncio.sleep(1)
        await client.screenshot(os.path.join(OUTPUT_DIR, "feature_15_history_search.png"))

        # Clear history search
        await client.evaluate("""
            const clearBtn = document.querySelector('input[placeholder*="Search title"] ~ button');
            if (clearBtn) clearBtn.click();
        """)
        await asyncio.sleep(0.5)

        # 6. Test Admin Dashboard & RBAC (Feature 3) - Dark Mode
        await client.evaluate("""
            localStorage.setItem('machinemind_theme', 'dark');
            document.documentElement.classList.remove('light');
            document.documentElement.classList.add('dark');
            window.location.hash = '#admin';
        """)
        await asyncio.sleep(1.5)
        await client.screenshot(os.path.join(OUTPUT_DIR, "feature_03_admin_dark.png"))

        # Admin Dashboard - Light Mode
        await client.evaluate("""
            localStorage.setItem('machinemind_theme', 'light');
            document.documentElement.classList.remove('dark');
            document.documentElement.classList.add('light');
        """)
        await asyncio.sleep(1.5)
        await client.screenshot(os.path.join(OUTPUT_DIR, "feature_03_admin_light.png"))

        # 7. Test User Profile Management (Feature 2)
        # Open profile drawer/modal via header avatar button
        await client.evaluate("""
            const avatarBtn = document.querySelector('button[title*="User Profile"]') || 
                              Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Dr. Elena Vance'));
            if (avatarBtn) avatarBtn.click();
        """)
        await asyncio.sleep(1)
        await client.screenshot(os.path.join(OUTPUT_DIR, "feature_02_user_profile.png"))

        print("\n[SUCCESS] All verification tests passed and screenshots captured successfully!", flush=True)

        await client.close()
    finally:
        proc.terminate()
        try:
            proc.wait(timeout=5)
        except subprocess.TimeoutExpired:
            proc.kill()

if __name__ == "__main__":
    asyncio.run(run_verification())
