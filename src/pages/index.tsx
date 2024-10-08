import { signIn, useSession } from 'next-auth/react';
import Image from 'next/image'
import Link from 'next/link';

import { routesApp } from '@/lib/routes';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import logo from '/public/logo.webp'
import { MoveVerticalIcon } from '@/components/ui/icons';
import { InfoIcon } from '@/components/ui/icons';

import { Role } from '@prisma/client';
import { useEffect } from 'react';

export default function Index() {
  const { data: session } = useSession();
  const { toast } = useToast()

  const handleToast = () => {
    toast({
      title: "Para ingresar a la aplicación como administrador puedes usar las siguientes credenciales:",
      description: "admin@admin.com - Admin_1234",
    })
  }

  useEffect(() => {
    if (!session) handleToast()
  }, [])

  // Si no hay sesión, muestra el botón de inicio de sesión
  if (!session) {
    return (
      <main className="w-full h-dvh flex justify-center items-center">
        <Button onClick={() => handleToast()} className="fixed top-4 right-4 rounded-full p-2 w-10 h-10">
          <InfoIcon width={24} height={24} />
        </Button>
        <Card className="w-full max-w-sm">
          <CardHeader className='flex items-center w-full'>
            <Image src={logo} alt="Logo" width={200} height={64} />
          </CardHeader>
          <CardContent className="grid gap-4">
            <CardDescription className="text-center">
              Para ingresar a la aplicación, por favor inicia sesión.
            </CardDescription>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={() => signIn()}>Iniciar Sesión</Button>
          </CardFooter>
        </Card>
      </main>
    )
  }

  // Si hay sesión, muestra el contenido de la aplicación
  return (
    <>
      <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
          {routesApp.filter((route) => route.roles.includes(session.user.role as Role)).map((route, index) => (
            <Card key={index} className='flex flex-col justify-between gap-8'>
              <CardHeader className="pb-2">
                <CardTitle className="text-4xl">{route.name}</CardTitle>
              </CardHeader>
              <CardFooter>
                <Link href={route.path}>
                  <Button>Ir</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </>
  )
}
