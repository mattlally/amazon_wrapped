import { parse, getYear, startOfMonth } from 'date-fns';
import type { Transaction, Card } from '../types';
import { parseMoney } from './money';
import { fuzzyMatch, extractLast4 } from './fuzzy';

export function assignPerson(
  transaction: Record<string, string>,
  cards: Card[],
  cardNames: string[]
): string {
  const to = (transaction.to || '').trim();
  const payments = (transaction.payments || '').trim();
  
  // Strategy 1: If `to` exists, try to match it
  if (to) {
    // Try exact match first (case-insensitive, normalized) - most reliable
    const normalizedTo = to.toLowerCase().replace(/[.,]/g, '').replace(/\s+/g, ' ').trim();
    for (const cardName of cardNames) {
      const normalizedCardName = cardName.toLowerCase().replace(/[.,]/g, '').replace(/\s+/g, ' ').trim();
      if (normalizedTo === normalizedCardName) {
        return cardName;
      }
    }
    
    // Try with standard threshold
    let matched = fuzzyMatch(to, cardNames, 60);
    if (matched) {
      return matched;
    }
    
    // Try with lower threshold (40%) for partial matches
    matched = fuzzyMatch(to, cardNames, 40);
    if (matched) {
      return matched;
    }
    
    // Check if one contains the other (handles "Marian V Lally" vs "Marian Lally")
    // Lower the length requirement to catch more matches
    for (const cardName of cardNames) {
      const normalizedCardName = cardName.toLowerCase().replace(/[.,]/g, '').replace(/\s+/g, ' ').trim();
      if (normalizedTo.includes(normalizedCardName) || normalizedCardName.includes(normalizedTo)) {
        // Lower threshold - allow shorter matches (e.g., "Bill" should match "Bill Lally")
        if (normalizedCardName.length > 3 && normalizedTo.length > 3) {
          return cardName;
        }
      }
    }
    
    // NEW: If `to` field has a value but doesn't match any card, use it directly
    // This handles cases where the name in `to` is correct but not in the cards table
    // Only do this if it looks like a real name (has at least 2 words or is > 5 chars)
    const words = normalizedTo.split(/\s+/).filter(w => w.length > 0);
    if (words.length >= 2 || normalizedTo.length > 5) {
      // Capitalize first letter of each word
      const capitalized = to
        .split(/\s+/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
      return capitalized;
    }
  }
  
  // Strategy 2: Extract last 4 from payments and match via card map
  if (payments) {
    const last4 = extractLast4(payments);
    if (last4) {
      const card = cards.find(c => c.last_4 === last4);
      if (card && card.name) {
        return card.name;
      }
    }
  }
  
  return 'Unknown';
}

export function deriveFields(transaction: Record<string, string>, cards: Card[], cardNames: string[], total_total: number): Partial<Transaction> {
  const refund = parseMoney(transaction.refund);
  const shippingRefund = parseMoney(transaction.shipping_refund);
  
  const person = assignPerson(transaction, cards, cardNames);
  const isReturn = refund > 0 || shippingRefund > 0;
  // net_spend is total_total minus refunds (for backwards compatibility, but we'll use total_total for spend)
  const netSpend = total_total - refund - shippingRefund;
  
  // Parse date
  let year: number | null = null;
  let month: Date | null = null;
  
  if (transaction.date) {
    const parsed = parse(transaction.date, 'yyyy-MM-dd', new Date());
    if (!isNaN(parsed.getTime())) {
      year = getYear(parsed);
      month = startOfMonth(parsed);
    }
  }
  
  return {
    person,
    is_return: isReturn,
    net_spend: netSpend,
    year,
    month,
    order_count: 1,
  };
}

