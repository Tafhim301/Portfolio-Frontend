import BlogForm from "@/components/dashboard/BlogForm";

export default function NewBlogPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-center mb-4">Create New Blog</h1>
      <BlogForm mode="create" />
    </div>
  );
}
