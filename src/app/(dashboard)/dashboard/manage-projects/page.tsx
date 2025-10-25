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
import { Loader2, Eye, Edit, Trash2, CalendarRange, ExternalLink, Github } from "lucide-react";
import { toast } from "sonner";
import { Pagination } from "@/components/ui/pagination";

type Project = {
  id: string;
  title: string;
  slug: string;
  description: string;
  imageUrl?: string;
  techStack?: string[];
  liveLink?: string;
  githubLink?: string;
  createdAt: string;
};

export default function ManageProjects() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/projects?page=${page}&limit=${limit}`,
        { credentials: "include" }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch projects");

      setProjects(data?.data || []);
      setTotalPages(Math.ceil((data?.meta?.total || 1) / limit));
    } catch (error) {
      console.error(error);
      toast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [page]);

  const handleDelete = async (id: string) => {
    toast.message("Confirm delete?", {
      description: "This action cannot be undone.",
      action: {
        label: "Delete",
        onClick: async () => {
          try {
            const res = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/projects/${id}`,
              {
                method: "DELETE",
                credentials: "include",
              }
            );
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to delete project");

            toast.success("Project deleted successfully");
            fetchProjects();
          } catch (error) {
            console.error(error);
            toast.error("Error deleting project");
          }
        },
      },
    });
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-6 w-6 animate-spin" />
        <p className="ml-2 text-gray-500">Loading projects...</p>
      </div>
    );

  return (
    <div className="p-6 w-full">
      <h1 className="text-2xl font-semibold mb-4">Manage Projects</h1>

      {projects.length === 0 ? (
        <p className="text-gray-500">No projects found.</p>
      ) : (
        <div className="border rounded-md overflow-hidden shadow-sm">
          <Table>
            <TableHeader className="bg-gray-100">
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Tech Stack</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project, index) => (
                <TableRow key={project.id}>
                  <TableCell>{(page - 1) * limit + index + 1}</TableCell>
                  <TableCell className="font-bold text-md">{project.title}</TableCell>
                  <TableCell className="text-sm font-medium text-gray-600">
                    {project.techStack?.join(", ") || "—"}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1 items-center font-semibold">
                      <CalendarRange size={15} />
                      {new Date(project.createdAt).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => router.push(`/projects/${project.slug}`)}
                    >
                      <Eye className="h-4 w-4 mr-1" /> View
                    </Button>

                    {project.githubLink && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(project.githubLink!, "_blank")}
                      >
                        <Github className="h-4 w-4 mr-1" /> Code
                      </Button>
                    )}

                    {project.liveLink && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(project.liveLink!, "_blank")}
                      >
                        <ExternalLink className="h-4 w-4 mr-1" /> Live
                      </Button>
                    )}

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => router.push(`/dashboard/update-project/${project.slug}`)}
                    >
                      <Edit className="h-4 w-4 mr-1" /> Edit
                    </Button>

                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(project.id)}
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
