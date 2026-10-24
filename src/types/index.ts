export type MachineStatus = 'optimal' | 'nominal' | 'warning' | 'critical' | 'offline';

export type ComponentType = 
  | 'bearing_de' 
  | 'bearing_nde' 
  | 'stator' 
  | 'rotor_shaft' 
  | 'cooling_fan' 
  | 'housing' 
  | 'terminal_box';

export interface MachineComponent {
  id: string;
  name: string;
  type: ComponentType;
  status: 'normal' | 'warning' | 'critical';
  healthScore: number;
  temperature: number; // °C
  vibration: number; // mm/s RMS
  failureProbability: number; // 0 - 1
  description: string;
  position3d: [number, number, number];
  recommendation?: string;
  inspectedDate?: string;
}

export interface Machine {
  id: string;
  code: string;
  name: string;
  type: 'Induction Motor' | 'Centrifugal Pump' | 'Turbocompressor' | 'Hydraulic Drive';
  location: string;
  facility: string;
  status: MachineStatus;
  healthScore: number; // 0 - 100
  runningHours: number;
  rpm: number;
  temperature: number; // °C
  vibration: number; // mm/s RMS
  pressure: number; // bar
  powerKw: number;
  powerFactor: number;
  efficiencyPercent: number;
  noiseDb: number;
  lastMaintenance: string;
  nextScheduledService: string;
  components: MachineComponent[];
  modelSpecs: {
    ratedKw: number;
    ratedRpm: number;
    voltage: string;
    frameSize: string;
    bearingType: string;
    insulationClass: string;
  };
}

export interface TelemetryPoint {
  timestamp: number;
  timeStr: string;
  temperature: number;
  vibration: number;
  pressure: number;
  rpm: number;
  powerKw: number;
  acousticDb: number;
  anomalyScore: number; // 0 - 100
}

export interface VibrationSpectrumPoint {
  frequency: number; // Hz
  amplitude: number; // mm/s
  threshold: number; // mm/s
  label?: string; // 1X, 2X, BPFO, BPFI
}

export type FaultSeverity = 'critical' | 'high' | 'medium' | 'low';
export type FaultStatus = 'active' | 'investigating' | 'mitigated' | 'resolved';

export interface SensorEvidence {
  sensor: string;
  currentValue: string;
  baselineValue: string;
  deviation: string;
  severity: 'normal' | 'warning' | 'critical';
}

export interface Fault {
  id: string;
  machineId: string;
  machineName: string;
  machineCode: string;
  title: string;
  severity: FaultSeverity;
  status: FaultStatus;
  detectedAt: string;
  affectedComponent: ComponentType;
  affectedComponentName: string;
  confidenceScore: number; // 0 - 100
  primaryCause: string;
  summary: string;
  sensorEvidence: SensorEvidence[];
  spectralSignature: VibrationSpectrumPoint[];
  estimatedDegradationDays: number;
}

export interface CausalNode {
  id: string;
  label: string;
  type: 'root' | 'mechanism' | 'symptom';
  probability: number; // 0 - 100
  evidence: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  children?: string[];
}

export interface RootCauseAnalysis {
  faultId: string;
  machineId: string;
  affectedComponent: ComponentType;
  affectedComponentName: string;
  primaryCause: string;
  confidence: number;
  causalChain: CausalNode[];
  contributingFactors: {
    factor: string;
    weight: number;
    impact: string;
  }[];
  uncertaintyBand: {
    lower: number;
    estimate: number;
    upper: number;
  };
  supportingTelemetry: {
    metric: string;
    description: string;
    zScore: number;
  }[];
}

export interface RepairProcedureStep {
  stepNumber: number;
  title: string;
  description: string;
  estimatedMinutes: number;
  toolsRequired: string[];
  safetyCheck: string;
}

export interface RepairStrategy {
  id: string;
  faultId: string;
  title: string;
  tier: 'conservative' | 'balanced' | 'aggressive' | 'temporary';
  description: string;
  procedure: RepairProcedureStep[];
  estimatedCost: number; // USD
  recoveryTimeHours: number;
  downtimeHours: number;
  safetyRequirements: string[];
  lotoRequired: boolean;
  requiredParts: {
    partNo: string;
    name: string;
    inStock: boolean;
    leadTimeDays: number;
    costUsd: number;
  }[];
  expectedOutcome: {
    healthGainPercent: number;
    rulExtensionDays: number;
    riskReductionPercent: number;
  };
  efficiencyImpactPercent: number;
  recommendationScore: number; // 0 - 100
  isRecommended: boolean;
  tradeoffs: {
    pros: string[];
    cons: string[];
  };
}

export interface DigitalTwinSimulationParams {
  targetRpm: number;
  loadPercentage: number;
  ambientTempC: number;
  lubricationQualityPercent: number;
  coolingAirflowPercent: number;
  appliedStrategyId?: string;
}

export interface SimulationResult {
  simulatedHealth: number;
  projectedTemp: number;
  projectedVibration: number;
  projectedRpm: number;
  projectedPowerKw: number;
  stressDistribution: {
    component: string;
    stressMpa: number;
    yieldLimitMpa: number;
    safetyFactor: number;
  }[];
  rulDaysPostFix: number;
  failureRiskPercent: number;
  energySavingsKwhPerMonth: number;
  telemetryStream: TelemetryPoint[];
}

export interface PredictiveHealth {
  machineId: string;
  currentHealth: number;
  remainingUsefulLifeDays: number;
  rulConfidenceInterval: {
    p10: number; // worst case
    p50: number; // median
    p90: number; // best case
  };
  healthDegradationCurve: {
    day: number;
    dateStr: string;
    unmitigatedHealth: number;
    mitigatedHealth: number;
    threshold: number;
  }[];
  maintenanceTimeline: {
    id: string;
    date: string;
    title: string;
    urgency: 'normal' | 'warning' | 'critical';
    component: string;
    technician: string;
    status: 'scheduled' | 'recommended' | 'overdue';
  }[];
  sensorDriftForecast: {
    sensor: string;
    unit: string;
    current: number;
    oneWeekProjected: number;
    oneMonthProjected: number;
    driftStatus: 'stable' | 'gradual_drift' | 'rapid_escalation';
  }[];
}

export interface MachineIncident {
  id: string;
  date: string;
  title: string;
  type: 'fault' | 'maintenance' | 'inspection' | 'component_replacement' | 'calibration';
  severity: 'low' | 'medium' | 'high' | 'critical';
  technician: string;
  durationHours: number;
  costUsd: number;
  resolution: string;
  partsReplaced?: string[];
}

export interface AnalyticsFleetSummary {
  fleetHealthAvg: number;
  totalMachines: number;
  activeFaultsCount: number;
  mtbfHours: number; // Mean Time Between Failures
  mttrHours: number; // Mean Time To Repair
  unplannedDowntimeHoursMonth: number;
  avoidedDowntimeSavingsUsd: number;
  maintenanceSpendYearUsd: number;
  healthDistribution: {
    optimal: number;
    nominal: number;
    warning: number;
    critical: number;
  };
  faultTypeDistribution: {
    category: string;
    count: number;
    percentage: number;
  }[];
  monthlyDowntimeTrend: {
    month: string;
    plannedHours: number;
    unplannedHours: number;
    costUsd: number;
  }[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Chief Reliability Engineer' | 'Plant Operations Director' | 'Maintenance Lead' | 'AI Systems Analyst';
  avatar?: string;
  organization: string;
  plantLocation: string;
  accessTier: 'Enterprise AI Full' | 'Operator Tier' | 'Viewer';
  notificationsCount: number;
}
