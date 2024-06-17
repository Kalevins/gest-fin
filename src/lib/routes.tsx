import { LineChartIcon, ShoppingCartIcon, UsersIcon } from "@/components/ui/icons";
import { Role } from "@prisma/client";

// Rutas de la aplicación
export const routesApp = [
  {
    name: "Sistema de gestión de ingresos y gastos",
    path: "/management",
    icon: <ShoppingCartIcon className="h-5 w-5" />,
    roles: [
      Role.ADMIN,
      Role.USER
    ]
  },
  {
    name: "Gestión de usuarios",
    path: "/users",
    icon: <UsersIcon className="h-5 w-5" />,
    roles: [
      Role.ADMIN
    ]
  },
  {
    name: "Reportes",
    path: "/reports",
    icon: <LineChartIcon className="h-5 w-5" />,
    roles: [
      Role.ADMIN
    ]
  },
]