import Link from "next/link";
import { Tag } from "lucide-react";

interface BlogCardProps {
  id: string;
  title: string;
  excerpt: string;
  tags: string[];
}

export default function BlogCard({ id, title, excerpt, tags }: BlogCardProps) {
  return (
    <div className="border rounded-xl p-6 bg-white hover:shadow-lg transition">
      <h2 className="text-2xl font-semibold mb-2">{title}</h2>
      <p className="text-gray-600 mb-4 line-clamp-3">{excerpt}</p>

      {/* Tags below each card */}
      <div className="flex flex-wrap gap-2 mb-4">
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 text-xs px-3 py-1 bg-gray-100 rounded-full border"
          >
            <Tag className="w-3 h-3" />
            {tag}
          </span>
        ))}
      </div>

   
      <Link
        href={`/blogs/${id}`}
        className="inline-block text-sm font-medium text-white bg-black px-4 py-2 rounded-lg hover:bg-gray-800 transition"
      >
        Read More →
      </Link>
    </div>
  );
}
