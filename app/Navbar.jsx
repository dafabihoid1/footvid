"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Dialog, DialogTrigger, DialogContent, DialogHeader } from "@/components/ui/dialog"
import {
  Menu,
  X,
  Calendar,
  Table,
  Video,
  Image,
  User,
  Home,
} from "lucide-react"
import { DialogTitle } from "@radix-ui/react-dialog"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { logout } from "./actions/actions"
import { useRouter } from "next/navigation"

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter();

  const links = [
    { href: "/", label: "Startseite", Icon: Home },
    { href: "/gameplan", label: "Spielplan", Icon: Calendar },
    { href: "/table",    label: "Tabelle",   Icon: Table },
    { href: "/docs",     label: "Videos",    Icon: Video },
    { href: "/photos",   label: "Fotos",     Icon: Image },
  ]

  const renderLink = ({ href, label, Icon }) => {
    const isActive = pathname === href
    return (
      <Link
        key={href}
        href={href}
        className={
          "flex items-center space-x-2 px-2 py-1 rounded transition duration-200 " +
          (isActive
            ? "text-primary font-semibold underline decoration-primary underline-offset-4"
            : "text-foreground hover:text-primary hover:scale-105")
        }
      >
        <Icon size={18} />
        <span>{label}</span>
      </Link>
    )
  }

async function handleAbmelden(e) {
  e.preventDefault();
  const { data, error } = await logout();
  if (error) {
    // show the error message
    console.error("Logout failed:", error.message);
    return;
  }
   router.refresh();
  router.push("/login");
}

  
  return (
    <header className="fixed top-0 w-full bg-[#003d11] text-foreground shadow z-20 border-b border-border">
      <nav className="container mx-auto flex items-center justify-between p-4">
        <Link href="/" className="flex items-center">
          <img src="/logo.png" alt="Logo" className="h-16" />
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center space-x-6">
          {links.map(renderLink)}
          <Link
            href=""
            onClick={handleAbmelden}
            className="flex items-center space-x-2 text-foreground hover:text-primary transition duration-200"
          >
            <User size={18} />
            <span>Abmelden</span>
          </Link>
       
        </div>

        {/* Mobile */}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" className="md:hidden">
              <Menu size={24} />
            </Button>
          </DialogTrigger>
          <VisuallyHidden>   <DialogTitle>TEst</DialogTitle></VisuallyHidden>
          <DialogContent className="sm:max-w-xs w-full p-6 bg-card text-foreground">
            <img src={"logo.png"} className="size-[48px]"></img>
            <div className="flex flex-col space-y-4">
              {links.map(renderLink)}
              <hr className="border-border my-2" />
              <Link
                href="/signin"
                className="flex items-center space-x-2 text-lg font-medium hover:text-primary transition duration-200"
              >
                <User size={18} />
                <span>Sign In</span>
              </Link>
              <Link href="/signup">
                <Button className="w-full">Sign Up</Button>
              </Link>
            </div>
          </DialogContent>
        </Dialog>
      </nav>
    </header>
  )
}
