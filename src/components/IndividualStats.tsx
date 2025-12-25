import { useState } from 'react';
import { format } from 'date-fns';
import type { Transaction } from '../types';

interface IndividualStatsProps {
  transactions: Transaction[];
  selectedPerson: string;
}

export function IndividualStats({ transactions, selectedPerson }: IndividualStatsProps) {
  const [tooltipCard, setTooltipCard] = useState<string | null>(null);

  // Filter transactions for selected person
  const personTransactions = transactions.filter((t) => t.person === selectedPerson);
  const othersTransactions = transactions.filter((t) => t.person !== selectedPerson);

  // Calculate person stats
  // Total Spend = sum of total_total - sum of refund
  const personSumTotalTotal = personTransactions.reduce((sum, t) => sum + t.total_total, 0);
  const personSumRefund = personTransactions.reduce((sum, t) => sum + t.refund, 0);
  const personTotalSpend = personSumTotalTotal - personSumRefund;
  
  const personOrders = personTransactions.length;
  const personReturns = personTransactions.filter((t) => t.refund > 0).length;
  const personReturnRate = personOrders > 0 ? personReturns / personOrders : 0;
  const personAvgOrderValue = personOrders > 0 ? personTotalSpend / personOrders : 0;
  const personMaxOrderValue = personTransactions.length > 0
    ? Math.max(...personTransactions.map((t) => t.total_total))
    : 0;

  // Calculate others stats (averages)
  const othersPeople = new Set(othersTransactions.map(t => t.person));
  const othersPeopleCount = othersPeople.size;
  
  // Find the transaction with max order value for tooltip
  const maxOrderTransaction = personTransactions.length > 0
    ? personTransactions.reduce((max, t) => t.total_total > max.total_total ? t : max, personTransactions[0])
    : null;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const formatPercent = (value: number) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  if (othersPeopleCount === 0) {
    // No other people, set all to 0
    const stats = [
      { title: 'Total Spend', personValue: personTotalSpend, othersValue: 0, format: formatCurrency, tooltip: null },
      { title: 'Orders', personValue: personOrders, othersValue: 0, format: (v: number) => Math.round(v).toLocaleString(), tooltip: null },
      { title: 'Returns', personValue: personReturns, othersValue: 0, format: (v: number) => Math.round(v).toLocaleString(), tooltip: null },
      { title: 'Return Rate', personValue: personReturnRate, othersValue: 0, format: formatPercent, tooltip: null },
      { title: 'Avg Order Value', personValue: personAvgOrderValue, othersValue: 0, format: formatCurrency, tooltip: null },
      { title: 'Most Expensive Purchase', personValue: personMaxOrderValue, othersValue: 0, format: formatCurrency, tooltip: maxOrderTransaction ? (() => {
        const dateStr = maxOrderTransaction.date ? format(maxOrderTransaction.date, 'MMM d, yyyy') : 'N/A';
        return `${dateStr}\n${maxOrderTransaction.items}`;
      })() : null },
    ];
    return renderStats(stats, selectedPerson, tooltipCard, setTooltipCard);
  }

  // Calculate per-person stats for others
  const othersPersonStats = Array.from(othersPeople).map(person => {
    const personTxns = othersTransactions.filter(t => t.person === person);
    // Total Spend = sum of total_total - sum of refund
    const sumTotalTotal = personTxns.reduce((sum, t) => sum + t.total_total, 0);
    const sumRefund = personTxns.reduce((sum, t) => sum + t.refund, 0);
    const spend = sumTotalTotal - sumRefund;
    
    const orders = personTxns.length;
    const returns = personTxns.filter(t => t.refund > 0).length;
    const returnRate = orders > 0 ? returns / orders : 0;
    const avgOrderValue = orders > 0 ? spend / orders : 0;
    const maxOrderValue = personTxns.length > 0 ? Math.max(...personTxns.map(t => t.total_total)) : 0;
    
    return { spend, orders, returns, returnRate, avgOrderValue, maxOrderValue };
  });

  // Calculate averages across all other people
  const othersAvgTotalSpend = othersPersonStats.reduce((sum, s) => sum + s.spend, 0) / othersPeopleCount;
  const othersAvgOrders = othersPersonStats.reduce((sum, s) => sum + s.orders, 0) / othersPeopleCount;
  const othersAvgReturns = othersPersonStats.reduce((sum, s) => sum + s.returns, 0) / othersPeopleCount;
  const othersAvgReturnRate = othersPersonStats.reduce((sum, s) => sum + s.returnRate, 0) / othersPeopleCount;
  const othersAvgOrderValue = othersPersonStats.reduce((sum, s) => sum + s.avgOrderValue, 0) / othersPeopleCount;
  const othersAvgMaxOrderValue = othersPersonStats.reduce((sum, s) => sum + s.maxOrderValue, 0) / othersPeopleCount;

  const stats = [
    {
      title: 'Total Spend',
      personValue: personTotalSpend,
      othersValue: othersAvgTotalSpend,
      format: formatCurrency,
    },
    {
      title: 'Orders',
      personValue: personOrders,
      othersValue: othersAvgOrders,
      format: (v: number) => Math.round(v).toLocaleString(),
    },
    {
      title: 'Returns',
      personValue: personReturns,
      othersValue: othersAvgReturns,
      format: (v: number) => Math.round(v).toLocaleString(),
    },
    {
      title: 'Return Rate',
      personValue: personReturnRate,
      othersValue: othersAvgReturnRate,
      format: formatPercent,
    },
    {
      title: 'Avg Order Value',
      personValue: personAvgOrderValue,
      othersValue: othersAvgOrderValue,
      format: formatCurrency,
    },
    {
      title: 'Most Expensive Purchase',
      personValue: personMaxOrderValue,
      othersValue: othersAvgMaxOrderValue,
      format: formatCurrency,
      tooltip: maxOrderTransaction ? (() => {
        const dateStr = maxOrderTransaction.date ? format(maxOrderTransaction.date, 'MMM d, yyyy') : 'N/A';
        return `${dateStr}\n${maxOrderTransaction.items}`;
      })() : null,
    },
  ];

  return renderStats(stats, selectedPerson, tooltipCard, setTooltipCard);
}

function renderStats(
  stats: Array<{ title: string; personValue: number; othersValue: number; format: (v: number) => string; tooltip: string | null }>,
  selectedPerson: string,
  tooltipCard: string | null,
  setTooltipCard: (card: string | null) => void
) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.title}
          className="bg-white rounded-lg shadow relative"
          onMouseEnter={() => stat.tooltip && setTooltipCard(stat.title)}
          onMouseLeave={() => setTooltipCard(null)}
          onClick={() => stat.tooltip && setTooltipCard(tooltipCard === stat.title ? null : stat.title)}
        >
          <div className="p-4 bg-gray-50 border-b border-gray-200">
            <h3 className="text-sm font-medium text-gray-700">{stat.title}</h3>
          </div>
          <div className="flex">
            {/* Person section - Spotify green */}
            <div className="flex-1 bg-[#1DB954] p-4">
              <p className="text-xs font-medium text-black mb-1">{selectedPerson}</p>
              <p className="text-xl font-bold text-black">{stat.format(stat.personValue)}</p>
            </div>
            {/* Others section - Grey */}
            <div className="flex-1 bg-gray-600 p-4">
              <p className="text-xs font-medium text-white mb-1">Others (Avg)</p>
              <p className="text-xl font-bold text-white">{stat.format(stat.othersValue)}</p>
            </div>
          </div>
          {stat.tooltip && tooltipCard === stat.title && (
            <div className="absolute bottom-full left-0 right-0 mb-2 bg-gray-900 text-white text-xs rounded-lg p-3 z-10 shadow-lg max-w-full">
              <p className="break-words whitespace-pre-line">{stat.tooltip}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
