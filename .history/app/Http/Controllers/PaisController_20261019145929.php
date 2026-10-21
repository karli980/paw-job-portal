import { Link } from '@inertiajs/react';

interface Pais {
    id: number;
    nombre: string;
    codigo_iso: string;
    codigo_iso3: string;
    estado: boolean;
}

interface Props {
    paises: Pais[];
}

export default function Index({ paises }: Props) {
    return (
        <div>
            <h1>Países</h1>

            <Link href="/paises/create">
                Nuevo país
            </Link>

            <table>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Código ISO</th>
                        <th>Código ISO3</th>
                        <th>Estado</th>
                    </tr>
                </thead>
                <tbody>
                    {paises.map((pais) => (
                        <tr key={pais.id}>
                            <td>{pais.nombre}</td>
                            <td>{pais.codigo_iso}</td>
                            <td>{pais.codigo_iso3}</td>
                            <td>{pais.estado ? 'Activo' : 'Inactivo'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
