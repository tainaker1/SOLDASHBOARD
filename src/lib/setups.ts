import { IndicatorSnapshot, RegimeSnapshot, SetupIdea, StructureSnapshot } from "@/lib/types";

export function generateSetups(price: number, ind: IndicatorSnapshot, structure: StructureSnapshot, regime: RegimeSnapshot): SetupIdea[] {
  const spreadTooHigh = ind.atr14 / price > 0.025;
  const chop = regime.regime === "CHOP";

  const trendPullback: SetupIdea = {
    name: "Trend Pullback",
    side: ind.ema20 > ind.ema50 ? "long" : "short",
    active: regime.regime === "TREND" && Math.abs(price - ind.ema20) / price < 0.006 && ind.relVolume20 > 1,
    reason: ["Régimen trend", "Pullback a EMA20/50", "Confirmación por volumen relativo > 1"],
    entry: price,
    stop: ind.ema50,
    targets: [price + (price - ind.ema50), price + 2 * (price - ind.ema50)],
    rr: 2,
    noTradeReasons: [chop ? "CHOP" : "", spreadTooHigh ? "Volatilidad extrema" : ""].filter(Boolean)
  };

  const rangeMR: SetupIdea = {
    name: "Range Mean Reversion",
    side: price < ind.vwap ? "long" : "short",
    active: regime.regime === "RANGE" && (ind.rsi14 < 35 || ind.rsi14 > 65),
    reason: ["Rango detectado", "Extremo con RSI", "Objetivo retorno a VWAP"],
    entry: price,
    stop: price < ind.vwap ? price - ind.atr14 : price + ind.atr14,
    targets: [ind.vwap, price < ind.vwap ? ind.vwap + ind.atr14 : ind.vwap - ind.atr14],
    rr: 1.8,
    noTradeReasons: [spreadTooHigh ? "ATR alto" : "", chop ? "CHOP" : ""].filter(Boolean)
  };

  const breakoutRetest: SetupIdea = {
    name: "Breakout Retest",
    side: structure.bos === "up" ? "long" : "short",
    active: structure.bos !== "none" && structure.choch !== "none" && ind.relVolume20 > 1.2,
    reason: ["Compresión previa", "Ruptura BOS", "Retest + CHoCH"],
    entry: price,
    stop: structure.bos === "up" ? structure.swingLow : structure.swingHigh,
    targets: [price + ind.atr14 * (structure.bos === "up" ? 1.5 : -1.5), price + ind.atr14 * (structure.bos === "up" ? 3 : -3)],
    rr: 2.2,
    noTradeReasons: [chop ? "Evitar en CHOP" : "", spreadTooHigh ? "Spread implícito alto" : ""].filter(Boolean)
  };

  return [trendPullback, rangeMR, breakoutRetest];
}
