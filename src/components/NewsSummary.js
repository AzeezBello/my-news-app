"use client";
import { useEffect, useState } from 'react';

export default function NewsSummary({ activeTab, setActiveTab }) {
  const [newsSummary, setNewsSummary] = useState([]);
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  
  // Fetch news data whenever the activeTab changes
  useEffect(() => {
    // Define the base API URL
    let url = `${baseUrl}/api/news/`;

    // Adjust the URL based on the selected tab
    if (activeTab === 'Last Day') {
      url += '?filter=last_day';
    } else if (activeTab === 'Last Week') {
      url += '?filter=last_week';
    } else if (activeTab === 'Last Month') {
      url += '?filter=last_month';
    }

    // Fetch filtered news data
    fetch(url)
      .then((response) => response.json())
      .then((data) => setNewsSummary(data.slice(0, 2))) // Limit to 2 items for summary
      .catch((error) => console.error("Error fetching news summary:", error));
  }, [activeTab]);

  const newsSummaryTabs = ['Last Day', 'Last Week', 'Last Month'];

  return (
    <div>
      <h3 className="text-2xl font-bold mb-1">View News Summary</h3>
      <div className="flex flex-col space-y-1 mb-6">
        <div className="h-0.5 w-full bg-gray-700"></div>
        <div className="h-0.5 w-full bg-gray-400"></div>
        <div className="h-0.5 w-full bg-gray-200"></div>
      </div>
      <div className="flex space-x-2 mb-4">
        {newsSummaryTabs.map((tab) => (
          <button
            key={tab}
            className={`text-xs px-3 py-1 rounded-full ${
              activeTab === tab ? 'bg-black text-white' : 'bg-gray-200 text-gray-800'
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Displaying News Summary */}
      <div className="space-y-2">
        {newsSummary.map((news) => (
          <p key={news.id} className="text-sm text-gray-600 mb-2">
            <a href={`/news/${news.id}`} className="font-medium text-gray-500 hover:underline">
              {news.title}
            </a>
            <span className="ml-2 text-gray-500">{news.summary}</span>
          </p>
        ))}
      </div>
      <p className="text-xs text-gray-500 mt-2">Updated {activeTab.toLowerCase()}</p>
      <a href="#" className="text-blue-500 hover:underline text-sm">Show More &rarr;</a>
    </div>
  );
}
