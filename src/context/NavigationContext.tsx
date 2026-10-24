import React, { createContext, useContext, useState, useEffect } from 'react';

export type AppView = 
  | 'landing'
  | 'login'
  | 'register'
  | 'forgot-password'
  | 'overview'
  | 'monitoring'
  | '3d-model'
  | 'faults'
  | 'root-cause'
  | 'repair-strategies'
  | 'digital-twin'
  | 'recommendations'
  | 'predictive'
  | 'history'
  | 'analytics'
  | 'settings'
  | 'admin';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  severity: 'critical' | 'warning' | 'info';
  read: boolean;
  targetView?: AppView;
}

interface NavigationContextType {
  currentView: AppView;
  navigate: (view: AppView) => void;
  commandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;
  notificationsOpen: boolean;
  setNotificationsOpen: (open: boolean) => void;
  notifications: AppNotification[];
  unreadCount: number;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

const initialNotifications: AppNotification[] = [
  {
    id: 'notif-1',
    title: 'Critical Bearing Anomaly Detected',
    message: 'MTR-704 DE Bearing vibration spiked to 8.45 mm/s RMS (184.2 Hz BPFO).',
    timestamp: '12 min ago',
    severity: 'critical',
    read: false,
    targetView: 'faults'
  },
  {
    id: 'notif-2',
    title: 'Digital Twin Simulation Available',
    message: 'MachineMind AI generated 3 repair scenarios with Monte Carlo risk bounds.',
    timestamp: '28 min ago',
    severity: 'info',
    read: false,
    targetView: 'digital-twin'
  },
  {
    id: 'notif-3',
    title: 'Remaining Useful Life Alert',
    message: 'MTR-704 RUL projected under 5.2 days without mitigation.',
    timestamp: '1 hour ago',
    severity: 'warning',
    read: false,
    targetView: 'predictive'
  }
];

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<AppView>(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const h = window.location.hash.replace('#', '') as AppView;
      const validViews: AppView[] = [
        'landing', 'login', 'register', 'forgot-password', 'overview', 
        'monitoring', '3d-model', 'faults', 'root-cause', 'repair-strategies', 
        'digital-twin', 'recommendations', 'predictive', 'history', 'analytics', 'settings', 'admin'
      ];
      if (validViews.includes(h)) return h;
    }
    return 'overview';
  });
  const [commandPaletteOpen, setCommandPaletteOpen] = useState<boolean>(false);
  const [notificationsOpen, setNotificationsOpen] = useState<boolean>(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<AppNotification[]>(initialNotifications);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).__machinemind_navigate = (v: AppView) => {
        setCurrentView(v);
        window.location.hash = v;
      };
      const onHashChange = () => {
        const h = window.location.hash.replace('#', '') as AppView;
        if (h) setCurrentView(h);
      };
      window.addEventListener('hashchange', onHashChange);
      return () => window.removeEventListener('hashchange', onHashChange);
    }
  }, []);

  const navigate = (view: AppView) => {
    setCurrentView(view);
    if (typeof window !== 'undefined') {
      window.location.hash = view;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Keyboard shortcut for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <NavigationContext.Provider
      value={{
        currentView,
        navigate,
        commandPaletteOpen,
        setCommandPaletteOpen,
        notificationsOpen,
        setNotificationsOpen,
        notifications,
        unreadCount,
        markNotificationRead,
        markAllNotificationsRead,
        sidebarCollapsed,
        setSidebarCollapsed
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) throw new Error('useNavigation must be used within a NavigationProvider');
  return context;
};
