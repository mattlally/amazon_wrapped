import { useState } from 'react';
import { format } from 'date-fns';
import type { KpiData } from '../types';
import type { Transaction } from '../types';

interface KpiCardsProps {
  kpis: KpiData;
  transactions: Transaction[];
}

export function KpiCards({ kpis, transactions }: KpiCardsProps) {
  const [tooltipCard, setTooltipCard] = useState<string | null>(null);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const formatPercent = (value: number) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  // Calculate most expensive purchase
  const mostExpensive = transactions.length > 0
    ? transactions.reduce((max, t) => t.total_total > max.total_total ? t : max, transactions[0])
    : null;

  // Format tooltip for most expensive purchase
  const formatMostExpensiveTooltip = (t: Transaction | null) => {
    if (!t) return null;
    const dateStr = t.date ? format(t.date, 'MMM d, yyyy') : 'N/A';
    return `${t.person}\n${dateStr}\n${t.items}`;
  };

  const cards = [
    {
      title: 'Total Spend',
      value: formatCurrency(kpis.totalSpend),
      tooltip: null,
    },
    {
      title: 'Orders',
      value: kpis.orders.toLocaleString(),
      tooltip: null,
    },
    {
      title: 'Returns',
      value: kpis.returns.toLocaleString(),
      tooltip: null,
    },
    {
      title: 'Return Rate',
      value: formatPercent(kpis.returnRate),
      tooltip: null,
    },
    {
      title: 'Avg Order Value',
      value: formatCurrency(kpis.avgOrderValue),
      tooltip: null,
    },
    {
      title: 'Most Expensive Purchase',
      value: mostExpensive ? formatCurrency(mostExpensive.total_total) : '$0.00',
      tooltip: formatMostExpensiveTooltip(mostExpensive),
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {cards.map((card) => (
        <div
          key={card.title}
          className="bg-[#1DB954] rounded-lg shadow-lg p-6 text-white relative"
          onMouseEnter={() => card.tooltip && setTooltipCard(card.title)}
          onMouseLeave={() => setTooltipCard(null)}
          onClick={() => card.tooltip && setTooltipCard(tooltipCard === card.title ? null : card.title)}
        >
          <h3 className="text-sm font-medium opacity-90 mb-1">{card.title}</h3>
          <p className="text-2xl font-bold">{card.value}</p>
          {card.tooltip && tooltipCard === card.title && (
            <div className="absolute bottom-full left-0 right-0 mb-2 bg-gray-900 text-white text-xs rounded-lg p-3 z-10 shadow-lg max-w-full">
              <p className="break-words">{card.tooltip}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

