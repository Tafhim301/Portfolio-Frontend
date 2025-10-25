"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import {
  Calendar,
  Clock,
  ZoomIn,
  Globe,
  Code2,
  ArrowLeft,
  ChevronRight,
  CheckCircle,
  Images,
} from "lucide-react";
import { format } from "date-fns";
import { Project } from "@/types";

export default function ProjectClientView({ project }: { project: Project }) {
  const router = useRouter();
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [modalApi, setModalApi] = useState<CarouselApi | null>(null);

  useEffect(() => {
    if (modalApi && selectedImageIndex !== null) {
      modalApi.scrollTo(selectedImageIndex, true);
    }
  }, [modalApi, selectedImageIndex]);

  return (
    <div className="bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 min-h-screen">
      {/* --- Back Button --- */}
      <div className="container max-w-7xl mx-auto px-4 pt-8">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-500 transition-all"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Projects
        </Button>
      </div>

      {/* --- Project Details Card --- */}
      <section className="container max-w-7xl mx-auto px-4 pt-12 pb-24">
        <Card className="overflow-hidden border-none shadow-2xl bg-white/90 dark:bg-gray-900/80 backdrop-blur-xl">
          <CardContent className="p-8 md:p-10">
            <div className="grid lg:grid-cols-5 gap-12 xl:gap-16 items-start">
              {/* Left: Thumbnail & Mini Gallery */}
              <div className="lg:col-span-3 space-y-4">
                <div className="relative aspect-video rounded-2xl overflow-hidden shadow-xl">
                  <Image
                    src={project.thumbnail}
                    alt={project.title}
                    fill
                    priority
                    className="object-cover transition-transform duration-700 hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 60vw"
                  />
                </div>

                {/* --- Mini Preview Gallery --- */}
                {project.demoImages?.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-4">
                    {project.demoImages.slice(0, 4).map((img, i) => (
                      <Dialog key={i} onOpenChange={(open) => !open && setSelectedImageIndex(null)}>
                        <DialogTrigger asChild>
                          <div
                            onClick={() => setSelectedImageIndex(i)}
                            className="relative aspect-video rounded-lg overflow-hidden cursor-pointer group"
                          >
                            <Image
                              src={img}
                              alt={`Preview ${i + 1}`}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <ZoomIn className="h-5 w-5 text-white" />
                            </div>
                          </div>
                        </DialogTrigger>
                        <DialogContent className="max-w-6xl p-0 border-none bg-transparent shadow-none">
                          <Carousel setApi={setModalApi} opts={{ loop: true, align: "center" }}>
                            <CarouselContent>
                              {project.demoImages.map((url, j) => (
                                <CarouselItem key={j}>
                                  <div className="relative aspect-video">
                                    <Image
                                      src={url}
                                      alt={`Screenshot ${j + 1}`}
                                      fill
                                      className="object-contain rounded-xl"
                                    />
                                  </div>
                                </CarouselItem>
                              ))}
                            </CarouselContent>
                            <CarouselPrevious className="left-2" />
                            <CarouselNext className="right-2" />
                          </Carousel>
                        </DialogContent>
                      </Dialog>
                    ))}

                    {project.demoImages.length > 4 && (
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setSelectedImageIndex(0)}
                        className="rounded-lg flex items-center justify-center"
                      >
                        <Images className="h-5 w-5" />
                      </Button>
                    )}
                  </div>
                )}
              </div>

              {/* Right: Project Info */}
              <div className="lg:col-span-2 space-y-6">
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-snug">
                  {project.title}
                </h1>

                <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
                  {project.description}
                </p>

                {/* Meta Info */}
                <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-gray-500 dark:text-gray-400 border-t dark:border-gray-700 pt-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-red-500" />
                    <span>{format(new Date(project.createdAt), "MMMM d, yyyy")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-red-500" />
                    <span>Updated {format(new Date(project.updatedAt), "MMM d, yyyy")}</span>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  {project.liveUrl && (
                    <Button
                      size="lg"
                      className="bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/20"
                      onClick={() => window.open(project.liveUrl, "_blank")}
                    >
                      <Globe className="h-4 w-4 mr-2" /> Live Demo
                    </Button>
                  )}
                  {project.repoUrl && (
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                      onClick={() => window.open(project.repoUrl, "_blank")}
                    >
                      <Code2 className="h-4 w-4 mr-2" /> Source Code
                    </Button>
                  )}
                </div>

                {/* Features */}
                {project.features?.length > 0 && (
                  <div className="pt-6 border-t dark:border-gray-700">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      Key Features
                    </h3>
                    <ul className="space-y-2">
                      {project.features.map((f, i) => (
                        <li key={i} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                          <ChevronRight className="h-4 w-4 text-red-500 mt-1" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Tech Stack */}
                {project.techStack?.length > 0 && (
                  <div className="pt-6">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                      Technologies Used
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {project.techStack.map((tech) => (
                        <Badge
                          key={tech}
                          className="bg-gray-900 text-white dark:bg-white dark:text-gray-900 rounded-full px-3 py-1 text-sm font-medium"
                        >
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* --- CTA Footer --- */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-gray-100/80 to-white/90 dark:from-gray-900/50 dark:to-gray-950/50 text-center border-t dark:border-gray-800">
        <div className="container max-w-4xl mx-auto px-4">
          <h3 className="text-3xl md:text-4xl font-semibold text-gray-900 dark:text-white mb-4">
            Like what you see?
          </h3>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed">
            Discover more projects or collaborate with us to build something extraordinary.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              size="lg"
              variant="outline"
              className="border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => router.push("/projects")}
            >
              All Projects
            </Button>
            <Button
              size="lg"
              className="bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/20"
              onClick={() => router.push("/contact")}
            >
              Contact
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
