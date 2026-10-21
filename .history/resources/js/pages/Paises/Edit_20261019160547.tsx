import { Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';

interface Pais {
    id: number;
    nombre: string;
    codigo_iso: string;
    codigo_iso3: string;
    estado: boolean;
}

interface Props {
    pais: Pais;
}

export default function Edit({ pais }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        nombre: pais.nombre,
        codigo_iso: pais.codigo_iso,
        codigo_iso3: pais.codigo_iso3,
        estado: pais.estado,
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        put(`/paises/${pais.id}`);
    };

    return (
        <div>
            <h1>Editar país</h1>

            <form onSubmit={submit}>
                <div>
                    <label>Nombre</label>
                    <input
                        type="text"
                        value={data.nombre}
                        onChange={(e) => setData('nombre', e.target.value)}
                    />
                    {errors.nombre && <div>{errors.nombre}</div>}
                </div>

                <div>
                    <label>Código ISO (2 letras)</label>
                    <input
                        type="text"
                        value={data.codigo_iso}
                        onChange={(e) => setData('codigo_iso', e.target.value)}
                        maxLength={2}
                        placeholder="Ej: AR"
                    />
                    {errors.codigo_iso && <div>{errors.codigo_iso}</div>}
                </div>

                <div>
                    <label>Código ISO3 (3 letras)</label>
                    <input
                        type="text"
                        value={data.codigo_iso3}
                        onChange={(e) => setData('codigo_iso3', e.target.value)}
                        maxLength={3}
                        placeholder="Ej: ARG"
                    />
                    {errors.codigo_iso3 && <div>{errors.codigo_iso3}</div>}
                </div>

                <div>
                    <label>
                        <input
                            type="checkbox"
                            checked={data.estado}
                            onChange={(e) => setData('estado', e.target.checked)}
                        />
                        Activo
                    </label>
                    {errors.estado && <div>{errors.estado}</div>}
                </div>

                <button type="submit" disabled={processing}>
                    Actualizar
                </button>
            </form>

            <Link href="/paises">Volver</Link>
        </div>
    );
}
