import React, { useState } from 'react';

const FilterPanel = ({ filters, onApplyFilter }) => {
  const [selectedFilter, setSelectedFilter] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const [filterValue, setFilterValue] = useState('');
  
  const currentFilter = filters.find(f => f.name === selectedFilter);
  
  const handleApplyFilter = () => {
    if (selectedFilter && (selectedOption || currentFilter?.options.length === 0) && filterValue) {
      onApplyFilter(selectedFilter, selectedOption, filterValue);
      // Reset after applying
      setFilterValue('');
    }
  };
  
  return (
    <div className="filter-panel">
      <h2>Filters</h2>
      
      <div className="filter-controls">
        <select 
          value={selectedFilter} 
          onChange={(e) => {
            setSelectedFilter(e.target.value);
            setSelectedOption('');
          }}
        >
          <option value="">Select a filter</option>
          {filters.map((filter) => (
            <option key={filter.name} value={filter.name}>
              {filter.name}
            </option>
          ))}
        </select>
        
        {selectedFilter && (
          <>
            {currentFilter.options.length > 0 && (
              <select 
                value={selectedOption} 
                onChange={(e) => setSelectedOption(e.target.value)}
              >
                <option value="">Select an option</option>
                {currentFilter.options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            )}
            
            <input
              type="text"
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
              placeholder={`Enter ${selectedFilter.toLowerCase()} value`}
            />
            
            <button 
              onClick={handleApplyFilter}
              disabled={!selectedFilter || (currentFilter.options.length > 0 && !selectedOption) || !filterValue}
            >
              Apply Filter
            </button>
          </>
        )}
      </div>
      
      <div className="filter-suggestions">
        <h3>Example Queries</h3>
        <ul>
          <li onClick={() => onApplyFilter('', '', 'Show people with age less than 50')}>
            Show people with age less than 50
          </li>
          <li onClick={() => onApplyFilter('', '', 'Show all female people')}>
            Show all female people
          </li>
          <li onClick={() => onApplyFilter('', '', 'Show people with salary greater than 70000')}>
            Show people with salary greater than 70000
          </li>
        </ul>
      </div>
    </div>
  );
};

export default FilterPanel;