// src/app/(public)/projects/[slug]/page.tsx
import React from "react";
import { notFound } from "next/navigation";

import {type Project } from "@/types";
import ProjectClientView from "@/components/modules/projects/projectClientView";



async function getProject(slug: string): Promise<Project | null> {
  try {
   
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects/${slug}`, {
      cache: "no-store", 
    });

    if (!res.ok) {
      return null;
    }
    
    const data = await res.json();
    return data.data;

  } catch (err) {
    console.error("Failed to fetch project:", err);
    return null;
  }
}

export default async function SingleProjectPage({ params }: { params: { slug: string } }) {
  
 
  const project = await getProject(params.slug);


  if (!project) {
    notFound();
  }


  return <ProjectClientView project={project} />;
}