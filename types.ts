
export interface KLinePoint {
  age: number;
  year: number;
  ganZhi: string; // 当年的流年干支 (如：甲辰)
  daYun?: string; // 当前所在的大运（如：甲子大运），用于图表标记
  open: number;
  close: number;
  high: number;
  low: number;
  score: number;
  reason: string; // 这里现在需要存储详细的流年描述
}

export interface AnalysisData {
  bazi: string[]; // [Year, Month, Day, Hour] pillars
  summary: string;
  summaryScore: number; // 0-10
  
  personality: string;      // 性格分析
  personalityScore: number; // 0-10
  
  industry: string;
  industryScore: number; // 0-10

  fengShui: string;       // 发展风水 (New)
  fengShuiScore: number;  // 0-10 (New)
  
  wealth: string;
  wealthScore: number; // 0-10
  
  marriage: string;
  marriageScore: number; // 0-10
  
  health: string;
  healthScore: number; // 0-10
  
  family: string;
  familyScore: number; // 0-10

  // Crypto / Web3 Specifics
  crypto: string;       // 币圈交易分析
  cryptoScore: number;  // 投机运势评分
  cryptoYear: string;   // 暴富流年 (e.g., 2025 乙巳)
  cryptoStyle: string;  // 适合流派 (现货/合约/链上Alpha)
}

export interface LifeDestinyResult {
  chartData: KLinePoint[];
  analysis: AnalysisData;
}

export interface BirthProfile {
  name: string;
  gender: 'Male' | 'Female';
  birthDate: string;
  birthTime: string;
}
