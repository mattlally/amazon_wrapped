import type { FilterState } from '../types';

interface FiltersPanelProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  people: string[];
}

export function FiltersPanel({ filters, onFiltersChange, people }: FiltersPanelProps) {
  const handlePersonChange = (person: string) => {
    onFiltersChange({ ...filters, selectedPerson: person });
  };

  const handleDateStartChange = (date: string) => {
    onFiltersChange({
      ...filters,
      dateRange: { ...filters.dateRange, start: date ? new Date(date) : null },
    });
  };

  const handleDateEndChange = (date: string) => {
    onFiltersChange({
      ...filters,
      dateRange: { ...filters.dateRange, end: date ? new Date(date) : null },
    });
  };

  const handleMetricChange = (metric: 'spend' | 'count') => {
    onFiltersChange({ ...filters, metric });
  };

  const handleExcludeReturnsChange = (exclude: boolean) => {
    onFiltersChange({ ...filters, excludeReturns: exclude });
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-4">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Filters</h2>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Person
        </label>
        <select
          value={filters.selectedPerson}
          onChange={(e) => handlePersonChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="All">All</option>
          {people.map((person) => (
            <option key={person} value={person}>
              {person}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Start Date
          </label>
          <input
            type="date"
            value={filters.dateRange.start ? filters.dateRange.start.toISOString().split('T')[0] : ''}
            onChange={(e) => handleDateStartChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            End Date
          </label>
          <input
            type="date"
            value={filters.dateRange.end ? filters.dateRange.end.toISOString().split('T')[0] : ''}
            onChange={(e) => handleDateEndChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Metric
        </label>
        <div className="flex gap-4">
          <label className="flex items-center">
            <input
              type="radio"
              name="metric"
              value="spend"
              checked={filters.metric === 'spend'}
              onChange={() => handleMetricChange('spend')}
              className="mr-2"
            />
            Spend ($)
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="metric"
              value="count"
              checked={filters.metric === 'count'}
              onChange={() => handleMetricChange('count')}
              className="mr-2"
            />
            Count
          </label>
        </div>
      </div>

      <div>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={filters.excludeReturns}
            onChange={(e) => handleExcludeReturnsChange(e.target.checked)}
            className="mr-2"
          />
          Exclude returns from spend
        </label>
      </div>
    </div>
  );
}

