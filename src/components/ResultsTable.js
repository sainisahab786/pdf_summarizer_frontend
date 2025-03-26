import React from 'react';

const ResultsTable = ({ results }) => {
  if (!results || results.length === 0) {
    return null;
  }
  
  // Get all unique keys from results
  const columns = Object.keys(results[0]);
  
  return (
    <div className="results-table-container">
      <h2>Results</h2>
      <div className="results-table-wrapper">
        <table className="results-table">
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column}>{column}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {results.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map((column) => (
                  <td key={`${rowIndex}-${column}`}>{row[column]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResultsTable;