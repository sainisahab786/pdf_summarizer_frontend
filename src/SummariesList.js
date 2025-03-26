import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SummariesList = ({ refresh }) => {
  const [summaries, setSummaries] = useState([]);

  useEffect(() => {
    fetchSummaries();
  }, [refresh]);  // Fetch summaries when refresh state changes

  const fetchSummaries = async () => {
    try {
      const response = await axios.get("http://localhost:8000/summaries/");
      setSummaries(response.data);
    } catch (error) {
      console.error("Error fetching summaries:", error);
    }
  };

  return (
    <div className="summaries-list">
      <h3>Generated Summaries</h3>
      {summaries.length > 0 ? (
        <ul>
          {summaries.map((summary, index) => (
            <li key={index}>{summary.content}</li>
          ))}
        </ul>
      ) : (
        <p>No summaries available. Upload a file and click 'Get Summarized Content'.</p>
      )}
    </div>
  );
};

export default SummariesList;
