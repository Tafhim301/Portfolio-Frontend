"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, Eye, Edit, Trash2, CalendarRange, Star } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Pagination } from "@/components/ui/pagination";

type Blog = {
  id: string;
  title: string;
  slug: string;
  author: { name: string };
  createdAt: string;
  isFeatured?: boolean;
};

export default function ManageBlogs() {
  const router = useRouter();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const limit = 10;

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/blogs?page=${page}&limit=${limit}`,
        { credentials: "include" }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch blogs");

      setBlogs(data?.data || []);
      setTotalPages(Math.ceil((data?.meta?.total || 1) / limit));
    } catch (error) {
      console.error(error);
      toast.error("Failed to load blogs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [page]);


  const handleDelete = async (id: string) => {
    toast.message("Confirm delete?", {
      description: "This action cannot be undone.",
      action: {
        label: "Delete",
        onClick: async () => {
          try {
            const res = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/blogs/${id}`,
              {
                method: "DELETE",
                credentials: "include",
              }
            );
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to delete blog");

            toast.success("Blog deleted successfully");
            fetchBlogs();
          } catch (error) {
            console.error(error);
            toast.error("Error deleting blog");
          }
        },
      },
    });
  };


  const handleToggleFeature = async (id: string, isFeatured: boolean) => {

    try {
      
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/blogs/toggleIsFeatured/${id}`,
        {
          method: "PATCH",
          credentials: "include",

        }
      );

      const data = await res.json();


      if (!res.ok) throw new Error(data.message || "Failed to update feature");

      toast.success(`Blog ${!isFeatured ? "featured" : "unfeatured"} successfully`);
      fetchBlogs();
    } catch (error) {
      console.error(error);
      toast.error("Error updating feature status");
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-6 w-6 animate-spin" />
        <p className="ml-2 text-gray-500">Loading blogs...</p>
      </div>
    );

  return (
    <div className="p-6 w-full">
      <h1 className="text-2xl font-semibold mb-4">Manage Blogs</h1>

      {blogs.length === 0 ? (
        <p className="text-gray-500">No blogs found.</p>
      ) : (
        <div className="border rounded-md overflow-hidden shadow-sm">
          <Table>
            <TableHeader className="bg-gray-100">
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {blogs.map((blog, index) => (
                <TableRow key={blog.id}>
                  <TableCell>{(page - 1) * limit + index + 1}</TableCell>
                  <TableCell className="font-bold text-md">{blog.title}</TableCell>
                  <TableCell className="font-semibold text-sm">
                    {blog.author?.name || "Tafhimul Islam"}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1 items-center font-semibold">
                      <CalendarRange size={15} />
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        "px-2 py-1 rounded text-xs font-medium",
                        blog.isFeatured
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      )}
                    >
                      {blog.isFeatured ? "Featured" : "Not Featured"}
                    </span>
                  </TableCell>
                  <TableCell className="flex justify-end gap-2">

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => router.push(`/blogs/${blog.slug}`)}
                    >
                      <Eye className="h-4 w-4 mr-1" /> Preview
                    </Button>


                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => router.push(`/dashboard/update-blog/${blog.slug}`)}
                    >
                      <Edit className="h-4 w-4 mr-1" /> Edit
                    </Button>


                    <Button
                      size="sm"
                      variant={blog.isFeatured ? "secondary" : "default"}
                      className="hover:bg-gray-600 w-28"
                      onClick={() => handleToggleFeature(blog.id, blog.isFeatured!)}
                    >
                      <Star
                        className={cn("h-4 w-4 mr-1", {
                          "text-yellow-500": blog.isFeatured,
                        })}
                      />{" "}
                      {blog.isFeatured ? "Unfeature" : "Feature"}
                    </Button>


                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(blog.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" /> Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={(p) => setPage(p)}
          />
        </div>
      )}
    </div>
  );
}
