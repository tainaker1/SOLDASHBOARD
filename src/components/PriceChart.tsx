"use client";

import { createChart, CandlestickData } from "lightweight-charts";
import { useEffect, useRef } from "react";
import { Candle } from "@/lib/types";

export function PriceChart({ candles }: { candles: Candle[] }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const chart = createChart(ref.current, { height: 320, layout: { background: { color: "#020617" }, textColor: "#cbd5e1" } });
    const series = chart.addCandlestickSeries();
    const data: CandlestickData[] = candles.map((c) => ({
      time: Math.floor(c.openTime / 1000) as CandlestickData["time"],
      open: c.open,
      high: c.high,
      low: c.low,
      close: c.close
    }));
    series.setData(data);
    chart.timeScale().fitContent();
    return () => chart.remove();
  }, [candles]);

  return <div className="rounded-xl border border-slate-800" ref={ref} />;
}
