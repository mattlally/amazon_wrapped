import { useState } from 'react';
import type { Transaction } from '../types';
import { format } from 'date-fns';

interface SuperlativesProps {
  transactions: Transaction[];
}

export function Superlatives({ transactions }: SuperlativesProps) {
  const [expandedDropdown, setExpandedDropdown] = useState<string | null>(null);

  if (transactions.length === 0) return null;

  // Calculate person totals
  const personStats = new Map<string, { spend: number; orders: number; maxOrder: { amount: number; transaction: Transaction | null } }>();
  
  transactions.forEach((t) => {
    const existing = personStats.get(t.person) || { spend: 0, orders: 0, maxOrder: { amount: 0, transaction: null } };
    // Total Spend = total_total - refund (for each transaction)
    existing.spend += t.total_total - t.refund;
    existing.orders += t.order_count;
    // Track the highest total_total for most expensive purchase
    if (t.total_total > existing.maxOrder.amount) {
      existing.maxOrder = { amount: t.total_total, transaction: t };
    }
    personStats.set(t.person, existing);
  });

  // Count returns per person
  const returnCounts = new Map<string, number>();
  transactions.forEach((t) => {
    if (t.is_return) {
      const count = returnCounts.get(t.person) || 0;
      returnCounts.set(t.person, count + 1);
    }
  });

  // Build rankings for each category
  const spendRankings = Array.from(personStats.entries())
    .map(([person, stats]) => ({ person, value: stats.spend }))
    .sort((a, b) => b.value - a.value);

  const ordersRankings = Array.from(personStats.entries())
    .map(([person, stats]) => ({ person, value: stats.orders }))
    .sort((a, b) => b.value - a.value);

  const maxOrderRankings = Array.from(personStats.entries())
    .map(([person, stats]) => ({ person, value: stats.maxOrder.amount, transaction: stats.maxOrder.transaction }))
    .filter(item => item.transaction !== null)
    .sort((a, b) => b.value - a.value);

  const returnsRankings = Array.from(returnCounts.entries())
    .map(([person, count]) => ({ person, value: count }))
    .sort((a, b) => b.value - a.value);

  // Find winners
  const biggestSpender = spendRankings[0];
  const mostFrequentPurchaser = ordersRankings[0];
  const mostExpensivePurchase = maxOrderRankings[0];
  const mostReturns = returnsRankings[0];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const formatItems = (items: string, maxLength: number = 50) => {
    if (items.length <= maxLength) return items;
    return items.substring(0, maxLength) + '...';
  };

  const superlatives = [
    {
      id: 'spend',
      title: 'Biggest Spender',
      winner: biggestSpender?.person || 'N/A',
      data: biggestSpender ? formatCurrency(biggestSpender.value) : 'N/A',
      icon: '💰',
      rankings: spendRankings,
      formatValue: formatCurrency,
    },
    {
      id: 'orders',
      title: 'Most Frequent Purchaser',
      winner: mostFrequentPurchaser?.person || 'N/A',
      data: mostFrequentPurchaser ? `${mostFrequentPurchaser.value} orders` : 'N/A',
      icon: '🛒',
      rankings: ordersRankings,
      formatValue: (v: number) => `${v} orders`,
    },
    {
      id: 'purchase',
      title: 'Most Expensive Purchase',
      winner: mostExpensivePurchase?.person || 'N/A',
      data: mostExpensivePurchase && mostExpensivePurchase.transaction
        ? `${formatCurrency(mostExpensivePurchase.value)} - ${formatItems(mostExpensivePurchase.transaction.items)}${mostExpensivePurchase.transaction.date ? ` on ${format(mostExpensivePurchase.transaction.date, 'M/d/yyyy')}` : ''}`
        : 'N/A',
      icon: '💎',
      rankings: maxOrderRankings.map(r => ({ person: r.person, value: r.value })),
      formatValue: formatCurrency,
    },
    {
      id: 'returns',
      title: 'Most Returns',
      winner: mostReturns?.person || 'N/A',
      data: mostReturns ? `${mostReturns.value} returns` : 'N/A',
      icon: '↩️',
      rankings: returnsRankings,
      formatValue: (v: number) => `${v} returns`,
    },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-800">Spending Superlatives</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {superlatives.map((superlative) => (
          <div
            key={superlative.id}
            className="bg-white rounded-lg shadow-lg p-6 border-2 border-gray-200"
          >
            <div className="text-3xl mb-2">{superlative.icon}</div>
            <h3 className="text-sm font-medium text-gray-600 mb-2">{superlative.title}</h3>
            <p className="text-lg font-bold text-gray-900 mb-1">{superlative.winner}</p>
            <p className="text-sm text-gray-600 mb-3">{superlative.data}</p>
            
            {/* Dropdown */}
            <div className="relative">
              <button
                onClick={() => setExpandedDropdown(expandedDropdown === superlative.id ? null : superlative.id)}
                className="w-full text-left text-sm text-gray-700 hover:text-gray-900 font-medium"
              >
                {expandedDropdown === superlative.id ? '▼' : '▶'} Everyone Else
              </button>
              {expandedDropdown === superlative.id && (
                <div className="mt-2 space-y-1 max-h-48 overflow-y-auto">
                  {superlative.rankings.slice(1).map((rank, idx) => (
                    <div key={rank.person} className="text-xs text-gray-600 flex justify-between">
                      <span>{idx + 2}. {rank.person}</span>
                      <span className="font-medium">{superlative.formatValue(rank.value)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
