import { addJournal, listJournal } from "@/lib/db/sqlite";
import { z } from "zod";

const journalSchema = z.object({
  side: z.string(),
  setup: z.string(),
  entry: z.number(),
  stop: z.number(),
  target: z.number(),
  resultR: z.number(),
  screenshotUrl: z.string().optional(),
  tags: z.string().optional()
});

export async function GET() {
  return Response.json(listJournal());
}

export async function POST(request: Request) {
  const json = await request.json();
  const parsed = journalSchema.safeParse(json);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  addJournal(parsed.data);
  return Response.json({ ok: true });
}
