import Image from "next/image";
import Link from "next/link";

type Blog = {
  id: string;
  title: string;
  excerpt: string;
  coverImage?: string;
  createdAt: string;
  tags: string[];
};

export const revalidate = 30; 

async function getBlogs(): Promise<Blog[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blogs`, {
    next: { revalidate: 30 },
  });

  if (!res.ok) throw new Error("Failed to fetch blogs");
  const data = await res.json();
  return data?.data || [];
}

export default async function AllBlogsPage() {
  const blogs = await getBlogs();

  return (
    <div className="py-20 px-4 max-w-7xl mx-auto">
      <h2 className="text-center text-4xl font-bold mb-10 text-white">
        All Blogs
      </h2>

      {blogs.length === 0 ? (
        <div className="text-center text-gray-400 text-lg">
          No blogs found yet.
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog) => (
            <div
              key={blog.id}
              className="bg-[#111111] border border-gray-800 rounded-xl p-5 hover:border-rose-500 transition duration-300"
            >
              {/* Image */}
              {blog.coverImage && (
                <Image
                  src={blog.coverImage}
                  alt={blog.title}
                  width={20}
                  height={20}
                  className="w-full h-44 object-cover rounded-lg mb-4"
                />
              )}

              {/* Title */}
              <h3 className="text-xl font-semibold mb-2 text-white">
                {blog.title.length > 40
                  ? blog.title.slice(0, 40) + "..."
                  : blog.title}
              </h3>

              {/* Excerpt */}
              <p className="text-gray-400 text-sm mb-4">
                {blog.excerpt.length > 80
                  ? blog.excerpt.slice(0, 80) + "..."
                  : blog.excerpt}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {blog.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-gray-800 text-gray-300 text-xs px-2 py-1 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* CTA */}
              <Link
                href={`/blogs/${blog.id}`}
                className="inline-flex items-center text-rose-500 hover:text-rose-400 font-medium"
              >
                Read More →
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
