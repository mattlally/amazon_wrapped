import Papa from 'papaparse';
import type { Card } from '../types';

// Represents a row where keys are the original CSV headers
export interface RawRow {
  [key: string]: string;
}

// Represents a raw CSV row before headers are applied
type CsvRow = string[];

/**
 * Parse the CSV as **raw rows** (no header mapping).
 * This lets us reliably detect the second header row that starts the cards table.
 */
export function parseCSV(file: File): Promise<CsvRow[]> {
  return new Promise((resolve, reject) => {
    Papa.parse<string[]>(file, {
      header: false,
      skipEmptyLines: false,
      dynamicTyping: false,
      complete: (results) => {
        if (results.errors.length > 0) {
          console.warn('CSV parsing errors:', results.errors);
        }
        resolve(results.data as CsvRow[]);
      },
      error: (error) => {
        reject(error);
      },
    });
  });
}

/**
 * Split the raw CSV into:
 * - transactions table (mapped to RawRow objects using the first header row)
 * - cards table (mapped so that rows have `last_4` and `name` properties)
 *
 * This follows the spec:
 * - Find the header row that contains BOTH "last_4" and "name" (case-insensitive).
 * - Everything before that row is transactions
 * - Everything from that row onwards is cards
 */
export function splitTables(rows: CsvRow[]): { transactions: RawRow[]; cards: RawRow[] } {
  if (!rows.length) {
    return { transactions: [], cards: [] };
  }

  // First non-empty row is the transactions header
  const firstHeaderIndex = rows.findIndex((r) => r.some((cell) => String(cell ?? '').trim() !== ''));
  if (firstHeaderIndex === -1) {
    return { transactions: [], cards: [] };
  }
  const txHeader = rows[firstHeaderIndex].map((h) => String(h ?? ''));

  // Find the cards header row by VALUES containing last_4 and name
  let cardsHeaderIndex = -1;
  for (let i = firstHeaderIndex + 1; i < rows.length; i++) {
    const row = rows[i].map((c) => String(c ?? '').toLowerCase().trim());
    const hasLast4 = row.some((c) => c.includes('last_4') || c.includes('last4'));
    const hasName = row.some((c) => c === 'name');
    if (hasLast4 && hasName) {
      cardsHeaderIndex = i;
      break;
    }
  }

  // If we never found a cards header, treat everything (after first header) as transactions
  if (cardsHeaderIndex === -1) {
    const txRows: RawRow[] = [];
    for (let i = firstHeaderIndex + 1; i < rows.length; i++) {
      const row = rows[i];
      const obj: RawRow = {};
      txHeader.forEach((header, idx) => {
        obj[header] = String(row[idx] ?? '');
      });
      // keep even if blanks; later logic will remove blank-items rows
      txRows.push(obj);
    }
    return { transactions: txRows, cards: [] };
  }

  // Map transaction rows up to just before the cards header
  const transactions: RawRow[] = [];
  for (let i = firstHeaderIndex + 1; i < cardsHeaderIndex; i++) {
    const row = rows[i];
    const obj: RawRow = {};
    txHeader.forEach((header, idx) => {
      obj[header] = String(row[idx] ?? '');
    });
    transactions.push(obj);
  }

  // Map cards table: header row values tell us which columns are last_4 and name
  const cardsHeaderRaw = rows[cardsHeaderIndex];
  let last4Col = -1;
  let nameCol = -1;
  cardsHeaderRaw.forEach((cell, idx) => {
    const v = String(cell ?? '').toLowerCase().trim();
    if (last4Col === -1 && (v.includes('last_4') || v.includes('last4'))) {
      last4Col = idx;
    }
    if (nameCol === -1 && v === 'name') {
      nameCol = idx;
    }
  });

  const cards: RawRow[] = [];
  if (last4Col !== -1 && nameCol !== -1) {
    for (let i = cardsHeaderIndex + 1; i < rows.length; i++) {
      const row = rows[i];
      const last4 = String(row[last4Col] ?? '').trim();
      const name = String(row[nameCol] ?? '').trim();
      if (!last4 && !name) continue;
      cards.push({
        last_4: last4,
        name,
      });
    }
  }

  return { transactions, cards };
}

export function parseCardsTable(rows: RawRow[]): Card[] {
  if (rows.length === 0) return [];

  const cards: Card[] = [];
  for (const row of rows) {
    const last4 = String((row as any).last_4 ?? '').trim();
    const name = String((row as any).name ?? '').trim();
    if (last4 || name) {
      cards.push({ last_4: last4, name });
    }
  }
  return cards;
}

