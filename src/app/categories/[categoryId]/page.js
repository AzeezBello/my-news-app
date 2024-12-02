"use client"; // Mark as a Client Component

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function CategoryDetails({ params }) {
  const { categoryId } = params; // Get 'categoryId' from 'params'
  const [category, setCategory] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (categoryId) {
      // Fetch category details
      fetch(`https://newsapp-najw.onrender.com/api/categories/${categoryId}/`)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          console.log("Fetched Category Data:", data);
          setCategory(data);

          // Fetch articles based on IDs
          const articleIds = data.articles;
          if (articleIds && articleIds.length > 0) {
            Promise.all(
              articleIds.map((id) =>
                fetch(`https://newsapp-najw.onrender.com/api/news/${id}/`).then((res) =>
                  res.json()
                )
              )
            )
              .then((news) => {
                console.log("Fetched news:", news);
                setPosts(news);
                setLoading(false);
              })
              .catch((error) => {
                console.error("Error fetching news:", error);
                setLoading(false);
                setError("Failed to fetch news.");
              });
          } else {
            setPosts([]);
            setLoading(false);
          }
        })
        .catch((error) => {
          console.error("Error fetching category details:", error);
          setLoading(false);
          setError("Failed to fetch category details.");
        });
    }
  }, [categoryId]);

  if (loading) return <p>Loading...</p>;

  if (error) {
    return (
      <div className="text-center text-red-500">
        <p>Error: {error}</p>
        <p>Please try again later.</p>
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
            src={
              category.image.startsWith("http")
                ? category.image
                : `https://newsapp-najw.onrender.com/${category.image}`
            }
            alt={category.name}
            width={64}
            height={64}
            className="w-16 h-16 rounded-full object-cover mr-4"
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
                    : post.image
                    ? `https://newsapp-najw.onrender.com/${post.image}`
                    : "/placeholder-image.jpg"
                }
                alt={post.title || "Default Image"}
                width={300}
                height={200}
                className="w-full h-40 object-cover rounded-md mb-4"
              />
              <h2 className="text-xl font-bold mb-2">{post.title || "Untitled"}</h2>
              <p className="text-sm text-gray-600 mb-4">
                {post.description || "No description available."}
              </p>
              <Link
                href={`/news/${post.id}`}
                className="text-blue-500 hover:underline text-sm font-semibold"
              >
                Read More &rarr;
              </Link>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">
            No posts available for this category.
          </p>
        )}
      </div>
    </div>
  );
}
