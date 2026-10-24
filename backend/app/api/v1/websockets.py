import asyncio
import json
from typing import Dict, Set
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.services.sensor_engine import sensor_simulator

router = APIRouter(prefix="/ws", tags=["WebSockets"])

class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, Set[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, machine_id: str):
        await websocket.accept()
        if machine_id not in self.active_connections:
            self.active_connections[machine_id] = set()
        self.active_connections[machine_id].add(websocket)

    def disconnect(self, websocket: WebSocket, machine_id: str):
        if machine_id in self.active_connections:
            self.active_connections[machine_id].discard(websocket)

manager = ConnectionManager()

@router.websocket("/telemetry/{machine_id}")
async def websocket_telemetry_stream(websocket: WebSocket, machine_id: str):
    """Streams real-time industrial telemetry over WebSocket with bi-directional controls."""
    await manager.connect(websocket, machine_id)
    is_paused = False
    interval_sec = 1.0

    async def stream_ticks():
        nonlocal is_paused, interval_sec
        try:
            while True:
                if not is_paused and not sensor_simulator.is_paused:
                    tick = sensor_simulator.generate_tick(machine_id=machine_id)
                    payload = {
                        "type": "telemetry_tick",
                        "machineId": machine_id,
                        "data": tick,
                        "isSimulated": True
                    }
                    await websocket.send_text(json.dumps(payload))
                
                speed = sensor_simulator.simulation_speed
                await asyncio.sleep(max(0.1, interval_sec / speed))
        except (WebSocketDisconnect, asyncio.CancelledError):
            pass

    stream_task = asyncio.create_task(stream_ticks())

    try:
        while True:
            # Handle inbound client commands (pause, resume, scenario, speed)
            raw_text = await websocket.receive_text()
            try:
                cmd = json.loads(raw_text)
                action = cmd.get("action")
                if action == "pause":
                    is_paused = True
                    await websocket.send_text(json.dumps({"type": "status", "isPaused": True}))
                elif action == "resume":
                    is_paused = False
                    await websocket.send_text(json.dumps({"type": "status", "isPaused": False}))
                elif action == "scenario":
                    scenario = cmd.get("scenario", "normal")
                    sensor_simulator.set_scenario(machine_id, scenario)
                    await websocket.send_text(json.dumps({"type": "scenario_changed", "scenario": scenario}))
                elif action == "speed":
                    speed = float(cmd.get("speed", 1.0))
                    sensor_simulator.set_speed(speed)
                    await websocket.send_text(json.dumps({"type": "speed_changed", "speed": speed}))
            except Exception:
                pass
    except WebSocketDisconnect:
        stream_task.cancel()
        manager.disconnect(websocket, machine_id)
    except Exception:
        stream_task.cancel()
        manager.disconnect(websocket, machine_id)
