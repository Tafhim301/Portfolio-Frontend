"use client";

import { aboutData } from "@/data/aboutData";
import { motion } from "framer-motion";
import { LocationEdit, Mail } from "lucide-react";

export default function AboutPage() {
  const { personalInformation, skills, education, interests } = aboutData;

  return (
    <div className="max-w-6xl mx-auto md:pt-20 p-6 space-y-16">

      {/* Personal Info */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-tr from-black via-gray-900 to-gray-800 text-white rounded-2xl p-8 shadow-xl backdrop-blur-md"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold mb-2">{personalInformation.name}</h1>
        <h2 className="text-xl md:text-2xl font-semibold mb-4 text-red-500">{personalInformation.title}</h2>
        <p className="text-gray-300 mb-6">{personalInformation.about}</p>

        {/* Contact Info */}
        <div className="flex flex-wrap gap-6 text-gray-300">
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-red-500" />
            <span>{personalInformation.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <LocationEdit className="h-5 w-5 text-red-500" />
            <span>{personalInformation.location}</span>
          </div>
        </div>

        {/* Socials */}
        <div className="flex gap-6 mt-6 flex-wrap">
          {personalInformation.socials.map((social) => {
            const Icon = social.icon;
            return (
              <motion.a
                key={social.platform}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, color: "#f87171" }} // subtle hover effect
                className="flex items-center gap-2 transition"
              >
                <Icon className="h-5 w-5" />
                <span>{social.platform}</span>
              </motion.a>
            );
          })}
        </div>
      </motion.section>

      {/* Skills */}
      <motion.section
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="space-y-6"
      >
        <h2 className="text-3xl font-bold text-red-500">Skills</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Object.entries(skills).map(([category, items]) => (
            <motion.div
              key={category}
              whileHover={{ scale: 1.05 }}
              className="bg-white/10 backdrop-blur-md rounded-xl p-4 shadow-md flex flex-col gap-3 transition"
            >
              <h3 className="text-lg font-semibold capitalize text-red-400">{category}</h3>
              {items.map((skill) => {
                const Icon = skill.icon;
                return (
                  <div key={skill.name} className="flex items-center gap-2 ">
                    <Icon className="h-5 w-5 text-red-500" />
                    <span className="text-sm text-gray-600 font-semibold">{skill.name}</span>
                  </div>
                );
              })}
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Education */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="space-y-4"
      >
        <h2 className="text-3xl font-bold text-red-500">Education</h2>
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-lg flex flex-col gap-3 transition">
          <div className="flex items-center gap-2">
            <education.icon className="h-6 w-6 text-red-500" />
            <h3 className="text-xl font-semibold">{education.level}</h3>
          </div>
          <p className="font-semibold ">{education.institution}</p>
          <ul className="list-disc pl-5 ">
            {education.focus.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </motion.section>

      {/* Interests */}
      <motion.section
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="space-y-4"
      >
        <h2 className="text-3xl font-bold text-red-500">Interests</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {interests.map((interest) => {
            const Icon = interest.icon;
            return (
              <motion.div
                key={interest.name}
                whileHover={{ scale: 1.05, rotate: 1 }}
                className="bg-white/10 backdrop-blur-md rounded-xl p-4 flex items-center gap-2 shadow-md transition"
              >
                <Icon className="h-5 w-5 text-red-500" />
                <span>{interest.name}</span>
              </motion.div>
            );
          })}
        </div>
      </motion.section>
    </div>
  );
}
