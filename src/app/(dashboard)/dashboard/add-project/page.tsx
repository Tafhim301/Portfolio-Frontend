"use client"
import dynamic from 'next/dynamic';

const ProjectForm = dynamic(
  () => import('@/components/modules/projects/CreateProjectForm'),
  { ssr: false }
);

export default function NewProjectPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-center mb-4">Create New Project</h1>
      <ProjectForm mode='create'/>
    </div>
  );
}