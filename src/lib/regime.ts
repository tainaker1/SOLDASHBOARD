import { IndicatorSnapshot, RegimeSnapshot } from "@/lib/types";

export function classifyRegime(ind: IndicatorSnapshot, price: number): RegimeSnapshot {
  const slope = ((ind.ema50 - ind.ema200) / (ind.ema200 || 1)) * 100;
  const distVwap = Math.abs((price - ind.vwap) / (ind.vwap || 1)) * 100;
  const reasons: string[] = [];

  let regime: RegimeSnapshot["regime"] = "CHOP";
  let confidence = 50;

  if (Math.abs(slope) > 0.25 && ind.adxProxy > 25 && distVwap > 0.2) {
    regime = "TREND";
    confidence = Math.min(95, 55 + Math.abs(slope) * 40 + ind.adxProxy * 0.3);
    reasons.push(`Pendiente EMA50/200 fuerte (${slope.toFixed(2)}%)`);
  } else if (distVwap < 0.25 && ind.adxProxy < 25) {
    regime = "RANGE";
    confidence = Math.min(90, 50 + (0.25 - distVwap) * 140 + (25 - ind.adxProxy));
    reasons.push("Precio cerca de VWAP y momentum bajo");
  } else {
    regime = "CHOP";
    confidence = Math.min(85, 45 + ind.relVolume20 * 8);
    reasons.push("Señales mixtas sin direccionalidad clara");
  }

  const volRegime = ind.atr14 / (price || 1) > 0.015 ? "HIGH" : ind.atr14 / (price || 1) > 0.008 ? "MEDIUM" : "LOW";
  reasons.push(`ATR/Precio ${(ind.atr14 / (price || 1) * 100).toFixed(2)}%`);

  return { regime, confidence: Math.round(confidence), reasons, volRegime };
}
