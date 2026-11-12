import { Link, router } from '@inertiajs/react';
import { useState, type FormEvent } from 'react';
import {
    Search,
    Plus,
    Eye,
    Pencil,
    CircleOff,
    ArrowUp,
    ArrowDown,
    ArrowUpDown,
    CheckCircle2,
    Info,
    AlertTriangle,
    ChevronLeft,
    ChevronRight,
    Gift,
    X,
    FileSpreadsheet,
    FileText,
    Sparkles,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

// --------------------------------------------------
// TIPOS
// --------------------------------------------------

interface Beneficio {
    id: number;
    nombre: string;
    descripcion: string | null;
    icono: string | null;
    estado: boolean;
    created_at?: string;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface BeneficiosPaginados {
    data: Beneficio[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
    prev_page_url: string | null;
    next_page_url: string | null;
    links: PaginationLink[];
}

interface Filtros {
    buscar: string;
    orden: string;
    direccion: string;
    por_pagina: number;
}

interface Props {
    beneficios: BeneficiosPaginados;
    filtros: Filtros;
    flash?: {
        success?: {
            type: 'created' | 'updated' | 'deleted';
            message: string;
        };
    };
}

// --------------------------------------------------
// COMPONENTE
// --------------------------------------------------

export default function Index({
    beneficios,
    filtros,
    flash,
}: Props) {
    const [buscar, setBuscar] = useState(filtros.buscar ?? '');
    const [porPagina, setPorPagina] = useState(
        filtros.por_pagina ?? 5,
    );
    const [orden, setOrden] = useState(filtros.orden ?? 'nombre');
    const [direccion, setDireccion] = useState(
        filtros.direccion ?? 'asc',
    );

    // --------------------------------------------------
    // BÚSQUEDA Y FILTROS
    // --------------------------------------------------

    const aplicarFiltros = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        router.get(
            '/beneficios',
            {
                buscar,
                orden,
                direccion,
                por_pagina: porPagina,
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    };

    const limpiarBusqueda = () => {
        setBuscar('');

        router.get(
            '/beneficios',
            {
                buscar: '',
                orden,
                direccion,
                por_pagina: porPagina,
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    };

    // --------------------------------------------------
    // ORDENAMIENTO
    // --------------------------------------------------

    const ordenarPor = (campo: string) => {
        const nuevaDireccion =
            orden === campo && direccion === 'asc'
                ? 'desc'
                : 'asc';

        setOrden(campo);
        setDireccion(nuevaDireccion);

        router.get(
            '/beneficios',
            {
                buscar,
                orden: campo,
                direccion: nuevaDireccion,
                por_pagina: porPagina,
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    };

    const indicadorOrden = (campo: string) => {
        if (orden !== campo) {
            return (
                <ArrowUpDown className="ml-2 h-3.5 w-3.5 text-muted-foreground/60" />
            );
        }

        return direccion === 'asc' ? (
            <ArrowUp className="ml-2 h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
        ) : (
            <ArrowDown className="ml-2 h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
        );
    };

    const ariaOrden = (campo: string) =>
        orden !== campo
            ? 'none'
            : direccion === 'asc'
                ? 'ascending'
                : 'descending';

    // --------------------------------------------------
    // ACTIVAR / DESACTIVAR
    // --------------------------------------------------

    const cambiarEstado = (beneficio: Beneficio) => {
        const accion = beneficio.estado
            ? 'desactivar'
            : 'activar';

        if (
            confirm(
                `¿Estás seguro de que deseas ${accion} el beneficio "${beneficio.nombre}"?`,
            )
        ) {
            router.patch(
                `/beneficios/${beneficio.id}/estado`,
                {},
                {
                    preserveScroll: true,
                },
            );
        }
    };

    // --------------------------------------------------
    // NOTIFICACIONES
    // --------------------------------------------------

    const estilosFlash = {
        created: {
            container:
                'border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-100',
            icon: (
                <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
            ),
            titulo: 'Beneficio creado',
        },
        updated: {
            container:
                'border-indigo-200 bg-indigo-50 text-indigo-900 dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:text-indigo-100',
            icon: (
                <Info className="h-5 w-5 shrink-0 text-indigo-600 dark:text-indigo-400" />
            ),
            titulo: 'Beneficio activado o actualizado',
        },
        deleted: {
            container:
                'border-rose-200 bg-rose-50 text-rose-900 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-100',
            icon: (
                <AlertTriangle className="h-5 w-5 shrink-0 text-rose-600 dark:text-rose-400" />
            ),
            titulo: 'Beneficio desactivado',
        },
    };

    const notificacion = flash?.success
        ? estilosFlash[flash.success.type]
        : null;

    // --------------------------------------------------
    // PAGINACIÓN
    // --------------------------------------------------

    const esAnterior = (label: string) =>
        /previous|anterior/i.test(label);

    const esSiguiente = (label: string) =>
        /next|siguiente/i.test(label);

    const claseBotonOrden =
        'inline-flex items-center rounded-md px-1 py-1 -ml-1 text-sm font-semibold text-muted-foreground transition-colors hover:text-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:hover:text-indigo-300';

    return (
        <div className="min-h-full bg-muted/30">
            <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">



                {/* CABECERA */}
                <header className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
                    <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700 ring-1 ring-indigo-200/70 dark:bg-indigo-500/15 dark:text-indigo-300 dark:ring-indigo-400/20">
                            <Gift className="h-6 w-6" />
                        </div>

                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                                Beneficios
                            </h1>

                            <p className="mt-1 max-w-xl text-sm leading-relaxed text-muted-foreground">
                                Administra los beneficios que las empresas ofrecen a sus empleados.
                            </p>
                        </div>
                    </div>

                    {/* BOTONES DE ACCIÓN */}
                    <div className="flex flex-wrap items-center gap-2">

                        {/* REPORTE PDF */}
                        <a
                            href="/beneficios/reporte"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-4 text-sm font-medium text-rose-700 transition-colors hover:bg-rose-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300 dark:hover:bg-rose-500/20"
                        >
                            <FileText className="h-4 w-4" />
                            Reporte PDF
                        </a>

                        {/* REPORTE EXCEL */}
                        <a
                            href="/beneficios/excel"
                            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 text-sm font-medium text-emerald-700 transition-colors hover:bg-emerald-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300 dark:hover:bg-emerald-500/20"
                        >
                            <FileSpreadsheet className="h-4 w-4" />
                            Exportar Excel
                        </a>


                        {/* NUEVO BENEFICIO */}
                        <Button
                            asChild
                            className="h-10 rounded-lg bg-indigo-600 px-4 font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background dark:bg-indigo-500 dark:hover:bg-indigo-400"
                        >
                            <Link
                                href="/beneficios/create"
                                className="inline-flex items-center justify-center gap-2"
                            >
                                <Plus className="h-4 w-4" />
                                Nuevo beneficio
                            </Link>
                        </Button>
                    </div>
                </header>


                {/* NOTIFICACIÓN */}
                {flash?.success && notificacion && (
                    <div
                        role="status"
                        className={`flex items-start gap-3 rounded-xl border p-4 shadow-sm ${notificacion.container}`}
                    >
                        {notificacion.icon}

                        <div className="min-w-0">
                            <p className="text-sm font-semibold">
                                {notificacion.titulo}
                            </p>

                            <p className="mt-0.5 text-sm opacity-90">
                                {flash.success.message}
                            </p>
                        </div>
                    </div>
                )}

                {/* PANEL DE BÚSQUEDA */}
                <section className="rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6">
                    <form
                        onSubmit={aplicarFiltros}
                        className="flex flex-col gap-5 xl:flex-row xl:items-end xl:gap-6"
                    >
                        <div className="w-full space-y-3 xl:max-w-md xl:flex-1">
                            <label
                                htmlFor="buscar-beneficio"
                                className="block text-sm font-semibold text-foreground"
                            >
                                Buscar beneficio
                            </label>

                            <div className="relative">
                                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                                <Input
                                    id="buscar-beneficio"
                                    type="text"
                                    value={buscar}
                                    onChange={(e) =>
                                        setBuscar(e.target.value)
                                    }
                                    placeholder="Nombre o descripción..."
                                    className="h-10 w-full rounded-lg border-border bg-background pl-9 pr-10 transition-shadow focus-visible:ring-indigo-500"
                                />

                                {buscar && (
                                    <button
                                        type="button"
                                        onClick={limpiarBusqueda}
                                        aria-label="Limpiar búsqueda"
                                        className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="w-full space-y-3 sm:max-w-xs xl:w-48 xl:shrink-0">
                            <label
                                htmlFor="por-pagina"
                                className="block text-sm font-semibold text-foreground"
                            >
                                Registros por página
                            </label>

                            <select
                                id="por-pagina"
                                value={porPagina}
                                onChange={(e) =>
                                    setPorPagina(Number(e.target.value))
                                }
                                className="flex h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition-shadow focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value={5}>5 registros</option>
                                <option value={10}>10 registros</option>
                                <option value={20}>20 registros</option>
                            </select>
                        </div>

                        <div className="flex flex-wrap gap-3 xl:shrink-0">
                            <Button
                                type="submit"
                                className="h-10 rounded-lg bg-indigo-600 px-5 font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background dark:bg-indigo-500 dark:hover:bg-indigo-400"
                            >
                                <Search className="mr-2 h-4 w-4" />
                                Buscar
                            </Button>

                            {buscar && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={limpiarBusqueda}
                                    className="h-10 rounded-lg border-border px-4 font-medium focus-visible:ring-2 focus-visible:ring-indigo-500"
                                >
                                    <X className="mr-2 h-4 w-4" />
                                    Limpiar
                                </Button>
                            )}
                        </div>
                    </form>
                </section>

                {/* TABLA */}
                <section className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
                    <div className="flex flex-col gap-3 border-b border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="text-base font-semibold text-foreground">
                                Listado de beneficios
                            </h2>

                            <p className="mt-0.5 text-sm text-muted-foreground">
                                Consulta y administra los beneficios
                                disponibles.
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            <span className="inline-flex w-fit items-center rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold tabular-nums text-indigo-700 ring-1 ring-inset ring-indigo-100 dark:bg-indigo-500/15 dark:text-indigo-300 dark:ring-indigo-400/20">
                                {beneficios.total}{' '}
                                {beneficios.total === 1
                                    ? 'beneficio'
                                    : 'beneficios'}
                            </span>

                            
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-b border-border bg-muted/60 shadow-[inset_0_-1px_0_0_var(--color-border,transparent)] hover:bg-muted/60">
                                    <TableHead
                                        aria-sort={ariaOrden('nombre')}
                                        className="h-12 min-w-48 pl-5"
                                    >
                                        <button
                                            type="button"
                                            onClick={() =>
                                                ordenarPor('nombre')
                                            }
                                            className={claseBotonOrden}
                                        >
                                            Nombre
                                            {indicadorOrden('nombre')}
                                        </button>
                                    </TableHead>

                                    <TableHead className="h-12 min-w-64 text-sm font-semibold text-muted-foreground">
                                        Descripción
                                    </TableHead>

                                    <TableHead className="h-12 min-w-28 text-center text-sm font-semibold text-muted-foreground">
                                        Ícono
                                    </TableHead>

                                    <TableHead
                                        aria-sort={ariaOrden('estado')}
                                        className="h-12 min-w-28 text-center"
                                    >
                                        <button
                                            type="button"
                                            onClick={() =>
                                                ordenarPor('estado')
                                            }
                                            className={claseBotonOrden}
                                        >
                                            Estado
                                            {indicadorOrden('estado')}
                                        </button>
                                    </TableHead>

                                    <TableHead className="h-12 pr-5 text-right text-sm font-semibold text-muted-foreground">
                                        Acciones
                                    </TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {beneficios.data.length === 0 ? (
                                    <TableRow className="hover:bg-transparent">
                                        <TableCell
                                            colSpan={5}
                                            className="h-64 text-center"
                                        >
                                            <div className="flex flex-col items-center justify-center gap-3">
                                                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-dashed border-border bg-muted">
                                                    <Gift className="h-5 w-5 text-muted-foreground" />
                                                </div>

                                                <div>
                                                    <p className="font-semibold text-foreground">
                                                        No se encontraron beneficios
                                                    </p>

                                                    <p className="mt-1 text-sm text-muted-foreground">
                                                        Prueba con otro nombre
                                                        o descripción.
                                                    </p>
                                                </div>

                                                {buscar && (
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={limpiarBusqueda}
                                                        className="mt-1 focus-visible:ring-2 focus-visible:ring-indigo-500"
                                                    >
                                                        Limpiar búsqueda
                                                    </Button>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    beneficios.data.map((beneficio) => (
                                        <TableRow
                                            key={beneficio.id}
                                            className="group border-border/60 transition-colors odd:bg-transparent even:bg-muted/30 hover:bg-indigo-50/60 dark:hover:bg-indigo-500/10"
                                        >
                                            {/* NOMBRE */}
                                            <TableCell className="py-3.5 pl-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors group-hover:bg-indigo-100 group-hover:text-indigo-700 dark:group-hover:bg-indigo-500/20 dark:group-hover:text-indigo-300">
                                                        <Gift className="h-4 w-4" />
                                                    </div>

                                                    <span className="text-sm font-semibold text-foreground sm:text-[0.95rem]">
                                                        {beneficio.nombre}
                                                    </span>
                                                </div>
                                            </TableCell>

                                            {/* DESCRIPCIÓN */}
                                            <TableCell className="max-w-sm py-3.5">
                                                <p
                                                    className="line-clamp-2 text-sm leading-relaxed text-muted-foreground"
                                                    title={
                                                        beneficio.descripcion ??
                                                        undefined
                                                    }
                                                >
                                                    {beneficio.descripcion ||
                                                        'Sin descripción'}
                                                </p>
                                            </TableCell>

                                            {/* ÍCONO */}
                                            <TableCell className="py-3.5 text-center">
                                                {beneficio.icono ? (
                                                    <span
                                                        className="inline-flex max-w-36 items-center gap-1.5 rounded-md border border-border bg-muted px-2.5 py-1 font-mono text-xs text-foreground"
                                                        title={beneficio.icono}
                                                    >
                                                        <Sparkles className="h-3.5 w-3.5 shrink-0 text-indigo-600 dark:text-indigo-400" />
                                                        <span className="truncate">
                                                            {beneficio.icono}
                                                        </span>
                                                    </span>
                                                ) : (
                                                    <span className="text-xs text-muted-foreground">
                                                        Sin ícono
                                                    </span>
                                                )}
                                            </TableCell>

                                            {/* ESTADO */}
                                            <TableCell className="py-3.5 text-center">
                                                <span
                                                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${beneficio.estado
                                                        ? 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/20'
                                                        : 'bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-200 dark:bg-rose-500/10 dark:text-rose-300 dark:ring-rose-500/20'
                                                        }`}
                                                >
                                                    <span
                                                        className={`h-1.5 w-1.5 rounded-full ${beneficio.estado
                                                            ? 'bg-emerald-500'
                                                            : 'bg-rose-500'
                                                            }`}
                                                    />

                                                    {beneficio.estado
                                                        ? 'Activo'
                                                        : 'Inactivo'}
                                                </span>
                                            </TableCell>

                                            {/* ACCIONES */}
                                            <TableCell className="py-3.5 pr-5">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    {/* VER */}
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        asChild
                                                        className="h-9 rounded-lg border-border px-2.5 text-foreground hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 focus-visible:ring-2 focus-visible:ring-indigo-500 sm:px-3 dark:hover:border-indigo-400/30 dark:hover:bg-indigo-500/15 dark:hover:text-indigo-300"
                                                    >
                                                        <Link
                                                            href={`/beneficios/${beneficio.id}`}
                                                            aria-label={`Ver detalle de ${beneficio.nombre}`}
                                                            title="Ver detalle"
                                                        >
                                                            <Eye className="h-3.5 w-3.5 sm:mr-1.5" />
                                                            <span className="hidden sm:inline">
                                                                Ver
                                                            </span>
                                                        </Link>
                                                    </Button>

                                                    {/* EDITAR */}
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        asChild
                                                        className="h-9 rounded-lg border-border px-2.5 text-foreground hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 focus-visible:ring-2 focus-visible:ring-indigo-500 sm:px-3 dark:hover:border-indigo-400/30 dark:hover:bg-indigo-500/15 dark:hover:text-indigo-300"
                                                    >
                                                        <Link
                                                            href={`/beneficios/${beneficio.id}/edit`}
                                                            aria-label={`Editar ${beneficio.nombre}`}
                                                            title="Editar"
                                                        >
                                                            <Pencil className="h-3.5 w-3.5 sm:mr-1.5" />
                                                            <span className="hidden sm:inline">
                                                                Editar
                                                            </span>
                                                        </Link>
                                                    </Button>

                                                    {/* ACTIVAR / DESACTIVAR */}
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() =>
                                                            cambiarEstado(
                                                                beneficio,
                                                            )
                                                        }
                                                        aria-label={`${beneficio.estado
                                                            ? 'Desactivar'
                                                            : 'Activar'
                                                            } ${beneficio.nombre}`}
                                                        className={
                                                            beneficio.estado
                                                                ? 'h-9 rounded-lg px-2.5 text-rose-600 hover:bg-rose-50 hover:text-rose-700 focus-visible:ring-2 focus-visible:ring-rose-500 sm:px-3 dark:text-rose-400 dark:hover:bg-rose-500/15 dark:hover:text-rose-300'
                                                                : 'h-9 rounded-lg px-2.5 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800 focus-visible:ring-2 focus-visible:ring-emerald-500 sm:px-3 dark:text-emerald-400 dark:hover:bg-emerald-500/15 dark:hover:text-emerald-300'
                                                        }
                                                    >
                                                        {beneficio.estado ? (
                                                            <CircleOff className="h-3.5 w-3.5 sm:mr-1.5" />
                                                        ) : (
                                                            <CheckCircle2 className="h-3.5 w-3.5 sm:mr-1.5" />
                                                        )}

                                                        <span className="hidden sm:inline">
                                                            {beneficio.estado
                                                                ? 'Desactivar'
                                                                : 'Activar'}
                                                        </span>
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* PAGINACIÓN */}
                    <div className="flex flex-col gap-4 border-t border-border bg-muted/40 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-center text-sm text-muted-foreground sm:text-left">
                            Mostrando{' '}
                            <span className="font-semibold tabular-nums text-foreground">
                                {beneficios.from ?? 0}
                            </span>{' '}
                            a{' '}
                            <span className="font-semibold tabular-nums text-foreground">
                                {beneficios.to ?? 0}
                            </span>{' '}
                            de{' '}
                            <span className="font-semibold tabular-nums text-foreground">
                                {beneficios.total}
                            </span>{' '}
                            registros
                        </p>

                        <nav
                            aria-label="Paginación de beneficios"
                            className="flex flex-wrap items-center justify-center gap-1.5 sm:justify-end"
                        >
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                disabled={!beneficios.prev_page_url}
                                onClick={() =>
                                    beneficios.prev_page_url &&
                                    router.get(
                                        beneficios.prev_page_url,
                                        {},
                                        {
                                            preserveState: true,
                                            preserveScroll: true,
                                        },
                                    )
                                }
                                aria-label="Página anterior"
                                className="h-9 rounded-lg border-border bg-background px-3 focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:opacity-50"
                            >
                                <ChevronLeft className="h-4 w-4" />
                                <span className="hidden sm:inline">
                                    Anterior
                                </span>
                            </Button>

                            <span className="px-3 text-sm tabular-nums text-muted-foreground sm:hidden">
                                Página{' '}
                                <span className="font-semibold text-foreground">
                                    {beneficios.current_page}
                                </span>{' '}
                                de{' '}
                                <span className="font-semibold text-foreground">
                                    {beneficios.last_page}
                                </span>
                            </span>

                            {beneficios.links?.map((link, index) => {
                                if (
                                    esAnterior(link.label) ||
                                    esSiguiente(link.label)
                                ) {
                                    return null;
                                }

                                if (!link.url) {
                                    return (
                                        <span
                                            key={`${link.label}-${index}`}
                                            className="hidden px-2 text-sm text-muted-foreground sm:inline"
                                        >
                                            {link.label.replace(
                                                /&hellip;/g,
                                                '…',
                                            )}
                                        </span>
                                    );
                                }

                                return (
                                    <Button
                                        key={`${link.label}-${index}`}
                                        type="button"
                                        variant={
                                            link.active
                                                ? 'default'
                                                : 'outline'
                                        }
                                        size="sm"
                                        aria-current={
                                            link.active
                                                ? 'page'
                                                : undefined
                                        }
                                        onClick={() =>
                                            router.get(
                                                link.url!,
                                                {},
                                                {
                                                    preserveState: true,
                                                    preserveScroll: true,
                                                },
                                            )
                                        }
                                        className={
                                            link.active
                                                ? 'hidden h-9 min-w-9 rounded-lg bg-indigo-600 px-3 tabular-nums text-white shadow-sm hover:bg-indigo-700 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:inline-flex dark:bg-indigo-500 dark:hover:bg-indigo-400'
                                                : 'hidden h-9 min-w-9 rounded-lg border-border bg-background px-3 tabular-nums text-foreground hover:bg-indigo-50 hover:text-indigo-700 focus-visible:ring-2 focus-visible:ring-indigo-500 sm:inline-flex dark:hover:bg-indigo-500/15 dark:hover:text-indigo-300'
                                        }
                                    >
                                        {link.label}
                                    </Button>
                                );
                            })}

                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                disabled={!beneficios.next_page_url}
                                onClick={() =>
                                    beneficios.next_page_url &&
                                    router.get(
                                        beneficios.next_page_url,
                                        {},
                                        {
                                            preserveState: true,
                                            preserveScroll: true,
                                        },
                                    )
                                }
                                aria-label="Página siguiente"
                                className="h-9 rounded-lg border-border bg-background px-3 focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:opacity-50"
                            >
                                <span className="hidden sm:inline">
                                    Siguiente
                                </span>
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </nav>
                    </div>
                </section>

                <p className="pb-2 text-center text-xs text-muted-foreground">
                    Gestión de beneficios · Job Portal
                </p>
            </div>
        </div>
    );
}

