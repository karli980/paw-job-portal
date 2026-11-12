import { Link } from '@inertiajs/react';
import {
    ArrowLeft,
    Pencil,
    Lightbulb,
    Tags,
    CheckCircle2,
    XCircle,
} from 'lucide-react';

import { Button } from '@/components/ui/button';

interface Habilidad {
    id: number;
    nombre: string;
    categoria: string | null;
    estado: boolean;
}

interface ShowProps {
    habilidad: Habilidad;
}

export default function Show({ habilidad }: ShowProps) {
    return (
        <div className="min-h-full bg-muted/30">
            <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
                {/* CABECERA */}
                <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                    <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700 ring-1 ring-indigo-200/70 dark:bg-indigo-500/15 dark:text-indigo-300 dark:ring-indigo-400/20">
                            <Lightbulb className="h-6 w-6" />
                        </div>

                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                                Detalle de la habilidad
                            </h1>

                            <p className="mt-1 max-w-xl text-sm leading-relaxed text-muted-foreground">
                                Información de la habilidad seleccionada.
                            </p>
                        </div>
                    </div>

                    {/* ACCIONES */}
                    <div className="flex flex-wrap items-center gap-2">
                        <Button
                            variant="outline"
                            asChild
                            className="h-10 rounded-lg border-border px-4 font-medium text-foreground hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 focus-visible:ring-2 focus-visible:ring-indigo-500 dark:hover:border-indigo-400/30 dark:hover:bg-indigo-500/15 dark:hover:text-indigo-300"
                        >
                            <Link
                                href="/habilidades"
                                className="inline-flex items-center justify-center gap-2"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Volver
                            </Link>
                        </Button>

                        <Button
                            asChild
                            className="h-10 rounded-lg bg-indigo-600 px-4 font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background dark:bg-indigo-500 dark:hover:bg-indigo-400"
                        >
                            <Link
                                href={`/habilidades/${habilidad.id}/edit`}
                                className="inline-flex items-center justify-center gap-2"
                            >
                                <Pencil className="h-4 w-4" />
                                Editar
                            </Link>
                        </Button>
                    </div>
                </header>

                {/* TARJETA DE INFORMACIÓN */}
                <section className="mx-auto w-full max-w-3xl overflow-hidden rounded-xl border border-border bg-card shadow-sm">
                    <div className="border-b border-border px-5 py-4 sm:px-6">
                        <h2 className="text-base font-semibold text-foreground">
                            Información general
                        </h2>

                        <p className="mt-0.5 text-sm text-muted-foreground">
                            Datos registrados para esta habilidad.
                        </p>
                    </div>

                    <div className="space-y-6 p-5 sm:p-6">
                        {/* NOMBRE */}
                        <div className="space-y-3">
                            <span className="block text-sm font-semibold text-foreground">
                                Nombre
                            </span>

                            <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/60 px-4 py-3">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                                    <Lightbulb className="h-4 w-4" />
                                </div>

                                <span className="break-words text-sm font-semibold text-foreground sm:text-[0.95rem]">
                                    {habilidad.nombre}
                                </span>
                            </div>
                        </div>

                        {/* CATEGORÍA */}
                        <div className="space-y-3">
                            <span className="block text-sm font-semibold text-foreground">
                                Categoría
                            </span>

                            <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/60 px-4 py-3">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                                    <Tags className="h-4 w-4" />
                                </div>

                                <span className="break-words text-sm font-medium text-foreground">
                                    {habilidad.categoria?.trim() || 'Sin categoría'}
                                </span>
                            </div>
                        </div>

                        {/* ESTADO */}
                        <div className="space-y-3">
                            <span className="block text-sm font-semibold text-foreground">
                                Estado
                            </span>

                            <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/60 px-4 py-3">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                                    {habilidad.estado ? (
                                        <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                    ) : (
                                        <XCircle className="h-4 w-4 text-muted-foreground" />
                                    )}
                                </div>

                                {habilidad.estado ? (
                                    <span className="inline-flex items-center justify-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/15 dark:text-emerald-300">
                                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                        Activa
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center justify-center gap-1.5 rounded-full border border-border bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
                                        <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60" />
                                        Inactiva
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                <p className="pb-2 text-center text-xs text-muted-foreground">
                    Gestión de habilidades · Job Portal
                </p>
            </div>
        </div>
    );
}
