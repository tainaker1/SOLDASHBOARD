import { Candle } from "@/lib/types";
import { computeIndicators } from "@/lib/indicators";
import { detectStructure } from "@/lib/structure";
import { classifyRegime } from "@/lib/regime";
import { generateSetups } from "@/lib/setups";

export interface BacktestMetrics {
  winrate: number;
  expectancyR: number;
  maxDrawdownR: number;
  profitFactor: number;
  avgR: number;
}

export function runBacktest(candles: Candle[]): BacktestMetrics {
  let wins = 0;
  let losses = 0;
  let grossWin = 0;
  let grossLoss = 0;
  let equity = 0;
  let peak = 0;
  let maxDd = 0;
  const rs: number[] = [];

  for (let i = 220; i < candles.length - 5; i++) {
    const window = candles.slice(0, i + 1);
    const ind = computeIndicators(window);
    const structure = detectStructure(window);
    const regime = classifyRegime(ind, window[window.length - 1].close);
    const setup = generateSetups(window[window.length - 1].close, ind, structure, regime).find((s) => s.active);
    if (!setup || setup.noTradeReasons.length) continue;

    const future = candles.slice(i + 1, i + 6);
    const target = setup.targets[0];
    const stop = setup.stop;
    let r = 0;
    for (const bar of future) {
      if (setup.side === "long" && bar.low <= stop) {
        r = -1;
        break;
      }
      if (setup.side === "long" && bar.high >= target) {
        r = 1;
        break;
      }
      if (setup.side === "short" && bar.high >= stop) {
        r = -1;
        break;
      }
      if (setup.side === "short" && bar.low <= target) {
        r = 1;
        break;
      }
    }
    if (r === 0) r = (future[future.length - 1].close - setup.entry) / Math.abs(setup.entry - stop);

    rs.push(r);
    if (r > 0) {
      wins++;
      grossWin += r;
    } else {
      losses++;
      grossLoss += Math.abs(r);
    }
    equity += r;
    peak = Math.max(peak, equity);
    maxDd = Math.max(maxDd, peak - equity);
  }

  const trades = wins + losses;
  return {
    winrate: trades ? (wins / trades) * 100 : 0,
    expectancyR: rs.length ? rs.reduce((a, b) => a + b, 0) / rs.length : 0,
    maxDrawdownR: maxDd,
    profitFactor: grossLoss ? grossWin / grossLoss : grossWin,
    avgR: rs.length ? rs.reduce((a, b) => a + b, 0) / rs.length : 0
  };
}
