import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger 
} from "@/components/ui/sheet";
import { Menu, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

export default function Header() {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border/40 shadow-sm">
      <div className="container-custom">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-2xl font-bold gradient-text">
              TestBook
            </Link>
          </div>
          
          {/* Desktop Nav */}
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link href="/">
                  <NavigationMenuLink 
                    className={`${navigationMenuTriggerStyle()} ${location === "/" ? "text-primary font-medium" : ""}`}
                  >
                    Home
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <NavigationMenuTrigger>Courses</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4">
                    <li className="row-span-3">
                      <Link href="/courses">
                        <NavigationMenuLink className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-br from-primary to-secondary p-6 no-underline outline-none focus:shadow-md">
                          <div className="mt-4 mb-2 text-lg font-medium text-white">
                            Browse All Courses
                          </div>
                          <p className="text-sm leading-tight text-white/90">
                            Explore our extensive range of exam preparation courses
                          </p>
                        </NavigationMenuLink>
                      </Link>
                    </li>
                    <li>
                      <Link href="/courses?category=banking-insurance">
                        <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-medium leading-none">Banking & Insurance</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            SBI, IBPS, RBI, LIC & more
                          </p>
                        </NavigationMenuLink>
                      </Link>
                    </li>
                    <li>
                      <Link href="/courses?category=ssc-railways">
                        <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-medium leading-none">SSC & Railways</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            SSC CGL, CHSL, RRB & more
                          </p>
                        </NavigationMenuLink>
                      </Link>
                    </li>
                    <li>
                      <Link href="/courses?category=jee-neet">
                        <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-medium leading-none">JEE & NEET</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Engineering & Medical entrances
                          </p>
                        </NavigationMenuLink>
                      </Link>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <NavigationMenuTrigger>Test Series</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-3 p-4 w-[200px]">
                    <li>
                      <Link href="/tests">
                        <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-medium leading-none">Mock Tests</div>
                        </NavigationMenuLink>
                      </Link>
                    </li>
                    <li>
                      <Link href="/tests?type=subject">
                        <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-medium leading-none">Subject Tests</div>
                        </NavigationMenuLink>
                      </Link>
                    </li>
                    <li>
                      <Link href="/tests?type=previous-year">
                        <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-medium leading-none">Previous Year Papers</div>
                        </NavigationMenuLink>
                      </Link>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <Link href="/study-materials">
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Study Materials
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Current Affairs
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          
          {/* User actions */}
          <div className="hidden md:flex items-center space-x-4">
            {isSearchOpen ? (
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search courses..."
                  className="bg-neutral-100 pl-10 pr-10 py-2 rounded-full text-sm w-56 focus:outline-none focus:ring-2 focus:ring-primary"
                  autoFocus
                  onBlur={() => setIsSearchOpen(false)}
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
                <button 
                  className="absolute right-3 top-2.5 text-neutral-400" 
                  onClick={() => setIsSearchOpen(false)}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsSearchOpen(true)}
                className="text-neutral-600"
              >
                <Search className="h-5 w-5" />
              </Button>
            )}
            
            {user ? (
              <div className="flex items-center gap-4">
                <Link href="/dashboard">
                  <Button variant="ghost" className="text-neutral-800 hover:text-primary">
                    Dashboard
                  </Button>
                </Link>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-primary text-white">
                          {getInitials(user.fullName)}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.fullName}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard">Dashboard</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/profile">Profile Settings</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/auth">
                  <Button variant="ghost" className="text-primary hover:text-primary/80">
                    Login
                  </Button>
                </Link>
                <Link href="/auth">
                  <Button className="bg-primary text-white hover:bg-primary/90">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            {user ? (
              <Link href="/dashboard" className="mr-4">
                <Button variant="ghost" size="sm" className="text-neutral-800 hover:text-primary">
                  Dashboard
                </Button>
              </Link>
            ) : null}
            
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-neutral-800 hover:text-primary">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="flex flex-col h-full">
                  <div className="py-4">
                    <h2 className="text-lg font-bold">TestBook</h2>
                  </div>
                  
                  <div className="flex-1">
                    <div className="space-y-3">
                      <Link href="/">
                        <Button variant="ghost" className="w-full justify-start">Home</Button>
                      </Link>
                      <Link href="/courses">
                        <Button variant="ghost" className="w-full justify-start">Courses</Button>
                      </Link>
                      <Link href="/tests">
                        <Button variant="ghost" className="w-full justify-start">Test Series</Button>
                      </Link>
                      <Link href="/study-materials">
                        <Button variant="ghost" className="w-full justify-start">Study Materials</Button>
                      </Link>
                      <Button variant="ghost" className="w-full justify-start">Current Affairs</Button>
                    </div>
                  </div>
                  
                  <div className="pt-4 mt-4 border-t border-neutral-200">
                    <div className="mb-4 relative">
                      <Input 
                        type="text" 
                        placeholder="Search courses..." 
                        className="pl-10"
                      />
                      <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
                    </div>
                    
                    {user ? (
                      <div className="space-y-2">
                        <div className="flex items-center space-x-3 pb-2">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-primary text-white">
                              {getInitials(user.fullName)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{user.fullName}</p>
                            <p className="text-xs text-neutral-500">{user.email}</p>
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={handleLogout}
                        >
                          Log out
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-col space-y-2">
                        <Link href="/auth">
                          <Button className="btn-primary w-full">Sign Up</Button>
                        </Link>
                        <Link href="/auth">
                          <Button variant="outline" className="btn-outline w-full">Login</Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
