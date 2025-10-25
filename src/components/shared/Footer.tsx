import Link from "next/link";
import { Github, Linkedin, Twitter } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative w-full overflow-hidden pt-12 pb-8 text-gray-300">
      {/* Gradient Background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            "linear-gradient(135deg, #0a0a0a 0%, #111111 30%, #1a0000 70%, #2b0000 100%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 sm:px-8 md:px-12 lg:px-20">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
          
          {/* Left Section */}
          <div>
            <h2 className="text-2xl font-bold text-white tracking-wide">
              Tafhimul<span className="text-red-600">.</span>
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              Building meaningful digital experiences.
            </p>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-wrap justify-center md:justify-start gap-6 text-sm font-medium">
            <Link href="/" className="hover:text-red-500 transition-colors">
              Home
            </Link>
            <Link href="/projects" className="hover:text-red-500 transition-colors">
              Projects
            </Link>
            <Link href="/about" className="hover:text-red-500 transition-colors">
              About
            </Link>
            <Link href="/contact" className="hover:text-red-500 transition-colors">
              Contact
            </Link>
          </nav>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            <Link
              href="https://github.com/tafhimul"
              target="_blank"
              className="hover:text-red-500 transition-colors"
            >
              <Github className="w-5 h-5" />
            </Link>
            <Link
              href="https://linkedin.com/in/tafhimul"
              target="_blank"
              className="hover:text-red-500 transition-colors"
            >
              <Linkedin className="w-5 h-5" />
            </Link>
            <Link
              href="https://x.com/tafhimul"
              target="_blank"
              className="hover:text-red-500 transition-colors"
            >
              <Twitter className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Divider + Bottom Text */}
        <div className="border-t border-white/10 mt-8 pt-6 text-center text-xs text-gray-500">
          © {currentYear} Tafhimul Islam. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
