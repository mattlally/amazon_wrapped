export interface Transaction {
  order_id: string;
  order_url: string;
  items: string;
  to: string;
  date: Date | null;
  total: number; // Total charged to credit/debit card (includes subtotal, tax, shipping)
  gift: number; // Amount charged to gift card
  refund: number;
  payments: string;
  person: string;
  is_return: boolean;
  net_spend: number; // total_total - refund
  total_total: number; // total + gift - refund
  year: number | null;
  month: Date | null;
  order_count: number;
  category: string;
}

export interface Card {
  last_4: string;
  name: string;
}

export interface ParsedData {
  transactions: Transaction[];
  cards: Card[];
  stats: {
    transactionsLoaded: number;
    rowsRemoved: number;
    cardsLoaded: number;
    peopleDetected: string[];
    invalidDateCount: number;
    unknownPersonCount: number;
    finalTransactionCount: number;
  };
}

export interface FilterState {
  selectedPerson: string;
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
  metric: 'spend' | 'count';
  excludeReturns: boolean;
}

export interface KpiData {
  totalSpend: number;
  orders: number;
  returns: number;
  returnRate: number;
  avgOrderValue: number;
}

export interface MonthlyData {
  month: string;
  spend: number;
  orders: number;
  person: string;
}

export interface CategoryData {
  category: string;
  spend: number;
  orders: number;
}

