import { useState, useMemo } from 'react';
import { format } from 'date-fns';
import type { ParsedData, FilterState, KpiData } from './types';
import { processCSVFile } from './utils/processData';
import { UploadZone } from './components/UploadZone';
import { KpiCards } from './components/KpiCards';
import { Charts } from './components/Charts';
import { Tabs } from './components/Tabs';
import { Superlatives } from './components/Superlatives';
import { IndividualStats } from './components/IndividualStats';
import { ParsingSummary } from './components/ParsingSummary';
import { DataTable } from './components/DataTable';

function App() {
  const [parsedData, setParsedData] = useState<ParsedData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState<'summary' | 'individuals'>('summary');
  const [filters, setFilters] = useState<FilterState>({
    selectedPerson: 'All',
    dateRange: { start: null, end: null },
    metric: 'spend',
    excludeReturns: true,
  });
  const [individualPersonFilter, setIndividualPersonFilter] = useState<string>('');
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);

  const handleFileUpload = async (file: File) => {
    setIsProcessing(true);
    try {
      const data = await processCSVFile(file);
      setParsedData(data);
    } catch (error) {
      console.error('Error processing file:', error);
      alert('Error processing CSV file. Please check the console for details.');
    } finally {
      setIsProcessing(false);
    }
  };


  const kpis = useMemo((): KpiData => {
    if (!parsedData) {
      return {
        totalSpend: 0,
        orders: 0,
        returns: 0,
        returnRate: 0,
        avgOrderValue: 0,
      };
    }

    const allTransactions = parsedData.transactions;
    
    // Orders = number of transactions
    const orders = allTransactions.length;
    
    // Total Spend = sum of total_total - sum of refund
    const sumTotalTotal = allTransactions.reduce((sum, t) => sum + t.total_total, 0);
    const sumRefund = allTransactions.reduce((sum, t) => sum + t.refund, 0);
    const totalSpend = sumTotalTotal - sumRefund;
    
    // Returns = number of rows where refund > 0
    const returns = allTransactions.filter((t) => t.refund > 0).length;
    
    const returnRate = orders > 0 ? returns / orders : 0;
    const avgOrderValue = orders > 0 ? totalSpend / orders : 0;

    return {
      totalSpend,
      orders,
      returns,
      returnRate,
      avgOrderValue,
    };
  }, [parsedData]);

  const handlePersonClick = (person: string) => {
    setFilters({ ...filters, selectedPerson: person });
  };

  if (!parsedData) {
    return (
      <div className="min-h-screen bg-gray-100 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              2025 Amazon Prime Wrapped
            </h1>
            <p className="text-gray-600">
              Upload your Amazon order history CSV to see your spending insights
            </p>
          </div>
          <UploadZone onFileUpload={handleFileUpload} isProcessing={isProcessing} />
          {isProcessing && (
            <div className="mt-4 text-center text-gray-600">
              Processing your data...
            </div>
          )}
        </div>
      </div>
    );
  }

  // Set default individual person filter when switching to individuals tab
  const handleTabChange = (tab: 'summary' | 'individuals') => {
    setActiveTab(tab);
    if (tab === 'individuals' && !individualPersonFilter && parsedData.stats.peopleDetected.length > 0) {
      setIndividualPersonFilter(parsedData.stats.peopleDetected[0]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow p-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">2025 Amazon Prime Wrapped</h1>
            <p className="text-gray-600 mt-1">
              {activeTab === 'individuals' && individualPersonFilter ? (
                <>Your {parsedData.transactions.filter(t => t.person === individualPersonFilter).length} transactions analyzed</>
              ) : (
                <>Your {parsedData.stats.finalTransactionCount} transactions analyzed</>
              )}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs activeTab={activeTab} onTabChange={handleTabChange} />

        {/* Tab Content */}
        {activeTab === 'summary' && (
          <>
            {/* Parsing Summary */}
            <ParsingSummary data={parsedData} />

            {/* Summary Stats */}
            <KpiCards kpis={kpis} transactions={parsedData.transactions} />

            {/* Superlatives */}
            <Superlatives transactions={parsedData.transactions} />

            {/* Charts */}
            <Charts
              transactions={parsedData.transactions}
              filters={filters}
              onPersonClick={handlePersonClick}
            />
          </>
        )}

        {activeTab === 'individuals' && (
          <>
            {/* Person Filter */}
            <div className="bg-white rounded-lg shadow p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Person
              </label>
              <select
                value={individualPersonFilter}
                onChange={(e) => {
                  setIndividualPersonFilter(e.target.value);
                  setSelectedMonth(null); // Clear month filter when person changes
                }}
                className="w-full md:w-64 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              >
                {parsedData.stats.peopleDetected.map((person) => (
                  <option key={person} value={person}>
                    {person}
                  </option>
                ))}
              </select>
            </div>

            {/* Individual Stats Comparison */}
            {individualPersonFilter && (
              <>
                <IndividualStats
                  transactions={parsedData.transactions}
                  selectedPerson={individualPersonFilter}
                />

                {/* Charts for Individual */}
                <Charts
                  transactions={parsedData.transactions.filter(t => t.person === individualPersonFilter)}
                  filters={filters}
                  onPersonClick={handlePersonClick}
                  onMonthClick={(month) => setSelectedMonth(selectedMonth === month ? null : month)}
                />

                {/* Transactions Table */}
                <DataTable
                  transactions={parsedData.transactions.filter(t => {
                    if (t.person !== individualPersonFilter) return false;
                    if (selectedMonth && t.month) {
                      const monthKey = format(t.month, 'MMM yyyy');
                      return monthKey === selectedMonth;
                    }
                    return true;
                  })}
                />
              </>
            )}
          </>
        )}

      </div>
    </div>
  );
}

export default App;
