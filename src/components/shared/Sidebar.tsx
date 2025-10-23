"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  PlusCircle,
  FileText,
  FolderPlus,
  LayoutDashboard,
  LogOut,

  SidebarIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";


export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const logOut = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to logout");
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const navGroups = [
    {
      title: "Blog Management",
      items: [
        { name: "Create Blog", href: "/dashboard/create-blog", icon: PlusCircle },
        { name: "Manage Blogs", href: "/dashboard/manage-blogs", icon: FileText },
      ],
    },
    {
      title: "Project Management",
      items: [
        { name: "Add Project", href: "/dashboard/add-project", icon: FolderPlus },
        { name: "Manage Projects", href: "/dashboard/manage-projects", icon: LayoutDashboard },
      ],
    },
  ];

  return (
    <aside
      className={cn(
        "fixed md:static flex flex-col  bg-black text-white border-r transition-all duration-300",
        collapsed ? "w-20" : "w-64"
      )}
    >
     
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <Link href="/" className="flex items-center gap-2">
          {!collapsed && <span className="text-lg font-semibold">Dashboard</span>}
        </Link>
        <Button
          size="icon"
          variant="ghost"
          className="text-white hover:bg-gray-800"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <SidebarIcon/> : <SidebarIcon></SidebarIcon> }
        </Button>
      </div>

     
      <nav className="flex-1 overflow-y-auto p-3 space-y-4">
        <Link
          href="/"
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
            pathname === "/"
              ? "bg-gray-200 text-black"
              : "hover:bg-gray-800 hover:text-white"
          )}
        >
          <Home size={18} />
          {!collapsed && "Home"}
        </Link>

        {navGroups.map((group) => (
          <div key={group.title}>
            {!collapsed && (
              <p className="text-xs uppercase text-gray-400 px-3 mb-1">
                {group.title}
              </p>
            )}
            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition",
                      active
                        ? "bg-gray-200 text-black"
                        : "hover:bg-gray-800 hover:text-white"
                    )}
                  >
                    <Icon size={18} />
                    {!collapsed && item.name}
                 
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-800">
        <Button
          variant="destructive"
          className="w-full justify-start gap-2"
          onClick={logOut}
        >
          <LogOut size={18} />
          {!collapsed && "Logout"}
        </Button>
      </div>
    </aside>
  );
}
