"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { NavMenu } from "./nav-menu";
import Link from "next/link";

export const NavigationSheet = ({ isAdmin }: { isAdmin?: boolean }) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent>
        {/* Logo placeholder (can be replaced with your actual <Logo /> component) */}
        <div className="text-xl font-bold mb-8">
          <Link href="/">Logo</Link>
        </div>

        {/* Mobile Nav Menu */}
        <NavMenu isAdmin={isAdmin} orientation="vertical" className="mt-4"  />
      </SheetContent>
    </Sheet>
  );
};
