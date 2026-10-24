import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { 
  Machine, 
  MachineComponent, 
  TelemetryPoint, 
  Fault, 
  RootCauseAnalysis, 
  RepairStrategy 
} from '../types';
import { 
  mockMachines, 
  mockTelemetryHistory, 
  mockFaults, 
  mockRootCauseAnalysis, 
  mockRepairStrategies 
} from '../services/mockData';
import { generateNextTelemetryTick } from '../services/simulationEngine';
import { apiClient } from '../services/apiClient';

interface MachineContextType {
  machines: Machine[];
  selectedMachine: Machine;
  selectMachine: (id: string) => void;
  selectedComponent: MachineComponent | null;
  setSelectedComponent: (comp: MachineComponent | null) => void;
  telemetryHistory: TelemetryPoint[];
  liveTelemetry: TelemetryPoint;
  activeFault: Fault;
  allFaults: Fault[];
  rootCause: RootCauseAnalysis;
  repairStrategies: RepairStrategy[];
  selectedStrategy: RepairStrategy;
  setSelectedStrategy: (strat: RepairStrategy) => void;
  isStreaming: boolean;
  setIsStreaming: (streaming: boolean) => void;
  toggleStreaming: () => void;
  injectFault: () => void;
  resolveActiveFault: () => void;
  currentScenario: string;
  setScenario: (scenario: string) => Promise<void>;
}

const MachineContext = createContext<MachineContextType | undefined>(undefined);

export const MachineProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [machines, setMachines] = useState<Machine[]>(mockMachines);
  const [selectedMachineId, setSelectedMachineId] = useState<string>('MTR-704');
  const [selectedComponent, setSelectedComponent] = useState<MachineComponent | null>(() => {
    return mockMachines[0].components[0] || null;
  });

  const [telemetryHistory, setTelemetryHistory] = useState<TelemetryPoint[]>(mockTelemetryHistory);
  const [liveTelemetry, setLiveTelemetry] = useState<TelemetryPoint>(
    mockTelemetryHistory[mockTelemetryHistory.length - 1]
  );
  const [activeFault, setActiveFault] = useState<Fault>(mockFaults[0]);
  const [allFaults, setAllFaults] = useState<Fault[]>(mockFaults);
  const [rootCause, setRootCause] = useState<RootCauseAnalysis>(mockRootCauseAnalysis);
  const [repairStrategies, setRepairStrategies] = useState<RepairStrategy[]>(mockRepairStrategies);
  const [selectedStrategy, setSelectedStrategy] = useState<RepairStrategy>(mockRepairStrategies[0]);
  const [isStreaming, setIsStreaming] = useState<boolean>(true);
  const [currentScenario, setCurrentScenario] = useState<string>('bearing_spall');

  const wsRef = useRef<WebSocket | null>(null);

  // 1. Initial Load: Fetch machines from real backend API
  useEffect(() => {
    apiClient.machines.list()
      .then((data) => {
        if (data && data.length > 0) {
          setMachines(data as Machine[]);
          const current = data.find((m: any) => m.id === selectedMachineId) || data[0];
          if (current && current.components && current.components.length > 0) {
            setSelectedComponent(current.components[0]);
          }
        }
      })
      .catch(() => {
        // Fallback to local high-fidelity state if server unreachable
      });

    apiClient.faults.list()
      .then((faults) => {
        if (faults && faults.length > 0) {
          setAllFaults(faults as Fault[]);
          setActiveFault(faults[0] as Fault);
        }
      })
      .catch(() => {});
  }, []);

  const selectedMachine = machines.find((m) => m.id === selectedMachineId) || machines[0];

  const selectMachine = (id: string) => {
    setSelectedMachineId(id);
    const found = machines.find((m) => m.id === id);
    if (found && found.components.length > 0) {
      setSelectedComponent(found.components[0]);
    } else {
      setSelectedComponent(null);
    }
  };

  const toggleStreaming = () => {
    setIsStreaming((prev) => !prev);
  };

  // 2. Connect WebSocket to FastAPI backend with fallback to physics simulation
  useEffect(() => {
    if (!isStreaming) {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      return;
    }

    let ws = apiClient.createWebSocket(
      selectedMachineId,
      (tick) => {
        setLiveTelemetry(tick);
        setTelemetryHistory((prev) => [...prev.slice(1), tick]);
      },
      () => {
        // WebSocket error fallback: interval-based physics ticker
      }
    );
    wsRef.current = ws;

    // Fallback interval if websocket is offline
    const interval = setInterval(() => {
      if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
        setTelemetryHistory((prevHistory) => {
          const last = prevHistory[prevHistory.length - 1];
          const next = generateNextTelemetryTick(last, selectedMachine.healthScore);
          setLiveTelemetry(next);
          return [...prevHistory.slice(1), next];
        });
      }
    }, 2000);

    return () => {
      clearInterval(interval);
      if (ws) {
        ws.close();
      }
    };
  }, [isStreaming, selectedMachineId, selectedMachine.healthScore]);

  // 3. Inject fault into real backend
  const injectFault = async () => {
    try {
      await apiClient.faults.inject(selectedMachineId, "bearing_spall", "critical");
    } catch {}

    setMachines((prev) =>
      prev.map((m) =>
        m.id === selectedMachineId
          ? {
              ...m,
              status: 'critical',
              healthScore: 38,
              temperature: 98.4,
              vibration: 12.8,
            }
          : m
      )
    );
    setActiveFault((prev) => ({
      ...prev,
      severity: 'critical',
      status: 'active',
      title: 'CRITICAL: Severe Outer Raceway Flaking & Thermal Escalation',
      confidenceScore: 98.8
    }));
  };

  // 4. Resolve fault on backend
  const resolveActiveFault = async () => {
    try {
      await apiClient.faults.resolve(selectedMachineId);
    } catch {}

    setMachines((prev) =>
      prev.map((m) =>
        m.id === selectedMachineId
          ? {
              ...m,
              status: 'optimal',
              healthScore: 96,
              temperature: 58.2,
              vibration: 1.45,
            }
          : m
      )
    );
    setActiveFault((prev) => ({
      ...prev,
      status: 'resolved'
    }));
  };

  // 5. Switch Telemetry Scenario (Normal, Overheating, Bearing Spall, Pressure Surge, Multi-Anomaly)
  const setScenario = async (scenario: string) => {
    setCurrentScenario(scenario);
    try {
      await apiClient.sensors.setScenario(selectedMachineId, scenario);
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ action: "scenario", scenario }));
      }
    } catch {}

    // Update local machine telemetry & health
    let status: 'optimal' | 'warning' | 'critical' = 'optimal';
    let health = 96;
    let temp = 62.0;
    let vib = 1.85;

    if (scenario === 'overheating') {
      status = 'warning';
      health = 52;
      temp = 98.4;
      vib = 2.8;
      setActiveFault((prev) => ({
        ...prev,
        severity: 'high',
        status: 'active',
        title: 'Thermal Dissipation Failure / High Stator Overheat',
        primaryCause: 'Cooling fin airflow restriction & thermal grease breakdown',
        confidenceScore: 94.5
      }));
    } else if (scenario === 'bearing_spall' || scenario === 'excessive_vibration') {
      status = 'critical';
      health = 38;
      temp = 91.2;
      vib = 8.45;
      setActiveFault((prev) => ({
        ...prev,
        severity: 'critical',
        status: 'active',
        title: 'CRITICAL: Severe Outer Raceway Flaking & BPFO Vibration Spike',
        primaryCause: 'Sub-surface shear fatigue flaking on outer race',
        confidenceScore: 98.8
      }));
    } else if (scenario === 'pressure_surge') {
      status = 'warning';
      health = 68;
      temp = 67.5;
      vib = 4.2;
      setActiveFault((prev) => ({
        ...prev,
        severity: 'medium',
        status: 'active',
        title: 'Hydraulic Cavitation & Line Pressure Pulsation',
        primaryCause: 'Discharge line throttling inducing impeller cavitation',
        confidenceScore: 89.2
      }));
    } else if (scenario === 'multi_anomaly') {
      status = 'critical';
      health = 28;
      temp = 104.0;
      vib = 9.8;
      setActiveFault((prev) => ({
        ...prev,
        severity: 'critical',
        status: 'active',
        title: 'EMERGENCY: Multi-Node Compound Bearing & Thermal Breakdown',
        primaryCause: 'Simultaneous loss of lubricant and thermal cooling restriction',
        confidenceScore: 99.4
      }));
    } else {
      // Normal
      setActiveFault((prev) => ({
        ...prev,
        status: 'resolved'
      }));
    }

    setMachines((prev) =>
      prev.map((m) =>
        m.id === selectedMachineId
          ? { ...m, status, healthScore: health, temperature: temp, vibration: vib }
          : m
      )
    );
  };

  return (
    <MachineContext.Provider
      value={{
        machines,
        selectedMachine,
        selectMachine,
        selectedComponent,
        setSelectedComponent,
        telemetryHistory,
        liveTelemetry,
        activeFault,
        allFaults,
        rootCause,
        repairStrategies,
        selectedStrategy,
        setSelectedStrategy,
        isStreaming,
        setIsStreaming,
        toggleStreaming,
        injectFault,
        resolveActiveFault,
        currentScenario,
        setScenario
      }}
    >
      {children}
    </MachineContext.Provider>
  );
};

export const useMachine = () => {
  const context = useContext(MachineContext);
  if (!context) throw new Error('useMachine must be used within a MachineProvider');
  return context;
};
