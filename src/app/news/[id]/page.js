
import Image from "next/image";
import LeftSidebar from "../../../components/LeftSidebar";
import RightSidebar from "../../../components/RightSidebar";
import StoryCoverage from "../../../components/StoryCoverage";
import RelatedNews from "../../../components/RelatedNews";

// Fetch article details and related news on the server
async function fetchArticleAndRelatedNews(articleId) {
  const baseUrl = "https://newsapp-najw.onrender.com/api";

  try {
    // Fetch article
    const articleRes = await fetch(`${baseUrl}/news/${articleId}/`);
    if (!articleRes.ok) throw new Error("Failed to fetch article.");
    const article = await articleRes.json();

    // Fetch related news
    const relatedRes = await fetch(`${baseUrl}/news/${articleId}/related/`);
    const relatedArticles = relatedRes.ok ? await relatedRes.json() : [];

    return { article, relatedArticles };
  } catch (error) {
    console.error("Error fetching data:", error);
    return { article: null, relatedArticles: [] };
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
    <div>
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Left Sidebar */}
        <div className="col-span-3">
          <LeftSidebar />
        </div>

        {/* Main Content */}
        <section className="col-span-6 bg-white p-6">
          {article.image && (
            <Image
              src={article.image.startsWith("http") ? article.image : `https://newsapp-najw.onrender.com/${article.image}`}
              alt={article.title}
              width={600}
              height={400}
              className="w-full h-70 object-cover mb-1"
            />
          )}
          <h1 className="text-4xl font-bold mb-2">{article.title}</h1>
          <p className="text-gray-600">{article.content}</p>
          <StoryCoverage />
        </section>

        {/* Right Sidebar */}
        <div className="col-span-3">
          <RightSidebar />
        </div>
      </div>

      {/* Related News Section */}
      {relatedArticles && relatedArticles.length > 0 && (
        <div className="mt-8">
          <RelatedNews articles={relatedArticles} />
        </div>
      )}
    </div>
  );
}
