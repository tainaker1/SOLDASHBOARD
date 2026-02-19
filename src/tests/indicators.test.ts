import { describe, expect, test } from "vitest";
import { atr, ema, rsi, vwap } from "@/lib/indicators";
import { Candle } from "@/lib/types";

const sample = (n: number): Candle[] =>
  Array.from({ length: n }).map((_, i) => ({
    openTime: i * 60_000,
    open: 100 + i,
    high: 101 + i,
    low: 99 + i,
    close: 100 + i,
    volume: 10 + i
  }));

describe("indicators", () => {
  test("ema computes", () => {
    const result = ema([1, 2, 3, 4, 5], 3);
    expect(result).toBeGreaterThan(3);
    expect(result).toBeLessThan(5.1);
  });

  test("rsi in bullish ramp tends high", () => {
    const result = rsi(Array.from({ length: 20 }).map((_, i) => i + 1), 14);
    expect(result).toBeGreaterThan(70);
  });

  test("atr positive", () => {
    expect(atr(sample(30), 14)).toBeGreaterThan(0);
  });

  test("vwap stable", () => {
    const result = vwap(sample(20));
    expect(result.vwap).toBeGreaterThan(100);
    expect(result.dev).toBeGreaterThan(0);
  });
});
