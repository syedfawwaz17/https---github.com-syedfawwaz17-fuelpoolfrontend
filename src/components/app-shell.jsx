
"use client";

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Leaf, Search, Map, LayoutDashboard, LogIn, User, LogOut, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getToken, logout, getUser } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';


const useAuth = () => {
  const [user, setUser] = React.useState(null);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const { toast } = useToast();

  React.useEffect(() => {
    const token = getToken();
    const userData = getUser();
    setIsAuthenticated(!!token);
    if(userData) {
      setUser(userData)
    }
  }, []);

  const handleLogout = () => {
    logout(); // This will clear the token and redirect
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  return { isAuthenticated, user, logout: handleLogout };
};

export function AppShell({ children }) {
  const { isAuthenticated } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    { href: '/', label: 'Ride Search', icon: Search, auth: false },
    { href: '/smart-route', label: 'Smart Route', icon: Map, auth: false },
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, auth: true },
  ];

  const publicPages = ['/login', '/register'];

  React.useEffect(() => {
    const currentRoute = menuItems.find(item => item.href === pathname);
    const isProtectedRoute = currentRoute?.auth;

    if (!isAuthenticated && isProtectedRoute && !publicPages.includes(pathname)) {
      router.push('/login');
    }
  }, [isAuthenticated, pathname, router, menuItems]);

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <div className="bg-primary text-primary-foreground p-2 rounded-lg">
              <Leaf size={24} />
            </div>
            <h1 className="text-xl font-semibold font-headline text-primary">Fuelpool</h1>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {menuItems.map((item) => {
              if (item.auth && !isAuthenticated) return null;
              return (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    tooltip={item.label}
                  >
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          {isAuthenticated ? (
             <UserMenu />
          ) : (
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === '/login'}>
                  <Link href="/login">
                    <LogIn />
                    <span>Login</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          )}
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <Header />
        <main className="p-4 md:p-6 lg:p-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}

function Header() {
  const { toggleSidebar } = useSidebar();
  const { isAuthenticated } = useAuth();

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
      <SidebarTrigger className="md:hidden" />
      <div className="flex w-full items-center justify-end gap-4">
        {isAuthenticated && <UserMenu mobile />}
      </div>
    </header>
  );
}


function UserMenu({ mobile = false }) {
  const { user, logout } = useAuth();
  const router = useRouter();
  
  const handleLogout = () => {
    logout();
  }

  const commonClasses = "flex items-center gap-2";
  const userName = user?.name || "User";
  const userAvatarFallback = userName.charAt(0).toUpperCase();

  if (mobile) {
    return (
      <div className={cn("md:hidden", commonClasses)}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="h-9 w-9 cursor-pointer">
              <AvatarImage src={user?.profilePhotoUrl} alt={userName} />
              <AvatarFallback>{userAvatarFallback}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => router.push('/dashboard')}>Dashboard</DropdownMenuItem>
            <DropdownMenuItem onSelect={() => router.push('/dashboard')}>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  return (
     <div className="hidden md:flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.profilePhotoUrl} alt={userName} />
                    <AvatarFallback>{userAvatarFallback}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">{userName}</span>
                <ChevronDown size={16} />
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => router.push('/dashboard')}>
            <LayoutDashboard className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => router.push('/dashboard')}>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={handleLogout} className="text-red-500 focus:text-red-500 focus:bg-red-50 cursor-pointer">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
