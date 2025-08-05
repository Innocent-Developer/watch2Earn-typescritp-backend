export interface LevelEarning {
  level: number;
  pkr: number;
  usd: number;
}

const levelRates: LevelEarning[] = [
  { level: 1, pkr: 10, usd: 0.04 }, // Level 1 earning
  { level: 2, pkr: 20, usd: 0.07 }, // Level 2 earning},
  { level: 3, pkr: 30, usd: 0.11 },
  { level: 4, pkr: 65, usd: 0.23},
  { level: 5, pkr: 125, usd: 0.45 },
];

// Get earning rate for a specific level (1-5)
export function getLevelEarning(level: number): LevelEarning | null {
  const found = levelRates.find(l => l.level === level);
  return found || null;
}

// Example usage:
// const earning = getLevelEarning(5);
// if (earning) {
//   console.log(`Level ${earning.level}: PKR ${earning.pkr}, USD $${earning.usd}