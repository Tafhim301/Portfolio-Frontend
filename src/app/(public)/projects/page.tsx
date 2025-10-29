/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, ExternalLink, Github, ArrowRight, Sparkles } from "lucide-react";

interface Project {
  id: string;
  title: string;
  slug: string;
  description: string; 
  thumbnail: string;
  demoImages: string[];
  techStack: string[];
  features: string[];
  liveUrl?: string;
  repoUrl?: string;
  createdAt: string;
}

export default function ProjectsSection() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  async function fetchProjects() {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects/`, {
        method: "GET",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to load");

      setProjects(data.data);
    } catch (err) {
      console.error("Projects fetch error:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProjects();
  }, []);

  const extractPlainText = (content: string, limit: number): string => {
    let text = "";

    if (content.trim().startsWith('{"ops":')) {
      try {
        const delta = JSON.parse(content);
        text = delta.ops
          .map((op: any) => (typeof op.insert === "string" ? op.insert : ""))
          .join("");
      } catch {
        text = content;
      }
    } else {
      const div = document.createElement("div");
      div.innerHTML = content;
      text = div.textContent || div.innerText || "";
    }

    return text.length > limit ? text.slice(0, limit) + "..." : text;
  };

  return (
    <main className="py-20 px-6 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            My <span className="text-red-600">Projects</span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Explore innovative solutions built with modern technologies and creative design.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-red-600" />
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {projects && projects.length > 0 ? (
              projects.map((proj, idx) => (
                <div
                  key={proj.id}
                  className="opacity-0 animate-in fade-in slide-in-from-bottom-4 duration-500"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <Card className="group flex h-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-gray-200 dark:border-gray-800 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden">
                    <CardHeader className="p-0 relative">
                      <div className="relative h-56">
                        <Image
                          src={proj.thumbnail}
                          alt={proj.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                        <div className="absolute top-3 right-3">
                          <Badge className="bg-red-600 text-white shadow-md flex items-center gap-1">
                            <Sparkles className="h-3 w-3" /> New
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="p-6 space-y-4">
                      {/* Demo Thumbnails */}
                      {proj.demoImages && proj.demoImages.length > 0 && (
                        <div className="flex overflow-x-auto gap-2 pb-2 -mx-6 px-6 scrollbar-thin">
                          {proj.demoImages.slice(0, 4).map((img, i) => (
                            <div
                              key={i}
                              className="relative flex-shrink-0 w-12 h-12 rounded-md overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                            >
                              <Image
                                src={img}
                                alt={`Demo ${i + 1}`}
                                fill
                                className="object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      )}

                      <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-red-600 transition-colors line-clamp-1">
                        {proj.title}
                      </h3>

                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {extractPlainText(proj.description, 120)}
                      </p>

                      {/* Features */}
                      {proj.features && proj.features.length > 0 && (
                        <div className="space-y-1">
                          <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                            Key Features
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {proj.features.slice(0, 3).map((f, i) => (
                              <Badge
                                key={i}
                                variant="secondary"
                                className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                              >
                                {f}
                              </Badge>
                            ))}
                            {proj.features.length > 3 && (
                              <Badge variant="secondary" className="text-xs bg-gray-100 dark:bg-gray-800">
                                +{proj.features.length - 3}
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Tech Stack */}
                      {proj.techStack && proj.techStack.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {proj.techStack.slice(0, 5).map((tech) => (
                            <span
                              key={tech}
                              className="text-xs px-2.5 py-1 bg-gray-900 dark:bg-gray-100 text-gray-200 dark:text-gray-900 rounded-full font-medium"
                            >
                              {tech}
                            </span>
                          ))}
                          {proj.techStack.length > 5 && (
                            <span className="text-xs px-2.5 py-1 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full font-medium">
                              +{proj.techStack.length - 5}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-3">
                        {proj.liveUrl && (
                          <Button
                            size="sm"
                            className="bg-red-600 hover:bg-red-700 text-white flex-1 text-xs"
                            onClick={() => window.open(proj.liveUrl, "_blank")}
                          >
                            <ExternalLink className="h-3.5 w-3.5 mr-1" /> Live
                          </Button>
                        )}
                        {proj.repoUrl && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 text-xs border-gray-300 dark:border-gray-700"
                            onClick={() => window.open(proj.repoUrl, "_blank")}
                          >
                            <Github className="h-3.5 w-3.5 mr-1" /> Code
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          className="flex-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 text-xs"
                          onClick={() => router.push(`/projects/${proj.slug}`)}
                        >
                          Details <ArrowRight className="h-3.5 w-3.5 ml-1" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-20">
                <p className="text-gray-500 dark:text-gray-400 text-lg">No projects available at the moment.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}