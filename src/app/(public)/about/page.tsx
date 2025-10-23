
"use client";

import { aboutData } from "@/data/aboutData";
import { motion } from "framer-motion";
import { LocationEdit, Mail } from "lucide-react";


export default function AboutPage() {
  const { personalInformation, skills, education, interests } = aboutData;

  return (
    <div className="max-w-6xl md:pt-20 mx-auto p-6 space-y-16">
    
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-gray-600 to-blue-900 text-white rounded-2xl p-8 shadow-lg"
      >
        <h1 className="text-4xl font-bold mb-2">{personalInformation.name}</h1>
        <h2 className="text-xl font-semibold mb-4">{personalInformation.title}</h2>
        <p className="text-white/80 mb-6">{personalInformation.about}</p>

        <div className="flex flex-wrap gap-6">
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            <span>{personalInformation.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <LocationEdit className="h-5 w-5" />
            <span>{personalInformation.location}</span>
          </div>
        </div>

        <div className="flex gap-6 mt-6 flex-wrap">
          {personalInformation.socials.map((social) => {
            const Icon = social.icon;
            return (
              <motion.a
                key={social.platform}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.2 }}
                className="flex items-center gap-1  hover:text-yellow-400 transition"
              >
                <Icon className="h-5 w-5" />
                <span>{social.platform}</span>
              </motion.a>
            );
          })}
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="space-y-6"
      >
        <h2 className="text-3xl font-bold text-indigo-700 dark:text-indigo-400">Skills</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Object.entries(skills).map(([category, items]) => (
            <motion.div
              key={category}
              whileHover={{ scale: 1.05 }}
              className="bg-white/20 dark:bg-gray-900/30 backdrop-blur-md rounded-xl p-4 shadow-md flex flex-col gap-3"
            >
              <h3 className="text-lg font-semibold capitalize text-indigo-600">{category}</h3>
              {items.map((skill) => {
                const Icon = skill.icon;
                return (
                  <div key={skill.name} className="flex items-center gap-2">
                    <Icon className="h-5 w-5 text-yellow-400" />
                    <span className="">{skill.name}</span>
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
        <h2 className="text-3xl font-bold text-purple-700 dark:text-purple-400">Education</h2>
        <div className="bg-white/20 dark:bg-gray-900/30 backdrop-blur-md rounded-2xl p-6 shadow-lg flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <education.icon className="h-6 w-6 text-yellow-400" />
            <h3 className="text-xl font-semibold">{education.level}</h3>
          </div>
          <p className="font-semibold">{education.institution}</p>
          <ul className="list-disc pl-5 text-white/80">
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
        <h2 className="text-3xl font-bold text-indigo-700 dark:text-indigo-400">Interests</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {interests.map((interest) => {
            const Icon = interest.icon;
            return (
              <motion.div
                key={interest.name}
                whileHover={{ scale: 1.1, rotate: 2 }}
                className="bg-white/20 dark:bg-gray-900/30 backdrop-blur-md rounded-xl p-4 flex items-center gap-2 shadow-md"
              >
                <Icon className="h-5 w-5 text-yellow-400" />
                <span className="">{interest.name}</span>
              </motion.div>
            );
          })}
        </div>
      </motion.section>
    </div>
  );
}
