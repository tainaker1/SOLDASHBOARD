import { Candle, StructureSnapshot } from "@/lib/types";

export function detectStructure(candles: Candle[]): StructureSnapshot {
  const recent = candles.slice(-30);
  const highs = recent.map((c) => c.high);
  const lows = recent.map((c) => c.low);
  const swingHigh = Math.max(...highs);
  const swingLow = Math.min(...lows);
  const last = recent[recent.length - 1];
  const prev = recent[recent.length - 2];

  const bos = last.close > swingHigh * 0.998 ? "up" : last.close < swingLow * 1.002 ? "down" : "none";
  const choch = prev.close < prev.open && last.close > last.open && last.close > prev.high
    ? "up"
    : prev.close > prev.open && last.close < last.open && last.close < prev.low
      ? "down"
      : "none";

  return { swingHigh, swingLow, bos, choch };
}
