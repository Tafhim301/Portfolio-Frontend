
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Mail, Phone, MapPin, Send, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    setLoading(false);
    setShowSuccess(true);

    setTimeout(() => setShowSuccess(false), 3000);

    e.currentTarget.reset();
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-950 text-white flex flex-col items-center justify-center py-20 px-6 overflow-hidden">
   
      <motion.div
        className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-red-600/20 blur-3xl"
        animate={{ y: [0, 20, 0], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-indigo-600/20 blur-3xl"
        animate={{ y: [0, -20, 0], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl text-center mb-12 z-10"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Let’s <span className="text-red-500">Connect</span>
        </h1>
        <p className="text-gray-400 text-lg">
          Have a project idea, collaboration, or just want to say hi?  
          Drop me a message below — I usually reply within a day.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-10 w-full max-w-5xl z-10">
        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <Card className="bg-white/5 backdrop-blur-md border-none shadow-lg p-6 rounded-2xl">
            <CardContent className="space-y-6">
              <div className="flex text-red-500 items-center gap-3">
                <Mail className="h-6 w-6" />
                <p>tafhimul301@gmail.com</p>
              </div>
              <div className="flex text-red-500 items-center gap-3">
                <Phone className="h-6 w-6" />
                <p>+880 1638-83556</p>
              </div>
              <div className="flex text-red-500 items-center gap-3">
                <MapPin className="h-6 w-6" />
                <p>Chattogram, Bangladesh</p>
              </div>
            </CardContent>
          </Card>

          <div className="text-gray-400 text-sm">
            You can also reach me through my social channels —  
            <span className="text-white"> GitHub, LinkedIn, and X (Twitter)</span>.
          </div>
        </motion.div>

        {/* Contact Form */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-2xl shadow-lg flex flex-col gap-5"
        >
          <div>
            <label className="block text-sm text-gray-300 mb-1">Your Name</label>
            <input
              type="text"
              name="name"
              required
              className="w-full bg-black/30 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-red-500 outline-none transition"
              placeholder="Enter your name"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">Your Email</label>
            <input
              type="email"
              name="email"
              required
              className="w-full bg-black/30 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-red-500 outline-none transition"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">Message</label>
            <textarea
              name="message"
              required
              rows={4}
              className="w-full bg-black/30 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-red-500 outline-none transition resize-none"
              placeholder="Write your message..."
            ></textarea>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="mt-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Send className="h-4 w-4 animate-spin" /> Sending...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" /> Send Message
              </>
            )}
          </Button>
        </motion.form>
      </div>

      {/* ✅ Success Modal */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              transition={{ duration: 0.3 }}
              className="bg-gradient-to-br from-gray-800 to-gray-900 text-center px-10 py-8 rounded-2xl shadow-2xl border border-gray-700"
            >
              <CheckCircle2 className="w-14 h-14 text-green-400 mx-auto mb-3" />
              <h3 className="text-2xl font-semibold mb-2 text-white">Message Sent!</h3>
              <p className="text-gray-400">Thanks for reaching out. I’ll get back to you soon.</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
