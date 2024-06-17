import { auth } from "@/lib/auth"
import { routesApp } from "./lib/routes"

// Middleware de autenticación
export default auth((req) => {
  // Verifica si el usuario está autenticado
  if(!req.auth && req.nextUrl.pathname !== "/") {
    const newUrl = new URL("/", req.nextUrl.href)
    return Response.redirect(newUrl)
  }

  // Verifica si el usuario tiene permisos para acceder a la ruta
  const route = routesApp.find(route => route.path === req.nextUrl.pathname)

  if(!route?.roles.includes(req.auth?.user?.role) && req.nextUrl.pathname !== "/") {
    const newUrl = new URL("/", req.nextUrl.href)
    return Response.redirect(newUrl)
  }
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}

export const runtime = "experimental-edge"

