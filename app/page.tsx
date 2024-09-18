import Image from "next/image";
import { getPostsWithImages } from "@/lib/wordpress";

export default async function Home() {
  const postsWithImages = await getPostsWithImages();

  return (
    <div>
      <ul>
        {postsWithImages.map((post) => {
          console.log(post.featured_image_url);
          return (
            <li key={post.id}>
              <h2 dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
              {post.featured_image_url && (
                <Image
                  src={post.featured_image_url}
                  width={50}
                  height={50}
                  layout="responsive"
                  alt={post.title.rendered}
                />
                
              )
              }
            </li>
          );
        })}
      </ul>
    </div>
  );
}
