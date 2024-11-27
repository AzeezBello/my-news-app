"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Sidebar from '../components/Sidebar';
import TopNews from '../components/TopNews';
import LatestNews from '../components/LatestNews';
import LocalNews from '../components/LocalNews';
import PersonalizedNewsFeed from '../components/PersonalizedNewsFeed';

export default function Home() {
  const [news, setNews] = useState([]);
  const [filters, setFilters] = useState({ category: '', location: '' });

  useEffect(() => {
    let query = '';
    if (filters.category) query += `category=${filters.category}&`;
    if (filters.location) query += `location=${filters.location}&`;

    fetch(`http://127.0.0.1:8000/api/news/?${query}`)
      .then(response => response.json())
      .then(data => setNews(data));
  }, [filters]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
      
      {/* Top News - Full width on small screens, 75% width on large screens */}
      <div className="lg:col-span-3 col-span-1">
        <TopNews />
        <PersonalizedNewsFeed />
        <LocalNews location="San Francisco, USA" />
        <LatestNews />
      </div>

      {/* Right Sidebar - Full width on small screens, 25% width on large screens */}
      <div className="lg:col-span-1 col-span-1">
        <Sidebar />
      </div>
    </div>
  );
}
