"use client";
import { useEffect, useState } from 'react';
import AskVTAI from './AskVTAI';
import TopTopics from './TopTopics';
import SimilarNewsTopics from './SimilarNewsTopics';

export default function RightSidebar() {
  const [activeTab, setActiveTab] = useState('Last Day');
  const [categories, setCategories] = useState([]);

  const newsSummaryTabs = ['Last Day', 'Last Week', 'Last Month'];

  useEffect(() => {
    // Fetch categories from the API
    fetch('https://my-news-app-gy7u.onrender.com/api/categories/')  // Adjust API URL as needed
      .then((response) => response.json())
      .then((data) => {
        setCategories(data);
      });
  }, []);

  return (
    <div>
      {/* Ask VT AI Section */}
      <AskVTAI activeTab={activeTab} setActiveTab={setActiveTab} newsSummaryTabs={newsSummaryTabs} />

      {/* Top Topics Section */}
      <TopTopics topics={categories} />

      {/* Similar News Topics Section */}
      <SimilarNewsTopics topics={categories} />
    </div>
  );
}
