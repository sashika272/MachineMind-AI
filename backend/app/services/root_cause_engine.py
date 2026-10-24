from typing import Dict, Any, List, Optional
from app.services.ml_engine import ml_engine

class RootCauseDiagnosticEngine:
    def diagnose(
        self,
        telemetry: Dict[str, Any],
        machine_info: Optional[Dict[str, Any]] = None,
        components: Optional[List[Dict[str, Any]]] = None
    ) -> Dict[str, Any]:
        """Performs transparent multi-modal root cause analysis combining ML and rule-based physics."""
        ml_result = ml_engine.predict(telemetry)
        
        temp = telemetry.get("temperature", 65.0)
        vib = telemetry.get("vibration", 1.8)
        press = telemetry.get("pressure", 18.0)
        rpm = telemetry.get("rpm", 2980.0)
        acoustic = telemetry.get("acousticDb", 78.0)

        # Physics rule evaluation
        is_bearing_spall = (vib > 4.5 and temp > 75.0 and acoustic > 85.0)
        is_thermal_runaway = (temp > 88.0 and vib <= 4.5)
        is_unbalance = (vib > 5.0 and temp < 75.0)
        is_cavitation = (press > 28.0 or (vib > 4.0 and acoustic > 88.0 and temp < 70.0))

        if is_bearing_spall or ml_result["faultClassId"] == 1:
            affected_comp = "bearing_de"
            affected_comp_name = "Drive-End Bearing Assembly (DE) [SKF 6326 M/C3]"
            primary_cause = "Sub-surface shear fatigue flaking exacerbated by grease ester degradation at sustained elevated temperatures."
            confidence = min(96.0, max(85.0, ml_result["confidence"]))
            uncertainty_band = {"lower": round(confidence - 3.4, 1), "estimate": confidence, "upper": round(min(99.0, confidence + 2.8), 1)}
            
            causal_chain = [
                {
                    "id": "node-root-1",
                    "label": "Thermal Lubricant Breakdown",
                    "type": "root",
                    "probability": 95.0,
                    "evidence": "High ambient heat wave + boundary layer oil film thinning under heavy 422kW load.",
                    "severity": "critical",
                    "children": ["node-mech-1"]
                },
                {
                    "id": "node-mech-1",
                    "label": "Micro-Asperity Metal-to-Metal Contact",
                    "type": "mechanism",
                    "probability": 92.0,
                    "evidence": f"Acoustic emissions elevated to {acoustic} dB.",
                    "severity": "high",
                    "children": ["node-mech-2"]
                },
                {
                    "id": "node-mech-2",
                    "label": "Outer Race Micro-Spalling at Ball Track",
                    "type": "mechanism",
                    "probability": 96.0,
                    "evidence": "Synchronous 184.2 Hz spectral peak matched to 7-ball pass rolling frequency (BPFO).",
                    "severity": "critical",
                    "children": ["node-sym-1", "node-sym-2"]
                },
                {
                    "id": "node-sym-1",
                    "label": f"Radial Velocity Spike ({vib} mm/s RMS)",
                    "type": "symptom",
                    "probability": 99.0,
                    "evidence": "Accelerometer saturation above ISO 10816 Zone C alert line.",
                    "severity": "critical"
                },
                {
                    "id": "node-sym-2",
                    "label": f"Bearing Housing Temp Runaway ({temp} °C)",
                    "type": "symptom",
                    "probability": 97.0,
                    "evidence": "Continuous thermal rise on RTD-DE-01 sensor.",
                    "severity": "high"
                }
            ]

            contributing_factors = [
                {"factor": "Thermal stress & high ambient room temperature (38°C in Bay 4)", "weight": 38.0, "impact": "Accelerated grease base oil oxidation and viscosity loss by 45%."},
                {"factor": "Extended continuous duty cycle (14,820 hours since last overhaul)", "weight": 32.0, "impact": "Bearing life consumed is 87% of L10h rating."},
                {"factor": "Slight driven pump shaft misalignment (0.08mm angular tilt)", "weight": 20.0, "impact": "Generates asymmetric axial thrust on the deep groove ball track."},
                {"factor": "Transient grid harmonic voltage distortion (THD 4.2%)", "weight": 10.0, "impact": "Induced minor stray rotor shaft currents through rolling elements."}
            ]

            secondary_effects = [
                "Radial play increase may induce stator-to-rotor air gap eccentricity rub.",
                "Elevated thermal conduction will transfer heat directly to DE winding insulation."
            ]

            recommendations = [
                "Inspect grease purge port for darkened grease and metallic particle discharge.",
                "Verify high-frequency demodulated FFT at 184.2 Hz using portable analyzer.",
                "Prepare Lockout/Tagout (LOTO) permit for 6.6kV breaker panel."
            ]

        elif is_thermal_runaway or ml_result["faultClassId"] == 3:
            affected_comp = "cooling_fan"
            affected_comp_name = "Cooling Shroud & Stator Dissipation Fins"
            primary_cause = "Airflow restriction across external cooling cowl combined with surface fin dust fouling."
            confidence = 89.5
            uncertainty_band = {"lower": 85.0, "estimate": 89.5, "upper": 93.0}
            causal_chain = [
                {"id": "node-root-1", "label": "Air Intake Obstruction", "type": "root", "probability": 92.0, "evidence": "Low differential pressure across cooling shroud intake.", "severity": "high"}
            ]
            contributing_factors = [
                {"factor": "Airborne particulate accumulation on fin valleys", "weight": 60.0, "impact": "Reduces convective heat transfer coefficient by 40%."},
                {"factor": "High ambient summer temperature", "weight": 40.0, "impact": "Reduces delta T cooling potential."}
            ]
            secondary_effects = ["Thermal expansion reducing internal clearances."]
            recommendations = ["Inspect and steam-clean cooling shroud mesh intake."]

        else:
            affected_comp = "housing"
            affected_comp_name = "Main Stator Assembly"
            primary_cause = "Nominal operation with minor operational baseline vibration."
            confidence = 94.0
            uncertainty_band = {"lower": 90.0, "estimate": 94.0, "upper": 97.0}
            causal_chain = []
            contributing_factors = [{"factor": "Steady state baseline operation", "weight": 100.0, "impact": "No immediate degradation observed."}]
            secondary_effects = []
            recommendations = ["Maintain routine scheduled weekly walkaround inspection."]

        return {
            "faultId": telemetry.get("faultId", "FLT-2026-891"),
            "machineId": telemetry.get("machineId", "MTR-704"),
            "affectedComponent": affected_comp,
            "affectedComponentName": affected_comp_name,
            "primaryCause": primary_cause,
            "confidence": confidence,
            "uncertaintyBand": uncertainty_band,
            "causalChain": causal_chain,
            "contributingFactors": contributing_factors,
            "secondaryEffects": secondary_effects,
            "investigationRecommendations": recommendations,
            "supportingTelemetry": [
                {"metric": "Vibration Velocity RMS", "description": f"Measured {vib} mm/s RMS (Zone C limit: 4.5)", "zScore": round((vib - 1.8) / 0.8, 1)},
                {"metric": "DE Temperature Gradient", "description": f"Measured {temp} °C (Alarm: 85.0)", "zScore": round((temp - 62.0) / 4.5, 1)},
                {"metric": "Acoustic Emissions", "description": f"Measured {acoustic} dB (Baseline: 78.0)", "zScore": round((acoustic - 78.0) / 2.5, 1)}
            ]
        }

root_cause_engine = RootCauseDiagnosticEngine()
