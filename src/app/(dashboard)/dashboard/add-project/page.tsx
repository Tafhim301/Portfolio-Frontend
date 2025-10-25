'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Upload, X, Loader2, Plus } from 'lucide-react';
import { toast } from 'sonner';

import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

const projectSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  liveUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  repoUrl: z.string().url('Invalid GitHub URL').optional().or(z.literal('')),
  techStack: z.array(z.string()).min(1, 'Add at least one technology'),
  features: z.array(z.string()).min(1, 'Add at least one feature'),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

export default function AddProjects() {
  const router = useRouter();
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [demoImages, setDemoImages] = useState<File[]>([]);
  const [techInput, setTechInput] = useState('');
  const [featureInput, setFeatureInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors, isDirty },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: '',
      description: '',
      liveUrl: '',
      repoUrl: '',
      techStack: [],
      features: [],
    },
  });

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // Add Technology
  const handleAddTech = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && techInput.trim()) {
      e.preventDefault();
      const current = getValues('techStack');
      const newTech = techInput.trim();
      if (!current.includes(newTech)) {
        setValue('techStack', [...current, newTech], { shouldValidate: true });
      }
      setTechInput('');
    }
  };

  const removeTech = (tech: string) => {
    setValue(
      'techStack',
      getValues('techStack').filter((t) => t !== tech),
      { shouldValidate: true }
    );
  };

  // Add Feature
  const handleAddFeature = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && featureInput.trim()) {
      e.preventDefault();
      const current = getValues('features');
      const newFeat = featureInput.trim();
      if (!current.includes(newFeat)) {
        setValue('features', [...current, newFeat], { shouldValidate: true });
      }
      setFeatureInput('');
    }
  };

  const removeFeature = (feat: string) => {
    setValue(
      'features',
      getValues('features').filter((f) => f !== feat),
      { shouldValidate: true }
    );
  };

  // File Handlers
  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error('Thumbnail must be under 10MB');
        return;
      }
      setThumbnail(file);
    }
  };

  const handleDemoImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter((f) => f.size <= 10 * 1024 * 1024);
    if (validFiles.length < files.length) {
      toast.error('Some images skipped (max 10MB each)');
    }
    setDemoImages((prev) => [...prev, ...validFiles]);
  };

  const removeDemoImage = (index: number) => {
    setDemoImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Submit
  const onSubmit = async (data: ProjectFormValues) => {
    if (!thumbnail) {
      toast.error('Thumbnail image is required');
      return;
    }

    if (!API_URL) {
      toast.error('API URL not configured');
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('thumbnail', thumbnail);
    demoImages.forEach((img) => formData.append('demoImages', img));

    // Match Prisma model exactly
    formData.append('data', JSON.stringify({ project: data }));

    try {
      const res = await fetch(`${API_URL}/projects`, {
        method: 'POST',
        credentials : "include",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to create project');
      }

      toast.success('Project created successfully!');
      router.push('/manage-blogs');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <Card className="bg-white border border-gray-200 shadow-xl text-gray-900">
          <CardHeader className="pb-6">
            <CardTitle className="text-3xl font-bold text-center text-gray-900">
              Add New Project
            </CardTitle>
          </CardHeader>

          <CardContent className="pb-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 mt-6">

              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Title *</label>
                <Input
                  {...register('title')}
                  placeholder="AI Image Enhancer"
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description *</label>
                <Textarea
                  {...register('description')}
                  rows={4}
                  placeholder="An AI-powered web app that improves and upscales low-resolution images..."
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 resize-none"
                />
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
              </div>

              {/* URLs */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Live URL</label>
                  <Input
                    {...register('liveUrl')}
                    placeholder="https://ai-image-enhancer.vercel.app"
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                  {errors.liveUrl && <p className="text-red-500 text-sm mt-1">{errors.liveUrl.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">GitHub URL</label>
                  <Input
                    {...register('repoUrl')}
                    placeholder="https://github.com/tafhimul/ai-image-enhancer"
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                  {errors.repoUrl && <p className="text-red-500 text-sm mt-1">{errors.repoUrl.message}</p>}
                </div>
              </div>

              {/* Tech Stack */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Tech Stack *</label>
                <Input
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  onKeyDown={handleAddTech}
                  placeholder="Press Enter to add (e.g., Next.js, Node.js)"
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
                <div className="flex flex-wrap gap-2 mt-3">
                  {getValues('techStack').map((tech) => (
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
                {errors.techStack && <p className="text-red-500 text-sm mt-1">{errors.techStack.message}</p>}
              </div>

              {/* Features */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Features *</label>
                <Input
                  value={featureInput}
                  onChange={(e) => setFeatureInput(e.target.value)}
                  onKeyDown={handleAddFeature}
                  placeholder="Press Enter to add (e.g., Image upscaling up to 4x)"
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
                <div className="flex flex-wrap gap-2 mt-3">
                  {getValues('features').map((feat) => (
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
                {errors.features && <p className="text-red-500 text-sm mt-1">{errors.features.message}</p>}
              </div>

              {/* Thumbnail */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Thumbnail Image *</label>
                <div className="border-2 border-dashed border-gray-300 p-6 rounded-xl text-center hover:border-blue-400 transition">
                  {thumbnail ? (
                    <div className="flex justify-center items-center gap-4">
                      <div className="relative w-32 h-32 rounded-lg overflow-hidden shadow-md">
                        <Image
                          src={URL.createObjectURL(thumbnail)}
                          alt="Thumbnail Preview"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        type="button"
                        onClick={() => setThumbnail(null)}
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
                </div>
              </div>

              {/* Demo Images */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Demo Images (Optional)</label>
                <div className="border-2 border-dashed border-gray-300 p-6 rounded-xl">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {demoImages.map((img, idx) => (
                      <div key={idx} className="relative group rounded-lg overflow-hidden shadow">
                        <Image
                          src={URL.createObjectURL(img)}
                          alt={`Demo ${idx + 1}`}
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
                  disabled={isSubmitting || !thumbnail || !isDirty}
                  className={cn(
                    'bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 px-6',
                    (isSubmitting || !thumbnail || !isDirty) && 'opacity-60 cursor-not-allowed'
                  )}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Creating...
                    </>
                  ) : (
                    'Create Project'
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