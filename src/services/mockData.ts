import { 
  Machine, 
  Fault, 
  RootCauseAnalysis, 
  RepairStrategy, 
  PredictiveHealth, 
  MachineIncident, 
  AnalyticsFleetSummary,
  User,
  TelemetryPoint,
  VibrationSpectrumPoint
} from '../types';

export const currentUser: User = {
  id: 'usr-90412',
  name: 'Dr. Elena Vance',
  email: 'elena.vance@machinemind.ai',
  role: 'Chief Reliability Engineer',
  organization: 'Apex Industrial Dynamics · Plant Delta-4',
  plantLocation: 'Rotterdam Industrial Basin',
  accessTier: 'Enterprise AI Full',
  notificationsCount: 3,
};

export const mockMachines: Machine[] = [
  {
    id: 'MTR-704',
    code: 'MTR-704-DE',
    name: 'Primary Feed Pump Induction Motor',
    type: 'Induction Motor',
    location: 'Bay 4 · Feedwater Treatment Line',
    facility: 'Delta-4 Cogeneration Unit',
    status: 'warning',
    healthScore: 64,
    runningHours: 14820,
    rpm: 2975,
    temperature: 87.4,
    vibration: 7.82,
    pressure: 18.4,
    powerKw: 422.5,
    powerFactor: 0.91,
    efficiencyPercent: 91.2,
    noiseDb: 93.6,
    lastMaintenance: '2026-08-14',
    nextScheduledService: '2026-11-10',
    modelSpecs: {
      ratedKw: 450,
      ratedRpm: 3000,
      voltage: '6,600 V / 3-Phase / 50Hz',
      frameSize: 'IEC 400L',
      bearingType: 'SKF 6326 M/C3 Deep Groove (Drive End)',
      insulationClass: 'Class H (180°C)',
    },
    components: [
      {
        id: 'comp-1',
        name: 'Drive-End Bearing Assembly (DE)',
        type: 'bearing_de',
        status: 'critical',
        healthScore: 42,
        temperature: 92.6,
        vibration: 8.45,
        failureProbability: 0.78,
        description: 'Micro-spalling detected on outer raceway with localized cage looseness and severe thermal accumulation.',
        position3d: [1.85, 0, 0],
        recommendation: 'Immediate replacement or scheduled shutdown within 120 operating hours.',
        inspectedDate: '2026-10-21'
      },
      {
        id: 'comp-2',
        name: 'Non-Drive End Bearing (NDE)',
        type: 'bearing_nde',
        status: 'normal',
        healthScore: 89,
        temperature: 58.1,
        vibration: 2.14,
        failureProbability: 0.08,
        description: 'Nominal operational status. Lubrication film thickness is within recommended ISO VG 460 limits.',
        position3d: [-1.85, 0, 0],
        recommendation: 'Next lubrication inspection in 450 hours.',
        inspectedDate: '2026-10-18'
      },
      {
        id: 'comp-3',
        name: 'Stator Core & 6.6kV Windings',
        type: 'stator',
        status: 'warning',
        healthScore: 71,
        temperature: 86.8,
        vibration: 3.20,
        failureProbability: 0.24,
        description: 'Elevated thermal gradient transferred from DE bearing housing. Winding insulation resistance is acceptable.',
        position3d: [0, 0, 0],
        recommendation: 'Monitor phase current balance and thermal dissipation fins.',
        inspectedDate: '2026-10-20'
      },
      {
        id: 'comp-4',
        name: 'Cast Iron Stator Housing & Fins',
        type: 'housing',
        status: 'normal',
        healthScore: 94,
        temperature: 68.2,
        vibration: 2.85,
        failureProbability: 0.04,
        description: 'Structural integrity intact. Surface cooling fins are clear of heavy particulate accumulation.',
        position3d: [0, 0.4, 0],
        recommendation: 'Routine visual inspection.',
        inspectedDate: '2026-09-30'
      },
      {
        id: 'comp-5',
        name: 'Driveshaft & Rotor Dynamics',
        type: 'rotor_shaft',
        status: 'warning',
        healthScore: 68,
        temperature: 79.5,
        vibration: 5.60,
        failureProbability: 0.32,
        description: 'Secondary 1X and 2X rotational harmonic distortion caused by bearing play and radial eccentricity.',
        position3d: [0, 0, 0],
        recommendation: 'Laser alignment verification recommended post bearing swap.',
        inspectedDate: '2026-10-21'
      },
      {
        id: 'comp-6',
        name: 'High-Efficiency External Cooling Fan',
        type: 'cooling_fan',
        status: 'normal',
        healthScore: 92,
        temperature: 42.0,
        vibration: 1.80,
        failureProbability: 0.05,
        description: 'Aerodynamic blade profile undamaged. Shroud clearance verified at 4.2mm nominal.',
        position3d: [-2.2, 0, 0],
        recommendation: 'Check airflow intake mesh during weekly walkaround.',
        inspectedDate: '2026-10-15'
      },
      {
        id: 'comp-7',
        name: 'High-Voltage Terminal Junction Box',
        type: 'terminal_box',
        status: 'normal',
        healthScore: 96,
        temperature: 44.5,
        vibration: 1.20,
        failureProbability: 0.02,
        description: 'Cable glands sealed to IP66. Partial discharge analysis within safe limits (< 35 pC).',
        position3d: [0, 1.4, 0],
        recommendation: 'Infrared thermography scan every 6 months.',
        inspectedDate: '2026-08-14'
      }
    ]
  },
  {
    id: 'PMP-201',
    code: 'PMP-201-HP',
    name: 'Boiler Feed Multistage Pump',
    type: 'Centrifugal Pump',
    location: 'Bay 2 · High-Pressure Steam Feed',
    facility: 'Delta-4 Cogeneration Unit',
    status: 'optimal',
    healthScore: 95,
    runningHours: 8420,
    rpm: 3450,
    temperature: 61.2,
    vibration: 1.62,
    pressure: 42.8,
    powerKw: 310.0,
    powerFactor: 0.94,
    efficiencyPercent: 94.8,
    noiseDb: 84.1,
    lastMaintenance: '2026-09-12',
    nextScheduledService: '2026-12-15',
    modelSpecs: {
      ratedKw: 350,
      ratedRpm: 3500,
      voltage: '6,600 V / 3-Phase',
      frameSize: 'Pump Frame ISO 5199',
      bearingType: 'Spherical Roller 22218 EK',
      insulationClass: 'Class F',
    },
    components: []
  },
  {
    id: 'CMP-409',
    code: 'CMP-409-TX',
    name: 'Supercritical Turbocompressor Unit',
    type: 'Turbocompressor',
    location: 'Bay 6 · Synthesis Gas Train',
    facility: 'Delta-4 Cogeneration Unit',
    status: 'warning',
    healthScore: 73,
    runningHours: 21100,
    rpm: 8850,
    temperature: 114.2,
    vibration: 6.40,
    pressure: 82.5,
    powerKw: 1180.0,
    powerFactor: 0.93,
    efficiencyPercent: 88.5,
    noiseDb: 98.4,
    lastMaintenance: '2026-06-20',
    nextScheduledService: '2026-10-30',
    modelSpecs: {
      ratedKw: 1250,
      ratedRpm: 9000,
      voltage: '11,000 V / 3-Phase',
      frameSize: 'Integrally Geared API 617',
      bearingType: 'Tilting Pad Hydrodynamic',
      insulationClass: 'Class H',
    },
    components: []
  },
  {
    id: 'MTR-705',
    code: 'MTR-705-SL',
    name: 'Primary Slurry Circulation Drive',
    type: 'Induction Motor',
    location: 'Bay 3 · Mineral Slurry Refining',
    facility: 'Delta-4 Cogeneration Unit',
    status: 'nominal',
    healthScore: 88,
    runningHours: 11240,
    rpm: 1485,
    temperature: 69.5,
    vibration: 2.95,
    pressure: 12.1,
    powerKw: 480.0,
    powerFactor: 0.89,
    efficiencyPercent: 93.1,
    noiseDb: 87.2,
    lastMaintenance: '2026-07-28',
    nextScheduledService: '2026-11-25',
    modelSpecs: {
      ratedKw: 500,
      ratedRpm: 1500,
      voltage: '6,600 V / 3-Phase',
      frameSize: 'IEC 450M',
      bearingType: 'SKF 6230 C3',
      insulationClass: 'Class H',
    },
    components: []
  },
  {
    id: 'HYD-112',
    code: 'HYD-112-PX',
    name: 'Hydraulic Actuation Power Pack',
    type: 'Hydraulic Drive',
    location: 'Sub-level 1 · Turbine Governor Room',
    facility: 'Delta-4 Cogeneration Unit',
    status: 'nominal',
    healthScore: 86,
    runningHours: 6300,
    rpm: 1750,
    temperature: 54.3,
    vibration: 2.30,
    pressure: 210.0,
    powerKw: 175.0,
    powerFactor: 0.92,
    efficiencyPercent: 92.4,
    noiseDb: 81.5,
    lastMaintenance: '2026-08-02',
    nextScheduledService: '2026-12-01',
    modelSpecs: {
      ratedKw: 180,
      ratedRpm: 1800,
      voltage: '400 V / 3-Phase',
      frameSize: 'IEC 315L',
      bearingType: 'Cylindrical Roller NU 318',
      insulationClass: 'Class F',
    },
    components: []
  },
  {
    id: 'MTR-802',
    code: 'MTR-802-CT',
    name: 'Cooling Tower Induced Draft Fan Motor',
    type: 'Induction Motor',
    location: 'Roof Deck · Wet Cooling Tower C',
    facility: 'Delta-4 Cogeneration Unit',
    status: 'optimal',
    healthScore: 97,
    runningHours: 4120,
    rpm: 980,
    temperature: 46.8,
    vibration: 1.15,
    pressure: 1.2,
    powerKw: 215.0,
    powerFactor: 0.88,
    efficiencyPercent: 95.2,
    noiseDb: 79.8,
    lastMaintenance: '2026-10-01',
    nextScheduledService: '2027-01-15',
    modelSpecs: {
      ratedKw: 220,
      ratedRpm: 1000,
      voltage: '690 V / 3-Phase',
      frameSize: 'IEC 355M',
      bearingType: 'Sealed Spherical Roller',
      insulationClass: 'Class H',
    },
    components: []
  }
];

export const mockTelemetryHistory: TelemetryPoint[] = Array.from({ length: 30 }, (_, i) => {
  const step = 29 - i;
  const time = new Date(Date.now() - step * 60 * 1000);
  const hour = time.getHours().toString().padStart(2, '0');
  const min = time.getMinutes().toString().padStart(2, '0');
  const sec = time.getSeconds().toString().padStart(2, '0');

  // Progressive degradation simulation for MTR-704
  const degradation = Math.min(1, step / 30);
  return {
    timestamp: time.getTime(),
    timeStr: `${hour}:${min}:${sec}`,
    temperature: +(82.0 + (1 - degradation) * 5.4 + Math.sin(i * 0.7) * 0.6).toFixed(1),
    vibration: +(5.1 + (1 - degradation) * 2.72 + Math.cos(i * 0.5) * 0.35).toFixed(2),
    pressure: +(18.2 + Math.sin(i * 0.4) * 0.3).toFixed(1),
    rpm: +(2970 + Math.floor(Math.sin(i * 0.9) * 8)),
    powerKw: +(418 + (1 - degradation) * 4.5 + Math.random() * 2).toFixed(1),
    acousticDb: +(88.5 + (1 - degradation) * 5.1).toFixed(1),
    anomalyScore: Math.round(45 + (1 - degradation) * 38),
  };
});

export const mockVibrationSpectrum: VibrationSpectrumPoint[] = [
  { frequency: 25, amplitude: 0.8, threshold: 2.5, label: '0.5X (Sub-harm)' },
  { frequency: 49.6, amplitude: 3.4, threshold: 4.5, label: '1X (Run Speed 2975 RPM)' },
  { frequency: 99.2, amplitude: 2.1, threshold: 3.8, label: '2X (Misalignment)' },
  { frequency: 148.8, amplitude: 1.2, threshold: 3.0, label: '3X' },
  { frequency: 184.2, amplitude: 7.8, threshold: 2.8, label: 'BPFO (Outer Race Defect)' },
  { frequency: 235.0, amplitude: 1.5, threshold: 2.5 },
  { frequency: 292.6, amplitude: 5.6, threshold: 2.8, label: '2x BPFO (Harmonic)' },
  { frequency: 368.4, amplitude: 3.9, threshold: 2.2, label: '3x BPFO' },
  { frequency: 441.0, amplitude: 1.1, threshold: 2.0 },
  { frequency: 588.0, amplitude: 2.4, threshold: 1.8, label: 'Cage Modulated 4x BPFO' },
  { frequency: 720.0, amplitude: 0.9, threshold: 1.5 },
  { frequency: 850.0, amplitude: 0.7, threshold: 1.5 },
  { frequency: 1000.0, amplitude: 0.5, threshold: 1.2 }
];

export const mockFaults: Fault[] = [
  {
    id: 'FLT-2026-891',
    machineId: 'MTR-704',
    machineName: 'Primary Feed Pump Induction Motor',
    machineCode: 'MTR-704-DE',
    title: 'Drive-End Bearing Race Fatigue & Micro-Spalling',
    severity: 'critical',
    status: 'active',
    detectedAt: '2026-10-24 06:14 UTC',
    affectedComponent: 'bearing_de',
    affectedComponentName: 'Drive-End Bearing Assembly (DE)',
    confidenceScore: 94.6,
    primaryCause: 'Sub-surface shear stress collapse aggravated by grease lubricant thermal shear thinning.',
    summary: 'High-frequency demodulation analysis reveals synchronous impacts at 184.2 Hz (BPFO). Peak velocity reached 8.45 mm/s RMS, exceeding ISO 10816-3 Zone C thresholds.',
    estimatedDegradationDays: 5.2,
    sensorEvidence: [
      {
        sensor: 'Radial Accelerometer DE-Acc-101',
        currentValue: '8.45 mm/s RMS',
        baselineValue: '2.10 mm/s RMS',
        deviation: '+302% (Alert Zone C)',
        severity: 'critical'
      },
      {
        sensor: 'Bearing Temperature RTD-DE-01',
        currentValue: '92.6 °C',
        baselineValue: '62.0 °C',
        deviation: '+30.6 °C above baseline',
        severity: 'critical'
      },
      {
        sensor: 'High-Frequency Enveloping HFE-04',
        currentValue: '18.4 gE',
        baselineValue: '1.2 gE',
        deviation: '+1433% Impact Peak',
        severity: 'critical'
      },
      {
        sensor: 'Acoustic Emission Sensor AES-02',
        currentValue: '93.6 dB',
        baselineValue: '78.2 dB',
        deviation: '+15.4 dB ultrasonic hiss',
        severity: 'warning'
      }
    ],
    spectralSignature: mockVibrationSpectrum
  },
  {
    id: 'FLT-2026-879',
    machineId: 'CMP-409',
    machineName: 'Supercritical Turbocompressor Unit',
    machineCode: 'CMP-409-TX',
    title: 'Stage-2 Impeller Clearance Thermal Expansion Anomaly',
    severity: 'high',
    status: 'investigating',
    detectedAt: '2026-10-23 18:40 UTC',
    affectedComponent: 'rotor_shaft',
    affectedComponentName: 'Stage-2 Rotor Assembly',
    confidenceScore: 88.2,
    primaryCause: 'High inlet gas moisture condensation inducing transient labyrinth seal rub.',
    summary: 'Shaft orbit analysis shows elliptical deformation with elevated 1X vibration harmonics at 147.5 Hz.',
    estimatedDegradationDays: 14.0,
    sensorEvidence: [
      {
        sensor: 'Proximity Probe X/Y Proj-402',
        currentValue: '62.4 µm pk-pk',
        baselineValue: '24.0 µm pk-pk',
        deviation: '+160% radial runout',
        severity: 'warning'
      },
      {
        sensor: 'Exhaust Thermocouple TC-202',
        currentValue: '114.2 °C',
        baselineValue: '94.0 °C',
        deviation: '+20.2 °C thermal rise',
        severity: 'warning'
      }
    ],
    spectralSignature: []
  },
  {
    id: 'FLT-2026-855',
    machineId: 'MTR-705',
    machineName: 'Primary Slurry Circulation Drive',
    machineCode: 'MTR-705-SL',
    title: 'Phase-B Stator Terminal Mild Thermal Resistance Drift',
    severity: 'medium',
    status: 'mitigated',
    detectedAt: '2026-10-22 09:12 UTC',
    affectedComponent: 'terminal_box',
    affectedComponentName: 'Terminal Box Bushing Lug',
    confidenceScore: 82.0,
    primaryCause: 'Slight terminal lug bolt relaxation under cyclic 480kW operational torque vibration.',
    summary: 'Thermographic sensor detected 12°C delta between Phase B and Phase A/C lugs.',
    estimatedDegradationDays: 32.0,
    sensorEvidence: [
      {
        sensor: 'Optical Pyrometer Lug-B',
        currentValue: '58.4 °C',
        baselineValue: '46.0 °C',
        deviation: '+12.4 °C phase delta',
        severity: 'warning'
      }
    ],
    spectralSignature: []
  }
];

export const mockRootCauseAnalysis: RootCauseAnalysis = {
  faultId: 'FLT-2026-891',
  machineId: 'MTR-704',
  affectedComponent: 'bearing_de',
  affectedComponentName: 'Drive-End Bearing Assembly (DE) [SKF 6326 M/C3]',
  primaryCause: 'Sub-surface shear fatigue flaking exacerbated by grease ester degradation at sustained >85°C core temperatures.',
  confidence: 94.6,
  uncertaintyBand: {
    lower: 91.2,
    estimate: 94.6,
    upper: 97.4
  },
  causalChain: [
    {
      id: 'node-root-1',
      label: 'Thermal Lubricant Breakdown',
      type: 'root',
      probability: 95,
      evidence: 'High ambient heat wave + boundary layer oil film thinning under 422kW load.',
      severity: 'critical',
      children: ['node-mech-1']
    },
    {
      id: 'node-mech-1',
      label: 'Micro-Asperity Metal-to-Metal Contact',
      type: 'mechanism',
      probability: 92,
      evidence: 'High-frequency acoustic emission jump from 78 dB to 93.6 dB.',
      severity: 'high',
      children: ['node-mech-2']
    },
    {
      id: 'node-mech-2',
      label: 'Outer Race Micro-Spalling at Ball Contact Path',
      type: 'mechanism',
      probability: 96,
      evidence: 'Synchronous 184.2 Hz spectral peak matched to 7-ball rolling pass frequency.',
      severity: 'critical',
      children: ['node-sym-1', 'node-sym-2']
    },
    {
      id: 'node-sym-1',
      label: 'Radial Velocity Spike (8.45 mm/s RMS)',
      type: 'symptom',
      probability: 99,
      evidence: 'Triaxial accelerometer DE-Acc-101 channel Z and X saturation.',
      severity: 'critical'
    },
    {
      id: 'node-sym-2',
      label: 'Bearing Housing Temperature Runaway (92.6 °C)',
      type: 'symptom',
      probability: 97,
      evidence: 'RTD sensor gradient +1.4 °C/hour slope over past 36 operating hours.',
      severity: 'high'
    }
  ],
  contributingFactors: [
    {
      factor: 'Thermal stress & high ambient room temperature (38°C in Bay 4)',
      weight: 38,
      impact: 'Accelerated grease base oil oxidation and viscosity loss by 45%.'
    },
    {
      factor: 'Extended continuous duty cycle (14,820 hours since last bearing overhaul)',
      weight: 32,
      impact: 'Bearing life consumed is 87% of L10h rating.'
    },
    {
      factor: 'Slight driven pump shaft misalignment (0.08mm angular tilt)',
      weight: 20,
      impact: 'Generates asymmetric axial thrust on the deep groove ball track.'
    },
    {
      factor: 'Transient grid harmonic voltage distortion (THD 4.2%)',
      weight: 10,
      impact: 'Induced minor stray rotor shaft currents through rolling elements.'
    }
  ],
  supportingTelemetry: [
    {
      metric: 'BPFO Peak Amplitude (184.2 Hz)',
      description: 'Envelope demodulation amplitude 7.82 mm/s vs 0.35 mm/s baseline.',
      zScore: 6.8
    },
    {
      metric: 'Crest Factor (Peak-to-RMS ratio)',
      description: 'Vibration signal impulsive spikiness shifted from 3.2 to 8.9.',
      zScore: 5.4
    },
    {
      metric: 'RTD Temperature Delta DE vs NDE',
      description: 'DE bearing runs +34.5 °C hotter than opposing NDE bearing.',
      zScore: 4.9
    }
  ]
};

export const mockRepairStrategies: RepairStrategy[] = [
  {
    id: 'strat-1',
    faultId: 'FLT-2026-891',
    title: 'Planned DE Bearing Replacement & Precision Alignment',
    tier: 'balanced',
    description: 'Schedule a controlled 6-hour maintenance window. Replace SKF 6326 M/C3 bearing with insulated ceramic-hybrid alternative, purge old grease, and perform dual-plane laser alignment.',
    isRecommended: true,
    recommendationScore: 96,
    estimatedCost: 3850,
    recoveryTimeHours: 6.0,
    downtimeHours: 5.5,
    lotoRequired: true,
    safetyRequirements: [
      'Lockout/Tagout (LOTO) 6.6kV Breaker Panel B4-CB02',
      'Hydraulic bearing induction heater with temperature monitoring (< 110°C)',
      'Class 2 PPE, arc-flash face shield during electrical isolation',
      'Confined space permit not required; overhead crane certified rigger'
    ],
    requiredParts: [
      {
        partNo: 'SKF-6326-M-C3-INSOCOAT',
        name: 'Insocoat Deep Groove Ball Bearing (130x280x58mm)',
        inStock: true,
        leadTimeDays: 0,
        costUsd: 1420
      },
      {
        partNo: 'MOBIL-SHC-POLYREX-462',
        name: 'Synthetic Polyurea High-Temp Grease (18kg Pail)',
        inStock: true,
        leadTimeDays: 0,
        costUsd: 280
      },
      {
        partNo: 'SEAL-V-RING-VA-130',
        name: 'FKM Viton High-Temp V-Ring Shaft Seal',
        inStock: true,
        leadTimeDays: 0,
        costUsd: 95
      }
    ],
    procedure: [
      {
        stepNumber: 1,
        title: 'Electrical De-energization & Verified Isolation (LOTO)',
        description: 'Open 6.6kV vacuum circuit breaker B4-CB02. Verify absence of voltage using certified high-voltage detector wand. Ground stator terminals.',
        estimatedMinutes: 30,
        toolsRequired: ['HV Proving Unit', 'Calibrated Multimeter', 'LOTO Padlocks & Hasps'],
        safetyCheck: 'Zero voltage verification witnessed by certified safety officer.'
      },
      {
        stepNumber: 2,
        title: 'Coupling Disconnection & DE End-Shield Dismantling',
        description: 'Unbolt flexible disc coupling. Rig dial indicators. Remove outer bearing cover and carefully unbolt the drive-end cast end-shield.',
        estimatedMinutes: 60,
        toolsRequired: ['Torque wrench 400Nm', 'Pneumatic impact gun', 'Overhead 5-ton bridge crane'],
        safetyCheck: 'Ensure rotor shaft is supported by wooden saddles to prevent winding scrape.'
      },
      {
        stepNumber: 3,
        title: 'Hydraulic Pulling of Damaged Bearing',
        description: 'Attach 3-jaw hydraulic puller to bearing inner race. Apply gradual pressure up to 250 bar. Safely extract damaged SKF 6326 bearing.',
        estimatedMinutes: 45,
        toolsRequired: ['Enerpac 30-ton Hydraulic Puller', 'Protective shaft sleeve protector'],
        safetyCheck: 'Use ballistic safety blanket wrapped around bearing during pull.'
      },
      {
        stepNumber: 4,
        title: 'Induction Heating & Mounting of New INSOCOAT Bearing',
        description: 'Heat new Insocoat bearing uniformly to 105°C on induction heater. Slide onto journals until seated firmly against shaft shoulder. Pack with 420g Polyrex grease.',
        estimatedMinutes: 45,
        toolsRequired: ['SKF TIH 100M Induction Heater', 'Infrared Thermometer', 'Grease packing gauge'],
        safetyCheck: 'Never exceed 120°C to preserve ceramic coating dielectric breakdown integrity.'
      },
      {
        stepNumber: 5,
        title: 'Reassembly, Laser Alignment & Baseline Telemetry Run',
        description: 'Reinstall end-shield and seal. Couple to pump shaft. Perform precision laser alignment to < 0.03mm tolerance. Bump test rotation.',
        estimatedMinutes: 90,
        toolsRequired: ['Prüftechnik ROTALIGN Laser Alignment Kit', 'Shim pack 316SS'],
        safetyCheck: 'Verify all guards are bolted prior to clearing LOTO.'
      }
    ],
    expectedOutcome: {
      healthGainPercent: 32,
      rulExtensionDays: 780,
      riskReductionPercent: 94
    },
    efficiencyImpactPercent: 1.8,
    tradeoffs: {
      pros: [
        'Completely resolves root cause with ceramic insulation protecting from future stray currents',
        'Restores health score from 64% to 96% and resets bearing L10h life',
        'All replacement parts are on-site in Delta-4 warehouse aisle 14'
      ],
      cons: [
        'Requires scheduled 5.5-hour downtime on Feedwater Line',
        'Requires certified high-voltage isolation technician'
      ]
    }
  },
  {
    id: 'strat-2',
    faultId: 'FLT-2026-891',
    title: 'Conditioned Lubricant High-Pressure Flush & Load Derate (75%)',
    tier: 'conservative',
    description: 'Temporary non-intrusive mitigation without dismantling. Flush grease cavity with synthetic high-viscosity ester grease, and derate motor load to 310 kW (75%) to curb frictional heat generation.',
    isRecommended: false,
    recommendationScore: 78,
    estimatedCost: 650,
    recoveryTimeHours: 1.5,
    downtimeHours: 0.5,
    lotoRequired: false,
    safetyRequirements: [
      'Safety glasses and nitrile grease-resistant gloves',
      'Live equipment perimeter barrier tape (1.5m clearance)',
      'Continuous vibration monitoring during automated re-greasing cycle'
    ],
    requiredParts: [
      {
        partNo: 'MOBIL-SHC-POLYREX-462-CRTG',
        name: 'Grease Cartridge High Viscosity 400g (x4)',
        inStock: true,
        leadTimeDays: 0,
        costUsd: 120
      }
    ],
    procedure: [
      {
        stepNumber: 1,
        title: 'Load Derate via Distributed Control System (DCS)',
        description: 'Signal DCS to throttle feedwater valve 4-FV-101, reducing MTR-704 draw from 422 kW to 315 kW.',
        estimatedMinutes: 15,
        toolsRequired: ['DCS Operator Terminal Console'],
        safetyCheck: 'Verify downstream steam drum level remains within green band.'
      },
      {
        stepNumber: 2,
        title: 'Purge Old Degraded Grease & Inject Fresh Lubricant',
        description: 'Open grease relief drain plug. Pump 350 grams fresh Mobil Polyrex grease while motor is rotating at reduced RPM.',
        estimatedMinutes: 45,
        toolsRequired: ['Pneumatic grease gun with digital flowmeter'],
        safetyCheck: 'Monitor purge port for smooth discharge of oxidized dark grease.'
      },
      {
        stepNumber: 3,
        title: 'Vibration & Thermal Trend Verification',
        description: 'Observe real-time temperature drop on RTD-DE-01 and verify velocity drops below 6.0 mm/s.',
        estimatedMinutes: 30,
        toolsRequired: ['Handheld Fluke 805 Vibration Meter'],
        safetyCheck: 'If temperature rises above 95°C during re-greasing, initiate immediate trip.'
      }
    ],
    expectedOutcome: {
      healthGainPercent: 12,
      rulExtensionDays: 35,
      riskReductionPercent: 55
    },
    efficiencyImpactPercent: -3.5,
    tradeoffs: {
      pros: [
        'Minimal downtime (only 30 minutes throttled operation)',
        'Extremely low immediate operational cost ($650)',
        'Buys 35 days of run-time until major plant turnaround in December'
      ],
      cons: [
        'Does not repair physical micro-spall on outer raceway',
        'Reduces plant feed throughput by 12%',
        'Bearing will continue degrading, requiring heightened 24/7 monitoring'
      ]
    }
  },
  {
    id: 'strat-3',
    faultId: 'FLT-2026-891',
    title: 'Full Motor Assembly Hot-Swap with Standby Asset MTR-708',
    tier: 'aggressive',
    description: 'Complete replacement of entire motor with pre-commissioned zero-hour spare unit from reserve rack. Maximizes long-term reliability for critical baseload operation.',
    isRecommended: false,
    recommendationScore: 84,
    estimatedCost: 14800,
    recoveryTimeHours: 12.0,
    downtimeHours: 11.0,
    lotoRequired: true,
    safetyRequirements: [
      'Full facility LOTO & electrical disconnect clearance',
      'Dual 10-ton overhead crane tandem lift plan',
      'Structural foundation anchor bolt torque inspection team'
    ],
    requiredParts: [
      {
        partNo: 'MTR-COMPLETE-450KW-SPARE',
        name: 'Spare 450kW High-Voltage Motor MTR-708 (Refurbished)',
        inStock: true,
        leadTimeDays: 0,
        costUsd: 12500
      }
    ],
    procedure: [
      {
        stepNumber: 1,
        title: 'Full Electrical & Mechanical Disconnection',
        description: 'Disconnect 6.6kV supply cables, instrumentation wiring, cooling conduits, and unbolt anchor bolts.',
        estimatedMinutes: 120,
        toolsRequired: ['Hydraulic torque wrenches', 'Cable handling rigging'],
        safetyCheck: 'Verify cable phase tagging to prevent reverse rotation on replacement.'
      },
      {
        stepNumber: 2,
        title: 'Heavy Crane Lift & Swap to Spare Asset',
        description: 'Rig 4-leg wire rope sling to lifting lugs. Lift MTR-704 to transport dolly. Rig spare MTR-708 into place.',
        estimatedMinutes: 240,
        toolsRequired: ['Overhead Bridge Crane', 'Rigging Slings', 'Precision Level'],
        safetyCheck: 'Maintain exclusion zone under crane envelope.'
      },
      {
        stepNumber: 3,
        title: 'Full Recommissioning & Laser Alignment',
        description: 'Grout inspection, shim placement, laser alignment to 0.02mm, megger testing, and uncoupled solo test run.',
        estimatedMinutes: 360,
        toolsRequired: ['Laser alignment system', '5kV Megohmmeter', 'Vibration analyzer'],
        safetyCheck: 'Perform 2-hour solo no-load burn-in before coupling to pump.'
      }
    ],
    expectedOutcome: {
      healthGainPercent: 36,
      rulExtensionDays: 1400,
      riskReductionPercent: 99
    },
    efficiencyImpactPercent: 2.4,
    tradeoffs: {
      pros: [
        'Completely brand-new zero-hour asset installed',
        'Highest long-term reliability and max efficiency gain'
      ],
      cons: [
        'High cost ($14,800) and substantial 11-hour downtime',
        'Consumes the only spare high-voltage motor in the plant inventory'
      ]
    }
  }
];

export const mockPredictiveHealth: PredictiveHealth = {
  machineId: 'MTR-704',
  currentHealth: 64,
  remainingUsefulLifeDays: 5.2,
  rulConfidenceInterval: {
    p10: 3.1,
    p50: 5.2,
    p90: 8.4
  },
  healthDegradationCurve: [
    { day: 0, dateStr: 'Today', unmitigatedHealth: 64, mitigatedHealth: 64, threshold: 40 },
    { day: 1, dateStr: 'Day +1', unmitigatedHealth: 58, mitigatedHealth: 76, threshold: 40 },
    { day: 2, dateStr: 'Day +2', unmitigatedHealth: 51, mitigatedHealth: 88, threshold: 40 },
    { day: 3, dateStr: 'Day +3', unmitigatedHealth: 44, mitigatedHealth: 94, threshold: 40 },
    { day: 4, dateStr: 'Day +4', unmitigatedHealth: 38, mitigatedHealth: 95, threshold: 40 },
    { day: 5, dateStr: 'Day +5', unmitigatedHealth: 29, mitigatedHealth: 95, threshold: 40 },
    { day: 6, dateStr: 'Day +6', unmitigatedHealth: 18, mitigatedHealth: 95, threshold: 40 },
    { day: 7, dateStr: 'Day +7', unmitigatedHealth: 8,  mitigatedHealth: 95, threshold: 40 },
    { day: 14, dateStr: 'Day +14', unmitigatedHealth: 0, mitigatedHealth: 94, threshold: 40 },
    { day: 30, dateStr: 'Day +30', unmitigatedHealth: 0, mitigatedHealth: 93, threshold: 40 },
  ],
  maintenanceTimeline: [
    {
      id: 'maint-1',
      date: '2026-10-25 08:00',
      title: 'Emergency Drive-End Bearing Replacement (Strategy A)',
      urgency: 'critical',
      component: 'Drive-End Bearing Assembly (DE)',
      technician: 'Marcus Chen (Lead Mechanical)',
      status: 'recommended'
    },
    {
      id: 'maint-2',
      date: '2026-11-05 14:00',
      title: 'Shaft Laser Alignment & Disc Coupling Inspection',
      urgency: 'warning',
      component: 'Rotor & Coupling',
      technician: 'David Miller',
      status: 'scheduled'
    },
    {
      id: 'maint-3',
      date: '2026-11-20 09:00',
      title: 'Cooling Duct Pressure Wash & Airflow Balancing',
      urgency: 'normal',
      component: 'Cooling Shroud',
      technician: 'Facility Services Team',
      status: 'scheduled'
    },
    {
      id: 'maint-4',
      date: '2026-12-15 08:00',
      title: 'Stator 6.6kV Insulation Resistance & Tan Delta Test',
      urgency: 'normal',
      component: 'Stator Windings',
      technician: 'High Voltage Specialist (External)',
      status: 'scheduled'
    }
  ],
  sensorDriftForecast: [
    {
      sensor: 'DE-Acc-101 (Vibration Velocity)',
      unit: 'mm/s RMS',
      current: 8.45,
      oneWeekProjected: 14.2,
      oneMonthProjected: 26.5,
      driftStatus: 'rapid_escalation'
    },
    {
      sensor: 'RTD-DE-01 (Bearing Temp)',
      unit: '°C',
      current: 92.6,
      oneWeekProjected: 108.5,
      oneMonthProjected: 135.0,
      driftStatus: 'rapid_escalation'
    },
    {
      sensor: 'Current Transducer CT-PhaseA',
      unit: 'Amps',
      current: 44.2,
      oneWeekProjected: 46.8,
      oneMonthProjected: 51.2,
      driftStatus: 'gradual_drift'
    },
    {
      sensor: 'NDE-Acc-102 (Rear Bearing)',
      unit: 'mm/s RMS',
      current: 2.14,
      oneWeekProjected: 2.30,
      oneMonthProjected: 2.45,
      driftStatus: 'stable'
    }
  ]
};

export const mockIncidents: MachineIncident[] = [
  {
    id: 'INC-2026-0814',
    date: '2026-08-14',
    title: 'Routine 12,000-hr Overhaul & Stator Varnish Coating Inspection',
    type: 'maintenance',
    severity: 'low',
    technician: 'Marcus Chen',
    durationHours: 8.5,
    costUsd: 1850,
    resolution: 'Successfully completed insulation resistance test (120 MΩ). Greased both bearings with 300g Mobil Polyrex.'
  },
  {
    id: 'INC-2026-0422',
    date: '2026-04-22',
    title: 'Cooling Shroud Debris Ingress & Air Flow Restriction',
    type: 'fault',
    severity: 'medium',
    technician: 'Sarah Jenkins',
    durationHours: 3.0,
    costUsd: 420,
    resolution: 'Fan cowl intake screen clogged with airborne limestone dust. Removed screen, steam cleaned fins and reinstalled.',
    partsReplaced: ['Mesh Intake Filter Gasket']
  },
  {
    id: 'INC-2025-1110',
    date: '2025-11-10',
    title: 'Precision Shaft Re-alignment post Feed Pump Overhaul',
    type: 'inspection',
    severity: 'low',
    technician: 'David Miller',
    durationHours: 4.5,
    costUsd: 950,
    resolution: 'Coupling angular misalignment corrected from 0.12mm to 0.02mm using 316SS precision laser shims.'
  },
  {
    id: 'INC-2025-0618',
    date: '2025-06-18',
    title: 'NDE Bearing Replacement (L10 Life Expiry)',
    type: 'component_replacement',
    severity: 'medium',
    technician: 'Marcus Chen',
    durationHours: 6.0,
    costUsd: 2100,
    resolution: 'Installed new SKF deep groove bearing on non-drive end. Vibration normalized to 1.1 mm/s RMS.',
    partsReplaced: ['SKF 6322 M/C3 NDE Bearing', 'Oil Seal']
  }
];

export const mockAnalyticsSummary: AnalyticsFleetSummary = {
  fleetHealthAvg: 83.7,
  totalMachines: 6,
  activeFaultsCount: 3,
  mtbfHours: 4850,
  mttrHours: 4.2,
  unplannedDowntimeHoursMonth: 3.4,
  avoidedDowntimeSavingsUsd: 142000,
  maintenanceSpendYearUsd: 48200,
  healthDistribution: {
    optimal: 2,
    nominal: 2,
    warning: 2,
    critical: 0
  },
  faultTypeDistribution: [
    { category: 'Rolling Element Bearings', count: 14, percentage: 48 },
    { category: 'Thermal Overheating / Cooling', count: 6, percentage: 21 },
    { category: 'Shaft Misalignment / Balance', count: 4, percentage: 14 },
    { category: 'Electrical Winding / Terminals', count: 3, percentage: 10 },
    { category: 'Mechanical Seal / Pressure', count: 2, percentage: 7 }
  ],
  monthlyDowntimeTrend: [
    { month: 'May 26', plannedHours: 12.0, unplannedHours: 6.2, costUsd: 18400 },
    { month: 'Jun 26', plannedHours: 8.5, unplannedHours: 4.1, costUsd: 12800 },
    { month: 'Jul 26', plannedHours: 16.0, unplannedHours: 1.5, costUsd: 9200 },
    { month: 'Aug 26', plannedHours: 6.0, unplannedHours: 0.8, costUsd: 4600 },
    { month: 'Sep 26', plannedHours: 10.0, unplannedHours: 2.1, costUsd: 8400 },
    { month: 'Oct 26', plannedHours: 4.0, unplannedHours: 3.4, costUsd: 11200 }
  ]
};
