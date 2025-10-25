"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload, X, Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const projectSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  liveUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  repoUrl: z.string().url("Invalid GitHub URL").optional().or(z.literal("")),
  techStack: z.array(z.string()).min(1, "Add at least one technology"),
  features: z.array(z.string()).min(1, "Add at least one feature"),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

export default function UpdateProjectPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug as string;
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [demoImages, setDemoImages] = useState<File[]>([]);
  const [existingThumbnail, setExistingThumbnail] = useState<string | null>(null);
  const [existingDemoImages, setExistingDemoImages] = useState<string[]>([]);
  const [techInput, setTechInput] = useState("");
  const [featureInput, setFeatureInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [id, setId] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    reset,
    formState: { errors },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: "",
      description: "",
      liveUrl: "",
      repoUrl: "",
      techStack: [],
      features: [],
    },
  });

  useEffect(() => {
    const fetchProject = async () => {
      if (!slug || !API_URL) return;
      setIsLoading(true);
      try {
        const res = await fetch(`${API_URL}/projects/${slug}`, {
          credentials: "include",
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to load project");

        const project = data?.data;
        setId(project.id);

        reset({
          title: project.title,
          description: project.description,
          liveUrl: project.liveUrl || "",
          repoUrl: project.repoUrl || "",
          techStack: project.techStack || [],
          features: project.features || [],
        });
        setExistingThumbnail(project.thumbnail || null);
        setExistingDemoImages(project.demoImages || []);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch project");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProject();
  }, [slug, API_URL, reset]);

  const handleAddTech = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && techInput.trim()) {
      e.preventDefault();
      const current = getValues("techStack");
      const newTech = techInput.trim();
      if (!current.includes(newTech)) {
        setValue("techStack", [...current, newTech], { shouldValidate: true });
      }
      setTechInput("");
    }
  };

  const removeTech = (tech: string) => {
    setValue(
      "techStack",
      getValues("techStack").filter((t) => t !== tech),
      { shouldValidate: true }
    );
  };

  const handleAddFeature = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && featureInput.trim()) {
      e.preventDefault();
      const current = getValues("features");
      const newFeat = featureInput.trim();
      if (!current.includes(newFeat)) {
        setValue("features", [...current, newFeat], { shouldValidate: true });
      }
      setFeatureInput("");
    }
  };

  const removeFeature = (feat: string) => {
    setValue(
      "features",
      getValues("features").filter((f) => f !== feat),
      { shouldValidate: true }
    );
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Thumbnail must be under 10MB");
        return;
      }
      setThumbnail(file);
      setExistingThumbnail(null);
    }
  };

  const handleDemoImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter((f) => f.size <= 10 * 1024 * 1024);
    if (validFiles.length < files.length)
      toast.error("Some images skipped (max 10MB each)");
    setDemoImages((prev) => [...prev, ...validFiles]);
  };

  const removeDemoImage = (index: number) => {
    if (demoImages.length + existingDemoImages.length <= 1) {
      toast.error("At least one demo image is required");
      return;
    }
    setDemoImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingDemoImage = (index: number) => {
    if (demoImages.length + existingDemoImages.length <= 1) {
      toast.error("At least one demo image is required");
      return;
    }
    setExistingDemoImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeThumbnail = () => {
    if (!thumbnail && !existingThumbnail) {
      toast.error("Thumbnail is required");
      return;
    }
    setThumbnail(null);
    setExistingThumbnail(null);
  };

  const hasThumbnail = !!thumbnail || !!existingThumbnail;
  const hasDemoImages = existingDemoImages.length + demoImages.length > 0;
  const isFormValid = hasThumbnail && hasDemoImages;

  const onSubmit = async (data: ProjectFormValues) => {
    if (!API_URL) {
      toast.error("API URL not configured");
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    if (thumbnail) formData.append("thumbnail", thumbnail);
    demoImages.forEach((img) => formData.append("demoImages", img));

    formData.append(
      "data",
      JSON.stringify({
        project: {
          ...data,
        },
        existingThumbnail,
        existingDemoImages,
      })
    );

    try {
      const res = await fetch(`${API_URL}/projects/${id}`, {
        method: "PATCH",
        credentials: "include",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to update project");
      }

      toast.success("Project updated successfully!");
      router.push("/dashboard/manage-projects");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Update error:", error);
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-6 w-6 animate-spin text-gray-600" />
        <p className="ml-2 text-gray-600">Loading project...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <Card className="bg-white border py-2 border-gray-200 shadow-xl text-gray-900">
          <CardHeader className="pb-6">
            <CardTitle className="text-3xl font-bold text-center text-gray-900">
              Update Project
            </CardTitle>
          </CardHeader>

          <CardContent className="pb-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 mt-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Title *
                </label>
                <Input {...register("title")} placeholder="Project title" />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description *
                </label>
                <Textarea
                  {...register("description")}
                  rows={4}
                  placeholder="Project description"
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.description.message}
                  </p>
                )}
              </div>

              {/* URLs */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Live URL
                  </label>
                  <Input {...register("liveUrl")} placeholder="https://example.vercel.app" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    GitHub URL
                  </label>
                  <Input {...register("repoUrl")} placeholder="https://github.com/..." />
                </div>
              </div>

              {/* Tech Stack */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tech Stack *
                </label>
                <Input
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  onKeyDown={handleAddTech}
                  placeholder="Press Enter to add (e.g., React, Node.js)"
                />
                <div className="flex flex-wrap gap-2 mt-3">
                  {getValues("techStack").map((tech) => (
                    <span
                      key={tech}
                      className="inline-flex items-center bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-full text-sm font-medium"
                    >
                      {tech}
                      <button
                        type="button"
                        onClick={() => removeTech(tech)}
                        className="ml-2 text-indigo-700 hover:text-indigo-900"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Features *
                </label>
                <Input
                  value={featureInput}
                  onChange={(e) => setFeatureInput(e.target.value)}
                  onKeyDown={handleAddFeature}
                  placeholder="Press Enter to add (e.g., Dark mode)"
                />
                <div className="flex flex-wrap gap-2 mt-3">
                  {getValues("features").map((feat) => (
                    <span
                      key={feat}
                      className="inline-flex items-center bg-green-100 text-green-700 px-3 py-1.5 rounded-full text-sm font-medium"
                    >
                      {feat}
                      <button
                        type="button"
                        onClick={() => removeFeature(feat)}
                        className="ml-2 text-green-700 hover:text-green-900"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Thumbnail */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Thumbnail Image *
                </label>
                <div className="border-2 border-dashed border-gray-300 p-6 rounded-xl text-center">
                  {existingThumbnail || thumbnail ? (
                    <div className="flex justify-center items-center gap-4">
                      <div className="relative w-32 h-32 rounded-lg overflow-hidden shadow-md">
                        <Image
                          src={thumbnail ? URL.createObjectURL(thumbnail) : existingThumbnail!}
                          alt="Thumbnail"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        type="button"
                        onClick={removeThumbnail}
                      >
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <label className="cursor-pointer flex flex-col items-center">
                      <Upload className="w-10 h-10 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-600">
                        Click to upload thumbnail (max 10MB)
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleThumbnailChange}
                        className="hidden"
                      />
                    </label>
                  )}
                  {!hasThumbnail && (
                    <p className="text-red-500 text-sm mt-1">Thumbnail is required</p>
                  )}
                </div>
              </div>

        
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Demo Images *
                </label>
                <div className="border-2 border-dashed border-gray-300 p-6 rounded-xl">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {existingDemoImages.map((img, idx) => (
                      <div key={idx} className="relative group rounded-lg overflow-hidden shadow">
                        <Image
                          src={img}
                          alt={`Demo ${idx + 1}`}
                          width={200}
                          height={200}
                          className="object-cover w-full h-32"
                        />
                        <button
                          type="button"
                          onClick={() => removeExistingDemoImage(idx)}
                          className="absolute top-1 right-1 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    {demoImages.map((img, idx) => (
                      <div key={idx} className="relative group rounded-lg overflow-hidden shadow">
                        <Image
                          src={URL.createObjectURL(img)}
                          alt={`New Demo ${idx + 1}`}
                          width={200}
                          height={200}
                          className="object-cover w-full h-32"
                        />
                        <button
                          type="button"
                          onClick={() => removeDemoImage(idx)}
                          className="absolute top-1 right-1 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <label className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg h-32 cursor-pointer hover:border-blue-400 transition">
                      <Plus className="w-6 h-6 text-gray-400" />
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleDemoImagesChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                  {!hasDemoImages && (
                    <p className="text-red-500 text-sm mt-1">
                      At least one demo image is required
                    </p>
                  )}
                </div>
              </div>

              {/* Submit */}
              <div className="flex justify-center pt-6 gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 px-6"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || !isFormValid}
                  className={cn(
                    "bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 px-6",
                    (isSubmitting || !isFormValid) && "opacity-60 cursor-not-allowed"
                  )}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Updating...
                    </>
                  ) : (
                    "Update Project"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
