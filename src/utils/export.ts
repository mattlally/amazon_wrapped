import type { Transaction } from '../types';
import Papa from 'papaparse';

export function downloadCSV(transactions: Transaction[], filename: string = 'amazon-wrapped.csv') {
  const data = transactions.map(t => ({
    date: t.date ? t.date.toISOString().split('T')[0] : '',
    person: t.person,
    items: t.items,
    total: t.total.toFixed(2),
    refund: t.refund.toFixed(2),
    net_spend: t.net_spend.toFixed(2),
    is_return: t.is_return ? 'Yes' : 'No',
    payments: t.payments,
    order_id: t.order_id,
    category: t.category,
  }));
  
  const csv = Papa.unparse(data);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export interface SummaryData {
  kpis: {
    totalSpend: number;
    orders: number;
    returns: number;
    returnRate: number;
    avgOrderValue: number;
  };
  monthlySeries: Array<{
    month: string;
    spend: number;
    orders: number;
    person: string;
  }>;
  topSpenders: Array<{
    person: string;
    spend: number;
    orders: number;
  }>;
  categories: Array<{
    category: string;
    spend: number;
    orders: number;
  }>;
}

export function downloadSummaryJSON(data: SummaryData, filename: string = 'amazon-wrapped-summary.json') {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

