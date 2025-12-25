export function normalizeHeader(header: string): string {
  return header
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s]/g, '') // Remove punctuation
    .replace(/\s+/g, '_'); // Replace spaces with underscores
}

export function normalizeString(value: string | undefined | null): string {
  if (value === undefined || value === null) return '';
  const str = String(value).trim();
  if (str.toLowerCase() === 'nan' || str.toLowerCase() === 'none') return '';
  return str;
}

export function ensureColumns(row: Record<string, string>, requiredColumns: string[]): Record<string, string> {
  const normalized: Record<string, string> = {};
  
  // First, normalize all existing columns
  for (const [key, value] of Object.entries(row)) {
    const normalizedKey = normalizeHeader(key);
    normalized[normalizedKey] = normalizeString(value);
  }
  
  // Then ensure all required columns exist
  for (const col of requiredColumns) {
    if (!(col in normalized)) {
      normalized[col] = '';
    }
  }
  
  return normalized;
}

