import { Candle, IndicatorSnapshot } from "@/lib/types";

const avg = (nums: number[]) => nums.reduce((a, b) => a + b, 0) / nums.length;

export function ema(values: number[], length: number): number {
  if (values.length === 0) return 0;
  const k = 2 / (length + 1);
  return values.slice(1).reduce((acc, value) => value * k + acc * (1 - k), values[0]);
}

export function rsi(values: number[], length = 14): number {
  if (values.length < length + 1) return 50;
  let gains = 0;
  let losses = 0;
  for (let i = values.length - length; i < values.length; i++) {
    const diff = values[i] - values[i - 1];
    if (diff >= 0) gains += diff;
    else losses -= diff;
  }
  if (losses === 0) return 100;
  const rs = gains / losses;
  return 100 - 100 / (1 + rs);
}

export function atr(candles: Candle[], length = 14): number {
  if (candles.length < length + 1) return 0;
  const trs: number[] = [];
  for (let i = candles.length - length; i < candles.length; i++) {
    const cur = candles[i];
    const prev = candles[i - 1];
    trs.push(Math.max(cur.high - cur.low, Math.abs(cur.high - prev.close), Math.abs(cur.low - prev.close)));
  }
  return avg(trs);
}

export function vwap(candles: Candle[]): { vwap: number; dev: number } {
  let pv = 0;
  let vv = 0;
  const prices: number[] = [];
  for (const c of candles) {
    const tp = (c.high + c.low + c.close) / 3;
    pv += tp * c.volume;
    vv += c.volume;
    prices.push(tp);
  }
  const v = vv ? pv / vv : candles[candles.length - 1]?.close ?? 0;
  const variance = avg(prices.map((p) => (p - v) ** 2));
  return { vwap: v, dev: Math.sqrt(variance) };
}

export function relativeVolume(candles: Candle[], length = 20): number {
  if (candles.length < length + 1) return 1;
  const vols = candles.slice(-length - 1, -1).map((c) => c.volume);
  const recent = candles[candles.length - 1].volume;
  return recent / avg(vols);
}

export function computeIndicators(candles: Candle[]): IndicatorSnapshot {
  const closes = candles.map((c) => c.close);
  const ema20 = ema(closes.slice(-200), 20);
  const ema50 = ema(closes.slice(-200), 50);
  const ema200 = ema(closes.slice(-220), 200);
  const { vwap: vw, dev } = vwap(candles.slice(-390));
  const adxProxy = Math.min(100, Math.abs((ema20 - ema50) / (ema50 || 1)) * 2000 + relativeVolume(candles) * 10);

  return {
    ema20,
    ema50,
    ema200,
    vwap: vw,
    vwapUpper: vw + dev,
    vwapLower: vw - dev,
    rsi14: rsi(closes, 14),
    atr14: atr(candles, 14),
    relVolume20: relativeVolume(candles, 20),
    adxProxy
  };
}
