import Link from "next/link";
import Image from "next/image";
import LeftSidebar from "../../../components/LeftSidebar";
import RightSidebar from "../../../components/RightSidebar";
import StoryCoverage from "../../../components/StoryCoverage";
import RelatedNews from "../../../components/RelatedNews";

// Server-side function to fetch article details and related news
export async function getServerSideProps(context) {
  const { id } = context.params;

  try {
    // Fetch article details
    const articleRes = await fetch(`http://127.0.0.1:8000/api/news/${id}/`);
    if (!articleRes.ok) {
      throw new Error(`Failed to fetch article with id: ${id}`);
    }
    const article = await articleRes.json();

    // Fetch related news
    const relatedRes = await fetch(`http://127.0.0.1:8000/api/news/${id}/related/`);
    const relatedArticles = relatedRes.ok ? await relatedRes.json() : [];

    return {
      props: {
        article,
        relatedArticles,
      },
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      notFound: true, // Show 404 page if there's an error
    };
  }
}

export default function NewsDetails({ article, relatedArticles }) {
  if (!article) {
    return <p className="text-center text-gray-500">Article not found.</p>;
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
              src={article.image.startsWith("http") ? article.image : `http://127.0.0.1:8000${article.image}`}
              alt={article.title}
              width={600}
              height={400}
              className="w-full h-70 object-cover mb-1"
            />
          )}
          <h1 className="text-4xl font-bold mb-2">{article.title}</h1>
          <p>{article.content}</p>
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
