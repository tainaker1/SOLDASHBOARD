import { buildDashboardSnapshot } from "@/lib/engine/marketEngine";

export async function GET() {
  try {
    const data = await buildDashboardSnapshot("SOLUSDT");
    return Response.json(data);
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
}
