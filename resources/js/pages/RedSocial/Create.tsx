
import { Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import {
    ArrowLeft,
    Share2,
    Save,
    AlertCircle,
    CheckCircle2,
    ExternalLink,
    Globe,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        nombre: '',
        url: '',
        icono: '',
        estado: true,
    });

    const submit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post('/redes-sociales');
    };

    return (
        <div className="min-h-full bg-muted/30">
            <div className="mx-auto w-full max-w-3xl space-y-6 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
                {/* CABECERA */}
                <header className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700 ring-1 ring-indigo-200/70 dark:bg-indigo-500/15 dark:text-indigo-300 dark:ring-indigo-400/20">
                        <Share2 className="h-6 w-6" />
                    </div>

                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                            Nueva red social
                        </h1>

                        <p className="mt-1 max-w-xl text-sm leading-relaxed text-muted-foreground">
                            Registrá una nueva red social en el catálogo.
                        </p>
                    </div>
                </header>

                {/* FORMULARIO */}
                <form
                    onSubmit={submit}
                    className="rounded-xl border border-border bg-card shadow-sm"
                >
                    <div className="space-y-6 p-5 sm:p-6">
                        {/* NOMBRE */}
                        <div className="space-y-3">
                            <label
                                htmlFor="nombre"
                                className="block text-sm font-semibold text-foreground"
                            >
                                Nombre
                                <span className="ml-0.5 text-rose-500">*</span>
                            </label>

                            <Input
                                id="nombre"
                                type="text"
                                value={data.nombre}
                                onChange={(e) =>
                                    setData('nombre', e.target.value)
                                }
                                placeholder="Ej. LinkedIn, Instagram, Facebook..."
                                maxLength={100}
                                autoFocus
                                aria-invalid={!!errors.nombre}
                                aria-describedby={
                                    errors.nombre
                                        ? 'error-nombre'
                                        : undefined
                                }
                                className={`h-10 rounded-lg border-border bg-background transition-shadow focus-visible:ring-indigo-500 ${
                                    errors.nombre
                                        ? 'border-rose-400 focus-visible:ring-rose-500'
                                        : ''
                                }`}
                            />

                            <div className="flex items-center justify-between gap-3">
                                {errors.nombre ? (
                                    <p
                                        id="error-nombre"
                                        className="flex items-center gap-1.5 text-xs font-medium text-rose-600 dark:text-rose-400"
                                    >
                                        <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                                        {errors.nombre}
                                    </p>
                                ) : (
                                    <span className="text-xs text-muted-foreground">
                                        Nombre identificativo de la red social.
                                    </span>
                                )}

                                <span
                                    className={`shrink-0 text-xs tabular-nums ${
                                        data.nombre.length > 90
                                            ? 'text-amber-600 dark:text-amber-400'
                                            : 'text-muted-foreground'
                                    }`}
                                >
                                    {data.nombre.length}/100
                                </span>
                            </div>
                        </div>

                        {/* URL */}
                        <div className="space-y-3">
                            <label
                                htmlFor="url"
                                className="block text-sm font-semibold text-foreground"
                            >
                                URL
                                <span className="ml-0.5 text-rose-500">*</span>
                            </label>

                            <div className="relative">
                                <Globe className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                                <Input
                                    id="url"
                                    type="url"
                                    value={data.url}
                                    onChange={(e) =>
                                        setData('url', e.target.value)
                                    }
                                    placeholder="https://www.linkedin.com"
                                    maxLength={255}
                                    aria-invalid={!!errors.url}
                                    aria-describedby={
                                        errors.url ? 'error-url' : undefined
                                    }
                                    className={`h-10 rounded-lg border-border bg-background pl-9 transition-shadow focus-visible:ring-indigo-500 ${
                                        errors.url
                                            ? 'border-rose-400 focus-visible:ring-rose-500'
                                            : ''
                                    }`}
                                />
                            </div>

                            {errors.url ? (
                                <p
                                    id="error-url"
                                    className="flex items-center gap-1.5 text-xs font-medium text-rose-600 dark:text-rose-400"
                                >
                                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                                    {errors.url}
                                </p>
                            ) : (
                                <p className="text-xs text-muted-foreground">
                                    Ingresá la dirección completa, incluyendo
                                    https://.
                                </p>
                            )}

                            {/^https?:\/\/.+\..+/.test(data.url.trim()) && (
                                <a
                                    href={data.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-700 hover:underline dark:text-indigo-400 dark:hover:text-indigo-300"
                                >
                                    <ExternalLink className="h-3.5 w-3.5" />
                                    Comprobar enlace
                                </a>
                            )}
                        </div>

                        {/* ICONO */}
                        <div className="space-y-3">
                            <label
                                htmlFor="icono"
                                className="block text-sm font-semibold text-foreground"
                            >
                                Ícono
                                <span className="ml-0.5 text-rose-500">*</span>
                            </label>

                            <Input
                                id="icono"
                                type="text"
                                value={data.icono}
                                onChange={(e) =>
                                    setData('icono', e.target.value)
                                }
                                placeholder="Ej. linkedin, instagram, facebook"
                                maxLength={100}
                                aria-invalid={!!errors.icono}
                                aria-describedby={
                                    errors.icono
                                        ? 'error-icono'
                                        : undefined
                                }
                                className={`h-10 rounded-lg border-border bg-background transition-shadow focus-visible:ring-indigo-500 ${
                                    errors.icono
                                        ? 'border-rose-400 focus-visible:ring-rose-500'
                                        : ''
                                }`}
                            />

                            <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/40 p-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-background text-indigo-600 dark:text-indigo-400">
                                    <Share2 className="h-5 w-5" />
                                </div>

                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-medium text-foreground">
                                        Vista previa del ícono
                                    </p>
                                    <p className="mt-0.5 break-all text-xs text-muted-foreground">
                                        {data.icono || 'Sin especificar'}
                                    </p>
                                </div>
                            </div>

                            {errors.icono && (
                                <p
                                    id="error-icono"
                                    className="flex items-center gap-1.5 text-xs font-medium text-rose-600 dark:text-rose-400"
                                >
                                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                                    {errors.icono}
                                </p>
                            )}

                            <p className="text-xs text-muted-foreground">
                                Ingresá el nombre o la referencia del ícono
                                que utilizará la aplicación.
                            </p>
                        </div>

                        {/* ESTADO */}
                        <div className="space-y-3">
                            <span className="block text-sm font-semibold text-foreground">
                                Estado
                            </span>

                            <label
                                htmlFor="estado"
                                className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3.5 transition-colors ${
                                    data.estado
                                        ? 'border-emerald-200 bg-emerald-50/60 dark:border-emerald-500/30 dark:bg-emerald-500/10'
                                        : 'border-border bg-muted/40 hover:bg-muted/60'
                                }`}
                            >
                                <input
                                    id="estado"
                                    type="checkbox"
                                    checked={data.estado}
                                    onChange={(e) =>
                                        setData('estado', e.target.checked)
                                    }
                                    className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded border-border text-indigo-600 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0"
                                />

                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-1.5">
                                        {data.estado && (
                                            <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                        )}

                                        <span className="text-sm font-medium text-foreground">
                                            {data.estado ? 'Activa' : 'Inactiva'}
                                        </span>
                                    </div>

                                    <p className="mt-0.5 text-xs text-muted-foreground">
                                        {data.estado
                                            ? 'La red social estará disponible para ser utilizada.'
                                            : 'La red social quedará inactiva, pero podrás reactivarla después.'}
                                    </p>
                                </div>
                            </label>

                            {errors.estado && (
                                <p className="flex items-center gap-1.5 text-xs font-medium text-rose-600 dark:text-rose-400">
                                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                                    {errors.estado}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* ACCIONES */}
                    <div className="flex flex-col-reverse gap-2 border-t border-border bg-muted/40 px-5 py-4 sm:flex-row sm:items-center sm:justify-end sm:px-6">
                        <Button
                            type="button"
                            variant="outline"
                            asChild
                            className="h-10 rounded-lg border-border bg-background px-4 font-medium text-foreground hover:bg-muted focus-visible:ring-2 focus-visible:ring-indigo-500"
                        >
                            <Link
                                href="/redes-sociales"
                                className="inline-flex items-center justify-center gap-2"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Cancelar
                            </Link>
                        </Button>

                        <Button
                            type="submit"
                            disabled={processing}
                            className="h-10 rounded-lg bg-indigo-600 px-5 font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-60 dark:bg-indigo-500 dark:hover:bg-indigo-400"
                        >
                            <Save className="mr-2 h-4 w-4" />
                            {processing ? 'Guardando...' : 'Guardar red social'}
                        </Button>
                    </div>
                </form>

                <p className="pb-2 text-center text-xs text-muted-foreground">
                    Los campos con <span className="text-rose-500">*</span> son
                    obligatorios.
                </p>
            </div>
        </div>
    );
}
