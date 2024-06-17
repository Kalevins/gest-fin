import { User } from "@prisma/client"
import gql from "graphql-tag"
import { useMutation, useQuery } from "@apollo/client"

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { EditUser } from "@/components/users/editUser"
import { Skeleton } from "@/components/ui/skeleton"

// Querys de GraphQL
const GET_USERS = gql`
  query GetUsers {
    users {
      id
      name
      email
      phone
      role
    }
  }
`;

const EDIT_USER = gql`
  mutation EditUser($id: ID!, $name: String!, $role: Role!) {
    editUser(id: $id, name: $name, role: $role) {
      id
      name
      email
      phone
      role
    }
  }
`

export default function Index() {
  const { loading, data } = useQuery(GET_USERS);
  const [editUser, { loading: loadingEdit }] = useMutation(EDIT_USER,
    {
      refetchQueries: [{ query: GET_USERS }],
    }
  )

  return (
    <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
      <Card>
        <CardHeader className="px-7">
          <div className='flex justify-between'>
            <CardTitle>Usuarios</CardTitle>
          </div>
          <CardDescription>A continuación se muestran los usuarios registrados</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead className="hidden sm:table-cell">Correo</TableHead>
                <TableHead className="hidden sm:table-cell">Teléfono</TableHead>
                <TableHead className="text-center">Acciones </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index} >
                    <TableCell colSpan={4}>
                      <Skeleton className="h-10 w-full" />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                data?.users?.map((user: User) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell className="hidden sm:table-cell">{user.email}</TableCell>
                    <TableCell className="hidden sm:table-cell">{user.phone}</TableCell>
                    <TableCell className="text-center">
                      <EditUser handleEditUser={editUser} user={user} loading={loadingEdit}/>
                    </TableCell>
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
