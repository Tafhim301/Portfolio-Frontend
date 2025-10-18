import Image from "next/image";
import { Calendar, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export const revalidate = 60;

async function getBlog(slug: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blogs/${slug}`, {
    next: { revalidate: 60 },
  });
  const json = await res.json();
  return json.data;
}

export default async function BlogDetailsPage({ params }: { params: { slug: string } }) {
  const blog = await getBlog(params.slug);

  return (
    <div className="max-w-3xl mt-8 mx-auto px-4 py-16">
      <Card className="space-y-6">
       
        <CardHeader>
          <CardTitle className="text-4xl font-bold">{blog.title}</CardTitle>
          <CardDescription>
            <div className="flex items-center gap-6 text-sm text-gray-500 mt-2">
              <div className="flex items-center gap-1">
                <Calendar size={16} />
                {new Date(blog.createdAt).toLocaleDateString()}
              </div>
              <div className="flex items-center gap-1">
                <Eye size={16} />
                {blog.views} views
              </div>
            </div>
          </CardDescription>
        </CardHeader>

        {/* Card Content */}
        <CardContent className="space-y-6">
          {/* Cover Image */}
          <div className="relative w-full h-96 rounded-xl overflow-hidden">
            <Image
              src={blog.coverImage}
              alt={blog.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {blog.tags.map((tag: string) => (
              <span
                key={tag}
                className="text-xs px-3 py-1 bg-gray-100 rounded-full text-gray-600"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Content */}
          <div className="prose text-sm font-semibold max-w-none">
            {blog.content.split("\n").map((p: string, i: number) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
