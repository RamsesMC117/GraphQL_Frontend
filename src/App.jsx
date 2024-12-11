import { FormPersonas } from "./components/FormPersonas"
import { ListPersonas } from "./components/ListPersonas"
import { useQuery, gql } from '@apollo/client';

const GET_PERSONAS = gql`
    query GetPersonas {
        getPersonas {
            _id
            nombre
            apellido
            email
            telefono
            edad
            genero
            fechaNacimiento
        }
    }
`;

function App() {
  const { data, refetch } = useQuery(GET_PERSONAS);
  return (
    <>
      <div className="flex flex-col gap-4 m-4 p-4">
        <div>
          <h1 className="text-2xl font-bold">Personas API con GraphQL</h1>
        </div>

        <div className="flex w-full flex-col">
          <FormPersonas refetch={refetch} />
          <div className="divider"></div>
          <ListPersonas data={data} refetch={refetch} />
        </div>

      </div>
    </>
  )
}

export default App
