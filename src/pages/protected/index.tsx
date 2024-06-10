import { useSession, signIn, signOut } from 'next-auth/react'
import { useQuery, gql } from '@apollo/client';

const GET_USERS = gql`
  query GetUsers {
    users {
      id
      name
      email
    }
  }
`;

export default function ProtectedPage() {
  const { data: session } = useSession()
  const { loading, error, data } = useQuery(GET_USERS);

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error.message}</p>;

  if (!session) {
    return (
      <div>
        <p>No estás autenticado</p>
        <button onClick={() => signIn()}>Iniciar sesión</button>
        <div>
          <h1>Lista de usuarios</h1>
          <ul>
            {data.users.map((user: any) => (
              <li key={user.id}>{user.name} ({user.email})</li>
            ))}
          </ul>
        </div>
      </div>
    )
  }

  return (
    <div>
      <p>Bienvenido {session?.user?.name}</p>
      <button onClick={() => signOut()}>Cerrar sesión</button>
      <div>
        <h1>Lista de usuarios</h1>
        <ul>
          {data.users.map((user: any) => (
            <li key={user.id}>{user.name} ({user.email})</li>
          ))}
        </ul>
      </div>
    </div>
  )
}
