import { Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import {
    ArrowLeft,
    Tags,
    Save,
    AlertCircle,
    Percent,
    FileText,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';


export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        nombre: '',
        porcentaje: '',
        descripcion: '',
        estado: true,
    });

    const submit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        post('/niveles-habilidades');
    };

    return (
        <div className="min-h-full bg-muted/30">
            <div className="mx-auto max-w-4xl space-y-6 p-4 md:p-8">
                {/* Encabezado */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                            <Tags className="h-6 w-6" />
                        </div>

                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">
                                Nuevo nivel de habilidad
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Registrá un nivel de dominio de una habilidad.
                            </p>
                        </div>
                    </div>

                    <Button variant="outline" asChild>
                        <Link href="/niveles-habilidades">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Volver al listado
                        </Link>
                    </Button>
                </div>

                {/* Formulario */}
                <form onSubmit={submit} className="space-y-6">
                    <div className="rounded-xl border bg-card p-5 shadow-sm md:p-7">
                        <div className="mb-6">
                            <h2 className="text-lg font-semibold">
                                Datos del nivel
                            </h2>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Completá los datos del nivel de habilidad.
                                El porcentaje es opcional.
                            </p>
                        </div>

                        <div className="space-y-5">
                            {/* Nombre */}
                            <div className="space-y-2">
                                <label
                                    htmlFor="nombre"
                                    className="text-sm font-medium"
                                >
                                    Nombre del nivel{' '}
                                    <span className="text-red-500">*</span>
                                </label>

                                <Input
                                    id="nombre"
                                    value={data.nombre}
                                    onChange={(e) =>
                                        setData('nombre', e.target.value)
                                    }
                                    placeholder="Ej.: Intermedio"
                                    maxLength={50}
                                    required
                                    autoFocus
                                    aria-invalid={Boolean(errors.nombre)}
                                />

                                {errors.nombre && (
                                    <p className="flex items-center gap-2 text-sm text-red-600">
                                        <AlertCircle className="h-4 w-4 shrink-0" />
                                        {errors.nombre}
                                    </p>
                                )}

                                <p className="text-xs text-muted-foreground">
                                    Máximo 50 caracteres.
                                </p>
                            </div>

                            {/* Porcentaje */}
                            <div className="space-y-2">
                                <label
                                    htmlFor="porcentaje"
                                    className="flex items-center gap-2 text-sm font-medium"
                                >
                                    <Percent className="h-4 w-4 text-indigo-600" />
                                    Porcentaje de dominio
                                </label>

                                <div className="relative">
                                    <Input
                                        id="porcentaje"
                                        type="number"
                                        min={0}
                                        max={100}
                                        step={1}
                                        value={data.porcentaje}
                                        onChange={(e) =>
                                            setData(
                                                'porcentaje',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Ej.: 70"
                                        aria-invalid={Boolean(errors.porcentaje)}
                                        className="pr-10"
                                    />
                                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                                        %
                                    </span>
                                </div>

                                {errors.porcentaje && (
                                    <p className="flex items-center gap-2 text-sm text-red-600">
                                        <AlertCircle className="h-4 w-4 shrink-0" />
                                        {errors.porcentaje}
                                    </p>
                                )}

                                <p className="text-xs text-muted-foreground">
                                    Opcional. Ingresá un valor entero entre 0
                                    y 100. Podés dejarlo vacío si no querés
                                    asignar un porcentaje.
                                </p>
                            </div>

                            {/* Descripción */}

                            {/* Descripción */}
                            <div className="space-y-2">
                                <label
                                    htmlFor="descripcion"
                                    className="flex items-center gap-2 text-sm font-medium"
                                >
                                    <FileText className="h-4 w-4 text-indigo-600" />
                                    Descripción
                                </label>

                                <textarea
                                    id="descripcion"
                                    value={data.descripcion}
                                    onChange={(e) => setData('descripcion', e.target.value)}
                                    placeholder="Describí brevemente qué representa este nivel..."
                                    maxLength={255}
                                    rows={4}
                                    aria-invalid={Boolean(errors.descripcion)}
                                    className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                />

                                {errors.descripcion && (
                                    <p className="flex items-center gap-2 text-sm text-red-600">
                                        <AlertCircle className="h-4 w-4 shrink-0" />
                                        {errors.descripcion}
                                    </p>
                                )}

                                <p className="text-xs text-muted-foreground">
                                    Opcional. Máximo 255 caracteres.
                                </p>
                            </div>

                            {/* Estado */}
                            <div className="rounded-lg border bg-muted/20 p-4">
                                <label
                                    htmlFor="estado"
                                    className="flex cursor-pointer items-start gap-3"
                                >
                                    <input
                                        id="estado"
                                        type="checkbox"
                                        checked={data.estado}
                                        onChange={(e) =>
                                            setData('estado', e.target.checked)
                                        }
                                        className="mt-1 h-4 w-4 rounded border-input accent-indigo-600"
                                    />

                                    <span className="space-y-1">
                                        <span className="block text-sm font-medium">
                                            Nivel activo
                                        </span>
                                        <span className="block text-sm text-muted-foreground">
                                            Los niveles activos estarán
                                            disponibles para utilizarse en el
                                            sistema.
                                        </span>
                                    </span>
                                </label>

                                {errors.estado && (
                                    <p className="mt-2 flex items-center gap-2 text-sm text-red-600">
                                        <AlertCircle className="h-4 w-4 shrink-0" />
                                        {errors.estado}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Acciones */}
                    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                        <Button
                            type="button"
                            variant="outline"
                            asChild
                            disabled={processing}
                        >
                            <Link href="/niveles-habilidades">
                                Cancelar
                            </Link>
                        </Button>

                        <Button
                            type="submit"
                            disabled={processing}
                            className="bg-indigo-600 text-white hover:bg-indigo-700"
                        >
                            <Save className="mr-2 h-4 w-4" />
                            {processing
                                ? 'Guardando...'
                                : 'Guardar nivel'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
