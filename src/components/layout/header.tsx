"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import { BarChart3Icon, LayoutDashboard, LogIn, LogOut, Menu, Shield, UserPlus } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";
import { ThemeToggle } from "../ui/theme-toggle";
import { useEffect, useState } from "react";

const menus = ["home", "check-link", "benefit"];

export function Header() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.4,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry: any) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, options);

    menus.forEach((menu) => {
      const element = document.getElementById(menu);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [pathname]);

  useEffect(() => {
    setActiveSection(null);
  }, [pathname]);

  if (!isClient) {
    return (
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="text-xl font-bold flex items-center">
            <Shield className="mr-1.5 size-5" strokeWidth={4} absoluteStrokeWidth />
            SafeLink
          </Link>
        </div>
      </header>
    );
  }

  const isAuthenticated = status === "authenticated";

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center px-4">
        {/* Logo/Brand - Diposisikan di kiri */}
        <div className="flex-1">
          <Link href="/" className="text-xl font-bold flex items-center">
            <Shield className="mr-1.5 size-5" strokeWidth={4} absoluteStrokeWidth />
            SafeLink
          </Link>
        </div>

        {/* Menu Navigasi - Diposisikan di tengah */}
        {pathname === "/" && (
          <nav className="hidden md:flex items-center justify-center flex-1">
            <div className="flex gap-6 capitalize">
              {menus.map((menu) => (
                <Link
                  key={menu}
                  href={`${process.env.NEXT_PUBLIC_APP_URL}/#${menu}`}
                  className={`px-4 py-1 rounded-2xl text-sm font-medium transition-colors ${activeSection === menu ? "bg-primary text-primary-foreground" : "hover:bg-accent hover:text-accent-foreground"}`}
                >
                  {menu.replace("-", " ")}
                </Link>
              ))}
            </div>
          </nav>
        )}

        {/* Tombol Aksi - Diposisikan di kanan */}
        <div className="flex-1 flex justify-end items-center gap-2">
          <ThemeToggle />
          {isAuthenticated ? (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard" className="flex items-center gap-1">
                  <LayoutDashboard className="size-4" />
                  <span className="hidden sm:inline">Dashboard</span>
                </Link>
              </Button>
              <Button variant="ghost" className="justify-start" asChild>
                <Link href="/dashboard/stats" className="flex items-center gap-2">
                  <BarChart3Icon className="size-4" />
                  Stats
                </Link>
              </Button>
              <Button variant="ghost" size="sm" onClick={() => signOut()}>
                <LogOut className="size-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" size="sm" asChild>
                <Link href="/login" className="flex items-center gap-1">
                  <LogIn className="size-4" />
                  <span className="hidden sm:inline">Login</span>
                </Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/register" className="flex items-center gap-1">
                  <UserPlus className="size-4" />
                  <span className="hidden sm:inline">Register</span>
                </Link>
              </Button>
            </>
          )}

          {/* Mobile Navigation */}
          <div className="flex md:hidden items-center gap-2 ml-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="size-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader className="mb-6">
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-2">
                  {isAuthenticated ? (
                    <>
                      <Button variant="ghost" className="justify-start" asChild>
                        <Link href="/dashboard" className="flex items-center gap-2">
                          <LayoutDashboard className="size-4" />
                          Dashboard
                        </Link>
                      </Button>
                      <Button variant="ghost" className="justify-start" asChild>
                        <Link href="/dashboard/stats" className="flex items-center gap-2">
                          <BarChart3Icon className="size-4" />
                          Stats
                        </Link>
                      </Button>
                      <Button variant="ghost" className="justify-start" onClick={() => signOut()}>
                        <LogOut className="size-4" />
                        Logout
                      </Button>
                    </>
                  ) : (
                    <>
                      {menus.map((menu) => (
                        <Button key={menu} variant="ghost" className="justify-start" asChild>
                          <Link href={`#${menu}`} className="w-full">
                            {menu.replace("-", " ")}
                          </Link>
                        </Button>
                      ))}
                      <Button variant="outline" className="justify-start mt-4" asChild>
                        <Link href="/login" className="flex items-center gap-2">
                          <LogIn className="size-4" />
                          Login
                        </Link>
                      </Button>
                      <Button className="justify-start" asChild>
                        <Link href="/register" className="flex items-center gap-2">
                          <UserPlus className="size-4" />
                          Register
                        </Link>
                      </Button>
                    </>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
