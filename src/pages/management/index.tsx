import { useSession } from "next-auth/react"
import { MovementType, Role } from "@prisma/client"
import { gql, useMutation, useQuery } from "@apollo/client"

import { fixAmount, fixDate } from "@/lib/fixData"
import { NewRegister } from "@/components/management/newRegister"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"

// Querys de GraphQL
const GET_MOVEMENTS = gql`
  query GetMovements {
    movements {
      id
      concept
      amount
      date
      type
      user {
        name
        email
      }
    }
  }
`;

const CREATE_MOVEMENT = gql`
  mutation CreateMovement($concept: String!, $amount: Float!, $date: String!, $type: MovementType!) {
    createMovement(concept: $concept, amount: $amount, date: $date, type: $type) {
      id
      concept
      amount
      date
      type
    }
  }
`

export default function Index() {
  const { data: session } = useSession();
  const { loading, data } = useQuery(GET_MOVEMENTS);
  const [createMovement, { loading: loadingCreate }] = useMutation(CREATE_MOVEMENT,
    {
      refetchQueries: [{ query: GET_MOVEMENTS }],
    }
  )

  return (
    <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
      <Card>
        <CardHeader className="px-7">
          <div className='flex justify-between'>
            <CardTitle>Ingresos y Egresos</CardTitle>
            {session?.user?.role === Role.ADMIN && <NewRegister handleNewRegister={createMovement} loading={loadingCreate}/>}
          </div>
          <CardDescription>A continuación se muestran los ingresos y egresos registrados</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Concepto</TableHead>
                <TableHead className="hidden sm:table-cell">Monto</TableHead>
                <TableHead className="hidden sm:table-cell">Fecha</TableHead>
                <TableHead className="hidden sm:table-cell">Usuario</TableHead>
                <TableHead className="text-right">Tipo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index} >
                    <TableCell colSpan={5}>
                      <Skeleton className="h-10 w-full" />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                data?.movements?.map((movement: any) => (
                  <TableRow key={movement.id}>
                    <TableCell>{movement.concept}</TableCell>
                    <TableCell className="hidden sm:table-cell">{fixAmount(movement.amount)}</TableCell>
                    <TableCell className="hidden sm:table-cell">{fixDate(movement.date)}</TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <div className="font-medium">{movement.user.name}</div>
                      <div className="hidden text-sm text-muted-foreground md:inline">{movement.user.email}</div>
                    </TableCell>
                    <TableCell className="text-right">{movement.type === MovementType.EXPENSE ? "Egreso" : "Ingreso"}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
