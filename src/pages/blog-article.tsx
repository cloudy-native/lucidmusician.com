import { useParams } from "react-router-dom";
import MarkdownPage from "@/components/MarkdownPage";

export default function BlogArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  
  return <MarkdownPage markdownPath={`/content/blog/${slug}.md`} />;
}
