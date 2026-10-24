import math
import random
import time
from datetime import datetime, timezone
from typing import Dict, Any, List, Optional

class SensorSimulationService:
    def __init__(self):
        # Current active scenario per machine
        self.scenarios: Dict[str, str] = {
            "MTR-704": "bearing_spall",
            "PMP-201": "normal",
            "CMP-409": "pressure_surge",
            "MTR-705": "normal",
            "HYD-112": "normal",
            "MTR-802": "normal"
        }
        # Multipliers
        self.simulation_speed: float = 1.0 # 1x, 2x, 5x
        self.is_paused: bool = False
        
        # State counters for progressive degradation drift
        self.tick_counters: Dict[str, int] = {
            "MTR-704": 120,
            "PMP-201": 0,
            "CMP-409": 45,
            "MTR-705": 10,
            "HYD-112": 0,
            "MTR-802": 0
        }

    def set_scenario(self, machine_id: str, scenario: str):
        valid = ["normal", "bearing_spall", "overheating", "pressure_surge", "multi_anomaly"]
        if scenario in valid:
            self.scenarios[machine_id] = scenario
            self.tick_counters[machine_id] = 10 if scenario != "normal" else 0

    def get_scenario(self, machine_id: str) -> str:
        return self.scenarios.get(machine_id, "normal")

    def set_speed(self, speed: float):
        self.simulation_speed = max(0.2, min(10.0, speed))

    def toggle_pause(self) -> bool:
        self.is_paused = not self.is_paused
        return self.is_paused

    def generate_tick(self, machine_id: str = "MTR-704", base_data: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """Generates realistic sensor readings based on selected scenario."""
        scenario = self.get_scenario(machine_id)
        tick = self.tick_counters.get(machine_id, 0)
        self.tick_counters[machine_id] = tick + 1
        
        now = datetime.now(timezone.utc)
        hour = now.strftime("%H")
        minute = now.strftime("%M")
        second = now.strftime("%S")
        time_str = f"{hour}:{minute}:{second}"

        # Standard physical baselines for industrial induction motor
        base_temp = 62.0
        base_vib = 1.85
        base_press = 18.2
        base_rpm = 2975.0
        base_power = 415.0
        base_db = 78.0

        # Gaussian micro-noise
        noise_t = random.gauss(0, 0.15)
        noise_v = random.gauss(0, 0.08)
        noise_p = random.gauss(0, 0.1)
        noise_rpm = random.randint(-4, 4)

        if scenario == "normal":
            temp = base_temp + noise_t
            vib = base_vib + noise_v
            press = base_press + noise_p
            rpm = base_rpm + noise_rpm
            power = base_power + random.uniform(-1.0, 1.0)
            acoustic = base_db + random.uniform(-0.5, 0.5)
            anomaly_score = random.uniform(5.0, 15.0)

        elif scenario == "bearing_spall":
            # Progressive outer race flaking: high vibration, rising temperature, ultrasonic acoustic emission
            drift = min(1.0, tick / 200.0)
            temp = base_temp + (28.0 * drift) + noise_t + math.sin(tick * 0.1) * 0.5
            vib = base_vib + (6.4 * drift) + noise_v + math.cos(tick * 0.2) * 0.3
            press = base_press + noise_p
            rpm = base_rpm + noise_rpm
            power = base_power + (12.0 * drift) + random.uniform(-1.0, 1.5)
            acoustic = base_db + (15.5 * drift) + random.uniform(-0.5, 1.0)
            anomaly_score = min(98.0, 45.0 + (50.0 * drift))

        elif scenario == "overheating":
            # Cooling restriction / high ambient heat runaway
            drift = min(1.0, tick / 150.0)
            temp = base_temp + (38.0 * drift) + noise_t
            vib = base_vib + (1.5 * drift) + noise_v
            press = base_press + noise_p
            rpm = base_rpm + noise_rpm - (15.0 * drift) # thermal slip increase
            power = base_power + (20.0 * drift)
            acoustic = base_db + (4.0 * drift)
            anomaly_score = min(95.0, 40.0 + (55.0 * drift))

        elif scenario == "pressure_surge":
            # Hydraulic blockage or impeller cavitation
            surge = math.sin(tick * 0.3) * 14.0
            temp = base_temp + 5.0 + noise_t
            vib = base_vib + abs(surge) * 0.25 + noise_v
            press = base_press + surge + noise_p
            rpm = base_rpm + noise_rpm
            power = base_power + (abs(surge) * 1.5)
            acoustic = base_db + 8.0
            anomaly_score = 72.0

        elif scenario == "multi_anomaly":
            # Both bearing degradation and cooling failure
            drift = min(1.0, tick / 100.0)
            temp = base_temp + (35.0 * drift) + noise_t
            vib = base_vib + (7.2 * drift) + noise_v
            press = base_press + noise_p
            rpm = base_rpm - (20.0 * drift)
            power = base_power + (25.0 * drift)
            acoustic = base_db + (18.0 * drift)
            anomaly_score = 99.0
        else:
            temp, vib, press, rpm, power, acoustic, anomaly_score = base_temp, base_vib, base_press, base_rpm, base_power, base_db, 10.0

        return {
            "timestamp": int(now.timestamp() * 1000),
            "timeStr": time_str,
            "temperature": round(float(temp), 1),
            "vibration": round(float(max(0.4, vib)), 2),
            "pressure": round(float(press), 1),
            "rpm": round(float(rpm)),
            "powerKw": round(float(power), 1),
            "acousticDb": round(float(acoustic), 1),
            "anomalyScore": round(float(anomaly_score), 1),
            "isSimulated": True,
            "simulationScenario": scenario,
            "machineId": machine_id
        }

sensor_simulator = SensorSimulationService()
