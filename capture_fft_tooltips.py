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

async def capture_fft():
    user_data_dir = tempfile.mkdtemp(prefix="chr_fft_")
    chrome_cmd = [
        CHROME_PATH,
        "--headless=new",
        "--remote-debugging-port=9223",
        "--window-size=1920,1080",
        "--hide-scrollbars",
        "--no-first-run",
        "--no-default-browser-check",
        f"--user-data-dir={user_data_dir}"
    ]
    proc = subprocess.Popen(chrome_cmd)
    try:
        # Wait for CDP
        page_target = None
        for _ in range(20):
            try:
                r = requests.put("http://127.0.0.1:9223/json/new?http://localhost:3000/#monitoring", timeout=2)
                if r.status_code == 200:
                    page_target = r.json()
                    break
            except Exception:
                pass
            time.sleep(0.5)

        ws_url = page_target["webSocketDebuggerUrl"]
        async with websockets.connect(ws_url, max_size=100 * 1024 * 1024) as ws:
            msg_id = 0
            async def call(method, params=None):
                nonlocal msg_id
                msg_id += 1
                curr = msg_id
                await ws.send(json.dumps({"id": curr, "method": method, "params": params or {}}))
                while True:
                    resp = json.loads(await ws.recv())
                    if resp.get("id") == curr:
                        return resp.get("result", {})

            await call("Page.enable")
            await call("Runtime.enable")
            await call("Emulation.setDeviceMetricsOverride", {
                "width": 1920,
                "height": 1080,
                "deviceScaleFactor": 1,
                "mobile": False
            })

            # Auth session setup
            await call("Runtime.evaluate", {
                "expression": """
                    localStorage.setItem('machinemind_logged_out', 'false');
                    localStorage.setItem('machinemind_user', JSON.stringify({
                        id: 'USR-001',
                        email: 'elena.vance@machinemind.ai',
                        full_name: 'Dr. Elena Vance',
                        role: 'Chief Reliability Engineer',
                        organization: 'Apex Industrial Dynamics',
                        plant_location: 'Rotterdam Industrial Basin',
                        access_tier: 'Enterprise AI Full',
                        notifications_count: 3
                    }));
                    if (window.__machinemind_navigate) window.__machinemind_navigate('monitoring');
                    if (window.__machinemind_setTheme) window.__machinemind_setTheme('dark');
                """
            })
            await asyncio.sleep(2.0)

            # Scroll FFT chart into view and find the prominent 184.2 Hz bar
            bar_pos = await call("Runtime.evaluate", {
                "expression": """
                    (() => {
                        const containers = document.querySelectorAll('.recharts-responsive-container');
                        if (containers.length > 1) {
                            containers[1].scrollIntoView({ block: 'center' });
                        }
                        const bars = document.querySelectorAll('.recharts-bar-rectangle path, .recharts-bar-rectangle rect');
                        for (const b of bars) {
                            const rect = b.getBoundingClientRect();
                            if (rect.height > 30) {
                                return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 3 };
                            }
                        }
                        // Fallback
                        if (bars.length > 0) {
                            const rect = bars[0].getBoundingClientRect();
                            return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
                        }
                        return null;
                    })()
                """,
                "returnByValue": True
            })
            pos = bar_pos.get("result", {}).get("value")
            print(f"[FFT Capture] Found bar position: {pos}", flush=True)

            if pos:
                # 1. Hover in Dark Mode
                await call("Input.dispatchMouseEvent", {"type": "mouseMoved", "x": int(pos["x"]), "y": int(pos["y"])})
                await asyncio.sleep(1.2)
                res_dark = await call("Page.captureScreenshot", {"format": "png"})
                dark_file = os.path.join(OUTPUT_DIR, "dark_monitoring_fft_active_tooltip.png")
                with open(dark_file, "wb") as f:
                    f.write(base64.b64decode(res_dark["data"]))
                print(f"[Captured] {dark_file}", flush=True)

                # 2. Switch to Light Mode and Hover
                await call("Runtime.evaluate", {"expression": "if (window.__machinemind_setTheme) window.__machinemind_setTheme('light');"})
                await asyncio.sleep(0.8)
                await call("Input.dispatchMouseEvent", {"type": "mouseMoved", "x": int(pos["x"]), "y": int(pos["y"])})
                await asyncio.sleep(1.2)
                res_light = await call("Page.captureScreenshot", {"format": "png"})
                light_file = os.path.join(OUTPUT_DIR, "light_monitoring_fft_active_tooltip.png")
                with open(light_file, "wb") as f:
                    f.write(base64.b64decode(res_light["data"]))
                print(f"[Captured] {light_file}", flush=True)

    finally:
        proc.terminate()
        try:
            proc.wait(timeout=5)
        except Exception:
            proc.kill()

if __name__ == "__main__":
    asyncio.run(capture_fft())
