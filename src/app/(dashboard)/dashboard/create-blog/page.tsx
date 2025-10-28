"use client"
import dynamic from 'next/dynamic';

const BlogForm = dynamic(
  () => import('@/components/dashboard/BlogForm'),
  { ssr: false }
);

export default function NewBlogPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-center mb-4">Create New Blog</h1>
      <BlogForm mode="create" />
    </div>
  );
}