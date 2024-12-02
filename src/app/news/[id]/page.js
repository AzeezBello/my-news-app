import Image from "next/image";
import Link from "next/link";

// Generate static params for dynamic route
export async function generateStaticParams() {
  const res = await fetch("https://newsapp-najw.onrender.com/api/news/");
  const articles = await res.json();

  return articles.map((article) => ({
    id: article.id.toString(),
  }));
}

// Fetch data for a specific article
export default async function NewsDetails({ params }) {
  const { id } = params;

  // Fetch article details
  const articleRes = await fetch(`https://newsapp-najw.onrender.com/api/news/${id}/`);
  if (!articleRes.ok) {
    return <p>Article not found.</p>;
  }
  const article = await articleRes.json();

  // Fetch related articles
  const relatedRes = await fetch(`https://newsapp-najw.onrender.com/api/news/${id}/related/`);
  const relatedArticles = relatedRes.ok ? await relatedRes.json() : [];

  return (
    <div>
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Left Sidebar */}
        <div className="col-span-3">
          <div>Left Sidebar Content</div>
        </div>

        {/* Main Content */}
        <section className="col-span-6 bg-white p-6">
          <div>
            {article.image && (
              <Image
                src={article.image.startsWith("http") ? article.image : `http://127.0.0.1:8000${article.image}`}
                alt={article.title}
                className="w-full h-70 object-cover mb-4"
              />
            )}
            <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
            <p>{article.content}</p>

            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
              <div>
                {article.tags.map((tag, index) => (
                  <Link key={index} href={`/news?tag=${tag}`}>
                    <a className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm mr-2">
                      {tag}
                    </a>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Right Sidebar */}
        <div className="col-span-3">
          <div>Right Sidebar Content</div>
        </div>
      </div>

      {/* Related News Section */}
      <div>
        <h2 className="text-2xl font-bold">Related News</h2>
        {relatedArticles.length > 0 ? (
          relatedArticles.map((related) => (
            <div key={related.id}>
              <Link href={`/news/${related.id}`}>
                <a>{related.title}</a>
              </Link>
            </div>
          ))
        ) : (
          <p>No related news available.</p>
        )}
      </div>
    </div>
  );
}
