import { Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        nombre: '',
        codigo_iso: '',
        codigo_iso3: '',
        estado: true,
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        post('/paises');
    };

    return (
        <div>
            <h1>Nuevo país</h1>

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
                    {processing ? 'Guardando...' : 'Guardar'}
                </button>
            </form>

            <Link href="/paises">Volver</Link>
        </div>
    );
}
