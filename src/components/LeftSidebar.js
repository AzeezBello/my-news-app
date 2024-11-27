// components/LeftSidebar.js

"use client";
import { useEffect, useState } from 'react';
import DailyIndex from './DailyIndex';
import CoverageDetails from './CoverageDetails';
import ExchangeRate from './ExchangeRate';

export default function LeftSidebar({ articleId }) {
  const [indexValue, setIndexValue] = useState(20);
  const [sentiment, setSentiment] = useState('Serious');

  useEffect(() => {
    // You can update this state with real data from an API call if available
    // For now, these are placeholder values
  }, []);

  return (
    <div>
      {/* ExchangeRate Section */}
      <ExchangeRate />

      {/* Daily Index Section */}
      {/* <DailyIndex indexValue={indexValue} sentiment={sentiment} /> */}

      {/* Coverage Details Section */}
      <CoverageDetails
        apiUrl={`http://127.0.0.1:8000/api/news/${articleId}/coverage/`}
      />
    </div>
  );
}
