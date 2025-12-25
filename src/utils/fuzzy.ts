// Normalize name for comparison (remove punctuation, extra spaces, etc.)
function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[.,]/g, '') // Remove periods and commas
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
}

// Token-set ratio similarity (simplified version)
function tokenSetRatio(str1: string, str2: string): number {
  const normalized1 = normalizeName(str1);
  const normalized2 = normalizeName(str2);
  
  // Try exact match first (case-insensitive, normalized)
  if (normalized1 === normalized2) {
    return 100;
  }
  
  const tokens1 = new Set(normalized1.split(/\s+/).filter(t => t.length > 0));
  const tokens2 = new Set(normalized2.split(/\s+/).filter(t => t.length > 0));
  
  if (tokens1.size === 0 && tokens2.size === 0) return 100;
  if (tokens1.size === 0 || tokens2.size === 0) return 0;
  
  // Check if all tokens from the shorter name are in the longer name
  // This handles cases like "Marian V Lally" vs "Marian Lally"
  const shorter = tokens1.size <= tokens2.size ? tokens1 : tokens2;
  const longer = tokens1.size > tokens2.size ? tokens1 : tokens2;
  const allInLonger = Array.from(shorter).every(t => longer.has(t));
  
  if (allInLonger) {
    // If all tokens from shorter are in longer, calculate score based on overlap
    const intersection = new Set([...tokens1].filter(t => tokens2.has(t)));
    const union = new Set([...tokens1, ...tokens2]);
    return (intersection.size / union.size) * 100;
  }
  
  const intersection = new Set([...tokens1].filter(t => tokens2.has(t)));
  const union = new Set([...tokens1, ...tokens2]);
  
  if (union.size === 0) return 100;
  
  return (intersection.size / union.size) * 100;
}

export function fuzzyMatch(
  target: string,
  candidates: string[],
  threshold: number = 60
): string | null {
  if (!target || target.trim() === '') return null;
  
  const normalizedTarget = normalizeName(target);
  
  let bestMatch: string | null = null;
  let bestScore = 0;
  
  for (const candidate of candidates) {
    if (!candidate || candidate.trim() === '') continue;
    
    // Try exact match first (normalized)
    const normalizedCandidate = normalizeName(candidate);
    if (normalizedTarget === normalizedCandidate) {
      return candidate; // Return original candidate (preserves capitalization)
    }
    
    const score = tokenSetRatio(target, candidate);
    if (score > bestScore && score >= threshold) {
      bestScore = score;
      bestMatch = candidate;
    }
  }
  
  return bestMatch;
}

export function extractLast4(payments: string): string | null {
  if (!payments) return null;
  
  // Look for 4 consecutive digits, preferably at the end or after common separators
  const patterns = [
    /\b(\d{4})\s*$/m, // 4 digits at end
    /[•\*]\s*(\d{4})\b/, // After bullet/asterisk
    /\b(\d{4})\b/, // Any 4 digits
  ];
  
  for (const pattern of patterns) {
    const match = payments.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  
  return null;
}

