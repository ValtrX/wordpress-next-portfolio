// Description: WordPress API functions
// Used to fetch data from a WordPress site using the WordPress REST API
// Types are imported from `wordpress.d.ts`

import { Post } from "@/lib/wordpress.d";
import querystring from "query-string";

const baseUrl = process.env.WORDPRESS_URL;

function getUrl(path: string, query?: Record<string, any>) {
  const params = query ? querystring.stringify(query) : null;

  return `${baseUrl}${path}${params ? `?${params}` : ""}`;
}

export async function getAllPosts(filterParams?: {
  author?: string;
  tag?: string;
  category?: string;
}): Promise<Post[]> {
  const url = getUrl("/wp-json/wp/v2/posts", {
    author: filterParams?.author,
    tags: filterParams?.tag,
    categories: filterParams?.category,
  });
  const response = await fetch(url);
  const posts: Post[] = await response.json();
  return posts;
}

export async function getPostsWithImages(): Promise<Post[]> {
  const url = getUrl("/wp-json/wp/v2/media/")
  const posts: Post[] = await getAllPosts();
  const postsWithImages: Post[] = await Promise.all(
    posts.map(async (post) => {
      if (post.featured_media && post.status == "publish") {
        const mediaResponse = await fetch(
          `${url}${post.featured_media}`
        );
        const mediaData = await mediaResponse.json();
        return { ...post, featured_image_url: mediaData.source_url };
      }
      return post;
    })
  );
  return postsWithImages;
}
