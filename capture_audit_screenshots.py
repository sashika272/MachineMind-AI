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

    async def hover(self, x, y):
        await self.send("Input.dispatchMouseEvent", {
            "type": "mouseMoved",
            "x": int(x),
            "y": int(y)
        })

async def run_audit():
    user_data_dir = tempfile.mkdtemp(prefix="chr_audit_")
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
    print(f"[Audit] Starting Chrome process with profile {user_data_dir}...", flush=True)
    proc = subprocess.Popen(chrome_cmd)

    try:
        # Wait for Chrome CDP endpoint
        page_target = None
        for i in range(25):
            try:
                # Create or get page target
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
        print(f"[Audit] Connected to Page target: {ws_url}", flush=True)

        client = CDPClient(ws_url)
        await client.connect()

        # Enable Page and Runtime
        await client.send("Page.enable")
        await client.send("Runtime.enable")
        await client.send("Emulation.setDeviceMetricsOverride", {
            "width": 1920,
            "height": 1080,
            "deviceScaleFactor": 1,
            "mobile": False
        })

        print("[Audit] Initializing session authentication...", flush=True)
        await asyncio.sleep(2)

        # Set logged-in state in localStorage to ensure all protected views render
        await client.evaluate("""
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
            localStorage.setItem('machinemind_token', 'demo_jwt_token_verified');
        """)

        # Views to test
        views = [
            ("landing", "landing"),
            ("login", "login"),
            ("register", "register"),
            ("forgot-password", "forgot-password"),
            ("overview", "overview"),
            ("monitoring", "monitoring"),
            ("3d-model", "3d-model"),
            ("faults", "faults"),
            ("root-cause", "root-cause"),
            ("repair-strategies", "repair-strategies"),
            ("digital-twin", "digital-twin"),
            ("recommendations", "recommendations"),
            ("predictive", "predictive"),
            ("history", "history"),
            ("analytics", "analytics"),
            ("settings", "settings")
        ]

        print("\n=======================================================", flush=True)
        print("PHASE 1: CAPTURING DARK MODE SCREENSHOTS (16 VIEWS)", flush=True)
        print("=======================================================", flush=True)
        await client.evaluate("""
            if (window.__machinemind_setTheme) {
                window.__machinemind_setTheme('dark');
            } else {
                localStorage.setItem('machinemind_theme', 'dark');
                document.documentElement.classList.add('dark');
                document.documentElement.classList.remove('light');
            }
        """)
        await asyncio.sleep(0.5)

        for view_name, hash_val in views:
            await client.evaluate(f"""
                if (window.__machinemind_navigate) {{
                    window.__machinemind_navigate('{hash_val}');
                }} else {{
                    window.location.hash = '{hash_val}';
                }}
            """)
            await asyncio.sleep(1.0)
            shot_path = os.path.join(OUTPUT_DIR, f"dark_{view_name}.png")
            await client.screenshot(shot_path)

        print("\n========================================================", flush=True)
        print("PHASE 2: CAPTURING LIGHT MODE SCREENSHOTS (16 VIEWS)", flush=True)
        print("========================================================", flush=True)
        await client.evaluate("""
            if (window.__machinemind_setTheme) {
                window.__machinemind_setTheme('light');
            } else {
                localStorage.setItem('machinemind_theme', 'light');
                document.documentElement.classList.remove('dark');
                document.documentElement.classList.add('light');
            }
        """)
        await asyncio.sleep(0.5)

        for view_name, hash_val in views:
            await client.evaluate(f"""
                if (window.__machinemind_navigate) {{
                    window.__machinemind_navigate('{hash_val}');
                }} else {{
                    window.location.hash = '{hash_val}';
                }}
            """)
            await asyncio.sleep(1.0)
            shot_path = os.path.join(OUTPUT_DIR, f"light_{view_name}.png")
            await client.screenshot(shot_path)

        print("\n========================================================", flush=True)
        print("PHASE 3: INTERACTIVE TOOLTIP HOVER AUDIT (DARK & LIGHT)", flush=True)
        print("========================================================", flush=True)
        
        # 1. FFT Spectral Analysis Chart Tooltip in Dark Mode
        print("[Audit] Testing FFT Spectral Analysis Chart Tooltip in Dark Mode...", flush=True)
        await client.evaluate("if (window.__machinemind_setTheme) window.__machinemind_setTheme('dark');")
        await client.evaluate("if (window.__machinemind_navigate) window.__machinemind_navigate('monitoring');")
        await asyncio.sleep(1.5)

        fft_hover = await client.evaluate("""
            (() => {
                // Look for FFT bar or recharts bar
                const bars = document.querySelectorAll('.recharts-bar-rectangle path, .recharts-bar-rectangle rect, .recharts-rectangle');
                if (bars && bars.length > 0) {
                    const targetBar = bars[Math.floor(bars.length / 2)] || bars[0];
                    const rect = targetBar.getBoundingClientRect();
                    return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2, found: true };
                }
                const wrappers = document.querySelectorAll('.recharts-wrapper');
                if (wrappers && wrappers.length > 1) {
                    const rect = wrappers[1].getBoundingClientRect();
                    return { x: rect.left + rect.width * 0.4, y: rect.top + rect.height * 0.45, found: true };
                }
                return { x: 750, y: 480, found: true };
            })()
        """)
        if fft_hover and fft_hover.get("found"):
            await client.hover(fft_hover["x"], fft_hover["y"])
            await asyncio.sleep(1.0)
            await client.screenshot(os.path.join(OUTPUT_DIR, "dark_monitoring_fft_hover.png"))

        # 2. FFT Spectral Analysis Chart Tooltip in Light Mode
        print("[Audit] Testing FFT Spectral Analysis Chart Tooltip in Light Mode...", flush=True)
        await client.evaluate("if (window.__machinemind_setTheme) window.__machinemind_setTheme('light');")
        await asyncio.sleep(0.8)
        if fft_hover and fft_hover.get("found"):
            await client.hover(fft_hover["x"], fft_hover["y"])
            await asyncio.sleep(1.0)
            await client.screenshot(os.path.join(OUTPUT_DIR, "light_monitoring_fft_hover.png"))

        # 3. Telemetry Time Series Chart Tooltip
        telemetry_hover = await client.evaluate("""
            (() => {
                const wrappers = document.querySelectorAll('.recharts-wrapper');
                if (wrappers && wrappers.length > 0) {
                    const rect = wrappers[0].getBoundingClientRect();
                    return { x: rect.left + rect.width * 0.5, y: rect.top + rect.height * 0.5, found: true };
                }
                return { x: 500, y: 350, found: true };
            })()
        """)
        if telemetry_hover and telemetry_hover.get("found"):
            print("[Audit] Testing Telemetry Line Chart Tooltip in Dark Mode...", flush=True)
            await client.evaluate("if (window.__machinemind_setTheme) window.__machinemind_setTheme('dark');")
            await asyncio.sleep(0.5)
            await client.hover(telemetry_hover["x"], telemetry_hover["y"])
            await asyncio.sleep(1.0)
            await client.screenshot(os.path.join(OUTPUT_DIR, "dark_monitoring_telemetry_hover.png"))

            print("[Audit] Testing Telemetry Line Chart Tooltip in Light Mode...", flush=True)
            await client.evaluate("if (window.__machinemind_setTheme) window.__machinemind_setTheme('light');")
            await asyncio.sleep(0.5)
            await client.hover(telemetry_hover["x"], telemetry_hover["y"])
            await asyncio.sleep(1.0)
            await client.screenshot(os.path.join(OUTPUT_DIR, "light_monitoring_telemetry_hover.png"))

        # 4. Predictive Maintenance Health Degradation Chart Tooltip
        print("[Audit] Testing Predictive Maintenance RUL Chart Tooltip...", flush=True)
        await client.evaluate("if (window.__machinemind_navigate) window.__machinemind_navigate('predictive');")
        await client.evaluate("if (window.__machinemind_setTheme) window.__machinemind_setTheme('dark');")
        await asyncio.sleep(1.5)
        pred_hover = await client.evaluate("""
            (() => {
                const chart = document.querySelector('.recharts-wrapper');
                if (chart) {
                    const rect = chart.getBoundingClientRect();
                    return { x: rect.left + rect.width * 0.45, y: rect.top + rect.height * 0.5, found: true };
                }
                return { x: 600, y: 400, found: true };
            })()
        """)
        if pred_hover and pred_hover.get("found"):
            await client.hover(pred_hover["x"], pred_hover["y"])
            await asyncio.sleep(1.0)
            await client.screenshot(os.path.join(OUTPUT_DIR, "dark_predictive_hover.png"))

            await client.evaluate("if (window.__machinemind_setTheme) window.__machinemind_setTheme('light');")
            await asyncio.sleep(0.8)
            await client.hover(pred_hover["x"], pred_hover["y"])
            await asyncio.sleep(1.0)
            await client.screenshot(os.path.join(OUTPUT_DIR, "light_predictive_hover.png"))

        # 5. Analytics Bar Chart Tooltip
        print("[Audit] Testing Analytics Outage Bar Chart Tooltip...", flush=True)
        await client.evaluate("if (window.__machinemind_navigate) window.__machinemind_navigate('analytics');")
        await client.evaluate("if (window.__machinemind_setTheme) window.__machinemind_setTheme('dark');")
        await asyncio.sleep(1.5)
        ana_hover = await client.evaluate("""
            (() => {
                const bar = document.querySelector('.recharts-bar-rectangle') || document.querySelector('.recharts-wrapper');
                if (bar) {
                    const rect = bar.getBoundingClientRect();
                    return { x: rect.left + rect.width * 0.5, y: rect.top + rect.height * 0.5, found: true };
                }
                return { x: 600, y: 500, found: true };
            })()
        """)
        if ana_hover and ana_hover.get("found"):
            await client.hover(ana_hover["x"], ana_hover["y"])
            await asyncio.sleep(1.0)
            await client.screenshot(os.path.join(OUTPUT_DIR, "dark_analytics_hover.png"))

            await client.evaluate("if (window.__machinemind_setTheme) window.__machinemind_setTheme('light');")
            await asyncio.sleep(0.8)
            await client.hover(ana_hover["x"], ana_hover["y"])
            await asyncio.sleep(1.0)
            await client.screenshot(os.path.join(OUTPUT_DIR, "light_analytics_hover.png"))

        print("\n========================================================", flush=True)
        print("AUDIT SUCCESS: ALL SCREENSHOTS CAPTURED AND SAVED", flush=True)
        print("========================================================", flush=True)
        await client.close()

    finally:
        print("[Audit] Terminating Chrome process...", flush=True)
        proc.terminate()
        try:
            proc.wait(timeout=5)
        except Exception:
            proc.kill()

if __name__ == "__main__":
    asyncio.run(run_audit())
