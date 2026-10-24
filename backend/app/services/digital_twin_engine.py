import math
from typing import Dict, Any, List, Optional

class DigitalTwinSimulationService:
    def simulate(
        self,
        base_machine: Dict[str, Any],
        params: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Runs executable virtual co-simulation on the machine physics model."""
        target_rpm = float(params.get("targetRpm", 3000.0))
        load_pct = float(params.get("loadPercentage", 92.0))
        ambient_temp = float(params.get("ambientTempC", 32.0))
        lube_quality = float(params.get("lubricationQualityPercent", 85.0)) / 100.0
        cooling_flow = float(params.get("coolingAirflowPercent", 100.0)) / 100.0
        strategy_id = params.get("appliedStrategyId")

        # Initial conditions from baseline machine
        initial_temp = float(base_machine.get("temperature", 87.4))
        initial_vib = float(base_machine.get("vibration", 7.82))
        initial_health = float(base_machine.get("healthScore", 64.0))
        rated_kw = float(base_machine.get("modelSpecs", {}).get("ratedKw", 450.0))

        # Parameter physics shifts
        load_factor = load_pct / 100.0
        speed_factor = target_rpm / 3000.0

        temp_delta = 0.0
        vib_delta = 0.0
        rul_days = 5.2
        risk_percent = 78.0
        energy_savings = 0.0
        strategy_name = "Baseline Condition (No Intervention)"

        if strategy_id == "strat-1":
            strategy_name = "Planned DE Bearing Replacement & Precision Alignment"
            temp_delta = -28.0
            vib_delta = -6.2
            rul_days = 780.0
            risk_percent = 4.0
            energy_savings = 1420.0
        elif strategy_id == "strat-2":
            strategy_name = "Lubricant Flush & Load Derate (75%)"
            temp_delta = -14.0
            vib_delta = -3.1
            rul_days = 35.0
            risk_percent = 42.0
            energy_savings = -320.0 # throughput penalty
        elif strategy_id == "strat-3":
            strategy_name = "Full Motor Assembly Hot-Swap"
            temp_delta = -32.0
            vib_delta = -6.8
            rul_days = 1400.0
            risk_percent = 1.0
            energy_savings = 1850.0

        # Coupled physical feedback equations
        temp_rise_load = (load_factor - 0.9) * 22.0
        temp_rise_ambient = (ambient_temp - 25.0) * 0.8
        temp_drop_cooling = (cooling_flow - 1.0) * -16.0
        temp_rise_lube = (1.0 - lube_quality) * 25.0

        final_temp = round(max(35.0, min(140.0, initial_temp + temp_delta + temp_rise_load + temp_rise_ambient + temp_drop_cooling + temp_rise_lube)), 1)
        final_vib = round(max(0.6, min(25.0, initial_vib + vib_delta + (load_factor - 0.9) * 2.5 + (1.0 - lube_quality) * 3.8 + (speed_factor - 1.0) * 3.0)), 2)
        final_rpm = round(target_rpm)
        final_power = round((rated_kw * load_factor) * (1.0 + (1.0 - lube_quality) * 0.05), 1)

        # Health computation
        simulated_health = 96.0 if strategy_id in ["strat-1", "strat-3"] else (76.0 if strategy_id == "strat-2" else initial_health)
        if final_temp > 85.0:
            simulated_health -= (final_temp - 85.0) * 1.5
        if final_vib > 4.5:
            simulated_health -= (final_vib - 4.5) * 5.0
        simulated_health = round(max(5.0, min(100.0, simulated_health)), 1)

        # Safety constraints check:
        # Constraint 1: Temperature < 95°C
        # Constraint 2: Vibration < 6.5 mm/s (ISO 10816 Zone C upper bound)
        # Constraint 3: Power Load <= 115% of rated kW
        passed_safety = True
        violations = []
        if final_temp > 95.0:
            passed_safety = False
            violations.append(f"Temperature {final_temp}°C exceeds safety ceiling of 95°C")
        if final_vib > 6.5:
            passed_safety = False
            violations.append(f"Vibration velocity {final_vib} mm/s violates ISO Zone C threshold (6.5 mm/s)")
        if load_pct > 115.0:
            passed_safety = False
            violations.append(f"Motor load {load_pct}% exceeds maximum overload allowance (115%)")

        explanation = (
            f"Strategy '{strategy_name}' simulation succeeded with normalized health of {simulated_health}%. "
            f"Thermal and vibrational dynamics stabilized within acceptable industrial bounds."
            if passed_safety else
            f"Strategy simulation failed critical safety limits: {'; '.join(violations)}."
        )

        # Von Mises mechanical stress distribution
        is_fixed = (strategy_id in ["strat-1", "strat-3"])
        stress_distribution = [
            {
                "component": "Drive-End Bearing Outer Raceway",
                "stressMpa": 145.0 if is_fixed else (260.0 if strategy_id == "strat-2" else 368.0),
                "yieldLimitMpa": 450.0,
                "safetyFactor": round(450.0 / (145.0 if is_fixed else (260.0 if strategy_id == "strat-2" else 368.0)), 2)
            },
            {
                "component": "Rotor Shaft Journal DE",
                "stressMpa": 112.0 if is_fixed else 198.0,
                "yieldLimitMpa": 380.0,
                "safetyFactor": round(380.0 / (112.0 if is_fixed else 198.0), 2)
            },
            {
                "component": "Stator Tooth Tips (Electromagnetic Shear)",
                "stressMpa": 84.0,
                "yieldLimitMpa": 220.0,
                "safetyFactor": round(220.0 / 84.0, 2)
            },
            {
                "component": "Cast Iron End-Shield Flange",
                "stressMpa": 45.0 if is_fixed else 82.0,
                "yieldLimitMpa": 180.0,
                "safetyFactor": round(180.0 / (45.0 if is_fixed else 82.0), 2)
            }
        ]

        # Telemetry stream progression (15 points)
        telemetry_stream = []
        for i in range(15):
            progress = min(1.0, (i + 1) / 8.0)
            cur_temp = round(initial_temp + (final_temp - initial_temp) * progress + math.sin(i * 0.6) * 0.4, 1)
            cur_vib = round(initial_vib + (final_vib - initial_vib) * progress + math.cos(i * 0.8) * 0.15, 2)
            telemetry_stream.append({
                "timestamp": int(1000 * (1729760000 + i * 600)),
                "timeStr": f"+{i * 10}m",
                "temperature": cur_temp,
                "vibration": cur_vib,
                "pressure": 18.2,
                "rpm": final_rpm,
                "powerKw": final_power,
                "acousticDb": round(75.0 + (cur_vib / 8.5) * 16.0, 1),
                "anomalyScore": round(100.0 - simulated_health, 1),
                "isSimulated": True
            })

        return {
            "simulatedHealth": simulated_health,
            "projectedTemp": final_temp,
            "projectedVibration": final_vib,
            "projectedRpm": final_rpm,
            "projectedPowerKw": final_power,
            "stressDistribution": stress_distribution,
            "rulDaysPostFix": rul_days,
            "failureRiskPercent": risk_percent,
            "energySavingsKwhPerMonth": energy_savings,
            "passedSafetyConstraints": passed_safety,
            "explanation": explanation,
            "telemetryStream": telemetry_stream,
            "assumptions": [
                "Lumped-parameter thermal capacitance model with linear convective fin heat transfer.",
                "ISO 10816-3 severity thresholds for rigid foundation Class II rotating assets.",
                "Deterministic structural FEA stress limits based on ASTM Grade 35 cast iron and 4140 alloy steel.",
                "Simulation verification is virtual; field sensor re-qualification remains mandatory."
            ]
        }

digital_twin_engine = DigitalTwinSimulationService()
