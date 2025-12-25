export function parseMoney(value: string | undefined | null): number {
  if (!value) return 0;
  const str = String(value).trim();
  if (str === '' || str.toLowerCase() === 'nan' || str.toLowerCase() === 'none') {
    return 0;
  }
  
  // Remove $ and commas
  const cleaned = str.replace(/[$,\s]/g, '');
  const parsed = parseFloat(cleaned);
  
  return isNaN(parsed) ? 0 : parsed;
}

