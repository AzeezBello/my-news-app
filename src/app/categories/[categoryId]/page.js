import Image from "next/image";
import Link from "next/link";

// Generate static params for dynamic route
export async function generateStaticParams() {
  const res = await fetch("https://newsapp-najw.onrender.com/api/categories/");
  const categories = await res.json();

  return categories.map((category) => ({
    categoryId: category.id.toString(),
  }));
}

// Fetch data for the specific category
export default async function CategoryDetails({ params }) {
  const { categoryId } = params;

  // Fetch category details
  const categoryRes = await fetch(`https://newsapp-najw.onrender.com/api/categories/${categoryId}/`);
  if (!categoryRes.ok) {
    return <p>Category not found.</p>;
  }
  const category = await categoryRes.json();

  // Fetch articles
  const articleIds = category.articles || [];
  const articles = await Promise.all(
    articleIds.map(async (id) => {
      const articleRes = await fetch(`https://newsapp-najw.onrender.com/api/news/${id}/`);
      if (articleRes.ok) {
        return articleRes.json();
      }
      return null;
    })
  );

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
        {articles.length > 0 ? (
          articles.map(
            (article) =>
              article && (
                <div key={article.id} className="bg-white p-4 rounded-lg shadow-md">
                  <Image
                    src={article.image || "/placeholder-image.jpg"}
                    alt={article.title || "Default Image"}
                    className="w-full h-40 object-cover rounded-md mb-4"
                  />
                  <h2 className="text-xl font-bold mb-2">{article.title || "Untitled"}</h2>
                  <p className="text-sm text-gray-600 mb-4">
                    {article.description || "No description available."}
                  </p>
                  <Link href={`/news/${article.id}`}>
                    <a className="text-blue-500 hover:underline text-sm font-semibold">
                      Read More &rarr;
                    </a>
                  </Link>
                </div>
              )
          )
        ) : (
          <p className="col-span-full text-center text-gray-500">
            No posts available for this category.
          </p>
        )}
      </div>
    </div>
  );
}
