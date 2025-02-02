"use client";

import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import TopNews from '../components/TopNews';
import LatestNews from '../components/LatestNews';
// import LocalNews from '../components/LocalNews';
import PersonalizedNewsFeed from '../components/PersonalizedNewsFeed';

export default function Home() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [news, setNews] = useState([]);
  const [filters] = useState({ category: '', location: '' });
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    let query = '';
    if (filters.category) query += `category=${filters.category}&`;

    fetch(`${baseUrl}/news/?${query}`)
      .then(response => response.json())
      .then(data => setNews(data));
  }, [baseUrl,filters]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
      
      {/* Top News - Full width on small screens, 75% width on large screens */}
      <div className="lg:col-span-3 col-span-1">
        <TopNews />
        <PersonalizedNewsFeed />
        {/* <LocalNews /> */}
        <LatestNews />
      </div>

      {/* Right Sidebar - Full width on small screens, 25% width on large screens */}
      <div className="lg:col-span-1 col-span-1">
        <Sidebar />
      </div>
    </div>
  );
}
