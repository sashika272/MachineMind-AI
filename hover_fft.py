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

async def main():
    user_data_dir = tempfile.mkdtemp(prefix="chr_fft2_")
    chrome_cmd = [
        CHROME_PATH,
        "--headless=new",
        "--remote-debugging-port=9224",
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
                r = requests.put("http://127.0.0.1:9224/json/new?http://localhost:3000/#monitoring", timeout=2)
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

            # Setup auth
            await call("Runtime.evaluate", {
                "expression": """
                    localStorage.setItem('machinemind_logged_out', 'false');
                    localStorage.setItem('machinemind_user', JSON.stringify({
                        id: 'USR-001',
                        email: 'elena.vance@machinemind.ai',
                        full_name: 'Dr. Elena Vance',
                        role: 'Chief Reliability Engineer',
                        organization: 'Apex Industrial Dynamics'
                    }));
                    if (window.__machinemind_navigate) window.__machinemind_navigate('monitoring');
                    if (window.__machinemind_setTheme) window.__machinemind_setTheme('dark');
                """
            })
            await asyncio.sleep(2.0)

            # Find coordinates of the FFT bar in DOM
            pos = await call("Runtime.evaluate", {
                "expression": """
                    (() => {
                        const svgs = document.querySelectorAll('.recharts-surface');
                        if (svgs.length > 1) {
                            const fftSvg = svgs[1];
                            const paths = fftSvg.querySelectorAll('.recharts-bar-rectangle path, .recharts-bar-rectangle rect');
                            if (paths.length > 0) {
                                // Find the tallest bar
                                let maxH = 0;
                                let bestRect = null;
                                paths.forEach(p => {
                                    const r = p.getBoundingClientRect();
                                    if (r.height > maxH) {
                                        maxH = r.height;
                                        bestRect = r;
                                    }
                                });
                                if (bestRect) {
                                    return { x: bestRect.left + bestRect.width / 2, y: bestRect.top + bestRect.height / 2, maxH };
                                }
                            }
                        }
                        return { x: 420, y: 960, fallback: true };
                    })()
                """,
                "returnByValue": True
            })
            coords = pos.get("result", {}).get("value")
            print(f"[FFT] Target bar coords: {coords}", flush=True)

            x = int(coords["x"])
            y = int(coords["y"])

            # Hover Dark Mode
            await call("Input.dispatchMouseEvent", {"type": "mouseMoved", "x": x, "y": y})
            await asyncio.sleep(1.0)
            res_dark = await call("Page.captureScreenshot", {"format": "png"})
            with open(os.path.join(OUTPUT_DIR, "dark_monitoring_fft_hover.png"), "wb") as f:
                f.write(base64.b64decode(res_dark["data"]))
            print("[FFT] Saved dark_monitoring_fft_hover.png", flush=True)

            # Hover Light Mode
            await call("Runtime.evaluate", {"expression": "if (window.__machinemind_setTheme) window.__machinemind_setTheme('light');"})
            await asyncio.sleep(0.8)
            await call("Input.dispatchMouseEvent", {"type": "mouseMoved", "x": x, "y": y})
            await asyncio.sleep(1.0)
            res_light = await call("Page.captureScreenshot", {"format": "png"})
            with open(os.path.join(OUTPUT_DIR, "light_monitoring_fft_hover.png"), "wb") as f:
                f.write(base64.b64decode(res_light["data"]))
            print("[FFT] Saved light_monitoring_fft_hover.png", flush=True)

    finally:
        proc.terminate()
        try:
            proc.wait(timeout=5)
        except Exception:
            proc.kill()

if __name__ == "__main__":
    asyncio.run(main())
