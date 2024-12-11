import { useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { notification } from 'antd';

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

const DELETE_PERSONA = gql`
    mutation DeletePersona($id: ID!) {
        deletePersona(id: $id)
    }
`;

const UPDATE_PERSONA = gql`
    mutation UpdatePersona(
        $id: ID!
        $nombre: String
        $apellido: String
        $email: String
        $telefono: String
        $edad: Int
        $genero: String
        $fechaNacimiento: String
    ) {
        updatePersona(
            id: $id
            nombre: $nombre
            apellido: $apellido
            email: $email
            telefono: $telefono
            edad: $edad
            genero: $genero
            fechaNacimiento: $fechaNacimiento
        ) {
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

export function ListPersonas() {
    const { loading, error, data, refetch } = useQuery(GET_PERSONAS);
    const [deletePersona] = useMutation(DELETE_PERSONA);
    const [updatePersona] = useMutation(UPDATE_PERSONA);

    // Estado para controlar el modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPersona, setSelectedPersona] = useState(null);

    const handleDelete = async (id) => {
        try {
            await deletePersona({ variables: { id } });
            refetch();

            notification.success({
                message: 'Eliminación exitosa',
                description: 'El registro ha sido eliminado correctamente.',
                placement: 'topRight',
            });
        } catch (err) {
            console.error('Error eliminando persona:', err.message);
            notification.error({
                message: 'Error al eliminar',
                description: 'Ocurrió un error al intentar eliminar el registro.',
                placement: 'topRight',
            });
        }
    };

    const handleEdit = (persona) => {
        setSelectedPersona(persona);
        setIsModalOpen(true); // Abre el modal
    };

    const handleSave = async () => {
        try {
            await updatePersona({
                variables: {
                    id: selectedPersona._id,
                    ...selectedPersona,
                    edad: parseInt(selectedPersona.edad, 10) || null, // Convertir edad a número
                },
            });
            refetch();
            setIsModalOpen(false);

            notification.success({
                message: 'Actualización exitosa',
                description: 'Los datos han sido actualizados correctamente.',
                placement: 'topRight',
            });
        } catch (err) {
            console.error('Error actualizando persona:', err.message);
            notification.error({
                message: 'Error al actualizar',
                description: 'No se pudieron guardar los cambios. Intenta nuevamente.',
                placement: 'topRight',
            });
        }
    };

    if (loading) return <p>Cargando datos...</p>;
    if (error) return <p>Error al cargar datos: {error.message}</p>;

    return (
        <div className="overflow-x-auto">
            <table className="table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Nombre</th>
                        <th>Apellido</th>
                        <th>Correo</th>
                        <th>Teléfono</th>
                        <th>Edad</th>
                        <th>Género</th>
                        <th>Fecha de nacimiento</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {data.getPersonas.map((persona, index) => (
                        <tr key={persona._id}>
                            <td>{index + 1}</td>
                            <td>{persona.nombre}</td>
                            <td>{persona.apellido}</td>
                            <td>{persona.email}</td>
                            <td>{persona.telefono || 'N/A'}</td>
                            <td>{persona.edad || 'N/A'}</td>
                            <td>{persona.genero || 'N/A'}</td>
                            <td>{persona.fechaNacimiento || 'N/A'}</td>
                            <td>
                                <button
                                    className="btn btn-warning btn-sm"
                                    onClick={() => handleEdit(persona)}
                                >
                                    Editar
                                </button>
                                <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => handleDelete(persona._id)}
                                >
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Modal para editar */}
            {isModalOpen && selectedPersona && (
                <div className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">Editar Persona</h3>
                        <div className="form-control">
                            <label>Nombre:</label>
                            <input
                                type="text"
                                className="input input-bordered"
                                value={selectedPersona.nombre}
                                onChange={(e) =>
                                    setSelectedPersona({ ...selectedPersona, nombre: e.target.value })
                                }
                            />
                            <label>Apellido:</label>
                            <input
                                type="text"
                                className="input input-bordered"
                                value={selectedPersona.apellido}
                                onChange={(e) =>
                                    setSelectedPersona({ ...selectedPersona, apellido: e.target.value })
                                }
                            />
                            <label>Email:</label>
                            <input
                                type="email"
                                className="input input-bordered"
                                value={selectedPersona.email}
                                onChange={(e) =>
                                    setSelectedPersona({ ...selectedPersona, email: e.target.value })
                                }
                            />
                            <label>Teléfono:</label>
                            <input
                                type="text"
                                className="input input-bordered"
                                value={selectedPersona.telefono}
                                onChange={(e) =>
                                    setSelectedPersona({ ...selectedPersona, telefono: e.target.value })
                                }
                            />
                            <label>Edad:</label>
                            <input
                                type="number"
                                className="input input-bordered"
                                value={selectedPersona.edad}
                                onChange={(e) =>
                                    setSelectedPersona({ ...selectedPersona, edad: e.target.value })
                                }
                            />
                            <label>Género:</label>
                            <select
                                className="select select-bordered"
                                value={selectedPersona.genero}
                                onChange={(e) =>
                                    setSelectedPersona({ ...selectedPersona, genero: e.target.value })
                                }
                            >
                                <option value="Masculino">Masculino</option>
                                <option value="Femenino">Femenino</option>
                            </select>
                            <label>Fecha de Nacimiento:</label>
                            <input
                                type="date"
                                className="input input-bordered"
                                value={selectedPersona.fechaNacimiento}
                                onChange={(e) =>
                                    setSelectedPersona({
                                        ...selectedPersona,
                                        fechaNacimiento: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div className="modal-action">
                            <button className="btn btn-primary" onClick={handleSave}>
                                Guardar
                            </button>
                            <button className="btn" onClick={() => setIsModalOpen(false)}>
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
