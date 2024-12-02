import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

export async function generateStaticParams() {
  const res = await fetch("https://newsapp-najw.onrender.com/api/categories/");
  const categories = await res.json();

  return categories.map((category) => ({
    categoryId: category.id.toString(),
  }));
}

export default function CategoryDetails({ params }) {
  const { categoryId } = params;
  const [category, setCategory] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategoryDetails = async () => {
      try {
        const response = await fetch(`https://newsapp-najw.onrender.com/api/categories/${categoryId}/`);
        if (!response.ok) {
          throw new Error(`Failed to fetch category details: ${response.statusText}`);
        }
        const data = await response.json();
        setCategory(data);

        if (data.articles && data.articles.length > 0) {
          const articles = await Promise.all(
            data.articles.map((id) =>
              fetch(`https://newsapp-najw.onrender.com/api/news/${id}/`).then((res) => res.json())
            )
          );
          setPosts(articles);
        }
      } catch (error) {
        console.error("Error fetching category details:", error);
        setError("Failed to fetch category details.");
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
    return <div className="text-red-500">{error}</div>;
  }

  if (!category) {
    return <p>Category not found.</p>;
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center mb-6">
        {category.image && (
          <Image
            src={category.image.startsWith("http") ? category.image : `http://127.0.0.1:8000${category.image}`}
            alt={category.name}
            className="w-16 h-16 rounded-full object-cover mr-4"
          />
        )}
        <h1 className="text-3xl font-bold">{category.name}</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div key={post.id} className="bg-white p-4 rounded-lg shadow-md">
              <Image
                src={post.image ? post.image : "/placeholder-image.jpg"}
                alt={post.title || "Untitled"}
                className="w-full h-40 object-cover rounded-md mb-4"
              />
              <h2 className="text-xl font-bold mb-2">{post.title || "Untitled"}</h2>
              <p className="text-sm text-gray-600 mb-4">
                {post.description || "No description available."}
              </p>
              <Link href={`/news/${post.id}`} className="text-blue-500 hover:underline text-sm font-semibold">
                Read More &rarr;
              </Link>
            </div>
          ))
        ) : (
          <p>No posts available for this category.</p>
        )}
      </div>
    </div>
  );
}
