"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';


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

// Coverage Bar Component
function CoverageBar({ leftCoverage, sources }) {
  return (
    <div className="flex flex-col items-start mt-2 space-y-1">
      <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="absolute left-0 top-0 h-2 bg-blue-600"
          style={{ width: `${leftCoverage}%` }}
        ></div>
        <div
          className="absolute right-0 top-0 h-2 bg-red-600"
          style={{ width: `${100 - leftCoverage}%` }}
        ></div>
      </div>
      <div className="flex justify-between w-full text-xs font-semibold text-gray-800">
        <span>{leftCoverage}% left coverage</span>
        <span>{sources} sources</span>
      </div>
    </div>
  );
}

export default function TopNews() {
  const [news, setNews] = useState([]);

  useEffect(() => {
    fetch('http://newsapp-najw.onrender.com/api/news/') // Adjust URL to match your API endpoint
      .then((response) => response.json())
      .then((data) => {
        // Sort news articles by publication date in descending order
        const sortedData = data.sort((a, b) => new Date(b.published_at) - new Date(a.published_at));
        setNews(sortedData.slice(0, 5)); // Get the top 5 latest news articles
      });
  }, []);

  if (!news || news.length === 0) return <p>Loading...</p>;

  const mainNews = news[0];
  const sideNews = news[1];
  const bottomNews = news.slice(2, 5);

  return (
    <div>
      <h3 className="text-2xl font-bold mb-1">Top News</h3>
      <div className="flex flex-col space-y-1 mb-6">
        <div className="h-0.5 w-full bg-gray-700"></div>
        <div className="h-0.5 w-full bg-gray-400"></div>
        <div className="h-0.5 w-full bg-gray-200"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {mainNews && (
          <div className="col-span-2 relative">
            <Image
              src={mainNews.image?.startsWith('https') ? mainNews.image : `https://newsapp-najw.onrender.com/${mainNews.image}`}
              alt={mainNews.title}
              className="w-full h-96 object-cover rounded-md"
            />
            <div className="absolute bottom-6 left-6 text-white bg-black bg-opacity-60 p-4 rounded">
              <span className="bg-red-600 px-2 py-1 rounded text-xs uppercase">
                {mainNews.categories ? mainNews.categories.map(cat => cat.name).join(', ') : 'Uncategorized'}
              </span>
              <h3 className="text-4xl font-extrabold mt-2">{mainNews.title}</h3>
              <CoverageBar leftCoverage={54} sources={20} /> {/* Replace with dynamic values */}
              <p className="text-sm mt-2">{getTimeAgo(mainNews.published_at)} | {mainNews.location}</p>
            </div>
          </div>
        )}

        {sideNews && (
          <Link href={`/news/${sideNews.id}`} passHref>
            <div className="relative bg-gray-100 p-4 border rounded-md shadow-sm cursor-pointer hover:shadow-lg transition-shadow duration-300">
              <span className="text-xs text-gray-500">
                {sideNews.categories ? sideNews.categories.map(cat => cat.name).join(', ') : 'Uncategorized'}
              </span>
              <h4 className="text-xl font-bold mt-2">{sideNews.title}</h4>
              <CoverageBar leftCoverage={38} sources={8} />
              <Image
                src={sideNews.image?.startsWith('https') ? sideNews.image : `https://newsapp-najw.onrender.com/${sideNews.image}`}
                alt={sideNews.title}
                className="w-full h-40 object-cover mt-4 rounded-md"
              />
              <p className="text-sm text-gray-600 mt-2">{getTimeAgo(sideNews.published_at)} | {sideNews.location}</p>
            </div>
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {bottomNews.map((item) => (
          <Link key={item.id} href={`/news/${item.id}`} passHref>
            <div className="relative bg-gray-100 p-4 border rounded-md shadow-sm cursor-pointer hover:shadow-lg transition-shadow duration-300">
              <span className="text-xs text-gray-500">
                {item.categories ? item.categories.map(cat => cat.name).join(', ') : 'Uncategorized'}
              </span>
              <h5 className="text-lg font-bold mt-2">{item.title}</h5>
              <CoverageBar leftCoverage={50} sources={6} />
              <Image
                src={item.image?.startsWith('https') ? item.image : `https://newsapp-najw.onrender.com/${item.image}`}
                alt={item.title}
                className="w-full h-32 object-cover mt-4 rounded-md"
              />
              <p className="text-sm text-gray-600 mt-2">{getTimeAgo(item.published_at)} | {item.location}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
