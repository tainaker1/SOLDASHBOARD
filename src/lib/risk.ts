import { RiskParams, SetupIdea, TradePlan } from "@/lib/types";

export function buildTradePlan(
  setup: SetupIdea | undefined,
  params: RiskParams,
  dailyLossUsed: number,
  tradesTaken: number
): TradePlan {
  if (!setup) return { allowed: false, blockedReason: "No hay setup activo" };
  if (dailyLossUsed >= params.maxDailyLoss) return { allowed: false, blockedReason: "Max pérdida diaria alcanzada" };
  if (tradesTaken >= params.maxTradesPerDay) return { allowed: false, blockedReason: "Max trades por día alcanzado" };
  if (setup.noTradeReasons.length) return { allowed: false, blockedReason: setup.noTradeReasons.join(", ") };

  const riskAmount = params.capital * (params.riskPct / 100);
  const stopDistance = Math.abs(setup.entry - setup.stop);
  const size = stopDistance === 0 ? 0 : riskAmount / stopDistance;

  return {
    allowed: size > 0,
    setup,
    size,
    riskAmount
  };
}
