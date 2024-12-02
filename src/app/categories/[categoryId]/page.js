import Link from "next/link";
import Image from "next/image";

// Generate static params for dynamic route
export async function generateStaticParams() {
  const res = await fetch("https://newsapp-najw.onrender.com/api/categories/");
  const categories = await res.json();

  return categories.map((category) => ({
    categoryId: category.id.toString(),
  }));
}

// Fetch data for a specific category
export default async function CategoryDetails({ params }) {
  const { categoryId } = params;

  // Fetch category details
  const categoryRes = await fetch(`https://newsapp-najw.onrender.com/api/categories/${categoryId}/`);
  if (!categoryRes.ok) {
    return <p>Category not found.</p>;
  }
  const category = await categoryRes.json();

  // Fetch news articles for this category
  const articles = [];
  if (category.articles && category.articles.length > 0) {
    for (const articleId of category.articles) {
      const articleRes = await fetch(`https://newsapp-najw.onrender.com/api/news/${articleId}/`);
      if (articleRes.ok) {
        const article = await articleRes.json();
        articles.push(article);
      }
    }
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
        {articles.length > 0 ? (
          articles.map((post) => (
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
          <p className="col-span-full text-center text-gray-500">
            No posts available for this category.
          </p>
        )}
      </div>
    </div>
  );
}
