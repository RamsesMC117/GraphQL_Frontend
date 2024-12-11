import { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import { notification } from 'antd';

const CREATE_PERSONA = gql`
    mutation CreatePersona(
        $nombre: String!
        $apellido: String!
        $email: String!
        $telefono: String
        $edad: Int
        $genero: String
        $fechaNacimiento: String
    ) {
        createPersona(
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

export function FormPersonas({ refetch }) {
    const [formValues, setFormValues] = useState({
        nombre: '',
        apellido: '',
        email: '',
        telefono: '',
        edad: '',
        genero: '',
        fechaNacimiento: '',
    });

    const [createPersona] = useMutation(CREATE_PERSONA);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createPersona({
                variables: {
                    ...formValues,
                    edad: parseInt(formValues.edad, 10) || null, // Convertir edad a número
                },
            });
            notification.success({
                message: 'Inserción exitosa',
                description: 'El registro se ha guardado correctamente.',
                placement: 'topRight',
            });
            refetch(); // Actualiza la lista en la tabla
            setFormValues({
                nombre: '',
                apellido: '',
                email: '',
                telefono: '',
                edad: '',
                genero: '',
                fechaNacimiento: '',
            }); // Resetea el formulario
        } catch (err) {
            notification.error({
                message: 'Error al guardar',
                description: 'No se pudo guardar el registro. Intenta nuevamente.',
                placement: 'topRight',
            });
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="mt-6 flex flex-row flex-wrap gap-4">
                <div>
                    <label className="input input-bordered flex items-center gap-2">
                        Nombre:
                        <input
                            type="text"
                            className="grow"
                            placeholder="Nombre"
                            name="nombre"
                            value={formValues.nombre}
                            onChange={handleChange}
                            required
                        />
                    </label>
                </div>
                <div>
                    <label className="input input-bordered flex items-center gap-2">
                        Apellido:
                        <input
                            type="text"
                            className="grow"
                            placeholder="Apellido"
                            name="apellido"
                            value={formValues.apellido}
                            onChange={handleChange}
                            required
                        />
                    </label>
                </div>
                <div>
                    <label className="input input-bordered flex items-center gap-2">
                        Correo electrónico:
                        <input
                            type="email"
                            className="grow"
                            placeholder="example@example.com"
                            name="email"
                            value={formValues.email}
                            onChange={handleChange}
                            required
                        />
                    </label>
                </div>
                <div>
                    <label className="input input-bordered flex items-center gap-2">
                        Teléfono:
                        <input
                            type="text"
                            className="grow"
                            placeholder="1234567890"
                            name="telefono"
                            value={formValues.telefono}
                            onChange={handleChange}
                        />
                    </label>
                </div>
                <div>
                    <label className="input input-bordered flex items-center gap-2">
                        Edad:
                        <input
                            type="number"
                            className="grow"
                            placeholder="25"
                            name="edad"
                            value={formValues.edad}
                            onChange={handleChange}
                        />
                    </label>
                </div>
                <div>
                    <select
                        className="select select-bordered w-72"
                        name="genero"
                        value={formValues.genero}
                        onChange={handleChange}
                        required
                    >
                        <option disabled value="">
                            Género
                        </option>
                        <option value="Masculino">Masculino</option>
                        <option value="Femenino">Femenino</option>
                    </select>
                </div>
                <div>
                    <label className="input input-bordered flex items-center gap-2">
                        Fecha de nacimiento:
                        <input
                            type="date"
                            className="grow"
                            name="fechaNacimiento"
                            value={formValues.fechaNacimiento}
                            onChange={handleChange}
                            required
                        />
                    </label>
                </div>
            </div>
            <div className="mt-6">
                <button type="submit" className="btn btn-primary w-48">
                    Guardar
                </button>
            </div>
        </form>
    );
}
