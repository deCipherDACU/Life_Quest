import { User } from './types';

export interface GameTheme {
  id: string;
  name: string;
  description: string;
  unlockCondition: string;
  colors: {
    primary: string;
    accent: string;
    background: string;
    foreground: string;
    muted: string;
    border: string;
  };
  effects: {
    particles: 'stars' | 'embers' | 'bubbles' | 'lightning' | 'leaves';
    backgroundPattern: 'none' | 'grid' | 'dots' | 'waves' | 'hexagon';
    glowIntensity: 'low' | 'medium' | 'high';
  };
  unlockLevel: number;
  requiredAchievements?: string[];
}

export const gameThemes: GameTheme[] = [
  {
    id: 'novice',
    name: 'Novice Adventurer',
    description: 'The beginning of your journey',
    unlockCondition: 'Default theme',
    colors: {
      primary: '#8B5CF6',
      accent: '#A78BFA',
      background: '#0F0F23',
      foreground: '#FFFFFF',
      muted: '#6B7280',
      border: '#374151'
    },
    effects: {
      particles: 'stars',
      backgroundPattern: 'dots',
      glowIntensity: 'low'
    },
    unlockLevel: 1
  },
  {
    id: 'warrior',
    name: 'Crimson Warrior',
    description: 'For those who face challenges head-on',
    unlockCondition: 'Complete 50 Hard quests',
    colors: {
      primary: '#EF4444',
      accent: '#F87171',
      background: '#1A0B0B',
      foreground: '#FFFFFF',
      muted: '#7F1D1D',
      border: '#991B1B'
    },
    effects: {
      particles: 'embers',
      backgroundPattern: 'grid',
      glowIntensity: 'high'
    },
    unlockLevel: 15,
    requiredAchievements: ['q10'] // Unstoppable achievement
  },
  {
    id: 'mage',
    name: 'Arcane Scholar',
    description: 'Wisdom and knowledge illuminate the path',
    unlockCondition: 'Reach Intelligence level 10',
    colors: {
      primary: '#3B82F6',
      accent: '#60A5FA',
      background: '#0B1426',
      foreground: '#FFFFFF',
      muted: '#1E3A8A',
      border: '#1D4ED8'
    },
    effects: {
      particles: 'lightning',
      backgroundPattern: 'hexagon',
      glowIntensity: 'medium'
    },
    unlockLevel: 20,
    requiredAchievements: ['f16'] // Specialized achievement
  },
  {
    id: 'nature',
    name: 'Forest Guardian',
    description: 'In harmony with the natural world',
    unlockCondition: 'Complete 100 Health & Wellness quests',
    colors: {
      primary: '#10B981',
      accent: '#34D399',
      background: '#064E3B',
      foreground: '#FFFFFF',
      muted: '#065F46',
      border: '#047857'
    },
    effects: {
      particles: 'leaves',
      backgroundPattern: 'waves',
      glowIntensity: 'medium'
    },
    unlockLevel: 25,
    requiredAchievements: ['c6', 'c8'] // Fitness Fanatic + Zen Master
  },
  {
    id: 'celestial',
    name: 'Celestial Master',
    description: 'Transcended beyond mortal limitations',
    unlockCondition: 'Reach level 50 and unlock all skill trees',
    colors: {
      primary: '#F59E0B',
      accent: '#FBBF24',
      background: '#1F1611',
      foreground: '#FFFFFF',
      muted: '#92400E',
      border: '#B45309'
    },
    effects: {
      particles: 'stars',
      backgroundPattern: 'grid',
      glowIntensity: 'high'
    },
    unlockLevel: 50,
    requiredAchievements: ['l4', 'f17'] // Master level + Jack of All Trades
  }
];

export class ThemeManager {
  private static currentTheme: GameTheme = gameThemes[0];
  private static listeners: Array<(theme: GameTheme) => void> = [];

  static getCurrentTheme(): GameTheme {
    return this.currentTheme;
  }

  static getUnlockedThemes(user: User): GameTheme[] {
    return gameThemes.filter(theme => this.isThemeUnlocked(theme, user));
  }

  static isThemeUnlocked(theme: GameTheme, user: User): boolean {
    // Check level requirement
    if (user.level < theme.unlockLevel) {
      return false;
    }

    // Check achievement requirements
    if (theme.requiredAchievements) {
      // This would need to be implemented with actual achievement checking
      // For now, we'll assume achievements are tracked in user data
      return true; // Placeholder
    }

    return true;
  }

  static setTheme(theme: GameTheme): void {
    this.currentTheme = theme;
    this.applyThemeToDOM(theme);
    this.notifyListeners(theme);
    
    // Save to localStorage
    localStorage.setItem('lifequest-theme', theme.id);
  }

  static loadSavedTheme(user: User): void {
    const savedThemeId = localStorage.getItem('lifequest-theme');
    if (savedThemeId) {
      const theme = gameThemes.find(t => t.id === savedThemeId);
      if (theme && this.isThemeUnlocked(theme, user)) {
        this.setTheme(theme);
        return;
      }
    }
    
    // Default to highest unlocked theme
    const unlockedThemes = this.getUnlockedThemes(user);
    const highestTheme = unlockedThemes.reduce((highest, current) => 
      current.unlockLevel > highest.unlockLevel ? current : highest
    );
    this.setTheme(highestTheme);
  }

  private static applyThemeToDOM(theme: GameTheme): void {
    const root = document.documentElement;
    
    // Apply CSS custom properties
    root.style.setProperty('--primary', this.hexToHsl(theme.colors.primary));
    root.style.setProperty('--accent', this.hexToHsl(theme.colors.accent));
    root.style.setProperty('--background', this.hexToHsl(theme.colors.background));
    root.style.setProperty('--foreground', this.hexToHsl(theme.colors.foreground));
    root.style.setProperty('--muted', this.hexToHsl(theme.colors.muted));
    root.style.setProperty('--border', this.hexToHsl(theme.colors.border));
    
    // Apply theme class for additional styling
    document.body.className = document.body.className.replace(/theme-\w+/g, '');
    document.body.classList.add(`theme-${theme.id}`);
  }

  private static hexToHsl(hex: string): string {
    // Convert hex to HSL for CSS custom properties
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
  }

  static subscribe(listener: (theme: GameTheme) => void): () => void {
    this.listeners.push(listener);
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  private static notifyListeners(theme: GameTheme): void {
    this.listeners.forEach(listener => listener(theme));
  }
}

// Weather/Mood System
export interface WeatherState {
  type: 'sunny' | 'cloudy' | 'rainy' | 'stormy' | 'foggy' | 'snowy';
  intensity: number; // 0-1
  description: string;
}

export class WeatherSystem {
  static getWeatherFromProductivity(user: User): WeatherState {
    const recentProductivity = this.calculateRecentProductivity(user);
    
    if (recentProductivity >= 0.8) {
      return {
        type: 'sunny',
        intensity: recentProductivity,
        description: 'Clear skies ahead! Your productivity is shining bright.'
      };
    } else if (recentProductivity >= 0.6) {
      return {
        type: 'cloudy',
        intensity: 0.5,
        description: 'Partly cloudy with chances of achievement.'
      };
    } else if (recentProductivity >= 0.4) {
      return {
        type: 'rainy',
        intensity: 0.6,
        description: 'A light drizzle of tasks awaits completion.'
      };
    } else if (recentProductivity >= 0.2) {
      return {
        type: 'stormy',
        intensity: 0.8,
        description: 'Stormy weather ahead - time to weather the challenge!'
      };
    } else {
      return {
        type: 'foggy',
        intensity: 0.7,
        description: 'The path is unclear, but every step forward clears the fog.'
      };
    }
  }

  private static calculateRecentProductivity(user: User): number {
    // This would calculate based on recent task completion, streaks, etc.
    // For now, return a placeholder based on completion rate
    return Math.max(0, Math.min(1, user.completionRate / 100));
  }
}