
import { Link } from '@inertiajs/react';
import {
    ArrowLeft,
    Pencil,
    Users,
    Hash,
    CheckCircle2,
    XCircle,
    Infinity,
    ArrowDownToLine,
    ArrowUpFromLine,
} from 'lucide-react';

import { Button } from '@/components/ui/button';

interface CantidadEmpleado {
    id: number;
    nombre: string;
    minimo: number;
    maximo: number | null;
    estado: boolean;
}

interface ShowProps {
    cantidadEmpleado: CantidadEmpleado;
}

export default function Show({ cantidadEmpleado }: ShowProps) {
    const formatoNumero = (valor: number) =>
        valor.toLocaleString('es-AR');

    return (
        <div className="min-h-full bg-muted/30">
            <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">

                {/* CABECERA */}
                <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                    <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700 ring-1 ring-indigo-200/70 dark:bg-indigo-500/15 dark:text-indigo-300 dark:ring-indigo-400/20">
                            <Users className="h-6 w-6" />
                        </div>

                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                                Detalle del rango de empleados
                            </h1>

                            <p className="mt-1 max-w-xl text-sm leading-relaxed text-muted-foreground">
                                Información del rango de empleados seleccionado.
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <Button
                            variant="outline"
                            asChild
                            className="h-10 rounded-lg border-border px-4 font-medium text-foreground hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 focus-visible:ring-2 focus-visible:ring-indigo-500 dark:hover:border-indigo-400/30 dark:hover:bg-indigo-500/15 dark:hover:text-indigo-300"
                        >
                            <Link
                                href="/cantidad-empleados"
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
                                href={`/cantidad-empleados/${cantidadEmpleado.id}/edit`}
                                className="inline-flex items-center justify-center gap-2"
                            >
                                <Pencil className="h-4 w-4" />
                                Editar
                            </Link>
                        </Button>
                    </div>
                </header>

                {/* TARJETA CENTRADA */}
                <section className="mx-auto w-full max-w-3xl overflow-hidden rounded-xl border border-border bg-card shadow-sm">
                    <div className="border-b border-border px-5 py-4 sm:px-6">
                        <h2 className="text-base font-semibold text-foreground">
                            Información general
                        </h2>

                        <p className="mt-0.5 text-sm text-muted-foreground">
                            Datos registrados para este rango de empleados.
                        </p>
                    </div>

                    <div className="space-y-6 p-5 sm:p-6">

                        {/* Nombre */}
                        <div className="space-y-3">
                            <span className="block text-sm font-semibold text-foreground">
                                Nombre del rango
                            </span>

                            <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/60 px-4 py-3">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                                    <Users className="h-4 w-4" />
                                </div>

                                <span className="text-sm font-semibold text-foreground sm:text-[0.95rem]">
                                    {cantidadEmpleado.nombre}
                                </span>
                            </div>
                        </div>

                        {/* Cantidad mínima */}
                        <div className="space-y-3">
                            <span className="block text-sm font-semibold text-foreground">
                                Cantidad mínima de empleados
                            </span>

                            <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/60 px-4 py-3">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                                    <ArrowDownToLine className="h-4 w-4" />
                                </div>

                                <span className="text-sm font-semibold text-foreground sm:text-[0.95rem]">
                                    {formatoNumero(cantidadEmpleado.minimo)}
                                </span>
                            </div>
                        </div>

                        {/* Cantidad máxima */}
                        <div className="space-y-3">
                            <span className="block text-sm font-semibold text-foreground">
                                Cantidad máxima de empleados
                            </span>

                            <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/60 px-4 py-3">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                                    {cantidadEmpleado.maximo === null ? (
                                        <Infinity className="h-4 w-4" />
                                    ) : (
                                        <ArrowUpFromLine className="h-4 w-4" />
                                    )}
                                </div>

                                <span className="text-sm font-semibold text-foreground sm:text-[0.95rem]">
                                    {cantidadEmpleado.maximo === null
                                        ? 'Sin límite'
                                        : formatoNumero(cantidadEmpleado.maximo)}
                                </span>
                            </div>
                        </div>

                        {/* Resumen del rango */}
                        <div className="rounded-xl border border-indigo-200/70 bg-indigo-50/70 p-4 dark:border-indigo-400/20 dark:bg-indigo-500/10">
                            <div className="flex items-start gap-3">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300">
                                    <Hash className="h-4 w-4" />
                                </div>

                                <div>
                                    <p className="text-sm font-semibold text-indigo-950 dark:text-indigo-200">
                                        Resumen del rango
                                    </p>

                                    <p className="mt-1 text-sm leading-relaxed text-indigo-900/80 dark:text-indigo-200/80">
                                        Este rango comprende desde{' '}
                                        <strong>
                                            {formatoNumero(cantidadEmpleado.minimo)}
                                        </strong>{' '}
                                        empleados
                                        {cantidadEmpleado.maximo !== null ? (
                                            <>
                                                {' '}hasta{' '}
                                                <strong>
                                                    {formatoNumero(cantidadEmpleado.maximo)}
                                                </strong>{' '}
                                                empleados.
                                            </>
                                        ) : (
                                            <> en adelante, sin límite máximo.</>
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Estado */}
                        <div className="space-y-3">
                            <span className="block text-sm font-semibold text-foreground">
                                Estado
                            </span>

                            <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/60 px-4 py-3">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                                    {cantidadEmpleado.estado ? (
                                        <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                    ) : (
                                        <XCircle className="h-4 w-4 text-muted-foreground" />
                                    )}
                                </div>

                                {cantidadEmpleado.estado ? (
                                    <span className="inline-flex items-center justify-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/15 dark:text-emerald-300">
                                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                        Activo
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center justify-center gap-1.5 rounded-full border border-border bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
                                        <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60" />
                                        Inactivo
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                <p className="pb-2 text-center text-xs text-muted-foreground">
                    Gestión de cantidad de empleados · Job Portal
                </p>
            </div>
        </div>
    );
}
