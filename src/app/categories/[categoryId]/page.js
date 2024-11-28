import Link from "next/link";
import Image from "next/image";

// Generate static paths for categories
export async function generateStaticParams() {
  const res = await fetch("https://newsapp-najw.onrender.com/api/categories/");
  const categories = await res.json();
  return categories.map((category) => ({ categoryId: category.id.toString() }));
}

// Fetch data for the category
export default async function CategoryDetails({ params }) {
  const { categoryId } = params;

  // Fetch category details
  const categoryRes = await fetch(
    `https://newsapp-najw.onrender.com/api/categories/${categoryId}/`
  );
  if (!categoryRes.ok) {
    return <p>Category not found.</p>;
  }
  const category = await categoryRes.json();

  // Fetch related posts
  const articleIds = category.articles || [];
  const posts = await Promise.all(
    articleIds.map(async (id) => {
      const postRes = await fetch(`https://newsapp-najw.onrender.com/api/news/${id}/`);
      return postRes.ok ? await postRes.json() : null;
    })
  ).then((results) => results.filter(Boolean)); // Filter out failed fetches

  return (
    <div className="container mx-auto py-6">
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts.map((post) => (
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
            <Link href={`/news/${post.id}`} className="text-blue-500 hover:underline">
              Read More &rarr;
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
