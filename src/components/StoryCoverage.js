"use client";

import { useState, useEffect } from "react";

export default function StoryCoverage({ apiUrl }) {
  const [coverageData, setCoverageData] = useState([]);
  const [selectedBias, setSelectedBias] = useState("all"); // Filter by bias: all, left, center, right
  const [sortOrder, setSortOrder] = useState("relevancy"); // relevancy or chronological

  useEffect(() => {
    // Fetch coverage data from API
    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch coverage data.");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Coverage Data:", data); // Debugging log
        setCoverageData(data);
      })
      .catch((error) => console.error("Error fetching coverage data:", error));
  }, [apiUrl]);

  // Filter articles based on selected bias
  const filteredArticles =
    selectedBias === "all"
      ? coverageData
      : coverageData.filter((article) => article.bias === selectedBias);

  // Sort articles based on selected order
  const sortedArticles = [...filteredArticles].sort((a, b) => {
    if (sortOrder === "relevancy") {
      return b.relevance - a.relevance; // Sort by relevance
    } else if (sortOrder === "chronological") {
      return new Date(b.published_at) - new Date(a.published_at); // Sort by time
    }
    return 0;
  });

  return (
    <div className="story-coverage bg-gray-100 p-6 rounded-lg">
      {/* Header */}
      <h2 className="text-xl font-bold mb-4">Story Coverage</h2>
      <div className="flex justify-between items-center mb-6">
        {/* Bias Filter */}
        <div className="flex space-x-4">
          {["all", "left", "center", "right"].map((bias) => (
            <button
              key={bias}
              onClick={() => setSelectedBias(bias)}
              className={`py-1 px-4 rounded-md text-sm font-medium ${
                selectedBias === bias
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              {bias.charAt(0).toUpperCase() + bias.slice(1)}
            </button>
          ))}
        </div>

        {/* Sort Order */}
        <div className="flex space-x-4">
          <button
            onClick={() => setSortOrder("relevancy")}
            className={`py-1 px-4 rounded-md text-sm font-medium ${
              sortOrder === "relevancy"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            Relevancy
          </button>
          <button
            onClick={() => setSortOrder("chronological")}
            className={`py-1 px-4 rounded-md text-sm font-medium ${
              sortOrder === "chronological"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            Chronological
          </button>
        </div>
      </div>

      {/* Articles */}
      <div>
        {sortedArticles.length > 0 ? (
          sortedArticles.map((article) => (
            <div
              key={article.id}
              className="article-item bg-white p-4 mb-4 rounded-lg shadow-md"
            >
              {/* Source Name */}
              <div className="flex items-center mb-2">
                <Image
                  src={article.source_logo || "/placeholder-logo.png"}
                  alt={article.source}
                  className="w-6 h-6 rounded-full mr-2"
                />
                <span className="text-sm font-semibold text-gray-600">
                  {article.source}
                </span>
              </div>

              {/* Article Title */}
              <h3 className="text-lg font-bold mb-2">{article.title}</h3>

              {/* Published Time */}
              <p className="text-sm text-gray-500">
                {new Date(article.published_at).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}{" "}
                - {article.bias.charAt(0).toUpperCase() + article.bias.slice(1)}
              </p>

              {/* Read More */}
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 text-sm font-medium hover:underline mt-2 inline-block"
              >
                Read Full Article →
              </a>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No articles available.</p>
        )}
      </div>
    </div>
  );
}
