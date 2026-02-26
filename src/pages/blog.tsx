import { Link } from "react-router-dom";
import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  tags: string[];
}

const blogPosts: BlogPost[] = [
  {
    slug: "github-actions-macos-linux-build",
    title:
      "Building an Audio Plugin with GitHub Actions (macOS + Linux, multi-arch)",
    excerpt:
      "We show you the nitty-gritty details of building an audio plugin with GitHub Actions, including how to build for both macOS and Linux. There's a lot of nitty-gritty.",
    date: "February 26, 2026",
    readTime: "12 min read",
    tags: ["development", "audio", "plugin", "github-actions", "build"],
  },
  {
    slug: "precomputed-metadata-formats",
    title:
      "Precomputed Music-Theory Metadata: Packed Formats for Fast, Reliable Harmony",
    excerpt:
      "Learn how to precompute as much music theory as possible offline to make realtime generation fast and repeatable.",
    date: "February 26, 2026",
    readTime: "12 min read",
    tags: ["machine-learning", "music-theory", "harmony", "data-structures"],
  },
  {
    slug: "modeling-harmonies",
    title: "Modeling Harmonies: From Scores of the Masters to Real-Time AI",
    excerpt:
      "Explore the complete pipeline behind LucidHarmony's AI-powered harmonic generation system, from extracting knowledge from historical scores to deploying a lightweight neural network inside an audio plugin.",
    date: "December 11, 2025",
    readTime: "12 min read",
    tags: ["machine-learning", "music-theory", "lstm", "harmony"],
  },
  {
    slug: "technology-stack",
    title: "The LucidHarmony Tech Stack: Modeling, Plugin, and Website",
    excerpt:
      "A categorized inventory of the core technologies behind LucidHarmony, from Python modeling and LSTM inference to JUCE plugin development and AWS-backed web hosting.",
    date: "December 17, 2025",
    readTime: "10 min read",
    tags: ["tech", "architecture", "plugin", "machine-learning", "web"],
  },
  {
    slug: "but-is-it-ai",
    title: "How is this AI?",
    excerpt:
      "A deep but fiendly dive into autoregressive sequence modeling: Markov chains, n-grams, LSTM, and GPT-style Transformers—plus why decoding strategies like beam search and top-k sampling matter as much as training.",
    date: "December 17, 2025",
    readTime: "14 min read",
    tags: [
      "ai",
      "machine-learning",
      "lstm",
      "transformers",
      "markov",
      "decoding",
    ],
  },
  {
    slug: "survey",
    title: "Harmonic Generators for DAWs: State of the Union",
    excerpt:
      "We survey the currently available DAW applications and plugins for generating harmonies.",
    date: "December 15, 2025",
    readTime: "8 min read",
    tags: ["plugin", "daw", "harmony"],
  },
];

export default function BlogPage() {
  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="w-full max-w-6xl px-4">
          <div className="text-center mb-12">
            <h1 className={title()}>Blog</h1>
            <p className="text-lg text-default-600 mt-4">
              Latest articles, tutorials, and insights from our team
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.map((post) => (
              <Link
                key={post.slug}
                to={`/blog/${post.slug}`}
                className="group block p-6 rounded-lg border border-default-200 hover:border-default-400 transition-all hover:shadow-lg"
              >
                <div className="flex flex-col h-full">
                  <div className="flex items-center gap-2 text-sm text-default-500 mb-3">
                    <span>{post.date}</span>
                    <span>•</span>
                    <span>{post.readTime}</span>
                  </div>

                  <h2 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                    {post.title}
                  </h2>

                  <p className="text-default-600 mb-4 flex-grow">
                    {post.excerpt}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-1 rounded-full bg-default-100 text-default-700"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </DefaultLayout>
  );
}
