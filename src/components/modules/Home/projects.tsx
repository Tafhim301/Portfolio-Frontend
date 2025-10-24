"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader,  } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface Project {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  thumbnail: string;
  techStack: string[];
  liveUrl?: string;
  githubUrl?: string;
  createdAt: string;
}

export default function ProjectsSection() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  async function fetchProjects() {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/projects/`,{
            method : "GET"
        }
        
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to load");
     
      setProjects(data.data);
      console.log(data.data)
       
    } catch (err) {
      console.error("Projects fetch error:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProjects();
  }, []);



  return (
    <section className="py-16 px-6 bg-gradient-to-tr from-gray-900 to-black md:rounded-xl">
      <h2 className="text-3xl font-bold text-red-500 mb-8 text-center">Projects</h2>

      {loading ? (
        <div className="flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-red-500" />
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {projects && projects.length > 0 ? (
            projects?.map((proj) => (
              <Card
                key={proj.id}
                className="group overflow-hidden rounded-xl bg-white/5 backdrop-blur-lg hover:scale-105 transition-transform shadow-lg"
              >
                <CardHeader className="p-0">
                  <div className="relative h-48 w-full">
                    <Image
                      src={proj.thumbnail}
                      alt={proj.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-5 flex flex-col gap-3">
                  <h3 className="text-xl font-semibold text-white group-hover:text-red-400">
                    {proj.title}
                  </h3>
                  <p className="text-gray-300 flex-grow">{proj.excerpt}</p>
                  <div className="flex flex-wrap gap-2">
                    {proj.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="text-xs bg-gray-800 text-gray-200 px-2 py-1 rounded-full"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="mt-4 flex gap-2">
                    {proj.liveUrl && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(proj.liveUrl, "_blank")}
                      >
                        Live
                      </Button>
                    )}
                    {proj.githubUrl && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(proj.githubUrl, "_blank")}
                      >
                        Code
                      </Button>
                    )}
                    <Button
                      variant="link"
                      size="sm"
                      onClick={() => router.push(`/projects/${proj.slug}`)}
                    >
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-gray-400 text-center col-span-full">No projects to show.</p>
          )}
        </div>
      )}
    </section>
  );
}
