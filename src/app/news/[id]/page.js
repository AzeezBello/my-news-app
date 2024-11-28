"use client"; // Enable client-side rendering

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
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
  const { id: articleId } = params; // Dynamic parameter
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
          throw new Error(`Failed to fetch article: ${articleResponse.statusText}`);
        }
        const articleData = await articleResponse.json();
        setArticle(articleData);

        const relatedResponse = await fetch(
          `https://newsapp-najw.onrender.com/api/news/${articleId}/related/`
        );
        if (!relatedResponse.ok) {
          throw new Error(`Failed to fetch related articles`);
        }
        const relatedData = await relatedResponse.json();
        setRelatedArticles(relatedData);
      } catch (error) {
        console.error("Error fetching article data:", error);
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
          <LeftSidebar articleId={params.id} />
        </div>

        <section className="col-span-6 bg-white p-6">
          <div className="grid grid-cols-1 gap-4">
            {article.image && (
              <Image
                src={article.image.startsWith("http") ? article.image : `/default-image.jpg`}
                alt={article.title}
                className="w-full h-70 object-cover mb-1"
              />
            )}
            <p className="text-gray-600">{getTimeAgo(article.published_at)}, {article.location}</p>
            <h1 className="text-4xl font-bold mb-2">{article.title}</h1>

            {article.tags && article.tags.length > 0 && (
              <div className="mt-1 mb-6">
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag, index) => (
                    <Link
                      key={index}
                      href={`/news?tag=${tag}`}
                      className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <h2 className="text-2xl font-bold mt-6">News summary</h2>
            <div className="flex flex-col space-y-1 mb-1">
              <div className="h-0.5 w-full bg-gray-700"></div>
              <div className="h-0.5 w-full bg-gray-400"></div>
              <div className="h-0.5 w-full bg-gray-200"></div>
            </div>
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

export async function generateStaticParams() {
  const response = await fetch("https://newsapp-najw.onrender.com/api/news/");
  const articles = await response.json();

  return articles.map((article) => ({
    id: article.id.toString(),
  }));
}

export const dynamicParams = false;
