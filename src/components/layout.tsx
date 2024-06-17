import { ReactNode } from 'react';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image'
import Link from "next/link"
import { usePathname } from 'next/navigation';

import { routesApp } from '@/lib/routes';
import { HomeIcon, LoadingSpinner, PanelLeftIcon } from "@/components/ui/icons"
import { Button } from "@/components/ui/button"
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet"
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Role } from '@prisma/client';

// Layout de la aplicación
export function Layout({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  // Si el estado es cargando, muestra un spinner
  if(status === 'loading') return <div className='flex justify-center items-center w-dvw h-dvh'><LoadingSpinner className='w-1/12 h-auto'/></div>;

  // Si el estado es no autenticado, muestra el contenido
  if(status === 'unauthenticated') return <>{children}</>

  // Si el estado es autenticado, muestra el layout
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
        <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
          <TooltipProvider>
            <Link
              href="/"
              className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
              prefetch={false}
            >
              <HomeIcon className="h-4 w-4 transition-all group-hover:scale-110" />
              <span className="sr-only">GestFin</span>
            </Link>
            {routesApp.filter((route) => route.roles.includes(session?.user?.role as Role)).map((route) => (
              <Tooltip key={route.path}>
                <TooltipTrigger asChild>
                  <Link
                    href={route.path}
                    className={`flex h-9 w-9 items-center justify-center rounded-lg ${pathname === route.path ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'} transition-colors hover:text-foreground md:h-8 md:w-8`}
                    prefetch={false}
                  >
                    {route.icon}
                    <span className="sr-only">{route.name}</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">{route.name}</TooltipContent>
              </Tooltip>
            ))}
          </TooltipProvider>
        </nav>
      </aside>
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline" className="sm:hidden">
                <PanelLeftIcon className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="sm:max-w-xs">
              <nav className="grid gap-6 text-lg font-medium">
                <Link
                  href="/"
                  className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
                  prefetch={false}
                >
                  <HomeIcon className="h-5 w-5 transition-all group-hover:scale-110" />
                  <span className="sr-only">GestFin</span>
                </Link>
                {routesApp.map((route) => (
                  <Link
                    key={route.path}
                    href={route.path}
                    className={`flex items-center gap-4 px-2.5 ${pathname === route.path ? 'text-foreground' : 'text-muted-foreground'} hover:text-foreground`}
                    prefetch={false}
                  >
                    {route.icon}
                    {route.name}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
          <Breadcrumb className="hidden md:flex">
            <BreadcrumbList>
              {pathname === '/' ? (
                <BreadcrumbItem>
                  <BreadcrumbPage>GestFin</BreadcrumbPage>
                </BreadcrumbItem>
              ) : (
                <>
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link href="/" prefetch={false}>
                        GestFin
                      </Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>
                      {routesApp.find((route) => route.path === pathname)?.name}
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </>
              )}
            </BreadcrumbList>
          </Breadcrumb>
          <div className="ml-auto flex-1 md:grow-0" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="overflow-hidden rounded-full">
                <Image
                  src={session?.user?.image || '/avatar.png'}
                  width={36}
                  height={36}
                  alt="Avatar"
                  className="overflow-hidden rounded-full"
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{session?.user?.name}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => signOut()}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          {children}
        </main>
      </div>
    </div>
  )
}
