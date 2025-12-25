import { useMemo } from 'react';
import Plot from 'react-plotly.js';
import type { Transaction, FilterState } from '../types';
import { format } from 'date-fns';

interface ChartsProps {
  transactions: Transaction[];
  filters: FilterState;
  onPersonClick: (person: string) => void;
  onMonthClick?: (month: string | null) => void;
}

export function Charts({ transactions, filters, onPersonClick, onMonthClick }: ChartsProps) {
  // Person data
  const personData = useMemo(() => {
    const personMap = new Map<string, { spend: number; orders: number }>();

    transactions.forEach((t) => {
      const existing = personMap.get(t.person) || { spend: 0, orders: 0 };
      // Total Spend = total_total - refund (for each transaction)
      existing.spend += t.total_total - t.refund;
      existing.orders += t.order_count;
      personMap.set(t.person, existing);
    });

    // Sort people by spend in ascending order (for spend chart)
    const peopleBySpend = Array.from(personMap.keys()).sort((a, b) => {
      const spendA = personMap.get(a)!.spend;
      const spendB = personMap.get(b)!.spend;
      return spendA - spendB; // Ascending order
    });
    
    // Sort people by orders in ascending order (for order count chart)
    const peopleByOrders = Array.from(personMap.keys()).sort((a, b) => {
      const ordersA = personMap.get(a)!.orders;
      const ordersB = personMap.get(b)!.orders;
      return ordersA - ordersB; // Ascending order
    });
    
    // Truncate person names longer than 15 characters
    const truncateName = (name: string) => {
      return name.length > 15 ? name.substring(0, 15) + '...' : name;
    };

    return {
      people: peopleBySpend.map(truncateName), // For spend chart
      spend: peopleBySpend.map((p) => personMap.get(p)!.spend),
      orders: peopleBySpend.map((p) => personMap.get(p)!.orders),
      peopleByOrders: peopleByOrders.map(truncateName), // For order count chart
      ordersByPerson: peopleByOrders.map((p) => personMap.get(p)!.orders),
    };
  }, [transactions]);

  // Monthly data
  const monthlyData = useMemo(() => {
    const monthMap = new Map<string, { spend: number; orders: number }>();

    transactions.forEach((t) => {
      if (!t.month) return;
      const monthKey = format(t.month, 'yyyy-MM');
      const existing = monthMap.get(monthKey) || { spend: 0, orders: 0 };
      // Total Spend = total_total - refund (for each transaction)
      existing.spend += t.total_total - t.refund;
      existing.orders += t.order_count;
      monthMap.set(monthKey, existing);
    });

    const months = Array.from(monthMap.keys()).sort();
    return {
      // Format the month correctly - parse yyyy-MM and format as MMM yyyy
      months: months.map((m) => {
        const [year, month] = m.split('-');
        // Create date with month (0-indexed, so month-1) and day 1
        const date = new Date(parseInt(year), parseInt(month) - 1, 1);
        return format(date, 'MMM yyyy');
      }),
      spend: months.map((m) => monthMap.get(m)!.spend),
      orders: months.map((m) => monthMap.get(m)!.orders),
    };
  }, [transactions]);

  // Category data (excluding discretionary)
  const categoryData = useMemo(() => {
    const catMap = new Map<string, { spend: number; orders: number }>();

    transactions.forEach((t) => {
      if (t.category === 'discretionary') return; // Exclude discretionary
      const existing = catMap.get(t.category) || { spend: 0, orders: 0 };
      // Total Spend = total_total - refund (for each transaction)
      existing.spend += t.total_total - t.refund;
      existing.orders += t.order_count;
      catMap.set(t.category, existing);
    });

    const categories = Array.from(catMap.keys()).sort();
    return {
      categories,
      spend: categories.map((c) => catMap.get(c)!.spend),
      orders: categories.map((c) => catMap.get(c)!.orders),
    };
  }, [transactions]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Generate green shades
  const getGreenShades = (count: number) => {
    const shades = [];
    const baseGreen = [29, 185, 84]; // #1DB954 RGB
    for (let i = 0; i < count; i++) {
      const factor = 0.6 + (i / count) * 0.4; // Range from 60% to 100% brightness
      const r = Math.round(baseGreen[0] * factor);
      const g = Math.round(baseGreen[1] * factor);
      const b = Math.round(baseGreen[2] * factor);
      shades.push(`rgb(${r}, ${g}, ${b})`);
    }
    return shades;
  };

  const chartLayout = {
    autosize: true,
    margin: { l: 100, r: 50, t: 30, b: 50 },
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
    font: { color: '#374151', size: 12 },
  };

  // Check if this is for a single person (individuals tab) or multiple people (summary tab)
  const isSinglePerson = personData.people.length === 1;

  return (
    <div className="space-y-6">
      {!isSinglePerson && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Spend by Person - Horizontal Bar */}
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-lg font-semibold mb-4">Spend by Person</h3>
            <Plot
              data={[
                {
                  x: personData.spend,
                  y: personData.people,
                  type: 'bar',
                  orientation: 'h',
                  marker: { color: '#1DB954' },
                  text: personData.spend.map(v => formatCurrency(v)),
                  textposition: 'outside',
                  textfont: { color: '#000000' },
                },
              ]}
            layout={{
              ...chartLayout,
              xaxis: { 
                title: 'Spend ($)',
                range: [0, Math.max(...personData.spend) * 1.15], // Add 15% padding for labels
              },
              yaxis: { 
                title: 'Person',
                automargin: true,
              },
            }}
              config={{ displayModeBar: false, responsive: true }}
              style={{ width: '100%', height: '300px' }}
              onClick={(data: any) => {
                if (data.points[0]?.y) {
                  onPersonClick(String(data.points[0].y));
                }
              }}
            />
          </div>

          {/* Order Count by Person - Horizontal Bar */}
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-lg font-semibold mb-4">Order Count by Person</h3>
            <Plot
              data={[
                {
                  x: personData.ordersByPerson,
                  y: personData.peopleByOrders,
                  type: 'bar',
                  orientation: 'h',
                  marker: { color: '#1DB954' },
                  text: personData.ordersByPerson.map(v => v.toString()),
                  textposition: 'outside',
                  textfont: { color: '#000000' },
                },
              ]}
              layout={{
                ...chartLayout,
                xaxis: { title: 'Orders' },
                yaxis: { 
                  title: 'Person',
                  automargin: true,
                },
              }}
              config={{ displayModeBar: false, responsive: true }}
              style={{ width: '100%', height: '300px' }}
              onClick={(data: any) => {
                if (data.points[0]?.y) {
                  onPersonClick(String(data.points[0].y));
                }
              }}
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        {/* Monthly Trend */}
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold mb-4">
            Monthly Spend
          </h3>
          <Plot
            data={[
              {
                x: monthlyData.months,
                y: monthlyData.spend,
                type: 'scatter',
                mode: 'lines+markers',
                marker: { 
                  color: '#1DB954',
                  size: 10,
                },
                line: { color: '#1DB954', width: 2 },
                text: monthlyData.spend.map(v => formatCurrency(v)),
                textposition: 'top',
                textfont: { color: '#000000' },
              },
            ]}
            layout={{
              ...chartLayout,
              xaxis: { title: 'Month' },
              yaxis: { title: 'Spend ($)' },
            }}
            config={{ displayModeBar: false, responsive: true }}
            style={{ width: '100%', height: '300px' }}
            onClick={(data: any) => {
              if (onMonthClick && data.points && data.points[0]) {
                const clickedMonth = data.points[0].x;
                // Toggle: if same month clicked again, clear filter
                onMonthClick(clickedMonth);
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}
