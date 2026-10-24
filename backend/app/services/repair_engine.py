from typing import List, Dict, Any, Optional

class RepairStrategyEngine:
    def generate_strategies(self, fault_data: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Synthesizes structured, field-actionable engineering repair strategies."""
        fault_id = fault_data.get("faultId", fault_data.get("id", "FLT-2026-891"))
        
        strat_1 = {
            "id": "strat-1",
            "faultId": fault_id,
            "title": "Planned DE Bearing Replacement & Precision Alignment",
            "tier": "balanced",
            "description": "Schedule a controlled 6-hour maintenance window. Replace SKF 6326 M/C3 bearing with insulated ceramic-hybrid alternative, purge old grease, and perform dual-plane laser alignment.",
            "estimatedCost": 3850.0,
            "recoveryTimeHours": 6.0,
            "downtimeHours": 5.5,
            "lotoRequired": True,
            "safetyRequirements": [
                "Lockout/Tagout (LOTO) 6.6kV Breaker Panel B4-CB02",
                "Hydraulic bearing induction heater with temperature monitoring (< 110°C)",
                "Class 2 PPE, arc-flash face shield during electrical isolation",
                "Overhead crane certified rigger for end-shield removal"
            ],
            "requiredParts": [
                {"partNo": "SKF-6326-M-C3-INSOCOAT", "name": "Insocoat Deep Groove Ball Bearing (130x280x58mm)", "inStock": True, "leadTimeDays": 0, "costUsd": 1420.0},
                {"partNo": "MOBIL-SHC-POLYREX-462", "name": "Synthetic Polyurea High-Temp Grease (18kg Pail)", "inStock": True, "leadTimeDays": 0, "costUsd": 280.0},
                {"partNo": "SEAL-V-RING-VA-130", "name": "FKM Viton High-Temp V-Ring Shaft Seal", "inStock": True, "leadTimeDays": 0, "costUsd": 95.0}
            ],
            "procedure": [
                {
                    "stepNumber": 1,
                    "title": "Electrical De-energization & Verified Isolation (LOTO)",
                    "description": "Open 6.6kV vacuum circuit breaker B4-CB02. Verify absence of voltage using certified high-voltage detector wand. Ground stator terminals.",
                    "estimatedMinutes": 30,
                    "toolsRequired": ["HV Proving Unit", "Calibrated Multimeter", "LOTO Padlocks & Hasps"],
                    "safetyCheck": "Zero voltage verification witnessed by certified safety officer."
                },
                {
                    "stepNumber": 2,
                    "title": "Coupling Disconnection & DE End-Shield Dismantling",
                    "description": "Unbolt flexible disc coupling. Rig dial indicators. Remove outer bearing cover and unbolt cast end-shield.",
                    "estimatedMinutes": 60,
                    "toolsRequired": ["Torque wrench 400Nm", "Pneumatic impact gun", "Overhead 5-ton bridge crane"],
                    "safetyCheck": "Ensure rotor shaft is supported by wooden saddles to prevent winding scrape."
                },
                {
                    "stepNumber": 3,
                    "title": "Hydraulic Pulling of Damaged Bearing",
                    "description": "Attach 3-jaw hydraulic puller to bearing inner race. Apply gradual pressure up to 250 bar. Extract damaged SKF 6326 bearing.",
                    "estimatedMinutes": 45,
                    "toolsRequired": ["Enerpac 30-ton Hydraulic Puller", "Shaft sleeve protector"],
                    "safetyCheck": "Use ballistic safety blanket wrapped around bearing during pull."
                },
                {
                    "stepNumber": 4,
                    "title": "Induction Heating & Mounting of New INSOCOAT Bearing",
                    "description": "Heat new Insocoat bearing uniformly to 105°C on induction heater. Slide onto journals until seated firmly against shaft shoulder. Pack with 420g Polyrex grease.",
                    "estimatedMinutes": 45,
                    "toolsRequired": ["SKF TIH 100M Induction Heater", "Infrared Thermometer", "Grease packing gauge"],
                    "safetyCheck": "Never exceed 120°C to preserve ceramic coating dielectric breakdown integrity."
                },
                {
                    "stepNumber": 5,
                    "title": "Reassembly, Laser Alignment & Baseline Telemetry Run",
                    "description": "Reinstall end-shield and seal. Couple to pump shaft. Perform precision laser alignment to < 0.03mm tolerance. Bump test rotation.",
                    "estimatedMinutes": 90,
                    "toolsRequired": ["Prüftechnik ROTALIGN Laser Alignment Kit", "Shim pack 316SS"],
                    "safetyCheck": "Verify all guards are bolted prior to clearing LOTO."
                }
            ],
            "expectedOutcome": {
                "healthGainPercent": 32.0,
                "rulExtensionDays": 780.0,
                "riskReductionPercent": 94.0
            },
            "efficiencyImpactPercent": 1.8,
            "recommendationScore": 96.0,
            "isRecommended": True,
            "tradeoffs": {
                "pros": [
                    "Completely resolves root cause with ceramic insulation protecting from future stray currents",
                    "Restores health score from 64% to 96% and resets bearing L10h life",
                    "All replacement parts are on-site in Delta-4 warehouse aisle 14"
                ],
                "cons": [
                    "Requires scheduled 5.5-hour downtime on Feedwater Treatment Line",
                    "Requires certified high-voltage isolation technician"
                ]
            }
        }

        strat_2 = {
            "id": "strat-2",
            "faultId": fault_id,
            "title": "Conditioned Lubricant High-Pressure Flush & Load Derate (75%)",
            "tier": "conservative",
            "description": "Temporary non-intrusive mitigation without dismantling. Flush grease cavity with synthetic high-viscosity ester grease, and derate motor load to 310 kW (75%) to curb frictional heat generation.",
            "estimatedCost": 650.0,
            "recoveryTimeHours": 1.5,
            "downtimeHours": 0.5,
            "lotoRequired": False,
            "safetyRequirements": [
                "Safety glasses and nitrile grease-resistant gloves",
                "Live equipment perimeter barrier tape (1.5m clearance)",
                "Continuous vibration monitoring during automated re-greasing cycle"
            ],
            "requiredParts": [
                {"partNo": "MOBIL-SHC-POLYREX-462-CRTG", "name": "Grease Cartridge High Viscosity 400g (x4)", "inStock": True, "leadTimeDays": 0, "costUsd": 120.0}
            ],
            "procedure": [
                {
                    "stepNumber": 1,
                    "title": "Load Derate via Distributed Control System (DCS)",
                    "description": "Signal DCS to throttle feedwater valve 4-FV-101, reducing MTR-704 draw from 422 kW to 315 kW.",
                    "estimatedMinutes": 15,
                    "toolsRequired": ["DCS Operator Terminal Console"],
                    "safetyCheck": "Verify downstream steam drum level remains within green band."
                },
                {
                    "stepNumber": 2,
                    "title": "Purge Old Degraded Grease & Inject Fresh Lubricant",
                    "description": "Open grease relief drain plug. Pump 350 grams fresh Mobil Polyrex grease while motor is rotating at reduced RPM.",
                    "estimatedMinutes": 45,
                    "toolsRequired": ["Pneumatic grease gun with digital flowmeter"],
                    "safetyCheck": "Monitor purge port for smooth discharge of oxidized dark grease."
                },
                {
                    "stepNumber": 3,
                    "title": "Vibration & Thermal Trend Verification",
                    "description": "Observe real-time temperature drop on RTD-DE-01 and verify velocity drops below 6.0 mm/s.",
                    "estimatedMinutes": 30,
                    "toolsRequired": ["Handheld Fluke 805 Vibration Meter"],
                    "safetyCheck": "If temperature rises above 95°C during re-greasing, initiate immediate trip."
                }
            ],
            "expectedOutcome": {
                "healthGainPercent": 12.0,
                "rulExtensionDays": 35.0,
                "riskReductionPercent": 55.0
            },
            "efficiencyImpactPercent": -3.5,
            "recommendationScore": 78.0,
            "isRecommended": False,
            "tradeoffs": {
                "pros": [
                    "Minimal downtime (only 30 minutes throttled operation)",
                    "Extremely low immediate operational cost ($650)",
                    "Buys 35 days of run-time until major plant turnaround in December"
                ],
                "cons": [
                    "Does not repair physical micro-spall on outer raceway",
                    "Reduces plant feed throughput by 12%",
                    "Bearing will continue degrading, requiring heightened 24/7 monitoring"
                ]
            }
        }

        strat_3 = {
            "id": "strat-3",
            "faultId": fault_id,
            "title": "Full Motor Assembly Hot-Swap with Standby Asset MTR-708",
            "tier": "aggressive",
            "description": "Complete replacement of entire motor with pre-commissioned zero-hour spare unit from reserve rack. Maximizes long-term reliability for critical baseload operation.",
            "estimatedCost": 14800.0,
            "recoveryTimeHours": 12.0,
            "downtimeHours": 11.0,
            "lotoRequired": True,
            "safetyRequirements": [
                "Full facility LOTO & electrical disconnect clearance",
                "Dual 10-ton overhead crane tandem lift plan",
                "Structural foundation anchor bolt torque inspection team"
            ],
            "requiredParts": [
                {"partNo": "MTR-COMPLETE-450KW-SPARE", "name": "Spare 450kW High-Voltage Motor MTR-708 (Refurbished)", "inStock": True, "leadTimeDays": 0, "costUsd": 12500.0}
            ],
            "procedure": [
                {
                    "stepNumber": 1,
                    "title": "Full Electrical & Mechanical Disconnection",
                    "description": "Disconnect 6.6kV supply cables, instrumentation wiring, cooling conduits, and unbolt anchor bolts.",
                    "estimatedMinutes": 120,
                    "toolsRequired": ["Hydraulic torque wrenches", "Cable handling rigging"],
                    "safetyCheck": "Verify cable phase tagging to prevent reverse rotation on replacement."
                },
                {
                    "stepNumber": 2,
                    "title": "Heavy Crane Lift & Swap to Spare Asset",
                    "description": "Rig 4-leg wire rope sling to lifting lugs. Lift MTR-704 to transport dolly. Rig spare MTR-708 into place.",
                    "estimatedMinutes": 240,
                    "toolsRequired": ["Overhead Bridge Crane", "Rigging Slings", "Precision Level"],
                    "safetyCheck": "Maintain exclusion zone under crane envelope."
                },
                {
                    "stepNumber": 3,
                    "title": "Full Recommissioning & Laser Alignment",
                    "description": "Grout inspection, shim placement, laser alignment to 0.02mm, megger testing, and uncoupled solo test run.",
                    "estimatedMinutes": 360,
                    "toolsRequired": ["Laser alignment system", "5kV Megohmmeter", "Vibration analyzer"],
                    "safetyCheck": "Perform 2-hour solo no-load burn-in before coupling to pump."
                }
            ],
            "expectedOutcome": {
                "healthGainPercent": 36.0,
                "rulExtensionDays": 1400.0,
                "riskReductionPercent": 99.0
            },
            "efficiencyImpactPercent": 2.4,
            "recommendationScore": 84.0,
            "isRecommended": False,
            "tradeoffs": {
                "pros": [
                    "Completely brand-new zero-hour asset installed",
                    "Highest long-term reliability and max efficiency gain"
                ],
                "cons": [
                    "High cost ($14,800) and substantial 11-hour downtime",
                    "Consumes the only spare high-voltage motor in the plant inventory"
                ]
            }
        }

        return [strat_1, strat_2, strat_3]

repair_engine = RepairStrategyEngine()
