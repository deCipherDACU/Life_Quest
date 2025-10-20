
// XP Required for Level
export function xpForLevel(level: number): number {
  if (level <= 1) return 100;
  return Math.floor(100 * Math.pow(level, 1.5));
}

type Difficulty = 'Easy' | 'Medium' | 'Hard' | 'N/A';

// Task XP Calculation
export function calculateTaskXP(difficulty: Difficulty): number {
  const difficultyMultiplier: Record<Difficulty, number> = {
    'Easy': 20,
    'Medium': 40,
    'Hard': 60,
    'N/A': 0
  };
  
  return difficultyMultiplier[difficulty] || 0;
}

// Task Coin Calculation
export function calculateTaskCoins(difficulty: Difficulty, userLevel: number): number {
    const BASE_COINS = Math.max(5, Math.round(userLevel / 2));

    const difficultyMultiplier: Record<Difficulty, number> = {
        'Easy': 1.0,
        'Medium': 1.5,
        'Hard': 2.0,
        'N/A': 0
    };
    
    const coins = BASE_COINS * difficultyMultiplier[difficulty];
    return Math.floor(coins);
}

