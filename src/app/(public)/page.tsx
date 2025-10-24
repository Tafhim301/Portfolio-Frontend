import Hero from "@/components/modules/Home/Hero";
import ProjectsSection from "@/components/modules/Home/projects";

export default function HomePage() {
  return (
    <div>
      <Hero />
      <h2 className="text-center my-5 text-4xl">Featured Posts</h2>
      <ProjectsSection></ProjectsSection>
    </div>
  );
}
