import { parse, getYear, startOfMonth } from 'date-fns';
import type { ParsedData, Transaction, Card } from '../types';
import { parseCSV, splitTables, parseCardsTable } from './csvSplit';
import { ensureColumns, normalizeString } from './normalize';
import { parseMoney } from './money';
import { inferCategory } from './categorize';

const REQUIRED_COLUMNS = [
  'to',
  'payments',
  'date',
  'total',
  'refund',
  'gift',
  'order_id',
  'order_url',
];

/**
 * Extract last 4 digits from payments field
 * Looks for pattern "ending in" followed by 4 digits
 */
function extractLast4FromPayments(payments: string): string | null {
  if (!payments) return null;
  
  // Look for "ending in" followed by 4 digits
  const pattern = /ending\s+in\s+(\d{4})/i;
  const match = payments.match(pattern);
  if (match && match[1]) {
    return match[1];
  }
  
  // Fallback: look for any 4 consecutive digits
  const fallbackPattern = /\b(\d{4})\b/;
  const fallbackMatch = payments.match(fallbackPattern);
  if (fallbackMatch && fallbackMatch[1]) {
    return fallbackMatch[1];
  }
  
  return null;
}

/**
 * Populate missing "to" field using payments field and cards lookup
 */
function populateToField(
  transactions: Array<Record<string, string>>,
  cards: Card[]
): void {
  // Create a map of last_4 -> name for quick lookup
  const cardMap = new Map<string, string>();
  cards.forEach(card => {
    if (card.last_4 && card.name) {
      cardMap.set(card.last_4.trim(), card.name.trim());
    }
  });
  
  // For each transaction with blank/null "to", try to populate it
  transactions.forEach(transaction => {
    const to = normalizeString(transaction.to);
    if (!to || to.trim() === '') {
      const payments = normalizeString(transaction.payments);
      if (payments) {
        const last4 = extractLast4FromPayments(payments);
        if (last4 && cardMap.has(last4)) {
          transaction.to = cardMap.get(last4)!;
        }
      }
    }
  });
}

export async function processCSVFile(file: File): Promise<ParsedData> {
  // Step 1: Load CSV as raw rows
  const rawRows = await parseCSV(file);
  
  // Step 2: Split into two tables - transactions and cards
  const { transactions: transactionRawRows, cards: cardRawRows } = splitTables(rawRows);
  
  // Step 3: Parse cards table
  const cards = parseCardsTable(cardRawRows);
  
  // Step 4: Normalize transaction rows and ensure columns exist
  // First, filter out completely empty rows (all cells are empty/blank)
  const nonEmptyRows = transactionRawRows.filter(row => {
    return Object.values(row).some(val => String(val || '').trim() !== '');
  });
  
  // Step 4a: Remove fields we don't need (shipping, shipping_refund, tax)
  // and normalize the remaining fields
  const normalizedTransactions: Array<Record<string, string>> = [];
  for (const row of nonEmptyRows) {
    const normalized = ensureColumns(row, REQUIRED_COLUMNS);
    // Explicitly remove shipping, shipping_refund, and tax fields if they exist
    delete normalized.shipping;
    delete normalized.shipping_refund;
    delete normalized.tax;
    normalizedTransactions.push(normalized);
  }
  
  console.log(`Raw transaction rows: ${transactionRawRows.length}`);
  console.log(`Non-empty rows: ${nonEmptyRows.length}`);
  
  // Step 5: Create total_total column = total + gift
  const transactionsWithTotalTotal = normalizedTransactions.map(row => {
    const total = parseMoney(row.total);
    const gift = parseMoney(row.gift);
    
    // Calculate total_total = total + gift (do NOT subtract refund here)
    const total_total = total + gift;
    
    // Round to 2 decimal places to match typical currency precision
    const roundedTotal = Math.round(total_total * 100) / 100;
    
    return {
      ...row,
      total_total: roundedTotal,
    };
  });
  
  // Step 6: Remove rows where total_total = 0 or null
  const transactionsNonZero = transactionsWithTotalTotal.filter(row => {
    const total_total = row.total_total as number;
    
    // Filter out if null or NaN
    if (total_total === null || isNaN(total_total)) {
      return false;
    }
    
    // Round to 2 decimal places and check if it's effectively 0
    const rounded = Math.round(total_total * 100) / 100;
    
    // Remove rows where total_total is 0 (or very close to 0)
    return Math.abs(rounded) > 0.001;
  });
  
  // Step 7: Remove rows where items is null or blank
  // Check both the normalized items field and the original items field
  const transactionsWithItems = transactionsNonZero.filter(row => {
    const items = normalizeString(row.items);
    // Also check the original items field in case normalization missed something
    const originalItems = String(row.items || '').trim();
    return items.trim() !== '' && originalItems !== '';
  });
  
  // Debug logging
  console.log('=== Data Cleaning Debug ===');
  console.log(`Initial transactions: ${normalizedTransactions.length}`);
  console.log(`After total_total calculation: ${transactionsWithTotalTotal.length}`);
  console.log(`After removing total_total = 0: ${transactionsNonZero.length}`);
  console.log(`After removing blank items: ${transactionsWithItems.length}`);
  
  const sumBeforeFilters = transactionsWithTotalTotal.reduce((sum, row) => sum + (row.total_total as number || 0), 0);
  const sumAfterFilters = transactionsWithItems.reduce((sum, row) => sum + (row.total_total as number || 0), 0);
  console.log(`Sum before filters: $${sumBeforeFilters.toFixed(2)}`);
  console.log(`Sum after filters: $${sumAfterFilters.toFixed(2)}`);
  
  // Additional debug: show rows that were filtered out
  const zeroTotalRows = transactionsWithTotalTotal.filter(row => {
    const total_total = row.total_total as number;
    return total_total === null || isNaN(total_total) || Math.abs(total_total) <= 0.001;
  });
  console.log(`Rows with total_total = 0 (filtered out): ${zeroTotalRows.length}`);
  
  // Show ALL zero total rows with details
  if (zeroTotalRows.length > 0) {
    console.log('All zero total rows:', zeroTotalRows.map(r => ({
      order_id: r.order_id,
      total: r.total,
      gift: r.gift,
      refund: r.refund,
      total_total: r.total_total,
      items: r.items?.substring(0, 50) || '(blank)'
    })));
  }
  
  // Also show rows that we're KEEPING but might have very small total_total
  const keptRowsWithSmallTotal = transactionsNonZero.filter(row => {
    const total_total = row.total_total as number;
    return total_total !== null && !isNaN(total_total) && Math.abs(total_total) > 0.001 && Math.abs(total_total) < 0.50;
  });
  console.log(`Rows kept with small total_total (< $0.50): ${keptRowsWithSmallTotal.length}`);
  if (keptRowsWithSmallTotal.length > 0) {
    console.log('Rows with small total_total:', keptRowsWithSmallTotal.map(r => ({
      order_id: r.order_id,
      total: r.total,
      gift: r.gift,
      refund: r.refund,
      calculated_total_total: (parseMoney(r.total) + parseMoney(r.gift) - parseMoney(r.refund)).toFixed(2),
      stored_total_total: r.total_total,
      items: r.items?.substring(0, 50) || '(blank)'
    })));
  }
  
  const blankItemsRows = transactionsNonZero.filter(row => {
    const items = normalizeString(row.items);
    const originalItems = String(row.items || '').trim();
    return items.trim() === '' || originalItems === '';
  });
  console.log(`Rows with blank items (filtered out): ${blankItemsRows.length}`);
  if (blankItemsRows.length > 0 && blankItemsRows.length <= 10) {
    console.log('Sample blank items rows:', blankItemsRows.map(r => ({
      order_id: r.order_id,
      items: r.items,
      total_total: r.total_total
    })));
  }
  
  // Step 8: Add refund_boolean column
  const transactionsWithRefundBoolean = transactionsWithItems.map(row => {
    const refund = parseMoney(row.refund);
    const refund_boolean = refund !== 0 && refund !== null;
    
    return {
      ...row,
      refund_boolean,
    };
  });
  
  // Step 9: Populate missing "to" field using payments and cards lookup
  populateToField(transactionsWithRefundBoolean, cards);
  
  // Step 10: Now process into Transaction objects and assign people
  const processedTransactions: Transaction[] = [];
  let invalidDateCount = 0;
  let unknownPersonCount = 0;
  const peopleSet = new Set<string>();
  
  // Build card name list for person assignment
  const cardNames = cards.map(c => c.name).filter(n => n.trim() !== '');
  
  for (const row of transactionsWithRefundBoolean) {
    // Parse date
    let date: Date | null = null;
    if (row.date) {
      const parsed = parse(row.date, 'yyyy-MM-dd', new Date());
      if (isNaN(parsed.getTime())) {
        invalidDateCount++;
      } else {
        date = parsed;
      }
    }
    
    // Parse money columns
    const total = parseMoney(row.total);
    const refund = parseMoney(row.refund);
    const gift = parseMoney(row.gift);
    const total_total = row.total_total as number;
    const refund_boolean = row.refund_boolean as boolean;
    
    // Assign person - use the "to" field directly (it should be populated by step 7)
    // Capitalize it properly for display
    let person = 'Unknown';
    const to = normalizeString(row.to);
    if (to && to.trim() !== '') {
      // Capitalize first letter of each word
      person = to
        .split(/\s+/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
    } else {
      // If "to" is still blank after population attempt, try payments field as fallback
      const payments = normalizeString(row.payments);
      if (payments) {
        const last4 = extractLast4FromPayments(payments);
        if (last4) {
          const card = cards.find(c => c.last_4 === last4);
          if (card && card.name) {
            person = card.name;
          }
        }
      }
    }
    
    // Calculate is_return (refund > 0)
    const isReturn = refund > 0;
    
    // Calculate net_spend (total_total - refund)
    const netSpend = total_total - refund;
    
    // Parse year and month
    let year: number | null = null;
    let month: Date | null = null;
    if (date) {
      year = getYear(date);
      month = startOfMonth(date);
    }
    
    // Infer category
    const category = inferCategory(row.items, row.category);
    
    // Build transaction
    const transaction: Transaction = {
      order_id: row.order_id || '',
      order_url: row.order_url || '',
      items: row.items || '',
      to: to || '',
      date,
      total,
      gift,
      refund,
      payments: row.payments || '',
      person,
      is_return: isReturn,
      net_spend: netSpend,
      total_total,
      year,
      month,
      order_count: 1,
      category,
    };
    
    processedTransactions.push(transaction);
    
    if (person === 'Unknown') {
      unknownPersonCount++;
    }
    peopleSet.add(person);
  }
  
  // Calculate stats
  // Don't count blank rows between transactions and cards in the initial count
  // Count only non-empty transaction rows
  const initialTransactionCount = nonEmptyRows.length;
  const rowsRemoved = initialTransactionCount - processedTransactions.length;
  
  return {
    transactions: processedTransactions,
    cards,
    stats: {
      transactionsLoaded: initialTransactionCount, // Use non-empty rows count, not raw rows
      rowsRemoved,
      cardsLoaded: cards.length,
      peopleDetected: Array.from(peopleSet).sort(),
      invalidDateCount,
      unknownPersonCount,
      finalTransactionCount: processedTransactions.length,
    },
  };
}
