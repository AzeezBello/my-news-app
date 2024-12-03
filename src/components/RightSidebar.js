"use client";
import { useEffect, useState } from 'react';
import AskVTAI from './AskVTAI';
import TopTopics from './TopTopics';
import SimilarNewsTopics from './SimilarNewsTopics';

export default function RightSidebar() {
  const [activeTab, setActiveTab] = useState('Last Day');
  const [categories, setCategories] = useState([]);
  const newsSummaryTabs = ['Last Day', 'Last Week', 'Last Month'];
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    // Fetch categories from the API
    fetch(`${baseUrl}api/categories/`)  // Adjust API URL as needed
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
