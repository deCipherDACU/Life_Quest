'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ADHDSettings {
  isEnabled: boolean;
  distractionBlocking: boolean;
  simplifiedInterface: boolean;
  focusTimerEnabled: boolean;
  breakReminders: boolean;
  hyperfocusProtection: boolean;
  animationsReduced: boolean;
  colorContrast: 'normal' | 'high';
  fontSize: 'normal' | 'large';
  taskGrouping: 'priority' | 'energy' | 'time';
}

interface ADHDContextType {
  settings: ADHDSettings;
  updateSetting: <K extends keyof ADHDSettings>(key: K, value: ADHDSettings[K]) => void;
  toggleADHDMode: () => void;
  isSimplifiedMode: () => boolean;
  shouldShowElement: (elementType: 'decorative' | 'secondary' | 'animation') => boolean;
}

const defaultSettings: ADHDSettings = {
  isEnabled: false,
  distractionBlocking: true,
  simplifiedInterface: true,
  focusTimerEnabled: true,
  breakReminders: true,
  hyperfocusProtection: true,
  animationsReduced: false,
  colorContrast: 'normal',
  fontSize: 'normal',
  taskGrouping: 'priority',
};

const ADHDContext = createContext<ADHDContextType | undefined>(undefined);

export function ADHDProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<ADHDSettings>(defaultSettings);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('adhd-settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings({ ...defaultSettings, ...parsed });
      } catch (error) {
        console.error('Failed to parse ADHD settings:', error);
      }
    }
  }, []);

  // Save settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem('adhd-settings', JSON.stringify(settings));
  }, [settings]);

  // Apply CSS custom properties for ADHD mode
  useEffect(() => {
    const root = document.documentElement;
    
    if (settings.isEnabled) {
      root.classList.add('adhd-mode');
      
      // Apply font size adjustments
      if (settings.fontSize === 'large') {
        root.style.setProperty('--adhd-font-scale', '1.2');
      } else {
        root.style.setProperty('--adhd-font-scale', '1');
      }
      
      // Apply color contrast adjustments
      if (settings.colorContrast === 'high') {
        root.style.setProperty('--adhd-contrast', '1.5');
      } else {
        root.style.setProperty('--adhd-contrast', '1');
      }
      
      // Reduce motion if requested
      if (settings.animationsReduced) {
        root.style.setProperty('--adhd-motion', 'none');
      } else {
        root.style.setProperty('--adhd-motion', 'auto');
      }
    } else {
      root.classList.remove('adhd-mode');
      root.style.removeProperty('--adhd-font-scale');
      root.style.removeProperty('--adhd-contrast');
      root.style.removeProperty('--adhd-motion');
    }
  }, [settings]);

  const updateSetting = <K extends keyof ADHDSettings>(
    key: K,
    value: ADHDSettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const toggleADHDMode = () => {
    updateSetting('isEnabled', !settings.isEnabled);
  };

  const isSimplifiedMode = () => {
    return settings.isEnabled && settings.simplifiedInterface;
  };

  const shouldShowElement = (elementType: 'decorative' | 'secondary' | 'animation') => {
    if (!settings.isEnabled) return true;
    
    switch (elementType) {
      case 'decorative':
        return !settings.distractionBlocking;
      case 'secondary':
        return !settings.simplifiedInterface;
      case 'animation':
        return !settings.animationsReduced;
      default:
        return true;
    }
  };

  const value: ADHDContextType = {
    settings,
    updateSetting,
    toggleADHDMode,
    isSimplifiedMode,
    shouldShowElement,
  };

  return (
    <ADHDContext.Provider value={value}>
      {children}
    </ADHDContext.Provider>
  );
}

export function useADHD() {
  const context = useContext(ADHDContext);
  if (context === undefined) {
    throw new Error('useADHD must be used within an ADHDProvider');
  }
  return context;
}

// Hook for conditional rendering based on ADHD settings
export function useADHDConditional() {
  const { shouldShowElement, isSimplifiedMode } = useADHD();
  
  return {
    showDecorative: shouldShowElement('decorative'),
    showSecondary: shouldShowElement('secondary'),
    showAnimations: shouldShowElement('animation'),
    isSimplified: isSimplifiedMode(),
  };
}

// CSS class helper for ADHD-aware components
export function useADHDClasses() {
  const { settings } = useADHD();
  
  const getClasses = (baseClasses: string, adhdClasses?: string) => {
    if (!settings.isEnabled) return baseClasses;
    return `${baseClasses} ${adhdClasses || 'adhd-mode'}`;
  };
  
  return { getClasses, isADHDMode: settings.isEnabled };
}