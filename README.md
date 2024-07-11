# GestFin

_Proyecto de un sistema de gestión de ingresos y egresos_

### 🔧 Instalación

_En el directorio del proyecto ejecutar:_

```
npm i
```
```
npx prisma generate
```
```
npm run dev
```

_Para correr las pruebas:_

```
npm run test
```

## 📦 Resultados

_Puedes ver el proyecto en:_

[GestFin](https://gest-fin.vercel.app/)

_Las credenciales de administrador son:_

```
email: admin@admin.com
password: Admin_1234
```

## 📦 Despliegue en Vercel

_Para desplegar el proyecto en Vercel, se debe configurar las variables de entorno_

```
DATABASE_URL='postgres://postgres:1234@localhost:5432/gest_fin'
DIRECT_DATABASE_URL='postgres://postgres:1234@localhost:5432/gest_fin'

AUTH_SECRET='secret'
AUTH_AUTH0_ID='eiva21kqglb2vsvp'
AUTH_AUTH0_SECRET='secret'
AUTH_AUTH0_ISSUER='https://kalevins.us.auth0.com/'

DEPLOY_URL='https://gest-fin.vercel.app/'
```

_Luego, se debe agregar a Build Command el comando:_

```
npx prisma generate && npm run build
```

_Y desplegar el proyecto_

## 🛠️ Construcción

* [NEXT.js](https://nextjs.org/) - Framework de React
* [React](https://es.reactjs.org/) - Biblioteca de JavaScript
* [TypeScript](https://www.typescriptlang.org/) - Superset de JavaScript
* [TailwindCSS](https://tailwindcss.com/) - Framework de CSS
* [Shadcn/UI](https://ui.shadcn.com/) - Componentes de UI
* [GraphQL](https://graphql.org/) - Lenguaje de consulta
* [Apollo](https://www.apollographql.com/) - Cliente de GraphQL
* [Auth0](https://auth0.com/) - Herramienta de autenticación
* [Prisma](https://www.prisma.io/) - ORM
* [Vitest](https://vitest.dev/) - Herramienta de testing

## ✒️ Autores

* **Kevin Muñoz Rengifo** - *Totalidad* - [Kalevins](https://github.com/Kalevins)

## 🎁 Expresiones de Gratitud

* Agradecimientos especiales a PrevalentWare.