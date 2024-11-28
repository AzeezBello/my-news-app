// app/categories/[categoryId]/page.js

"use client"; // Mark this file as a Client Component
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

export async function generateStaticParams() {
  const res = await fetch("https://newsapp-najw.onrender.com/api/categories/");
  if (!res.ok) {
    throw new Error("Failed to fetch categories");
  }

  const categories = await res.json();

  // Return an array of category IDs as params
  return categories.map((category) => ({
    categoryId: category.id.toString(),
  }));
}

export default function CategoryDetails({ params }) {
  const { categoryId } = params; // Get 'categoryId' from 'params'
  const [category, setCategory] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (categoryId) {
      // Fetch category details first
      fetch(`https://newsapp-najw.onrender.com/api/categories/${categoryId}/`)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          setCategory(data);

          // Fetch news based on IDs
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
                setPosts(news);
                setLoading(false);
              })
              .catch(() => {
                setLoading(false);
                setError("Failed to fetch news.");
              });
          } else {
            setPosts([]);
            setLoading(false);
          }
        })
        .catch(() => {
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
            src={category.image}
            alt={category.name}
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
                src={post.image || "/placeholder-image.jpg"}
                alt={post.title || "Default Image"}
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
