export type Regime = "TREND" | "RANGE" | "CHOP";

export interface Candle {
  openTime: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface IndicatorSnapshot {
  ema20: number;
  ema50: number;
  ema200: number;
  vwap: number;
  vwapUpper: number;
  vwapLower: number;
  rsi14: number;
  atr14: number;
  relVolume20: number;
  adxProxy: number;
}

export interface StructureSnapshot {
  swingHigh: number;
  swingLow: number;
  bos: "up" | "down" | "none";
  choch: "up" | "down" | "none";
}

export interface SetupIdea {
  name: string;
  side: "long" | "short";
  active: boolean;
  reason: string[];
  entry: number;
  stop: number;
  targets: number[];
  rr: number;
  noTradeReasons: string[];
}

export interface RiskParams {
  capital: number;
  riskPct: number;
  maxTradesPerDay: number;
  maxDailyLoss: number;
}

export interface TradePlan {
  allowed: boolean;
  blockedReason?: string;
  setup?: SetupIdea;
  size?: number;
  riskAmount?: number;
}

export interface RegimeSnapshot {
  regime: Regime;
  confidence: number;
  reasons: string[];
  volRegime: "LOW" | "MEDIUM" | "HIGH";
}
