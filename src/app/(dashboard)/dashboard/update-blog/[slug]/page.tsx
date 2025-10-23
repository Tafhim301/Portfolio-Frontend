
import AdvancedBlogForm from "@/components/dashboard/BlogForm";
import { notFound } from "next/navigation";
import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";

export const revalidate = 0; 


async function getBlogBySlug(slug: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blogs/${slug}`, {
      cache: "no-store",
      credentials: "include",
    });

    if (!res.ok) return null;

    const json = await res.json();
    return json.data;
  } catch (error) {
    console.error("Error fetching blog:", error);
    return null;
  }
}

export default async function UpdateBlogPage({ params }: { params: { slug: string } }) {
  const blog = await getBlogBySlug(params.slug);

  if (!blog) return notFound();

  // --- Convert delta (if present) to HTML ---
  let contentHTML = "";
  try {
    const parsed = JSON.parse(blog.content);
    if (parsed?.ops) {
      const converter = new QuillDeltaToHtmlConverter(parsed.ops, {});
      contentHTML = converter.convert();
    } else {
      contentHTML = blog.content;
    }
  } catch {
    contentHTML = blog.content;
  }

  // --- Render AdvancedBlogForm in edit mode ---
  return (
    <section className="py-10 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold mb-6">Edit Blog</h1>

      <AdvancedBlogForm
        mode="edit"
        blogId={blog.id} 
        initial={{
          title: blog.title,
          excerpt: blog.excerpt,
          content: contentHTML,
          tags: blog.tags || [],
          coverImage: blog.coverImage,
        }}
      />
    </section>
  );
}
