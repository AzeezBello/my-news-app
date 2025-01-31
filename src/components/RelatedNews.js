"use client";
import { FaBookmark } from "react-icons/fa";
import Image from "next/image";

// Utility function to calculate time ago
function getTimeAgo(dateString) {
  const postedDate = new Date(dateString);
  const now = new Date();
  const timeDiff = Math.abs(now - postedDate);
  const hoursAgo = Math.floor(timeDiff / (1000 * 60 * 60));
  const daysAgo = Math.floor(hoursAgo / 24);

  if (daysAgo > 0) {
    return `${daysAgo} day${daysAgo > 1 ? "s" : ""} ago`;
  } else {
    return `${hoursAgo} hour${hoursAgo > 1 ? "s" : ""} ago`;
  }
}

function CoverageBar({ coverage }) {
  const [leftPercentage, rightPercentage] = coverage.includes("left")
    ? [parseInt(coverage), 100 - parseInt(coverage)]
    : [100 - parseInt(coverage), parseInt(coverage)];

  return (
    <div className="flex items-center space-x-2">
      <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="absolute left-0 top-0 h-2 bg-blue-600"
          style={{ width: `${leftPercentage}%` }}
        ></div>
        <div
          className="absolute right-0 top-0 h-2 bg-red-600"
          style={{ width: `${rightPercentage}%` }}
        ></div>
      </div>
    </div>
  );
}

export default function RelatedNews({ articles }) {
  console.log("Related Articles:", articles); // Log to verify data
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  return (
    <div className="p-4 bg-gray-100">
      {/* Header */}
      <h2 className="text-2xl font-bold">Related News</h2>
      <div className="flex flex-col space-y-1 mb-4">
        <div className="h-0.5 w-full bg-gray-700"></div>
        <div className="h-0.5 w-full bg-gray-400"></div>
        <div className="h-0.5 w-full bg-gray-200"></div>
      </div>

      {/* News Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {articles.map((news) => (
          <div key={news.id} className="bg-white p-4 border rounded-lg shadow-sm">
            {/* Header with Categories and Bookmark */}
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-gray-600">
                {news.categories && news.categories.length > 0
                  ? news.categories.map((cat) => cat.name).join(", ")
                  : "Uncategorized"}
              </span>
              <button className="text-gray-500">
                <FaBookmark />
              </button>
            </div>

            {/* Title */}
            <h3 className="text-lg font-bold text-gray-900 mb-2">{news.title}</h3>

            {/* Coverage Bar and Source Count */}
            <CoverageBar coverage={news.coverage || "50% left coverage"} />
            <div className="flex justify-between items-center mt-1 text-xs text-gray-600">
              <span>{news.coverage || "50% left coverage"}</span>
              <span>
                {news.sources || 1} source{news.sources > 1 ? "s" : ""}
              </span>
            </div>

            {/* Image */}
            {news.image && (
              <Image
                src={news.image_url}
                alt={news.title}
                width={400}
                height={200}
                className="w-full h-40 object-cover mt-4 rounded-md"
              />
            )}

            {/* Date and Location */}
            <p className="text-xs text-gray-600 mt-2">
              {getTimeAgo(news.published_at)}, {news.location}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
