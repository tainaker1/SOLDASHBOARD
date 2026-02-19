# SOL Intraday Dashboard (Educational)

Dashboard intradía para generar **trade ideas no automáticas** sobre SOLUSDT con enfoque riesgo-primero.

## Suposiciones
- Exchange elegido: **Binance spot/futures public market data** sin API key (modo demo).
- Persistencia: **SQLite** local (`soldashboard.db`) para journal.
- Timeframe base del motor en MVP: **1m**, con estructura para extender a 5m/15m/1h.
- Solo sugerencias educativas, **sin ejecución de órdenes**.

## Arquitectura (diagrama textual)

```text
Next.js App Router
├── UI Layer (app/page + components)
│   ├── Overview + Regime + Risk Status
│   ├── TradingView Lightweight Chart
│   ├── Setups Panel + Trade Plan Card
│   └── Backtest metrics + Settings snapshot
├── API Layer (/api/market, /api/journal)
│   ├── marketEngine orchestration
│   └── journal CRUD
├── Domain Engine (lib)
│   ├── data/binanceClient (REST + WS con reconexión)
│   ├── indicators (EMA/RSI/ATR/VWAP/RelVol)
│   ├── structure (swing/BOS/CHoCH simplificado)
│   ├── regime classifier (TREND/RANGE/CHOP + confidence)
│   ├── setups (3 setups con reglas booleanas)
│   ├── risk engine (size por stop + daily limits)
│   └── backtest (30-90d compatible por histórico disponible)
└── Storage
    └── SQLite (journal de operaciones manuales)
```

## Estructura de carpetas

```text
src/
  app/
    api/market/route.ts
    api/journal/route.ts
    layout.tsx
    page.tsx
  components/
    PriceChart.tsx
  lib/
    backtest.ts
    indicators.ts
    regime.ts
    risk.ts
    setups.ts
    structure.ts
    types.ts
    data/binanceClient.ts
    db/sqlite.ts
    engine/marketEngine.ts
  tests/
    indicators.test.ts
```

## Reglas de setups implementadas
1. **Trend Pullback**: régimen TREND + pullback a EMA20/50 + volumen relativo > 1.
2. **Range Mean Reversion**: régimen RANGE + RSI extremo (>
65 o <35) + objetivo VWAP.
3. **Breakout Retest**: BOS + CHoCH + volumen relativo alto (proxy de confirmación).

Cada setup entrega: trigger, invalidación (stop), targets, RR y condiciones no-trade (chop / volatilidad anómala).

## Instalación y ejecución

```bash
npm install
npm run dev
```

Luego abrir `http://localhost:3000`.

## Pruebas

```bash
npm test
```

## Cómo agregar un setup nuevo en 10 minutos
1. Abre `src/lib/setups.ts`.
2. Crea un objeto `SetupIdea` con:
   - `active`: condición booleana exacta.
   - `entry`, `stop`, `targets`.
   - `noTradeReasons`.
3. Añádelo al array retornado por `generateSetups`.
4. (Opcional) agrega campos nuevos en `types.ts` si necesitas metadata adicional.
5. Prueba rápido con `npm test`.
6. Verifica en UI que el card se renderiza automáticamente (mapea `data.setups`).

## Guardrails incorporados
- Disclaimer explícito y `educationalMode=true`.
- Risk engine bloquea ideas si excede pérdida diaria, límite de trades o no-trade conditions.
- Reconexión WS básica + manejo de error REST/API.
- Diseño incremental: indicadores y snapshots calculados por ventana reciente para no recalcular todo tick a tick en producción.

## Deploy local opcional
Puedes dockerizar con un `Dockerfile` Node18+ y volumen para `soldashboard.db`.
