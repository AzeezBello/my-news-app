"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function CategoryDetails({ params }) {
  const { categoryId } = params; // Get 'categoryId' from route parameters
  const [category, setCategory] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategoryDetails = async () => {
      try {
        // Fetch category details
        const categoryRes = await fetch(`http://127.0.0.1:8000/api/categories/${categoryId}/`);
        if (!categoryRes.ok) {
          throw new Error(`Category not found: ${categoryRes.statusText}`);
        }
        const categoryData = await categoryRes.json();
        setCategory(categoryData);

        // Fetch articles
        const articles = [];
        if (categoryData.articles && categoryData.articles.length > 0) {
          for (const articleId of categoryData.articles) {
            const articleRes = await fetch(`http://127.0.0.1:8000/api/news/${articleId}/`);
            if (articleRes.ok) {
              const articleData = await articleRes.json();
              articles.push(articleData);
            }
          }
        }
        setPosts(articles);
      } catch (err) {
        console.error("Error fetching category or articles:", err);
        setError("Failed to load category or articles.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryDetails();
  }, [categoryId]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return (
      <div className="text-center text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  if (!category) {
    return <p className="text-center text-gray-500">Category not found.</p>;
  }

  return (
    <div className="container mx-auto py-6">
      {/* Category Header */}
      <div className="flex items-center mb-6">
        {category.image && (
          <Image
            src={category.image.startsWith("http") ? category.image : `http://127.0.0.1:8000${category.image}`}
            alt={category.name}
            className="w-16 h-16 rounded-full object-cover mr-4"
            width={64}
            height={64}
          />
        )}
        <h1 className="text-3xl font-bold">{category.name}</h1>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div key={post.id} className="bg-white p-4 rounded-lg shadow-md">
              <Image
                src={
                  post.image && post.image.startsWith("http")
                    ? post.image
                    : `http://127.0.0.1:8000${post.image}`
                }
                alt={post.title || "Default Image"}
                className="w-full h-40 object-cover rounded-md mb-4"
                width={320}
                height={160}
              />
              <h2 className="text-xl font-bold mb-2">{post.title || "Untitled"}</h2>
              <p className="text-sm text-gray-600 mb-4">{post.description || "No description available."}</p>
              <Link
                href={`/news/${post.id}`}
                className="text-blue-500 hover:underline text-sm font-semibold"
              >
                Read More &rarr;
              </Link>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">No posts available for this category.</p>
        )}
      </div>
    </div>
  );
}
