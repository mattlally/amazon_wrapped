import type { ParsedData } from '../types';
import { format } from 'date-fns';

interface DebugPanelProps {
  data: ParsedData | null;
}

export function DebugPanel({ data }: DebugPanelProps) {
  if (!data) return null;

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-6">
      <h2 className="text-xl font-bold text-gray-800">Debug Panel</h2>

      <div>
        <h3 className="text-lg font-semibold mb-2">Parsing Summary</h3>
        <div className="bg-gray-50 rounded p-4 space-y-2">
          <p>
            <span className="font-medium">Transactions loaded:</span>{' '}
            {data.stats.transactionsLoaded}
          </p>
          <p>
            <span className="font-medium">Rows removed:</span>{' '}
            {data.stats.rowsRemoved} (blank items + zero total)
          </p>
          <p>
            <span className="font-medium">Final transaction count:</span>{' '}
            {data.transactions.length}
          </p>
          <p>
            <span className="font-medium">Cards loaded:</span>{' '}
            {data.stats.cardsLoaded}
          </p>
          <p>
            <span className="font-medium">People detected:</span>{' '}
            {data.stats.peopleDetected.join(', ') || 'None'}
          </p>
          <p>
            <span className="font-medium">Invalid dates:</span>{' '}
            {data.stats.invalidDateCount}
          </p>
          <p>
            <span className="font-medium">Unknown person count:</span>{' '}
            {data.stats.unknownPersonCount}
          </p>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">First 10 Transactions</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-2 py-1 text-left text-xs font-medium text-gray-500">Date</th>
                <th className="px-2 py-1 text-left text-xs font-medium text-gray-500">Person</th>
                <th className="px-2 py-1 text-left text-xs font-medium text-gray-500">Items</th>
                <th className="px-2 py-1 text-left text-xs font-medium text-gray-500">Total</th>
                <th className="px-2 py-1 text-left text-xs font-medium text-gray-500">Category</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.transactions.slice(0, 10).map((t, idx) => (
                <tr key={idx}>
                  <td className="px-2 py-1">
                    {t.date ? format(t.date, 'yyyy-MM-dd') : 'N/A'}
                  </td>
                  <td className="px-2 py-1">{t.person}</td>
                  <td className="px-2 py-1 max-w-xs truncate">{t.items}</td>
                  <td className="px-2 py-1">${t.total.toFixed(2)}</td>
                  <td className="px-2 py-1">{t.category}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Cards Table</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-2 py-1 text-left text-xs font-medium text-gray-500">Last 4</th>
                <th className="px-2 py-1 text-left text-xs font-medium text-gray-500">Name</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.cards.map((card, idx) => (
                <tr key={idx}>
                  <td className="px-2 py-1">{card.last_4}</td>
                  <td className="px-2 py-1">{card.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">People Breakdown</h3>
        <div className="bg-gray-50 rounded p-4">
            {data.stats.peopleDetected.map((person) => {
            const personTransactions = data.transactions.filter((t) => t.person === person);
            const totalSpend = personTransactions.reduce((sum, t) => sum + t.total_total, 0);
            const returns = personTransactions.filter(t => t.is_return).length;
            const maxOrder = personTransactions.length > 0 
              ? Math.max(...personTransactions.map(t => t.total_total))
              : 0;
            return (
              <div key={person} className="mb-2 text-sm border-b border-gray-200 pb-2">
                <div className="font-medium">{person}:</div>
                <div className="ml-4 text-xs text-gray-600">
                  {personTransactions.length} orders | ${totalSpend.toFixed(2)} total | {returns} returns | Max: ${maxOrder.toFixed(2)}
                </div>
              </div>
            );
          })}
          {data.stats.unknownPersonCount > 0 && (
            <div className="mt-2 text-sm text-red-600">
              <span className="font-medium">Unknown:</span> {data.stats.unknownPersonCount} transactions
            </div>
          )}
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-2">Matthew Lally Transactions (Debug)</h3>
        <div className="bg-gray-50 rounded p-4">
          {data.transactions
            .filter(t => t.person.toLowerCase().includes('matthew') || t.person.toLowerCase().includes('matt'))
            .map((t, idx) => (
              <div key={idx} className="text-xs mb-1 border-b border-gray-200 pb-1">
                <span className="font-medium">Person:</span> {t.person} | 
                <span className="font-medium"> Date:</span> {t.date ? format(t.date, 'yyyy-MM-dd') : 'N/A'} | 
                <span className="font-medium"> Total:</span> ${t.total.toFixed(2)} | 
                <span className="font-medium"> Total_Total:</span> ${t.total_total.toFixed(2)} | 
                <span className="font-medium"> To:</span> {t.to || '(empty)'}
              </div>
            ))}
          {data.transactions.filter(t => t.person.toLowerCase().includes('matthew') || t.person.toLowerCase().includes('matt')).length === 0 && (
            <p className="text-sm text-gray-600">No transactions found for Matthew/Matt</p>
          )}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Unknown Transactions (First 10)</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-2 py-1 text-left text-xs font-medium text-gray-500">Date</th>
                <th className="px-2 py-1 text-left text-xs font-medium text-gray-500">To Field</th>
                <th className="px-2 py-1 text-left text-xs font-medium text-gray-500">Payments</th>
                <th className="px-2 py-1 text-left text-xs font-medium text-gray-500">Items</th>
                <th className="px-2 py-1 text-left text-xs font-medium text-gray-500">Total</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.transactions
                .filter((t) => t.person === 'Unknown')
                .slice(0, 10)
                .map((t, idx) => (
                  <tr key={idx}>
                    <td className="px-2 py-1">
                      {t.date ? format(t.date, 'yyyy-MM-dd') : 'N/A'}
                    </td>
                    <td className="px-2 py-1 font-medium">{t.to || '(empty)'}</td>
                    <td className="px-2 py-1 max-w-xs truncate">{t.payments || '(empty)'}</td>
                    <td className="px-2 py-1 max-w-xs truncate">{t.items}</td>
                    <td className="px-2 py-1">${t.total.toFixed(2)}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        {data.transactions.filter((t) => t.person === 'Unknown').length > 10 && (
          <p className="text-xs text-gray-500 mt-2">
            Showing first 10 of {data.transactions.filter((t) => t.person === 'Unknown').length} unknown transactions
          </p>
        )}
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">All Unique "To" Values</h3>
        <div className="bg-gray-50 rounded p-4">
          <div className="text-sm space-y-1 max-h-40 overflow-y-auto">
            {Array.from(new Set(data.transactions.map((t) => t.to).filter((to) => to && to.trim() !== '')))
              .sort()
              .map((to, idx) => (
                <div key={idx}>{to}</div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

