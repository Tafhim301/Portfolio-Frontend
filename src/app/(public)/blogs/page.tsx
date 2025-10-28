/* eslint-disable @typescript-eslint/no-explicit-any */
import Image from "next/image";
import Link from "next/link";
import { Eye, Calendar } from "lucide-react";
import BlogCardSkeleton from "@/components/ui/blogCardSkeleton";



export const revalidate = 6000000000;

async function getBlogs() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blogs`, { next: { revalidate} });
  const json = await res.json();
  return json.data;
}

export default async function BlogsPage() {
  const blogs = await getBlogs();
 
  return (
    <section className="max-w-6xl mt-12 mx-auto px-6 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Explore Blogs</h1>
        <p className="text-gray-500 max-w-2xl mx-auto">Here I share my stroies, journey, coding story and some dev observations</p>
      </div>


      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {blogs.length === 0 &&
          Array.from({ length: 6 }).map((_, i) => <BlogCardSkeleton key={i} />)}

        {blogs.map((blog: any) => (
          <div key={blog.id} className="group rounded-xl border border-gray-200 hover:shadow-lg transition overflow-hidden bg-white flex flex-col">
            <div className="relative w-full h-56">
              <Image
                src={blog.coverImage}
                alt={blog.title}
                fill
                className="object-cover group-hover:scale-105 transition"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>

            <div className="p-5 flex flex-col justify-between flex-1">
              <div>
                <div className="flex flex-wrap gap-2 mb-2">
                  {blog.tags.map((tag: string) => (
                    <span key={tag} className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600">#{tag}</span>
                  ))}
                </div>
                <h2 className="text-lg font-semibold line-clamp-2 mb-2 group-hover: text-foreground transition">
                  {blog.title}
                </h2>
                <p className="text-gray-500 text-sm line-clamp-3 mb-4">{blog.excerpt}</p>
              </div>

              <div className="flex justify-between items-center text-sm text-gray-400">
                <span className="flex items-center gap-1">
                  <Calendar size={16} />
                  {new Date(blog.createdAt).toLocaleDateString()}
                </span>
                <span className="flex items-center gap-1">
                  <Eye size={16} /> {blog.views}
                </span>
              </div>

              <Link
                href={`/blogs/${blog.slug}`}
                className="mt-4 inline-block text-center px-4 py-2 bg-accent-foreground text-white rounded-md text-sm font-medium hover:bg-gray-500 transition"
              >
                Read More →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
