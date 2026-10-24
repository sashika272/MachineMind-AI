import React from 'react';
import { useNavigation } from '../../context/NavigationContext';
import { useTheme } from '../../context/ThemeContext';
import { Sidebar } from './Sidebar';
import { TopHeader } from './TopHeader';
import { CommandPalette } from '../common/CommandPalette';
import { NotificationDrawer } from '../common/NotificationDrawer';

export const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentView, sidebarCollapsed } = useNavigation();
  const { isDark } = useTheme();

  // Full-bleed standalone pages
  const isPublicPage = ['landing', 'login', 'register', 'forgot-password'].includes(currentView);

  if (isPublicPage) {
    return (
      <div className={`min-h-screen transition-colors duration-200 selection:bg-cyan-500/20 selection:text-cyan-electric ${
        isDark ? 'bg-graphite-950 text-graphite-100' : 'bg-slate-50 text-slate-900'
      }`}>
        {children}
        <CommandPalette />
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-200 selection:bg-cyan-500/20 selection:text-cyan-electric ${
      isDark ? 'bg-graphite-950 text-graphite-100' : 'bg-slate-50 text-slate-900'
    }`}>
      {/* Fixed Sidebar */}
      <Sidebar />

      {/* Fixed Top Header */}
      <TopHeader />

      {/* Main Content Area */}
      <main
        className={`pt-16 min-h-screen transition-all duration-300 flex-1 flex flex-col ${
          sidebarCollapsed ? 'pl-20' : 'pl-64'
        }`}
      >
        <div className="p-6 md:p-8 flex-1 flex flex-col">
          {children}
        </div>
      </main>

      {/* Global Modals and Overlays */}
      <CommandPalette />
      <NotificationDrawer />
    </div>
  );
};
