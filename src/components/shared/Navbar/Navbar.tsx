"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Logo } from "./logo";
import { NavMenu } from "./nav-menu";
import { NavigationSheet } from "./navigation-sheet";
import { useAuth } from "@/context/AuthProvider";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";


const Navbar = () => {
  const { user, logout, loading} = useAuth();
  const isAdmin = user?.role === "ADMIN";
  const router = useRouter();
  const handleLogout = async () => {
    await logout();
    router.push("/");
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
          {loading ? (
            <div className="flex items-center gap-4">
              <Skeleton className="h-9 w-[70px] rounded-full" />
              <Skeleton className="h-4 w-24 rounded-full md:hidden" />
            </div>
          ) : isAdmin ? (
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

          {/* Mobile Menu - Show only when not loading */}
          {!loading && (
            <div className="md:hidden">
              <NavigationSheet isAdmin={isAdmin} />
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

