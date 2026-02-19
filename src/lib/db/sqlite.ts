import Database from "better-sqlite3";

const db = new Database("soldashboard.db");

db.exec(`
CREATE TABLE IF NOT EXISTS journal (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ts INTEGER NOT NULL,
  side TEXT NOT NULL,
  setup TEXT NOT NULL,
  entry REAL,
  stop REAL,
  target REAL,
  resultR REAL,
  screenshotUrl TEXT,
  tags TEXT
);
`);

export interface JournalRow {
  side: string;
  setup: string;
  entry: number;
  stop: number;
  target: number;
  resultR: number;
  screenshotUrl?: string;
  tags?: string;
}

export function listJournal() {
  return db.prepare("SELECT * FROM journal ORDER BY ts DESC LIMIT 200").all();
}

export function addJournal(row: JournalRow) {
  return db
    .prepare(
      `INSERT INTO journal (ts, side, setup, entry, stop, target, resultR, screenshotUrl, tags)
       VALUES (@ts, @side, @setup, @entry, @stop, @target, @resultR, @screenshotUrl, @tags)`
    )
    .run({ ...row, ts: Date.now() });
}
