import Image from "next/image";
import LeftSidebar from "../../../components/LeftSidebar";
import RightSidebar from "../../../components/RightSidebar";
import StoryCoverage from "../../../components/StoryCoverage";
import RelatedNews from "../../../components/RelatedNews";

// Fetch article details and related news
async function fetchArticleAndRelatedNews(articleId) {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  try {
    // Fetch article
    const articleRes = await fetch(`${baseUrl}/news/${articleId}/`);
    if (!articleRes.ok) throw new Error("Failed to fetch article.");
    const article = await articleRes.json();

    // Fetch related news
    const relatedRes = await fetch(`${baseUrl}/news/${articleId}/related/`);
    const relatedArticles = relatedRes.ok ? await relatedRes.json() : [];

    return { article, relatedArticles, baseUrl };
  } catch (error) {
    console.error("Error fetching data:", error.message);
    return { article: null, relatedArticles: [], baseUrl };
  }
}

export default async function NewsDetails({ params }) {
  const { id: articleId } = params;

  // Fetch data on the server
  const { article, relatedArticles } = await fetchArticleAndRelatedNews(articleId);

  if (!article) {
    return (
      <div className="text-center text-gray-500">
        <p>Article not found.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Left Sidebar */}
        <div className="col-span-3">
          <LeftSidebar />
        </div>

        {/* Main Content */}
        <main className="col-span-6 bg-white p-6 rounded-md shadow-md">
          {/* Article Image */}
          {article.image && (
            <Image
              src={article.image.startsWith("https") ? article.image : `${baseUrl}/${article.image}`}
              alt={article.title}
              width={600}
              height={400}
              className="w-full h-auto object-cover rounded-md mb-4"
            />
          )}

          {/* Article Title */}
          <h1 className="text-4xl font-bold mb-4">{article.title}</h1>

          {/* Article Content */}
          <p className="text-gray-700 leading-relaxed">{article.content}</p>

          {/* Story Coverage Section */}
          <div className="mt-6">
            <StoryCoverage />
          </div>
        </main>

        {/* Right Sidebar */}
        <div className="col-span-3">
          <RightSidebar />
        </div>
      </div>

      {/* Related News Section */}
      {relatedArticles.length > 0 && (
        <section className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Related News</h2>
          <RelatedNews articles={relatedArticles} />
        </section>
      )}
    </div>
  );
}
