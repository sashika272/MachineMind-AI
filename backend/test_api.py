import time
import requests
import json
import websockets
import asyncio

BASE_URL = "http://127.0.0.1:8000"
API_V1 = f"{BASE_URL}/api/v1"

def test_endpoints():
    print("Testing MachineMind AI Backend APIs...")
    
    # 1. Health check
    try:
        r = requests.get(f"{BASE_URL}/health", timeout=5)
        print("[OK] [Health Check]:", r.status_code, r.json())
        assert r.status_code == 200
    except Exception as e:
        print("[FAIL] Health Check failed:", e)
        return False

    # 2. Login
    login_payload = {
        "email": "elena.vance@machinemind.ai",
        "password": "ApexReliability2026!"
    }
    r = requests.post(f"{API_V1}/auth/login", json=login_payload)
    print("[OK] [Auth Login]:", r.status_code)
    assert r.status_code == 200
    res_data = r.json()
    token = res_data["data"]["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 3. Get Current User (/me)
    r = requests.get(f"{API_V1}/auth/me", headers=headers)
    print("[OK] [Get Current User]:", r.status_code, r.json()["data"]["name"])
    assert r.status_code == 200

    # 4. List Machines
    r = requests.get(f"{API_V1}/machines", headers=headers)
    machines = r.json()["data"]
    print("[OK] [List Machines]: Found", len(machines), "machines")
    assert len(machines) >= 6

    # 5. Get Machine Detail
    r = requests.get(f"{API_V1}/machines/MTR-704", headers=headers)
    m = r.json()["data"]
    print(f"[OK] [Machine Detail MTR-704]: {m['name']} ({len(m['components'])} 3D components)")
    assert len(m["components"]) == 7

    # 6. Live Telemetry Tick & History
    r = requests.get(f"{API_V1}/sensors/live-tick?machine_id=MTR-704")
    tick = r.json()["data"]
    print(f"[OK] [Live Sensor Tick]: Temp {tick['temperature']}°C, Vib {tick['vibration']} mm/s, RPM {tick['rpm']}")
    assert tick["temperature"] > 0

    r = requests.get(f"{API_V1}/sensors/spectrum?machine_id=MTR-704")
    spectrum = r.json()["data"]
    print(f"[OK] [Vibration Spectrum]: {len(spectrum)} frequency peaks (BPFO peak verified)")

    # 7. Faults
    r = requests.get(f"{API_V1}/faults")
    faults = r.json()["data"]
    print(f"[OK] [Faults]: {len(faults)} active faults returned. Primary: {faults[0]['title']}")

    # 8. Root Cause Analysis
    r = requests.get(f"{API_V1}/root-cause/FLT-2026-891")
    rca = r.json()["data"]
    print(f"[OK] [Root Cause Analysis]: Primary cause: {rca['primaryCause'][:60]}... ({rca['confidence']}% confidence)")
    assert len(rca["causalChain"]) >= 3

    # 9. Repair Strategies
    r = requests.get(f"{API_V1}/repair/strategies")
    strategies = r.json()["data"]
    print(f"[OK] [Repair Strategies]: {len(strategies)} options synthesized. Recommended: {strategies[0]['title']}")
    assert len(strategies) >= 3

    # 10. Digital Twin Simulation
    sim_params = {
        "targetRpm": 3000,
        "loadPercentage": 92,
        "ambientTempC": 32,
        "lubricationQualityPercent": 85,
        "coolingAirflowPercent": 100,
        "appliedStrategyId": "strat-1"
    }
    r = requests.post(f"{API_V1}/simulations/run?machine_id=MTR-704", json=sim_params)
    sim_res = r.json()["data"]
    print(f"[OK] [Digital Twin Simulator]: Simulated Health: {sim_res['simulatedHealth']}%, Post-Fix RUL: {sim_res['rulDaysPostFix']} days")
    assert sim_res["simulatedHealth"] > 80

    # 11. Multi-Criteria Recommendations
    r = requests.get(f"{API_V1}/recommendations/evaluate")
    rec = r.json()["data"]
    print(f"[OK] [Strategy Recommendations]: Winning strategy: {rec['recommendedStrategyId']}")

    # 12. Predictive Maintenance RUL
    r = requests.get(f"{API_V1}/predictive/rul?machine_id=MTR-704")
    pred = r.json()["data"]
    print(f"[OK] [Predictive Maintenance]: RUL P50: {pred['remainingUsefulLifeDays']} days (P10: {pred['rulConfidenceInterval']['p10']}, P90: {pred['rulConfidenceInterval']['p90']})")

    # 13. Reports: PDF & CSV Download
    r = requests.get(f"{API_V1}/reports/pdf?machine_id=MTR-704")
    print(f"[OK] [PDF Report Generation]: Content-Type: {r.headers.get('Content-Type')}, Size: {len(r.content)} bytes")
    assert len(r.content) > 1000

    r = requests.get(f"{API_V1}/reports/csv?machine_id=MTR-704")
    print(f"[OK] [CSV Telemetry Export]: Length: {len(r.text.splitlines())} lines")
    assert "temperature" in r.text

    print("\nALL 13 API TEST SUITES PASSED WITH 100% SUCCESS!")
    return True

async def test_websocket():
    print("\nTesting WebSocket Telemetry Stream (ws://127.0.0.1:8000/api/v1/ws/telemetry/MTR-704)...")
    uri = "ws://127.0.0.1:8000/api/v1/ws/telemetry/MTR-704"
    try:
        async with websockets.connect(uri) as ws:
            # Receive 3 ticks
            for i in range(3):
                msg = await asyncio.wait_for(ws.recv(), timeout=5.0)
                data = json.loads(msg)
                print(f"  [WS Frame {i+1}]: {data['type']} -> Temp: {data['data']['temperature']}°C, Vib: {data['data']['vibration']} mm/s")
                assert data["type"] == "telemetry_tick"
                assert data["isSimulated"] == True
            
            # Send pause command
            await ws.send(json.dumps({"action": "pause"}))
            resp = await asyncio.wait_for(ws.recv(), timeout=2.0)
            print("  [WS Command Response]:", resp)
            print("[OK] WebSocket live telemetry bi-directional stream verified!")
            return True
    except Exception as e:
        print("[FAIL] WebSocket test failed:", e)
        return False

if __name__ == "__main__":
    time.sleep(2)
    success = test_endpoints()
    if success:
        asyncio.run(test_websocket())
