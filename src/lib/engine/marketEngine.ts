import { runBacktest } from "@/lib/backtest";
import { fetchKlines } from "@/lib/data/binanceClient";
import { computeIndicators } from "@/lib/indicators";
import { classifyRegime } from "@/lib/regime";
import { buildTradePlan } from "@/lib/risk";
import { generateSetups } from "@/lib/setups";
import { detectStructure } from "@/lib/structure";
import { RiskParams } from "@/lib/types";

const defaultRisk: RiskParams = {
  capital: 10000,
  riskPct: 0.5,
  maxTradesPerDay: 5,
  maxDailyLoss: 250
};

export async function buildDashboardSnapshot(symbol = "SOLUSDT") {
  const candles = await fetchKlines(symbol, "1m", 600);
  const ind = computeIndicators(candles);
  const structure = detectStructure(candles);
  const price = candles[candles.length - 1].close;
  const regime = classifyRegime(ind, price);
  const setups = generateSetups(price, ind, structure, regime);
  const active = setups.find((s) => s.active);
  const tradePlan = buildTradePlan(active, defaultRisk, 0, 0);
  const backtest = runBacktest(candles.slice(-500));

  return {
    symbol,
    timeframe: "1m",
    lastPrice: price,
    educationalMode: true,
    disclaimer: "Solo fines educativos. No es asesoría financiera ni ejecución automática.",
    session: "24/7 crypto",
    marketStatus: regime,
    indicators: ind,
    structure,
    setups,
    tradePlan,
    backtest,
    candles: candles.slice(-150)
  };
}
