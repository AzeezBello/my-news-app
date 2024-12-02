"use client"; // Mark the component as a Client Component

import { useEffect, useState } from "react";
import Image from "next/image";
import LeftSidebar from "../../../components/LeftSidebar";
import RightSidebar from "../../../components/RightSidebar";
import StoryCoverage from "../../../components/StoryCoverage";
import RelatedNews from "../../../components/RelatedNews";

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

export default function NewsDetails({ params }) {
  const { id: articleId } = params; // Extract article ID from params
  const [article, setArticle] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticleDetails = async () => {
      try {
        const articleResponse = await fetch(
          `https://newsapp-najw.onrender.com/api/news/${articleId}/`
        );
        if (!articleResponse.ok) {
          throw new Error(`Failed to fetch article details: ${articleResponse.statusText}`);
        }
        const articleData = await articleResponse.json();
        setArticle(articleData);

        const relatedResponse = await fetch(
          `https://newsapp-najw.onrender.com/api/news/${articleId}/related/`
        );
        if (!relatedResponse.ok) {
          throw new Error(`Failed to fetch related articles: ${relatedResponse.statusText}`);
        }
        const relatedData = await relatedResponse.json();
        setRelatedArticles(relatedData);
      } catch (error) {
        console.error("Error fetching article or related news:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticleDetails();
  }, [articleId]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!article) {
    return <p>Article not found.</p>;
  }

  return (
    <div>
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="col-span-3">
          <LeftSidebar />
        </div>
        <section className="col-span-6 bg-white p-6">
          <div className="grid grid-cols-1 gap-4">
            {article.image && (
              <Image
                src={
                  article.image.startsWith("http")
                    ? article.image
                    : `https://newsapp-najw.onrender.com/${article.image}`
                }
                alt={article.title}
                className="w-full h-70 object-cover mb-1"
              />
            )}
            <p className="text-gray-600">
              {getTimeAgo(article.published_at)}, {article.location}
            </p>
            <h1 className="text-4xl font-bold mb-2">{article.title}</h1>
            <p className="mb-6">{article.content}</p>
          </div>
          <StoryCoverage />
        </section>
        <div className="col-span-3">
          <RightSidebar />
        </div>
      </div>
      {relatedArticles.length > 0 && (
        <div className="mt-8">
          <RelatedNews articles={relatedArticles} />
        </div>
      )}
    </div>
  );
}
