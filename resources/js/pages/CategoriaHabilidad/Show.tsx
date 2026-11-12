
import { Link } from '@inertiajs/react';
import {
    ArrowLeft,
    Pencil,
    Tags,
    CheckCircle2,
    XCircle,
} from 'lucide-react';

import { Button } from '@/components/ui/button';

interface CategoriaHabilidad {
    id: number;
    nombre: string;
    estado: boolean;
}

interface ShowProps {
    categoria: CategoriaHabilidad;
}

export default function Show({ categoria }: ShowProps) {
    return (
        <div className="min-h-full bg-muted/30">
            <div className="mx-auto w-full max-w-3xl space-y-6 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
                {/* CABECERA */}
                <header className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700 ring-1 ring-indigo-200/70 dark:bg-indigo-500/15 dark:text-indigo-300 dark:ring-indigo-400/20">
                        <Tags className="h-6 w-6" />
                    </div>

                    <div className="min-w-0 flex-1">
                        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                            Detalle de categoría
                        </h1>

                        <p className="mt-1 max-w-xl text-sm leading-relaxed text-muted-foreground">
                            Consulta la información de esta categoría de
                            habilidades.
                        </p>
                    </div>
                </header>

                {/* TARJETA DE INFORMACIÓN */}
                <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
                    <div className="border-b border-border bg-muted/40 px-5 py-4 sm:px-6">
                        <h2 className="text-base font-semibold text-foreground">
                            Información de la categoría
                        </h2>

                        <p className="mt-1 text-sm text-muted-foreground">
                            Datos registrados en el catálogo.
                        </p>
                    </div>

                    <div className="space-y-6 p-5 sm:p-6">
                        {/* NOMBRE */}
                        <div className="space-y-2">
                            <span className="block text-sm font-medium text-muted-foreground">
                                Nombre de la categoría
                            </span>

                            <div className="flex items-start gap-3 rounded-lg border border-border bg-background p-4">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300">
                                    <Tags className="h-5 w-5" />
                                </div>

                                <div className="min-w-0 flex-1">
                                    <p className="break-words text-base font-semibold text-foreground">
                                        {categoria.nombre}
                                    </p>

                                    <p className="mt-1 text-xs text-muted-foreground">
                                        Identificador: #{categoria.id}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* ESTADO */}
                        <div className="space-y-2">
                            <span className="block text-sm font-medium text-muted-foreground">
                                Estado
                            </span>

                            <div
                                className={`flex items-start gap-3 rounded-lg border p-4 ${
                                    categoria.estado
                                        ? 'border-emerald-200 bg-emerald-50/60 dark:border-emerald-500/30 dark:bg-emerald-500/10'
                                        : 'border-rose-200 bg-rose-50/60 dark:border-rose-500/30 dark:bg-rose-500/10'
                                }`}
                            >
                                {categoria.estado ? (
                                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                                ) : (
                                    <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-600 dark:text-rose-400" />
                                )}

                                <div>
                                    <p
                                        className={`text-sm font-semibold ${
                                            categoria.estado
                                                ? 'text-emerald-700 dark:text-emerald-400'
                                                : 'text-rose-700 dark:text-rose-400'
                                        }`}
                                    >
                                        {categoria.estado
                                            ? 'Activa'
                                            : 'Inactiva'}
                                    </p>

                                    <p className="mt-1 text-xs text-muted-foreground">
                                        {categoria.estado
                                            ? 'La categoría está habilitada para organizar las habilidades.'
                                            : 'La categoría está deshabilitada y puede reactivarse desde el listado.'}
                                    </p>
                                </div>
                            </div>
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
                                href="/categorias-habilidades"
                                className="inline-flex items-center justify-center gap-2"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Volver al listado
                            </Link>
                        </Button>

                        <Button
                            type="button"
                            asChild
                            className="h-10 rounded-lg bg-indigo-600 px-5 font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background dark:bg-indigo-500 dark:hover:bg-indigo-400"
                        >
                            <Link
                                href={`/categorias-habilidades/${categoria.id}/edit`}
                                className="inline-flex items-center justify-center gap-2"
                            >
                                <Pencil className="h-4 w-4" />
                                Editar categoría
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
