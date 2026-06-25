import type { CollectionEntry } from "astro:content";

export function getRelatedPosts(
  current: CollectionEntry<"blog">,
  all: CollectionEntry<"blog">[],
  limit = 3,
): CollectionEntry<"blog">[] {
  const currentTags = new Set(current.data.tags);

  return all
    .filter((post) => post.id !== current.id)
    .map((post) => ({
      post,
      score: post.data.tags.filter((tag) => currentTags.has(tag)).length,
    }))
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return (
        new Date(b.post.data.date).getTime() -
        new Date(a.post.data.date).getTime()
      );
    })
    .slice(0, limit)
    .map(({ post }) => post);
}