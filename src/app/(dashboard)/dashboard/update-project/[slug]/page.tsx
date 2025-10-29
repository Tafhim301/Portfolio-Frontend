
import { notFound } from "next/navigation";
import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";
import ProjectForm from "@/components/modules/projects/CreateProjectForm";



export const revalidate = 0;

async function getProject(slug: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects/${slug}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error("Failed to fetch project for update:", error);
    return null;
  }
}

export default async function UpdateProjectPage({ params }: { params: { slug: string } }) {
  const project = await getProject(params.slug);

  if (!project) return notFound();

  let descriptionHTML = "";
  try {
    const parsed = JSON.parse(project.description);
    if (parsed?.ops) {
      const converter = new QuillDeltaToHtmlConverter(parsed.ops, {});
      descriptionHTML = converter.convert();
    } else {
      descriptionHTML = project.description;
    }
  } catch {
    descriptionHTML = project.description;
  }

  return (
    <section className="py-10 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold mb-6">Edit Project</h1>

      <ProjectForm
        mode="edit"
        projectId={project.id}
        initial={{
          title: project.title,
          description: descriptionHTML,
          liveUrl: project.liveUrl,
          repoUrl: project.repoUrl,
          techStack: project.techStack,
          features: project.features,
          thumbnail: project.thumbnail,
          demoImages: project.demoImages,
        }}
      />
    </section>
  );
}
