"use client"
import React from 'react'
import Link from 'next/link'
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink
} from "@/components/ui/navigation-menu"
import { Button } from "@/components/ui/button"
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog"
import { Menu, X } from "lucide-react"

export default function Navbar() {
  return (
    <header className="fixed top-0 w-full bg-[#003d11] shadow z-20 border-b border-gray-200">
      <nav className="container mx-auto flex items-center justify-between p-4">
        <Link href="/">
            <img src='/logo.png' className='h-16'></img>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          <NavigationMenu>
            <NavigationMenuList>
             
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href="/gameplan" className="hover:text-primary">Spielplan</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href="/table" className="hover:text-primary">Tabelle</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>  
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href="/docs" className="hover:text-primary">Videos</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href="/docs" className="hover:text-primary">Fotos</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <Link href="/signin">
            <Button variant="ghost" size="sm">Sign In</Button>
          </Link>
          <Link href="/signup">
            <Button size="sm">Sign Up</Button>
          </Link>
        </div>

        {/* Mobile Menu */}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" className="md:hidden">
              <Menu size={24} />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-xs w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <span className="text-xl font-bold">MyLogo</span>
              <DialogTrigger asChild>
                <Button variant="ghost">
                  <X size={24} />
                </Button>
              </DialogTrigger>
            </div>
            <div className="flex flex-col space-y-4">
              <Link href="/products/analytics" className="text-lg font-medium">Analytics</Link>
              <Link href="/products/engagement" className="text-lg font-medium">Engagement</Link>
              <Link href="/products/security" className="text-lg font-medium">Security</Link>
              <Link href="/pricing" className="text-lg font-medium">Pricing</Link>
              <Link href="/docs" className="text-lg font-medium">Docs</Link>
              <Link href="/signin" className="text-lg font-medium">Sign In</Link>
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
