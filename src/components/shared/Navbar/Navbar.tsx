"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Logo } from "./logo";
import { NavMenu } from "./nav-menu";
import { NavigationSheet } from "./navigation-sheet";

const Navbar = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  // Fetch user info on client
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/user`, {
          credentials: "include", // send cookies
        });

        if (!res.ok) {
          setIsAdmin(false);
          return;
        }

        const data = await res.json();
        if (data?.data?.user?.role === "ADMIN") {
          setIsAdmin(true);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        setIsAdmin(false);
      }
    };

    fetchUser();
  }, []);

  // Logout handler
  const handleLogout = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      setIsAdmin(false);
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="fixed top-3 inset-x-4 h-16 max-w-screen-xl mx-auto rounded-full bg-background border dark:border-slate-700/70 z-30">
      <div className="flex h-full items-center justify-between px-6 md:px-8">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <Logo />
        </Link>

        {/* Desktop Menu */}
        <NavMenu className="hidden md:block" isAdmin={isAdmin} />

        {/* Actions and Mobile Menu */}
        <div className="flex items-center gap-4 md:gap-6">
          {isAdmin ? (
            <Button
              className="rounded-full px-5 py-2 text-sm md:text-base"
              onClick={handleLogout}
            >
              Logout
            </Button>
          ) : (
            <Button className="rounded-full px-5 py-2 text-sm md:text-base">
              <Link href="/login" className="block w-full text-center">
                Login
              </Link>
            </Button>
          )}

          {/* Mobile Menu */}
          <div className="md:hidden">
            <NavigationSheet isAdmin={isAdmin} />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
