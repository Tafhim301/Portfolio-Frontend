"use client";

import { aboutData } from "@/data/aboutData";
import Image from "next/image";
import React from "react";
import { Mail, LocationEdit } from "lucide-react";

export default function Hero() {
  const { personalInformation, heroRoles } = aboutData;
  const [displayedText, setDisplayedText] = React.useState("");
  const [roleIndex, setRoleIndex] = React.useState(0);
  const [isDeleting, setIsDeleting] = React.useState(false);

  // Typewriter effect for roles
  React.useEffect(() => {
    const currentRole = heroRoles[roleIndex];
    let timeout: NodeJS.Timeout;

    if (!isDeleting && displayedText.length < currentRole.length) {
      timeout = setTimeout(() => {
        setDisplayedText(currentRole.slice(0, displayedText.length + 1));
      }, 120);
    } else if (isDeleting && displayedText.length > 0) {
      timeout = setTimeout(() => {
        setDisplayedText(currentRole.slice(0, displayedText.length - 1));
      }, 80);
    } else if (!isDeleting && displayedText.length === currentRole.length) {
      timeout = setTimeout(() => setIsDeleting(true), 1000);
    } else if (isDeleting && displayedText.length === 0) {
      setIsDeleting(false);
      setRoleIndex((prev) => (prev + 1) % heroRoles.length);
    }

    return () => clearTimeout(timeout);
  }, [displayedText, isDeleting, roleIndex, heroRoles]);

  return (
    <div className="">
      <section className="relative flex flex-col items-center justify-center text-center w-full overflow-hidden text-white px-6 py-10 pt-20
      bg-gradient-to-tr from-black via-gray-900 to-gray-800
      bg-[length:400%_400%] animate-[gradient_15s_ease_infinite]">

      {/* Profile Photo */}
      <div className="mb-6 rounded-full border-4 border-red-600 overflow-hidden w-40 h-40">
        <Image
          src="/profile.jpg"
          alt="Tafhimul Islam"
          width={160}
          height={160}
          className="object-cover"
        />
      </div>

      {/* Name */}
      <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-2">
        {personalInformation.name}
      </h1>

      {/* Typewriter Roles */}
      <div className="text-2xl md:text-4xl font-extrabold mb-6 text-red-500 h-10">
        <span>{displayedText}</span>
        <span className="animate-pulse font-normal">|</span>
      </div>

      {/* Personal Information */}
      <div className="flex flex-col md:flex-row items-center gap-6 mb-6 text-gray-300">
        <div className="flex items-center gap-2">
          <Mail className="h-5 w-5 text-red-500" />
          <span>{personalInformation.email}</span>
        </div>
        <div className="flex items-center gap-2">
          <LocationEdit className="h-5 w-5 text-red-500" />
          <span>{personalInformation.location}</span>
        </div>
      </div>

      {/* Social Links */}
      <div className="flex gap-6 mb-8">
        {personalInformation.socials.map((social) => {
          const Icon = social.icon;
          return (
            <a
              key={social.platform}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-gray-300 hover:text-red-500 transition"
            >
              <Icon className="h-5 w-5" />
              <span className="hidden md:inline">{social.platform}</span>
            </a>
          );
        })}
      </div>

      {/* About / Summary */}
      <p className="max-w-2xl text-gray-300 text-lg md:text-xl mb-8">
        {personalInformation.about}
      </p>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <a
          href="/projects"
          className="px-8 py-4 rounded-xl border border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition"
        >
          View Projects
        </a>
        <a
          href="/contact"
          className="px-8 py-4 rounded-xl bg-red-600 text-white hover:bg-red-700 transition"
        >
          Contact Me
        </a>
      </div>
    </section>
    </div>
  );
}
