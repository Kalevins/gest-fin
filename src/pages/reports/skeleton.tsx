import { FileIcon } from "@/components/ui/icons"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton";

export default function Index() {

  return (
    <>
      <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Saldo total</CardDescription>
              <CardTitle className="text-4xl">
                <Skeleton className="w-24 h-7" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">
                <Skeleton className="w-20 h-3" />
              </div>
            </CardContent>
            <CardFooter>
              <div className="text-xs text-muted-foreground">
                <Skeleton className="w-20 h-3" />
              </div>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Ingresos</CardDescription>
              <CardTitle className="text-4xl">
                <Skeleton className="w-24 h-7" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">
                <Skeleton className="w-20 h-3" />
              </div>
            </CardContent>
            <CardFooter>
              <Skeleton className="w-full h-3" />
            </CardFooter>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Egresos</CardDescription>
              <CardTitle className="text-4xl">
                <Skeleton className="w-24 h-7" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">
                <Skeleton className="w-20 h-3" />
              </div>
            </CardContent>
            <CardFooter>
              <Skeleton className="w-full h-3" />
            </CardFooter>
          </Card>
        </div>
        <Tabs defaultValue="lines">
          <div className="flex items-center">
            <TabsList>
              <TabsTrigger value="lines">Lineas</TabsTrigger>
              <TabsTrigger value="bars">Barras</TabsTrigger>
            </TabsList>
            <div className="ml-auto flex items-center gap-2">
              <Button size="sm" variant="outline" className="h-7 gap-1 text-sm">
                <FileIcon className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only">Descargar</span>
              </Button>
            </div>
          </div>
          <TabsContent value="lines">
            <Card>
              <CardHeader className="px-7">
                <CardTitle>Reportes</CardTitle>
                <CardDescription>A continuación se muestra un gráfico de los moviminetos financieros</CardDescription>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-96 w-full" />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="bars">
            <Card>
              <CardHeader className="px-7">
                <CardTitle>Reportes</CardTitle>
                <CardDescription>A continuación se muestra un gráfico de los moviminetos financieros</CardDescription>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-96 w-full" />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}
