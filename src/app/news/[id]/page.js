"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function NewsDetails({ params }) {
  const { id } = params; // Use 'id' from params
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      fetch(`http://127.0.0.1:8000/api/news/${id}/`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch article.");
          }
          return response.json();
        })
        .then((data) => {
          setArticle(data);
        })
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <h1>{article.title}</h1>
      {article.image && (
        <Image
          src={article.image.startsWith("http") ? article.image : `http://127.0.0.1:8000${article.image}`}
          alt={article.title}
          width={600}
          height={400}
        />
      )}
      <p>{article.content}</p>
    </div>
  );
}
