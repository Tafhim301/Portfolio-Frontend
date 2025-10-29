/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import Image from "next/image";
import { Plus, X, Loader2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

const projectSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(50, "Description must be at least 50 characters"),
  liveUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  repoUrl: z.string().url("Invalid GitHub URL").optional().or(z.literal("")),
  techStack: z.array(z.string()).min(1, "Add at least one technology"),
  features: z.array(z.string()).min(1, "Add at least one feature"),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

type Props = {
  mode: "create" | "edit";
  projectId?: string;
  slug?: string;
  initial?: {
    title?: string;
    description?: string;
    liveUrl?: string;
    repoUrl?: string;
    techStack?: string[];
    features?: string[];
    thumbnail?: string;
    demoImages?: string[];
  };
  autosaveKey?: string;
};

export default function ProjectForm({
  mode,
  projectId,
  slug,
  initial,
  autosaveKey = "project:draft",
}: Props) {
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const quillRef = useRef<ReactQuill | null>(null);
  const [isLoading, setIsLoading] = useState(!!slug);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | undefined>(
    initial?.thumbnail
  );
  const [demoImages, setDemoImages] = useState<File[]>([]);
  const [demoPreviews, setDemoPreviews] = useState<string[]>(initial?.demoImages || []);
  const [techInput, setTechInput] = useState("");
  const [featureInput, setFeatureInput] = useState("");
  const [wordCount, setWordCount] = useState(0);

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: initial?.title || "",
      description: initial?.description || "",
      liveUrl: initial?.liveUrl || "",
      repoUrl: initial?.repoUrl || "",
      techStack: initial?.techStack || [],
      features: initial?.features || [],
    },
  });

  // Watch description word count
  useEffect(() => {
    const sub = form.watch((value) => {
      const text = (value.description || "").replace(/<[^>]*>/g, " ").trim();
      setWordCount(text.split(/\s+/).filter(Boolean).length);
    });
    return () => sub.unsubscribe();
  }, [form]);

  // Autosave draft in create mode
  useEffect(() => {
    if (mode !== "create") return;

    const interval = setInterval(() => {
      const values = form.getValues();
      const payload = {
        ...values,
        thumbnail: thumbnailPreview,
        demoImages: demoPreviews,
      };
      localStorage.setItem(autosaveKey, JSON.stringify(payload));
    }, 5000);
    return () => clearInterval(interval);
  }, [form, thumbnailPreview, demoPreviews, autosaveKey, mode]);

  // Fetch project for edit mode
  useEffect(() => {
    if (mode !== "edit" || !slug || !API_URL) return;

    const fetchProject = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`${API_URL}/projects/${slug}`, { credentials: "include" });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to load project");

        const project = data.data;
        form.reset({
          title: project.title,
          description: project.description,
          liveUrl: project.liveUrl || "",
          repoUrl: project.repoUrl || "",
          techStack: project.techStack || [],
          features: project.features || [],
        });
        setThumbnailPreview(project.thumbnail);
        setDemoPreviews(project.demoImages || []);
      } catch (err: any) {
        console.error(err);
        toast.error("Failed to fetch project data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProject();
  }, [slug, API_URL, form, mode]);

  // Thumbnail handlers
  const handleThumbnailChange = (file: File | null) => {
    if (!file) {
      setThumbnail(null);
      setThumbnailPreview(initial?.thumbnail);
      return;
    }
    if (file.size > 10 * 1024 * 1024) return toast.error("Thumbnail must be under 10MB");
    setThumbnail(file);
    setThumbnailPreview(URL.createObjectURL(file));
  };

  // Demo images handlers
  const handleDemoImagesChange = (files: FileList | null) => {
    if (!files) return;
    const validFiles = Array.from(files).filter((f) => f.size <= 10 * 1024 * 1024);
    if (validFiles.length < files.length) toast.error("Some images skipped (max 10MB each)");
    setDemoImages((prev) => [...prev, ...validFiles]);
    setDemoPreviews((prev) => [...prev, ...validFiles.map((f) => URL.createObjectURL(f))]);
  };
  const removeDemoImage = (index: number) => {
    setDemoImages((prev) => prev.filter((_, i) => i !== index));
    setDemoPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // Tech & Feature handlers
  const addTech = () => {
    if (techInput.trim() && !form.getValues("techStack").includes(techInput.trim())) {
      form.setValue("techStack", [...form.getValues("techStack"), techInput.trim()], { shouldValidate: true });
      setTechInput("");
    }
  };
  const removeTech = (t: string) => {
    form.setValue("techStack", form.getValues("techStack").filter((x) => x !== t), { shouldValidate: true });
  };
  const addFeature = () => {
    if (featureInput.trim() && !form.getValues("features").includes(featureInput.trim())) {
      form.setValue("features", [...form.getValues("features"), featureInput.trim()], { shouldValidate: true });
      setFeatureInput("");
    }
  };
  const removeFeature = (f: string) => {
    form.setValue("features", form.getValues("features").filter((x) => x !== f), { shouldValidate: true });
  };

  const onSubmit = async (data: ProjectFormValues) => {
    if (mode === "create" && !thumbnail) return toast.error("Thumbnail is required");
    if (!API_URL) return toast.error("API URL not configured");

    setIsSubmitting(true);
    const formData = new FormData();
    if (thumbnail) formData.append("thumbnail", thumbnail);
    demoImages.forEach((img) => formData.append("demoImages", img));
    formData.append("data", JSON.stringify({ project: data }));

    try {
      const url = mode === "create" ? `${API_URL}/projects` : `${API_URL}/projects/${projectId}`;
      const res = await fetch(url, {
        method: mode === "create" ? "POST" : "PATCH",
        credentials: "include",
        body: formData,
      });
      const payload = await res.json();
      if (!res.ok) throw new Error(payload.message || "Failed to save project");

      if (mode === "create") localStorage.removeItem(autosaveKey);
      toast.success(mode === "create" ? "Project created!" : "Project updated!");
      router.push(mode === "create" ? "/dashboard/manage-projects" : `/projects/${payload.data.slug}`);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin mr-2" /> Loading project data...
      </div>
    );

  return (
    <div className="min-h-screen flex items-start justify-center py-8 px-4">
      <div className="w-full max-w-4xl bg-white rounded-md shadow-sm p-6">
        <h2 className="text-2xl font-semibold mb-6">
          {mode === "create" ? "Add New Project" : "Edit Project"}
        </h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

            {/* Title */}
            <FormField control={form.control} name="title" render={({ field }) => (
              <FormItem>
                <FormLabel>Title *</FormLabel>
                <FormControl>
                  <Input placeholder="My Next.js Portfolio" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            {/* Description */}
            <FormField control={form.control} name="description" render={({ field }) => (
              <FormItem>
                <FormLabel>Description *</FormLabel>
                <FormControl>
                  <ReactQuill
                    ref={quillRef}
                    theme="snow"
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Describe your project in detail..."
                    className="h-64 [&_.ql-container]:h-52 [&_.ql-editor]:min-h-52"
                  />
                </FormControl>
                <div className="text-sm text-muted-foreground text-right">{wordCount} words</div>
                <FormMessage />
              </FormItem>
            )} />

            {/* URLs */}
            <div className="grid md:grid-cols-2 gap-6">
              <FormField control={form.control} name="liveUrl" render={({ field }) => (
                <FormItem>
                  <FormLabel>Live URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://yourapp.vercel.app" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="repoUrl" render={({ field }) => (
                <FormItem>
                  <FormLabel>GitHub Repo</FormLabel>
                  <FormControl>
                    <Input placeholder="https://github.com/..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            {/* Tech Stack */}
            <FormField control={form.control} name="techStack" render={({ field }) => (
              <FormItem>
                <FormLabel>Tech Stack *</FormLabel>
                <FormControl>
                  <div className="flex gap-2">
                    <Input
                      value={techInput}
                      onChange={(e) => setTechInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTech())}
                      placeholder="Press Enter to add"
                    />
                    <Button type="button" onClick={addTech} size="icon">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </FormControl>
                <div className="flex flex-wrap gap-2 mt-2">
                  {field.value.map((tech) => (
                    <Badge key={tech} variant="secondary">
                      {tech}
                      <button type="button" onClick={() => removeTech(tech)} className="ml-2">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )} />

            {/* Features */}
            <FormField control={form.control} name="features" render={({ field }) => (
              <FormItem>
                <FormLabel>Key Features *</FormLabel>
                <FormControl>
                  <div className="flex gap-2">
                    <Input
                      value={featureInput}
                      onChange={(e) => setFeatureInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())}
                      placeholder="Press Enter to add"
                    />
                    <Button type="button" onClick={addFeature} size="icon">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </FormControl>
                <div className="flex flex-wrap gap-2 mt-2">
                  {field.value.map((feat) => (
                    <Badge key={feat} variant="secondary">
                      {feat}
                      <button type="button" onClick={() => removeFeature(feat)} className="ml-2">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )} />

            {/* Thumbnail */}
            <FormItem>
              <FormLabel>Thumbnail *</FormLabel>
              <FormControl>
                {thumbnailPreview ? (
                  <div className="flex items-center gap-4">
                    <div className="w-40 h-40 relative rounded-md overflow-hidden border">
                      <Image src={thumbnailPreview} alt="Thumbnail" fill className="object-cover" />
                    </div>
                    <Button variant="destructive" type="button" onClick={() => handleThumbnailChange(null)}>Remove</Button>
                  </div>
                ) : (
                  <label className="cursor-pointer flex flex-col items-center border-2 border-dashed p-6 rounded-md">
                    Click to upload
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleThumbnailChange(e.target.files?.[0] || null)} />
                  </label>
                )}
              </FormControl>
            </FormItem>

            {/* Demo Images */}
            <FormItem>
              <FormLabel>Demo Images</FormLabel>
              <FormControl>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {demoPreviews.map((src, i) => (
                    <div key={i} className="relative group rounded-md overflow-hidden">
                      <Image src={src} alt={`Demo ${i+1}`} width={200} height={150} className="object-cover w-full h-32" />
                      <button type="button" onClick={() => removeDemoImage(i)} className="absolute top-1 right-1 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <label className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md h-32 cursor-pointer">
                    <Plus className="w-6 h-6 text-gray-400" />
                    <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleDemoImagesChange(e.target.files)} />
                  </label>
                </div>
              </FormControl>
            </FormItem>

            {/* Buttons */}
            <div className="flex items-center gap-4 pt-6">
              <Button variant="outline" type="button" onClick={() => router.back()}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {mode === "create" ? "Create Project" : "Update Project"}
              </Button>
            </div>

          </form>
        </Form>
      </div>
    </div>
  );
}
