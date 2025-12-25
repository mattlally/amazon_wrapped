import { useState } from 'react';
import type { ParsedData } from '../types';

interface ParsingSummaryProps {
  data: ParsedData;
}

export function ParsingSummary({ data }: ParsingSummaryProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex justify-between items-center text-left"
      >
        <h2 className="text-xl font-bold text-gray-800">Parsing Summary</h2>
        <span className="text-gray-500">{isExpanded ? '▼' : '▶'}</span>
      </button>
      {isExpanded && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Transactions:</span>
            <p className="font-semibold">{data.stats.transactionsLoaded}</p>
          </div>
          <div>
            <span className="text-gray-600">People:</span>
            <p className="font-semibold">{data.stats.peopleDetected.length}</p>
          </div>
          <div>
            <span className="text-gray-600">Rows Removed:</span>
            <p className="font-semibold">{data.stats.rowsRemoved}</p>
          </div>
        </div>
      )}
    </div>
  );
}

