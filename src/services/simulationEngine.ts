import { 
  TelemetryPoint, 
  DigitalTwinSimulationParams, 
  SimulationResult,
  Machine
} from '../types';

export function runDigitalTwinSimulation(
  baseMachine: Machine, 
  params: DigitalTwinSimulationParams
): SimulationResult {
  const {
    targetRpm,
    loadPercentage,
    ambientTempC,
    lubricationQualityPercent,
    coolingAirflowPercent,
    appliedStrategyId
  } = params;

  // Physics baseline calculation
  const loadFactor = loadPercentage / 100;
  const speedFactor = targetRpm / 3000;
  const coolingFactor = coolingAirflowPercent / 100;
  const lubeFactor = lubricationQualityPercent / 100;

  let health = 64;
  let tempDelta = 0;
  let vibDelta = 0;
  let rulDays = 5.2;
  let riskPercent = 78;
  let energySavingsKwh = 0;

  if (appliedStrategyId === 'strat-1') {
    // Strategy 1: Bearing Replacement & Precision Alignment
    health = 96;
    tempDelta = -28;
    vibDelta = -6.2;
    rulDays = 780;
    riskPercent = 4;
    energySavingsKwh = 1420;
  } else if (appliedStrategyId === 'strat-2') {
    // Strategy 2: Lubricant flush & load derating
    health = 76;
    tempDelta = -14;
    vibDelta = -3.1;
    rulDays = 35;
    riskPercent = 42;
    energySavingsKwh = -320; // lower throughput penalty
  } else if (appliedStrategyId === 'strat-3') {
    // Strategy 3: Full Motor Assembly Hot-Swap
    health = 99;
    tempDelta = -32;
    vibDelta = -6.8;
    rulDays = 1400;
    riskPercent = 1;
    energySavingsKwh = 1850;
  }

  // Adjust for user parameters
  const tempRiseFromLoad = (loadFactor - 0.9) * 22;
  const tempRiseFromAmbient = (ambientTempC - 25) * 0.8;
  const tempDropFromCooling = (coolingFactor - 1) * -16;
  const tempRiseFromLube = (1 - lubeFactor) * 25;

  const finalTemp = Math.max(35, Math.min(140, +(baseMachine.temperature + tempDelta + tempRiseFromLoad + tempRiseFromAmbient + tempDropFromCooling + tempRiseFromLube).toFixed(1)));
  const finalVib = Math.max(0.8, Math.min(25, +(baseMachine.vibration + vibDelta + (loadFactor - 0.9) * 2.5 + (1 - lubeFactor) * 3.8 + (speedFactor - 1) * 3.0).toFixed(2)));
  const finalRpm = Math.round(targetRpm);
  const finalPowerKw = +((baseMachine.modelSpecs.ratedKw * loadFactor) * (1 + (1 - lubeFactor) * 0.05)).toFixed(1);

  // Dynamic health calculation based on final states
  let simulatedHealth = health;
  if (finalTemp > 90) simulatedHealth -= (finalTemp - 90) * 1.2;
  if (finalVib > 4.5) simulatedHealth -= (finalVib - 4.5) * 4.5;
  simulatedHealth = Math.max(5, Math.min(100, Math.round(simulatedHealth)));

  // Telemetry stream projection (15 intervals)
  const telemetryStream: TelemetryPoint[] = Array.from({ length: 15 }, (_, i) => {
    const t = new Date(Date.now() + i * 10 * 60 * 1000);
    const hour = t.getHours().toString().padStart(2, '0');
    const min = t.getMinutes().toString().padStart(2, '0');
    
    // Convergence curve towards steady-state
    const progress = Math.min(1, (i + 1) / 8);
    const curTemp = +(baseMachine.temperature + (finalTemp - baseMachine.temperature) * progress + Math.sin(i * 0.6) * 0.4).toFixed(1);
    const curVib = +(baseMachine.vibration + (finalVib - baseMachine.vibration) * progress + Math.cos(i * 0.8) * 0.15).toFixed(2);
    
    return {
      timestamp: t.getTime(),
      timeStr: `${hour}:${min}`,
      temperature: curTemp,
      vibration: curVib,
      pressure: +(baseMachine.pressure + Math.sin(i * 0.5) * 0.2).toFixed(1),
      rpm: finalRpm + Math.floor(Math.sin(i) * 5),
      powerKw: +(finalPowerKw + Math.random() * 1.5).toFixed(1),
      acousticDb: +(75 + (curVib / 8.5) * 18).toFixed(1),
      anomalyScore: Math.round(100 - simulatedHealth),
    };
  });

  return {
    simulatedHealth,
    projectedTemp: finalTemp,
    projectedVibration: finalVib,
    projectedRpm: finalRpm,
    projectedPowerKw: finalPowerKw,
    stressDistribution: [
      {
        component: 'Drive-End Bearing Race',
        stressMpa: appliedStrategyId ? 145 : 368,
        yieldLimitMpa: 450,
        safetyFactor: +(450 / (appliedStrategyId ? 145 : 368)).toFixed(2)
      },
      {
        component: 'Rotor Shaft Journal DE',
        stressMpa: appliedStrategyId ? 112 : 198,
        yieldLimitMpa: 380,
        safetyFactor: +(380 / (appliedStrategyId ? 112 : 198)).toFixed(2)
      },
      {
        component: 'Stator Tooth Tips (Electromagnetic)',
        stressMpa: 84,
        yieldLimitMpa: 220,
        safetyFactor: +(220 / 84).toFixed(2)
      },
      {
        component: 'Cast Iron End-Shield Flange',
        stressMpa: appliedStrategyId ? 45 : 82,
        yieldLimitMpa: 180,
        safetyFactor: +(180 / (appliedStrategyId ? 45 : 82)).toFixed(2)
      }
    ],
    rulDaysPostFix: rulDays,
    failureRiskPercent: riskPercent,
    energySavingsKwhPerMonth: energySavingsKwh,
    telemetryStream
  };
}

export function generateNextTelemetryTick(
  prevPoint: TelemetryPoint, 
  healthScore: number
): TelemetryPoint {
  const now = new Date();
  const hour = now.getHours().toString().padStart(2, '0');
  const min = now.getMinutes().toString().padStart(2, '0');
  const sec = now.getSeconds().toString().padStart(2, '0');

  // Realistic random micro-jitter and drift
  const tempJitter = (Math.random() - 0.48) * 0.3;
  const vibJitter = (Math.random() - 0.49) * 0.12;
  const rpmJitter = Math.floor((Math.random() - 0.5) * 6);
  const powerJitter = (Math.random() - 0.5) * 0.8;

  const newTemp = +(prevPoint.temperature + tempJitter).toFixed(1);
  const newVib = Math.max(0.5, +(prevPoint.vibration + vibJitter).toFixed(2));
  const newRpm = prevPoint.rpm + rpmJitter;
  const newPower = +(prevPoint.powerKw + powerJitter).toFixed(1);

  return {
    timestamp: now.getTime(),
    timeStr: `${hour}:${min}:${sec}`,
    temperature: newTemp,
    vibration: newVib,
    pressure: +(prevPoint.pressure + (Math.random() - 0.5) * 0.05).toFixed(1),
    rpm: newRpm,
    powerKw: newPower,
    acousticDb: +(76 + (newVib / 8) * 16).toFixed(1),
    anomalyScore: Math.round(100 - healthScore + (Math.random() - 0.5) * 3)
  };
}
