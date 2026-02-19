import { PriceChart } from "@/components/PriceChart";
import { buildDashboardSnapshot } from "@/lib/engine/marketEngine";

export default async function HomePage() {
  const data = await buildDashboardSnapshot();

  return (
    <main className="mx-auto grid max-w-7xl gap-4 p-6 md:grid-cols-12">
      <section className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 md:col-span-12">
        <h1 className="text-2xl font-semibold">SOL Intraday Trade Ideas Dashboard</h1>
        <p className="text-sm text-amber-300">{data.disclaimer}</p>
      </section>

      <section className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 md:col-span-3">
        <h2 className="font-semibold">Overview</h2>
        <ul className="mt-3 space-y-1 text-sm">
          <li>Estado: {data.marketStatus.regime}</li>
          <li>Confianza: {data.marketStatus.confidence}/100</li>
          <li>Volatilidad: {data.marketStatus.volRegime}</li>
          <li>Sesión: {data.session}</li>
          <li>Hoy: {data.tradePlan.allowed ? "Permitido" : "No permitido"}</li>
        </ul>
      </section>

      <section className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 md:col-span-9">
        <h2 className="mb-2 font-semibold">Chart</h2>
        <PriceChart candles={data.candles} />
      </section>

      <section className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 md:col-span-6">
        <h2 className="font-semibold">Setups activos</h2>
        <div className="mt-3 space-y-3 text-sm">
          {data.setups.map((setup) => (
            <div key={setup.name} className="rounded-lg border border-slate-700 p-3">
              <p className="font-medium">{setup.name} · {setup.side}</p>
              <p>Estado: {setup.active ? "Activo" : "Inactivo"}</p>
              <p>Checklist: {setup.reason.join(" | ")}</p>
              {!!setup.noTradeReasons.length && <p className="text-amber-300">No-trade: {setup.noTradeReasons.join(", ")}</p>}
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 md:col-span-6">
        <h2 className="font-semibold">Trade plan</h2>
        {data.tradePlan.setup ? (
          <div className="mt-3 space-y-1 text-sm">
            <p>Entry: {data.tradePlan.setup.entry.toFixed(3)}</p>
            <p>Stop (invalidación): {data.tradePlan.setup.stop.toFixed(3)}</p>
            <p>Targets: {data.tradePlan.setup.targets.map((t) => t.toFixed(3)).join(" / ")}</p>
            <p>R:R estimado: {data.tradePlan.setup.rr}</p>
            <p>Size sugerido: {data.tradePlan.size?.toFixed(2)} SOL</p>
            <p>Riesgo monetario: ${data.tradePlan.riskAmount?.toFixed(2)}</p>
          </div>
        ) : (
          <p className="mt-3 text-sm">Sin setup válido por ahora.</p>
        )}
      </section>

      <section className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 md:col-span-6">
        <h2 className="font-semibold">Backtest (MVP)</h2>
        <ul className="mt-2 text-sm">
          <li>Winrate: {data.backtest.winrate.toFixed(1)}%</li>
          <li>Expectancy: {data.backtest.expectancyR.toFixed(2)}R</li>
          <li>Profit factor: {data.backtest.profitFactor.toFixed(2)}</li>
          <li>Max drawdown: {data.backtest.maxDrawdownR.toFixed(2)}R</li>
          <li>Avg R: {data.backtest.avgR.toFixed(2)}</li>
        </ul>
      </section>

      <section className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 md:col-span-6">
        <h2 className="font-semibold">Settings (default)</h2>
        <ul className="mt-2 text-sm">
          <li>Exchange: Binance (public demo)</li>
          <li>Par: SOLUSDT</li>
          <li>Timeframes: 1m, 5m, 15m, 1h (base 1m en MVP)</li>
          <li>Risk: 0.5% por trade, max 5 trades/día, max pérdida $250</li>
        </ul>
      </section>
    </main>
  );
}
