/**
 * Enterprise Global UI State using Zustand
 * Eliminates Redux boilerplate: No actions, no reducers, no providers.
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type SupportedLanguage = 'en' | 'ar';
export type AppTheme = 'light' | 'dark' | 'system';

interface AppState {
  // Localization & RTL
  language: SupportedLanguage;
  isRtl: boolean;
  setLanguage: (lang: SupportedLanguage) => void;

  // Theme
  theme: AppTheme;
  setTheme: (theme: AppTheme) => void;

  // Sidebar & Navigation
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  closeSidebar: () => void;

  // Active Workflow Studio State
  activeWorkflowId: string | null;
  setActiveWorkflowId: (id: string | null) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      language: 'en',
      isRtl: false,
      setLanguage: (language) =>
        set({
          language,
          isRtl: language === 'ar',
        }),

      theme: 'light',
      setTheme: (theme) => set({ theme }),

      isSidebarOpen: true,
      toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
      closeSidebar: () => set({ isSidebarOpen: false }),

      activeWorkflowId: null,
      setActiveWorkflowId: (activeWorkflowId) => set({ activeWorkflowId }),
    }),
    {
      name: 'enterprise-app-preferences',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ language: state.language, theme: state.theme }),
    }
  )
);
