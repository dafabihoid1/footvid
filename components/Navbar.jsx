"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Menu, Calendar, Table, Video, Image, User, Home} from "lucide-react";
import { DialogTitle } from "@radix-ui/react-dialog";
import { logout } from "../app/actions/actions";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  // Add mobileOrder property to control ordering on mobile
  const links = [
    { href: "/", label: "Startseite", Icon: Home, mobileOrder: 3 },
    { href: "/gameplan", label: "Spielplan", Icon: Calendar, mobileOrder: 1 },
    { href: "/table", label: "Tabelle", Icon: Table, mobileOrder: 2 },
    { href: "/videos", label: "Videos", Icon: Video, mobileOrder: 4 },
    { href: "/fotos", label: "Fotos", Icon: Image, mobileOrder: 5 },
  ];

  // Derive separate arrays for desktop and mobile
  const desktopLinks = links;
  const mobileLinks = [...links].sort((a, b) => a.mobileOrder - b.mobileOrder);

  const renderLink = ({ href, label, Icon }, isBottom = false) => {
    const isActive = pathname === href;
    const baseClasses = isBottom
      ? "flex flex-col items-center justify-center space-y-1 p-2 rounded transition duration-200"
      : "flex items-center space-x-2 px-2 py-1 rounded transition duration-200";
    const textClasses = isActive
      ? "text-primary font-semibold underline"
      : "text-foreground  hover:text-primary hover:scale-105";

    return (
      <Link
        key={href}
        href={href}
        className={`${baseClasses} ${textClasses}`}
      >
        <Icon size={isBottom ? 24 : 18} />
        <span className={isBottom ? "text-xs" : "text-base"}>{label}</span>
      </Link>
    );
  };

  async function handleAbmelden(e) {
    e.preventDefault();
    const { data, error } = await logout();
    if (error) {
      console.error("Logout failed:", error.message);
      return;
    }
    router.refresh();
    router.push("/login");
  }

  return (
    <>
      {/* Top navbar for desktop */}
      <header className="fixed top-0 w-full bg-leibengreen text-foreground shadow z-20 border-b border-border">
        <nav className="container mx-auto flex items-center justify-between p-4">
          <Link href="/" className="flex items-center">
            <img src="/logo.png" alt="Logo" className="h-16" />
          </Link>

          {/* Desktop */}
          <div className="hidden lg:flex items-center space-x-6">
            {desktopLinks.map(link => renderLink(link))}
            <Link
              href=""
              onClick={handleAbmelden}
              className="flex items-center space-x-2 text-foreground hover:text-primary transition duration-200"
            >
              <User size={18} />
              <span>Abmelden</span>
            </Link>
          </div>

          <div className="">
            <Dialog>
              <DialogTrigger asChild>
                 <Button variant="ghost"  size="icon" className="size-10">
               <User className="!w-6 !h-6"/>
                </Button>
              </DialogTrigger>
              <DialogTitle className="sr-only">Leiben</DialogTitle>
              <DialogContent className="sm:max-w-xs w-full p-6 bg-card text-foreground">
                <img
                  src="/logo.png"
                  alt="Logo"
                  className="h-12 w-auto "
                />
                <div className="mt-4 space-y-4">
                  <hr className="border-border" />
                  <Link
                    href=""
                    onClick={handleAbmelden}
                    className="flex items-center space-x-2 text-foreground hover:text-primary transition duration-200"
                  >
                    <User size={18} />
                    <span>Abmelden</span>
                  </Link>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Mobile Menu Trigger (hidden since bottom nav used) */}
          <div className="hidden">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost">
                  <Menu size={24} />
                </Button>
              </DialogTrigger>
              <DialogTitle className="sr-only">Leiben</DialogTitle>
              <DialogContent className="sm:max-w-xs w-full p-6 bg-card text-foreground">
                <img
                  src="/logo.png"
                  alt="Logo"
                  className="h-12 w-auto mx-auto"
                />
                <div className="mt-4 space-y-4">
                  {desktopLinks.map(link => renderLink(link))}
                  <hr className="border-border" />
                  <Link
                    href=""
                    onClick={handleAbmelden}
                    className="flex items-center space-x-2 text-foreground hover:text-primary transition duration-200"
                  >
                    <User size={18} />
                    <span>Abmelden</span>
                  </Link>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </nav>
      </header>

      {/* Bottom navbar for mobile */}
      <nav className="fixed bottom-0 z-10 w-full bg-leibengreen text-foreground shadow lg:hidden border-t border-border">
        <div className="flex justify-around items-center p-2">
          {mobileLinks.map(link => renderLink(link, true))}
        </div>
      </nav>
    </>
  );
}
