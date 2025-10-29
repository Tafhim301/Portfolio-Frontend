"use client";

import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";
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
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { format } from "date-fns";
import { Project } from "@/types";
import ScrollDevIcons from "./ScrollDevIcon";

export default function ProjectClientView({ project }: { project: Project }) {
  const router = useRouter();
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [modalApi, setModalApi] = useState<CarouselApi | null>(null);

  useEffect(() => {
    if (modalApi && selectedImageIndex !== null) {
      modalApi.scrollTo(selectedImageIndex, true);
    }
  }, [modalApi, selectedImageIndex]);

  const renderDescription = (desc: string) => {
    try {
      if (desc.trim().startsWith('{"ops":')) {
        const delta = JSON.parse(desc);
        const converter = new QuillDeltaToHtmlConverter(delta.ops, {
          paragraphTag: "p",
          linkTarget: "_blank",
        });
        return { __html: converter.convert() };
      }
    } catch (err) {
      console.warn("Failed to parse Quill delta:", err);
    }
    return { __html: desc };
  };


  return (
    <div className="bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 min-h-screen">
      {/* Back Button */}
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

      {/* Project Details */}
      <section className="container max-w-7xl mx-auto px-4 pt-12 pb-24">
        <Card className="overflow-hidden border-none shadow-2xl bg-white/90 dark:bg-gray-900/80 backdrop-blur-xl">
          <CardContent className="p-8 md:p-10">
            <div className="grid lg:grid-cols-5 gap-12 xl:gap-16 items-start">
              {/* Left - Images */}
              <div className="lg:col-span-3 space-y-6">
                <div className="relative aspect-video rounded-2xl overflow-hidden shadow-xl">
                  <Image
                    src={project.thumbnail}
                    alt={project.title}
                    fill
                    priority
                    className="object-cover transition-transform duration-700 hover:scale-105"
                  />
                </div>

                {/* Mini Gallery */}
                {project.demoImages?.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
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

              {/* Right - Info */}
              <div className="lg:col-span-2 space-y-6">
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-snug">
                  {project.title}
                </h1>

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
                          <ChevronRight className="h-4 w-4 text-red-500 mt-1 flex-shrink-0" />
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

            {/* Description + Right Panel with Gradient + CTA */}
            <div className="grid lg:grid-cols-3 gap-10 py-10 border-t dark:border-gray-800 mt-10">
              {/* Left: Description */}
              <div className="lg:col-span-2">
                <div
                  className=""
                  dangerouslySetInnerHTML={renderDescription(project.description)}
                />
              </div>

              <aside className="lg:col-span-1 relative overflow-hidden rounded-2xl bg-gradient-to-b from-black via-gray-900 to-red-950 p-8 flex flex-col items-center justify-center min-h-[600px] border border-red-500/20">
                {/* Animated Gradient Layers */}
                <div className="absolute inset-0 opacity-40">
                  <div className="absolute top-0 left-0 w-80 h-80 bg-red-600/40 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
                  <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full mix-blend-multiply filter blur-3xl animation-delay-2000"></div>
                  <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-gray-800/40 rounded-full mix-blend-multiply filter blur-3xl animation-delay-4000"></div>
                </div>

                {/* Floating Dev Icons — scroll reactive */}
                <ScrollDevIcons />

                {/* CTA */}
                <div className="relative z-20 mt-10 text-center space-y-4">
                  <div className="flex justify-center">
                    <Sparkles className="h-8 w-8 text-red-500 animate-pulse" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Ready to Build?</h3>
                  <p className="text-sm text-gray-300 max-w-xs mx-auto">
                    Let’s turn your idea into a blazing reality.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                    <Button
                      size="sm"
                      className="bg-red-600 hover:bg-red-700 text-white shadow-lg"
                      onClick={() => router.push("/contact")}
                    >
                      Start a Project
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className=" hover:bg-gray-2000"
                      onClick={() => router.push("/projects")}
                    >
                      More Projects
                    </Button>
                  </div>
                </div>
              </aside>


            </div>
          </CardContent>
        </Card>
      </section>


    </div>
  );
}