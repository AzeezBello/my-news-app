"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

import CoverageBar from './CoverageBar'; // Import CoverageBar component

// Utility function to calculate time ago
function getTimeAgo(dateString) {
  const postedDate = new Date(dateString);
  const now = new Date();
  const timeDiff = Math.abs(now - postedDate);
  const hoursAgo = Math.floor(timeDiff / (1000 * 60 * 60));
  const daysAgo = Math.floor(hoursAgo / 24);

  if (daysAgo > 0) {
    return `${daysAgo} day${daysAgo > 1 ? 's' : ''} ago`;
  } else {
    return `${hoursAgo} hour${hoursAgo > 1 ? 's' : ''} ago`;
  }
}


export default function LocalNews() {
  const [news, setNews] = useState([]);
  const [fallbackNews, setFallbackNews] = useState([]);

  useEffect(() => {
    // Fetch local news
    fetch('https://newsapp-najw.onrender.com/api/news/?location=Local') // Adjust URL to match your API endpoint for local news
      .then((response) => response.json())
      .then((data) => {
        if (data.length > 0) {
          setNews(data); // If local news is available
        } else {
          // Fetch most recent posts if no local news found
          fetch('https://newsapp-najw.onrender.com/api/news/')
            .then((response) => response.json())
            .then((recentData) => setFallbackNews(recentData.slice(0, 3)));
        }
      });
  }, []);

  const displayNews = news.length > 0 ? news : fallbackNews;

  return (
    <div>
      <h2 className="text-2xl font-bold mt-6 mb-1">Local News</h2>
      <p className="text-sm text-gray-600 mb-1">Stay current with all the local breaking news</p>
      <div className="flex flex-col space-y-1 mb-6">
        <div className="h-0.5 w-full bg-gray-700"></div>
        <div className="h-0.5 w-full bg-gray-400"></div>
        <div className="h-0.5 w-full bg-gray-200"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {displayNews.map((article, index) => (
          <Link key={index} href={`/news/${article.id}`}>
            <div key={index} className="bg-gray-100 p-4 border rounded-md shadow-sm">
              {/* Header with Category */}
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-gray-500">
                  {article.categories && article.categories.length > 0
                    ? article.categories.map((category) => category.name).join(', ')
                    : 'Uncategorized'}
                </span>
              </div>
              <h3 className="text-xl font-bold mt-2">{article.title}</h3>

              {/* Reusable CoverageBar Component */}
              <CoverageBar leftCoverage={article.leftCoverage || 50} sources={article.sources || 10} />

              <Image
                src={article.image.startsWith('http') ? article.image : `https://newsapp-najw.onrender.com${article.image}`}
                alt={article.title}
                className="w-full h-40 object-cover mt-4 rounded-md"
              />
              <p className="text-sm text-gray-600 mt-2">{getTimeAgo(article.published_at)} | {article.location}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
