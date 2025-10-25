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

  const truncateText = (text: string, limit: number) => {
    return text.length > limit ? text.slice(0, limit) + "..." : text;
  };

  return (
    <main className="py-20 px-6 bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
           My <span className="text-red-600">Projects</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
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
                <div key={proj.id} className="opacity-0  card-enter">
                  <Card
                    className="group flex h-full bg-white/80 backdrop-blur-sm border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden"
                    style={{ animationDelay: `${idx * 100}ms` }}
                  >
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
                      {/* Demo Images Preview */}
                      {proj.demoImages && proj.demoImages.length > 0 && (
                        <div className="flex overflow-x-auto gap-3 pb-3 -mx-6 px-6 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                          {proj.demoImages.map((img, i) => (
                            <div
                              key={i}
                              className="relative flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden group/demo shadow-lg hover:shadow-lg transition-all duration-300"
                            >
                              <Image
                                src={img}
                                alt={`${proj.title} - Demo ${i + 1}`}
                                fill
                                className="object-cover rounded-md transition-transform duration-300 group-hover/demo:scale-110"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 to-transparent opacity-70 group-hover/demo:opacity-60 transition-opacity" />
                            </div>
                          ))}
                        </div>
                      )}


                      <h3 className="text-2xl font-bold text-gray-900 group-hover:text-red-600 transition-colors line-clamp-1">
                        {proj.title}
                      </h3>


                      <p className="text-gray-600 text-sm leading-relaxed">
                        {truncateText(proj.description, 25)}
                      </p>


                      {proj.features && proj.features.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Key Features</p>
                          <div className="flex flex-wrap gap-1.5">
                            {proj.features.slice(0, 3).map((feature, i) => (
                              <Badge
                                key={i}
                                variant="secondary"
                                className="text-xs bg-gray-100 text-gray-700 hover:bg-red-100 hover:text-red-700 transition-colors"
                              >
                                {feature}
                              </Badge>
                            ))}
                            {proj.features.length > 3 && (
                              <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-500">
                                +{proj.features.length - 3}
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}


                      {proj.techStack && proj.techStack.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {proj.techStack.slice(0, 5).map((tech) => (
                            <span
                              key={tech}
                              className="text-xs px-2.5 py-1 bg-gray-900 text-gray-200 rounded-full font-medium"
                            >
                              {tech}
                            </span>
                          ))}
                          {proj.techStack.length > 5 && (
                            <span className="text-xs px-2.5 py-1 bg-gray-200 text-gray-600 rounded-full font-medium">
                              +{proj.techStack.length - 5}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-2">
                        {proj.liveUrl && (
                          <Button
                            size="sm"
                            className="bg-red-600 hover:bg-red-700 text-white flex-1"
                            onClick={() => window.open(proj.liveUrl, "_blank")}
                          >
                            <ExternalLink className="h-4 w-4 mr-1" /> Live
                          </Button>
                        )}
                        {proj.repoUrl && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 border-gray-300"
                            onClick={() => window.open(proj.repoUrl, "_blank")}
                          >
                            <Github className="h-4 w-4 mr-1" /> Code
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          className="flex-1 text-red-600 hover:bg-red-50"
                          onClick={() => router.push(`/projects/${proj.slug}`)}
                        >
                          Details <ArrowRight className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-20">
                <p className="text-gray-500 text-lg">No projects available at the moment.</p>
              </div>
            )}
          </div>
        )}
      </div>
   
    </main>
  );
}
