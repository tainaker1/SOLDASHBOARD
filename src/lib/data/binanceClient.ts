import { Candle } from "@/lib/types";
import WebSocket from "ws";

const BASE = "https://api.binance.com";

export async function fetchKlines(symbol = "SOLUSDT", interval = "1m", limit = 500): Promise<Candle[]> {
  const url = `${BASE}/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`;
  const res = await fetch(url, { next: { revalidate: 30 } });
  if (!res.ok) throw new Error(`Binance REST error: ${res.status}`);
  const rows = (await res.json()) as [number, string, string, string, string, string][];
  return rows.map((r) => ({
    openTime: r[0],
    open: Number(r[1]),
    high: Number(r[2]),
    low: Number(r[3]),
    close: Number(r[4]),
    volume: Number(r[5])
  }));
}

export function createKlineWs(
  symbol: string,
  interval: string,
  onCandle: (candle: Candle) => void,
  onStatus: (status: string) => void
): WebSocket {
  const stream = `${symbol.toLowerCase()}@kline_${interval}`;
  const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${stream}`);

  ws.on("open", () => onStatus("connected"));
  ws.on("close", () => {
    onStatus("reconnecting");
    setTimeout(() => createKlineWs(symbol, interval, onCandle, onStatus), 2000);
  });
  ws.on("error", () => onStatus("error"));
  ws.on("message", (raw) => {
    const msg = JSON.parse(raw.toString());
    if (!msg?.k) return;
    const k = msg.k;
    onCandle({
      openTime: Number(k.t),
      open: Number(k.o),
      high: Number(k.h),
      low: Number(k.l),
      close: Number(k.c),
      volume: Number(k.v)
    });
  });

  return ws;
}
