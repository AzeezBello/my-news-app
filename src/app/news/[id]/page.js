import Link from "next/link";
import Image from "next/image";

// Generate static params for dynamic route
export async function generateStaticParams() {
  const res = await fetch("https://newsapp-najw.onrender.com/api/news/");
  const newsArticles = await res.json();

  return newsArticles.map((article) => ({
    id: article.id.toString(),
  }));
}

// Fetch data for individual article
export default async function NewsDetails({ params }) {
  const { id } = params;

  // Fetch article details
  const articleRes = await fetch(`https://newsapp-najw.onrender.com/api/news/${id}/`);
  if (!articleRes.ok) {
    return <p>Article not found.</p>;
  }
  const article = await articleRes.json();

  // Fetch related news
  const relatedRes = await fetch(`https://newsapp-najw.onrender.com/api/news/${id}/related/`);
  const relatedArticles = relatedRes.ok ? await relatedRes.json() : [];

  return (
    <div>
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Left Sidebar */}
        <div className="col-span-3">Left Sidebar</div>

        {/* Main Content */}
        <section className="col-span-6 bg-white p-6">
          <div className="grid grid-cols-1 gap-4">
            {article.image && (
              <Image
                src={article.image}
                alt={article.title}
                className="w-full h-70 object-cover mb-1"
              />
            )}
            <p className="text-gray-600">{article.published_at}, {article.location}</p>
            <h1 className="text-4xl font-bold mb-2">{article.title}</h1>

            {/* Tags */}
            {article.tags && (
              <div className="flex flex-wrap gap-2 mt-4">
                {article.tags.map((tag, idx) => (
                  <Link key={idx} href={`/news?tag=${tag}`}>
                    <a className="bg-gray-200 px-3 py-1 rounded-full text-sm">
                      {tag}
                    </a>
                  </Link>
                ))}
              </div>
            )}

            <h2 className="text-2xl font-bold mt-6">News Summary</h2>
            <p>{article.content}</p>
          </div>
        </section>

        {/* Right Sidebar */}
        <div className="col-span-3">Right Sidebar</div>
      </div>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Related Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {relatedArticles.map((related) => (
              <div key={related.id} className="bg-white p-4 rounded-lg shadow-md">
                <Image
                  src={related.image || "/placeholder-image.jpg"}
                  alt={related.title || "Default Image"}
                  className="w-full h-40 object-cover rounded-md mb-4"
                />
                <h3 className="text-xl font-bold">{related.title || "Untitled"}</h3>
                <p className="text-sm text-gray-600">
                  {related.description || "No description available."}
                </p>
                <Link href={`/news/${related.id}`}>
                  <a className="text-blue-500 hover:underline text-sm font-semibold">
                    Read More &rarr;
                  </a>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
