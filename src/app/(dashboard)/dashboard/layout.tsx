"use client";

import React from "react"
import Sidebar from "@/components/shared/Sidebar";
import { useAuth } from "@/context/AuthProvider";
import { redirect } from "next/navigation";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user,loading } = useAuth();
  if (!user && !loading) {
    redirect('/login');
  }
  return (
    <main className="min-h-dvh flex gap-4">
      <Sidebar />
      <div className="w-full p-3">

        {children}

      </div>
    </main>
  );
}
