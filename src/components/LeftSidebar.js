// components/LeftSidebar.js

"use client";
import { useEffect} from 'react';
// import DailyIndex from './DailyIndex';
import CoverageDetails from './CoverageDetails';
import ExchangeRate from './ExchangeRate';

export default function LeftSidebar({ articleId }) {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

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
        apiUrl={`${baseUrl}/news/${articleId}/coverage/`}
      />
    </div>
  );
}
