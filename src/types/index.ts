
export interface Project {
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
  updatedAt: string;
}