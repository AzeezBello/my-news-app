"use client";
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import CoverageBar from './CoverageBar';
import { FaBookmark } from "react-icons/fa";

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

export default function LatestNews() {
  const [news, setNews] = useState([]);
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    fetch(`${baseUrl}/news/`) // Adjust URL to match your API endpoint
      .then((response) => response.json())
      .then((data) => {
        // Sort news articles by publication date in descending order
        const sortedData = data.sort((a, b) => new Date(b.published_at) - new Date(a.published_at));
        setNews(sortedData);
      });
  }, [baseUrl]);

  return (
    <div>
      <h2 className="text-2xl font-bold mt-6 mb-1">Latest News</h2>
      <div className="flex flex-col space-y-1 mb-6">
        <div className="h-0.5 w-full bg-gray-700"></div>
        <div className="h-0.5 w-full bg-gray-400"></div>
        <div className="h-0.5 w-full bg-gray-200"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {news.map((article, index) => (
          <Link key={index} href={`/news/${article.id}`}>
            <div className="bg-gray-100 p-4 border rounded-md shadow-sm cursor-pointer hover:shadow-lg transition-shadow duration-300">
              {/* Log categories to check structure */}
              {console.log('Categories for article', article.title, article.categories)}

              {/* Header with Category and Bookmark */}
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-gray-500">
                  {Array.isArray(article.categories) && article.categories.length > 0
                    ? article.categories.map((category) => category.name).join(', ')
                    : 'Uncategorized'}
                </span>
                <button className="text-gray-500">
                  <FaBookmark />
                </button>
              </div>
              <h3 className="text-xl font-bold mt-2">{article.title}</h3>
              
              {/* Reusable CoverageBar Component */}
              <CoverageBar leftCoverage={article.leftCoverage || 50} sources={article.sources || 10} />

              <Image
                src={article.image.startsWith('http') ? article.image : `${baseUrl}${article.image}`}
                alt={article.title}
                className="w-full h-40 object-cover mt-4 rounded-md"
              />
              <p className="text-sm text-gray-600 mt-2">{getTimeAgo(article.published_at)}, {article.location}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
