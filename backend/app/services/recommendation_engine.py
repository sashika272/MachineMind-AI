from typing import List, Dict, Any

class RecommendationEngine:
    def rank_strategies(
        self,
        strategies: List[Dict[str, Any]],
        simulation_outcomes: Dict[str, Dict[str, Any]]
    ) -> Dict[str, Any]:
        """Ranks strategies via Multi-Criteria Decision Analysis (MCDA)."""
        ranked = []
        for strat in strategies:
            s_id = strat.get("id")
            sim = simulation_outcomes.get(s_id, {})
            passed_safety = sim.get("passedSafetyConstraints", True)
            
            # Reject if safety constraint breached
            if not passed_safety:
                ranked.append({
                    "strategyId": s_id,
                    "title": strat.get("title"),
                    "status": "REJECTED_SAFETY_VIOLATION",
                    "overallScore": 0.0,
                    "rejectionReason": sim.get("explanation", "Violated critical operating limits.")
                })
                continue

            # Criteria normalization (0 - 100)
            cost = strat.get("estimatedCost", 5000.0)
            downtime = strat.get("recoveryTimeHours", 6.0)
            health_gain = strat.get("expectedOutcome", {}).get("healthGainPercent", 20.0)
            rul_extension = strat.get("expectedOutcome", {}).get("rulExtensionDays", 100.0)
            efficiency = strat.get("efficiencyImpactPercent", 0.0)

            # Scoring functions
            score_safety = 95.0 if strat.get("lotoRequired") else 80.0
            score_cost = max(10.0, 100.0 - (cost / 15000.0) * 80.0)
            score_downtime = max(10.0, 100.0 - (downtime / 12.0) * 80.0)
            score_performance = min(100.0, health_gain * 2.5)
            score_energy = max(20.0, 70.0 + efficiency * 10.0)

            # Weighted sum: Safety 30%, Cost 25%, Downtime 20%, Performance 15%, Energy 10%
            total_score = round(
                0.30 * score_safety +
                0.25 * score_cost +
                0.20 * score_downtime +
                0.15 * score_performance +
                0.10 * score_energy,
                1
            )

            ranked.append({
                "strategyId": s_id,
                "title": strat.get("title"),
                "tier": strat.get("tier"),
                "status": "APPROVED",
                "overallScore": total_score,
                "criteriaScores": {
                    "safety": round(score_safety, 1),
                    "costEfficiency": round(score_cost, 1),
                    "rapidRecovery": round(score_downtime, 1),
                    "machinePerformance": round(score_performance, 1),
                    "energySavings": round(score_energy, 1)
                },
                "rationale": (
                    "Optimal balance between long-term reliability and acceptable scheduled outage duration."
                    if total_score >= 85.0 else
                    "Viable short-term mitigation, but requires secondary overhaul."
                )
            })

        # Sort descending by overall score
        ranked.sort(key=lambda x: x["overallScore"], reverse=True)
        recommended_strategy_id = ranked[0]["strategyId"] if ranked else None

        return {
            "recommendedStrategyId": recommended_strategy_id,
            "rankings": ranked,
            "decisionMethod": "Multi-Criteria Decision Analysis (AHP-Weighted MCDA)",
            "limitations": [
                "Ranking weights assume standard baseload production priority.",
                "Emergency turnarounds with spare unit on standby may prioritize Strategy 3 hot-swap."
            ]
        }

recommendation_engine = RecommendationEngine()
