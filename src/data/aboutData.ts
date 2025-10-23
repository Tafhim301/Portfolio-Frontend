// src/data/aboutData.ts
import {
  Github,
  Linkedin,
  Mail,
  Code,
  FileCode,
  Terminal,
  Layout,
  Globe,
  Layers,
  Wind,
  FileText,
  Paintbrush,
  Server,
  Settings,
  Network,
  Database,
  GitBranch,
  Code2,
  Send,
  Cloud,
  Image,
  Brain,
  Cpu,
  GitCommit,
  GraduationCap,
  Puzzle,
  Hash,
  Atom,
  Rocket,
  Lightbulb
} from "lucide-react";

export type IconType = React.ComponentType<React.SVGProps<SVGSVGElement>>;

export interface Social {
  platform: string;
  url: string;
  icon: IconType;
}

export interface SkillItem {
  name: string;
  icon: IconType;
}

export interface AboutData {
  personalInformation: {
    name: string;
    title: string;
    location: string;
    email: string;
    about: string;
    socials: Social[];
  };
  professionalSummary: {
    description: string;
  };
  skills: {
    languages: SkillItem[];
    frontend: SkillItem[];
    backend: SkillItem[];
    databases: SkillItem[];
    tools: SkillItem[];
    learning: SkillItem[];
  };
  education: {
    level: string;
    institution: string;
    focus: string[];
    icon: IconType;
  };
  interests: SkillItem[];
  heroRoles : string[]
}

export const aboutData: AboutData = {
  personalInformation: {
    name: "Tafhimul Islam",
    title: "Full-Stack Web Developer & AI Enthusiast",
    location: "Chattogram, Bangladesh",
    email: "tafhimul301@gmail.com",
    about:
      "I'm a passionate web developer who enjoys crafting efficient, scalable, and user-focused digital experiences. I love exploring emerging technologies and using them to solve real-world problems.",
    socials: [
      {
        platform: "GitHub",
        url: "https://github.com/Tafhim301",
        icon: Github,
      },
      {
        platform: "LinkedIn",
        url: "https://www.linkedin.com/in/tafhimul-islam-381913381",
        icon: Linkedin,
      },
      {
        platform: "Email",
        url: "mailto:tafhimul301@gmail.com",
        icon: Mail,
      },
    ],
  },

  professionalSummary: {
    description:
      "Detail-oriented developer with a strong foundation in full-stack web development. Experienced with the MERN stack and TypeScript ecosystem, continuously learning advanced technologies like Next.js and AI integration.",
  },

  skills: {
    languages: [
      { name: "JavaScript", icon: Code },
      { name: "TypeScript", icon: FileCode },
      { name: "C", icon: Terminal },
    ],
    frontend: [
      { name: "React", icon: Layout },
      { name: "Next.js", icon: Globe },
      { name: "Redux Toolkit", icon: Layers },
      { name: "Tailwind CSS", icon: Wind },
      { name: "HTML", icon: FileText },
      { name: "CSS", icon: Paintbrush },
    ],
    backend: [
      { name: "Node.js", icon: Server },
      { name: "Express.js", icon: Settings },
      { name: "REST APIs", icon: Network },
    ],
    databases: [
      { name: "MongoDB", icon: Database },
      { name: "PostgreSQL", icon: Database },
    ],
    tools: [
      { name: "Git", icon: GitBranch },
      { name: "VS Code", icon: Code2 },
      { name: "Postman", icon: Send },
      { name: "Render", icon: Cloud },
      { name: "Cloudinary", icon: Image },
    ],
    learning: [
      { name: "AI & Machine Learning", icon: Brain },
      { name: "Deep Learning", icon: Cpu },
      { name: "System Design", icon: GitCommit },
    ],
  },

  education: {
    level: "Higher-Secondary (Class 11)",
    institution: "Govt. City College, Chattogram",
    focus: ["Physics", "Mathematics", "Computer Science"],
    icon: GraduationCap,
  },

  interests: [
    { name: "Artificial Intelligence", icon: Brain },
    { name: "Machine Learning", icon: Cpu },
    { name: "Game Theory", icon: Puzzle },
    { name: "Number Theory", icon: Hash },
    { name: "Physics & Relativity", icon: Atom },
    { name: "Space Exploration", icon: Rocket },
    { name: "Problem Solving", icon: Lightbulb },
  ],
heroRoles: [ "Learner", "Explorer","Developer", "Full-Stack Dev", "AI Enthusiast"],
};
