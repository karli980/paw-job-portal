import { Link, router } from '@inertiajs/react';

interface Pais {
    id: number;
    nombre: string;
    codigo_iso: string;
    codigo_iso3: string;
    estado: boolean;
}

interface Props {
    paises: Pais[];
    flash?: {
        success?: string;
    };
}

export default function Index({ paises, flash }: Props) {
    const eliminar = (id: number) => {
        if (confirm('¿Está seguro de eliminar este país?')) {
            router.delete(`/paises/${id}`);
        }
    };

    return (
        <div>
            <h1>Países</h1>

            {flash?.success && (
                <div>
                    {flash.success}
                </div>
            )}

            <Link href="/paises/create">Nuevo país</Link>

            <table>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Código ISO</th>
                        <th>Código ISO3</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {paises.map((pais) => (
                        <tr key={pais.id}>
                            <td>{pais.nombre}</td>
                            <td>{pais.codigo_iso}</td>
                            <td>{pais.codigo_iso3}</td>
                            <td>
                                <Link href={`/paises/${pais.id}/edit`}>
                                    Editar
                                </Link>
                                {' | '}
                                <button
                                    type="button"
                                    onClick={() => eliminar(pais.id)}
                                >
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
