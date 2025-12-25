interface TabsProps {
  activeTab: 'summary' | 'individuals';
  onTabChange: (tab: 'summary' | 'individuals') => void;
}

export function Tabs({ activeTab, onTabChange }: TabsProps) {
  return (
    <div className="border-b border-gray-200 mb-6">
      <nav className="-mb-px flex space-x-8">
        <button
          onClick={() => onTabChange('summary')}
          className={`${
            activeTab === 'summary'
              ? 'border-green-500 text-green-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
        >
          Summary
        </button>
        <button
          onClick={() => onTabChange('individuals')}
          className={`${
            activeTab === 'individuals'
              ? 'border-green-500 text-green-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
        >
          Individuals
        </button>
      </nav>
    </div>
  );
}

