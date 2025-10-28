"use client";

import React, { useEffect, useRef, useState } from "react";
import "react-quill-new/dist/quill.snow.css";
import ReactQuill from "react-quill-new";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";

const blogSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  excerpt: z.string().min(20, "Excerpt must be at least 20 characters"),
  content: z.string().min(1, "Content is required"),
  tags: z.string().optional(),
});

type BlogFormValues = z.infer<typeof blogSchema> & {
  coverFile?: File | null;
};

type Props = {
  mode: "create" | "edit";
  blogId?: string;
  slug?: string;
  initial?: {
    title?: string;
    excerpt?: string;
    content?: string;
    tags?: string[];
    coverImage?: string;
  };
  autosaveKey?: string;
};

export default function AdvancedBlogForm({
  mode,
  blogId,
  initial,
  autosaveKey = "blog:draft",
}: Props) {

  const quillRef = useRef<ReactQuill | null>(null);
  const [loading, setLoading] = useState(false);
  const [coverPreview, setCoverPreview] = useState<string | undefined>(
    initial?.coverImage
  );
  const [wordCount, setWordCount] = useState(0);
  const router = useRouter()

  const form = useForm<BlogFormValues>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: initial?.title || "",
      excerpt: initial?.excerpt || "",
      content: initial?.content || "",
      tags: initial?.tags?.join(", ") || "",
      coverFile: null,
    },
  });

useEffect(() => {
  const sub = form.watch((value, { name }) => {
    if (name === "content" && typeof document !== "undefined") {
      const tmp = document.createElement("div");
      tmp.innerHTML = value.content || "";
      const text = tmp.textContent || tmp.innerText || "";
      setWordCount(text.trim().split(/\s+/).filter(Boolean).length);
    }
  });
  return () => sub.unsubscribe();
}, [form]);

useEffect(() => {
  if (mode !== "create" || typeof window === "undefined") return;

  const interval = setInterval(() => {
    const values = form.getValues();
    const payload = {
      title: values.title,
      excerpt: values.excerpt,
      content: values.content,
      tags: values.tags,
      coverImage: coverPreview,
    };
    localStorage.setItem(autosaveKey, JSON.stringify(payload));
  }, 5000);
  return () => clearInterval(interval);
}, [form, coverPreview, autosaveKey, mode]);

  useEffect(() => {

    if (mode !== "create") return;

    const interval = setInterval(() => {
      const values = form.getValues();
      const payload = {
        title: values.title,
        excerpt: values.excerpt,
        content: values.content,
        tags: values.tags,
        coverImage: coverPreview,
      };
      localStorage.setItem(autosaveKey, JSON.stringify(payload));
    }, 5000);
    return () => clearInterval(interval);
  }, [form, coverPreview, autosaveKey, mode]);




  const onSubmit = async (values: BlogFormValues) => {
    if (!values.content || values.content === "<p><br></p>") {
      toast.error("Content cannot be empty");
      return;
    }

    setLoading(true);
    try {
      const delta = quillRef.current?.getEditor().getContents();
      const contentToSend = JSON.stringify(delta);

      const blogData = {
        blog: {
          title: values.title,
          excerpt: values.excerpt,
          content: contentToSend,
          tags: values.tags ? values.tags.split(",").map((t) => t.trim()) : [],
        },
      };


      const coverFile = form.getValues("coverFile");

      const formData = new FormData();
      if (coverFile) {
        formData.append("file", coverFile);
      }
      formData.append("data", JSON.stringify(blogData));

      const url =
        mode === "create"
          ? `${process.env.NEXT_PUBLIC_API_URL}/blogs`
          : `${process.env.NEXT_PUBLIC_API_URL}/blogs/${blogId}`;

      const res = await fetch(url, {
        method: mode === "create" ? "POST" : "PATCH",
        credentials: "include",
        body: formData,
      });



      const payload = await res.json();

      if (!res.ok) {
        toast.error(payload?.message || "Failed to save blog");
        return;
      }

      if (mode === "create") {
        localStorage.removeItem(autosaveKey)

      };
      toast.success(mode === "create" ? "Blog created" : "Blog updated");
      await fetch("/api/revalidate", {
        method: "POST",
        body: JSON.stringify({ path: "/blogs" }),
      });
      router.push(mode === "create" ? "/blogs" : `/blogs/${payload?.data?.slug}`)
    } catch (err) {
      console.error(err);
      toast.error("Unexpected error saving blog");
    } finally {
      setLoading(false);
    }
  };

  const handleCoverChange = (file?: File | null) => {
    if (!file) {
      setCoverPreview(initial?.coverImage);
      return;
    }
    setCoverPreview(URL.createObjectURL(file));
  };

  return (
    <div className="min-h-screen w-full flex items-end justify-center">
      <div className="w-full max-w-4xl bg-white rounded-md shadow-sm p-4 sm:p-6">
        <h2 className="text-2xl font-semibold mb-4">
          {mode === "create" ? "Create Blog" : "Edit Blog"}
        </h2>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Write a compelling title..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Excerpt */}
            <FormField
              control={form.control}
              name="excerpt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Excerpt</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Short summary for listings (20+ chars)"
                      className="h-24"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Content */}
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <div
                      className="border rounded-md overflow-hidden
                                ring-offset-background focus-within:outline-none 
                                focus-within:ring-2 focus-within:ring-ring 
                                focus-within:ring-offset-2"
                    >
                      <ReactQuill
                        ref={quillRef}
                        value={field.value}
                        onChange={field.onChange}
                        theme="snow"
                        placeholder="Write your article..."
                        className="[&_.ql-container]:border-none [&_.ql-toolbar]:border-x-0 
                                 [&_.ql-toolbar]:border-t-0 [&_.ql-toolbar]:border-b"
                      />
                    </div>
                  </FormControl>
                  <div className="flex items-center justify-between mt-2">
                    <FormMessage />
                    <div className="text-sm text-muted-foreground">
                      {wordCount} words • {Math.max(1, Math.ceil(wordCount / 200))}{" "}
                      min read
                    </div>
                  </div>
                </FormItem>
              )}
            />

            {/* Tags */}
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <Input placeholder="react, nextjs, development" {...field} />
                  </FormControl>
                  <FormDescription>
                    Separate tags with a comma.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Cover Image */}
            <FormItem>
              <FormLabel>Cover Image</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  className="file:text-foreground"
                  onChange={(e) => {
                    const f = e.target.files?.[0] ?? null;
                    form.setValue("coverFile", f);
                    handleCoverChange(f);
                  }}
                />
              </FormControl>
              <div className="mt-3">
                {coverPreview ? (
                  <div className="w-56 h-32 relative rounded-md overflow-hidden border">
                    <Image
                      src={coverPreview}
                      alt="cover preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">
                    No cover selected
                  </div>
                )}
              </div>
            </FormItem>

            {/* Buttons */}
            <div className="flex items-center gap-3">
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {loading
                  ? mode === "create"
                    ? "Creating..."
                    : "Updating..."
                  : mode === "create"
                    ? "Create Blog"
                    : "Update Blog"}
              </Button>

              {mode === "create" && (
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => {
                    localStorage.removeItem(autosaveKey);
                    form.reset({
                      title: "",
                      excerpt: "",
                      content: "",
                      tags: "",
                      coverFile: null,
                    });
                    setCoverPreview(undefined);
                    toast.success("Draft cleared");
                  }}
                >
                  Clear Draft
                </Button>
              )}
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
