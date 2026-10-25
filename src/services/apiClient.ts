/**
 * MachineMind AI Enterprise API Client
 * Connects React frontend to FastAPI backend endpoints & WebSockets.
 */

const PROD_API_ORIGIN = "https://machinemind-ai-backend.onrender.com";

export const getApiBase = (): string => {
  // If explicitly configured via VITE_API_BASE_URL, prioritize it
  const envUrl = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim();
  if (envUrl) {
    const cleanUrl = envUrl.replace(/\/+$/, "");
    return cleanUrl.endsWith("/api/v1") ? cleanUrl : `${cleanUrl}/api/v1`;
  }

  // In local development, use relative path to leverage Vite dev proxy
  if (import.meta.env.DEV) {
    return "/api/v1";
  }

  // In production, connect directly to the deployed public HTTPS backend
  return `${PROD_API_ORIGIN}/api/v1`;
};

export const getWsBase = (machineId: string = "MTR-704"): string => {
  const envWs = (import.meta.env.VITE_WS_BASE_URL as string | undefined)?.trim();
  if (envWs) {
    const cleanWs = envWs.replace(/\/+$/, "");
    return cleanWs.includes("/ws/telemetry") ? cleanWs : `${cleanWs}/ws/telemetry/${machineId}`;
  }

  if (import.meta.env.DEV) {
    const proto = window.location.protocol === "https:" ? "wss:" : "ws:";
    return `${proto}//${window.location.host}/api/v1/ws/telemetry/${machineId}`;
  }

  return `wss://machinemind-ai-backend.onrender.com/api/v1/ws/telemetry/${machineId}`;
};

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem("machinemind_token");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const primaryUrl = `${getApiBase()}${endpoint}`;
  let response: Response;
  
  try {
    response = await fetch(primaryUrl, {
      ...options,
      headers: {
        ...getAuthHeaders(),
        ...(options.headers || {}),
      },
    });
  } catch (err: any) {
    // Only in local development fallback to 127.0.0.1:8000 if proxy or localhost DNS resolution failed
    if (import.meta.env.DEV) {
      try {
        response = await fetch(`http://127.0.0.1:8000/api/v1${endpoint}`, {
          ...options,
          headers: {
            ...getAuthHeaders(),
            ...(options.headers || {}),
          },
        });
      } catch {
        throw new Error("Unable to connect to local MachineMind AI backend. Please verify FastAPI is running on port 8000.");
      }
    } else {
      // In production, NEVER attempt to connect to localhost/127.0.0.1
      const isNetworkErr = err instanceof TypeError || (err.message && err.message.toLowerCase().includes("failed to fetch"));
      if (isNetworkErr) {
        throw new Error(`Unable to connect to production backend (${primaryUrl}). Please verify internet connection and backend status.`);
      }
      throw new Error(`Connection error to ${primaryUrl}: ${err.message || "Network request failed"}`);
    }
  }

  if (!response.ok) {
    let errorDetail = "API request failed";
    try {
      const errJson = await response.json();
      if (Array.isArray(errJson.detail)) {
        // Format FastAPI / Pydantic validation error lists into readable messages
        errorDetail = errJson.detail.map((item: any) => item.msg || item.message || JSON.stringify(item)).join(", ");
      } else if (typeof errJson.detail === "string") {
        errorDetail = errJson.detail;
      } else if (typeof errJson.message === "string") {
        errorDetail = errJson.message;
      }
    } catch {
      errorDetail = `HTTP ${response.status}: ${response.statusText}`;
    }
    throw new Error(errorDetail);
  }

  const json = await response.json();
  return json.data !== undefined ? json.data : json;
}

export const apiClient = {
  // Authentication
  auth: {
    login: async (email: string, pass: string) => {
      const cleanEmail = email.trim().toLowerCase();
      const data = await request<any>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email: cleanEmail, password: pass }),
      });
      if (data?.access_token) {
        localStorage.setItem("machinemind_token", data.access_token);
      }
      return data;
    },
    register: async (name: string, email: string, pass: string, org?: string) => {
      const cleanEmail = email.trim().toLowerCase();
      const cleanName = name.trim();
      const cleanOrg = org ? org.trim() : undefined;
      const data = await request<any>("/auth/register", {
        method: "POST",
        body: JSON.stringify({ name: cleanName, email: cleanEmail, password: pass, organization: cleanOrg }),
      });
      if (data?.access_token) {
        localStorage.setItem("machinemind_token", data.access_token);
      }
      return data;
    },
    getMe: async () => {
      return request<any>("/auth/me");
    },
    logout: async () => {
      try {
        await request<any>("/auth/logout", { method: "POST" });
      } finally {
        localStorage.removeItem("machinemind_token");
      }
    },
    forgotPassword: async (email: string) => {
      const cleanEmail = email.trim().toLowerCase();
      return request<any>("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email: cleanEmail }),
      });
    },
  },

  // User Profile & Management
  users: {
    list: async () => request<any[]>("/users"),
    getProfile: async () => request<any>("/users/profile"),
    updateProfile: async (profile: { name?: string; role?: string; organization?: string; plant_location?: string }) =>
      request<any>("/users/profile", {
        method: "PUT",
        body: JSON.stringify(profile),
      }),
    updateAccess: async (userId: string, access: { role?: string; access_tier?: string; is_active?: boolean }) =>
      request<any>(`/users/${userId}/access`, {
        method: "PUT",
        body: JSON.stringify(access),
      }),
  },

  // Machines
  machines: {
    list: async () => request<any[]>("/machines"),
    get: async (id: string) => request<any>(`/machines/${id}`),
    components: async (id: string) => request<any[]>(`/machines/${id}/components`),
  },

  // Sensors & Telemetry
  sensors: {
    getLiveTick: async (machineId: string = "MTR-704") =>
      request<any>(`/sensors/live-tick?machine_id=${machineId}`),
    getTelemetryHistory: async (machineId: string = "MTR-704", points: number = 30) =>
      request<any[]>(`/sensors/telemetry?machine_id=${machineId}&points=${points}`),
    getSpectrum: async (machineId: string = "MTR-704") =>
      request<any[]>(`/sensors/spectrum?machine_id=${machineId}`),
    getDrift: async () => request<any[]>("/sensors/drift"),
    setScenario: async (machineId: string = "MTR-704", scenario: string = "normal") =>
      request<any>("/sensors/scenario", {
        method: "POST",
        body: JSON.stringify({ machine_id: machineId, scenario }),
      }),
  },

  // Faults
  faults: {
    list: async () => request<any[]>("/faults"),
    get: async (id: string) => request<any>(`/faults/${id}`),
    inject: async (machineId: string = "MTR-704", faultType: string = "bearing_spall", severity: string = "critical") =>
      request<any>("/faults/inject", {
        method: "POST",
        body: JSON.stringify({ machine_id: machineId, fault_type: faultType, severity }),
      }),
    resolve: async (machineId: string = "MTR-704") =>
      request<any>(`/faults/resolve?machine_id=${machineId}`, { method: "POST" }),
  },

  // Root Cause
  rootCause: {
    get: async (faultId: string = "FLT-2026-891") => request<any>(`/root-cause/${faultId}`),
    diagnose: async (machineId: string = "MTR-704") =>
      request<any>(`/root-cause/diagnose?machine_id=${machineId}`, { method: "POST" }),
  },

  // Repair Strategies
  repair: {
    list: async (faultId: string = "FLT-2026-891") =>
      request<any[]>(`/repair/strategies?fault_id=${faultId}`),
    get: async (strategyId: string, faultId: string = "FLT-2026-891") =>
      request<any>(`/repair/strategies/${strategyId}?fault_id=${faultId}`),
  },

  // Digital Twin Simulation
  simulation: {
    run: async (params: any, machineId: string = "MTR-704") =>
      request<any>(`/simulations/run?machine_id=${machineId}`, {
        method: "POST",
        body: JSON.stringify(params),
      }),
  },

  // Strategy Recommendations
  recommendations: {
    evaluate: async (faultId: string = "FLT-2026-891", machineId: string = "MTR-704") =>
      request<any>(`/recommendations/evaluate?fault_id=${faultId}&machine_id=${machineId}`),
    commit: async (machineId: string = "MTR-704", strategyId: string = "strat-1", technician: string = "Dr. Elena Vance", notes?: string) =>
      request<any>("/recommendations/commit", {
        method: "POST",
        body: JSON.stringify({ machine_id: machineId, strategy_id: strategyId, technician, notes }),
      }),
  },

  // Predictive Maintenance
  predictive: {
    getRul: async (machineId: string = "MTR-704") =>
      request<any>(`/predictive/rul?machine_id=${machineId}`),
  },

  // History & Incidents
  history: {
    getIncidents: async (machineId: string = "MTR-704") =>
      request<any[]>(`/history/incidents?machine_id=${machineId}`),
    createIncident: async (payload: any) =>
      request<any>("/history/incidents", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
  },

  // Analytics
  analytics: {
    getFleetSummary: async () => request<any>("/analytics/fleet-summary"),
  },

  // Reports (PDF & CSV Downloads)
  reports: {
    downloadPdf: (machineId: string = "MTR-704") => {
      const url = `${getApiBase()}/reports/pdf?machine_id=${machineId}`;
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `MachineMind_Audit_${machineId}.pdf`);
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    downloadCsv: (machineId: string = "MTR-704") => {
      const url = `${getApiBase()}/reports/csv?machine_id=${machineId}`;
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Telemetry_${machineId}.csv`);
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
  },

  // Live WebSocket Factory
  createWebSocket: (
    machineId: string,
    onTick: (tick: any) => void,
    onError?: (err: any) => void,
    onClose?: () => void
  ): WebSocket | null => {
    try {
      const ws = new WebSocket(getWsBase(machineId));
      ws.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          if (payload.type === "telemetry_tick" && payload.data) {
            onTick(payload.data);
          }
        } catch {
          // ignore parsing error
        }
      };
      if (onError) ws.onerror = onError;
      if (onClose) ws.onclose = onClose;
      return ws;
    } catch (e) {
      if (onError) onError(e);
      return null;
    }
  },
};
