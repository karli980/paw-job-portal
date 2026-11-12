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
    Globe2,
    X,
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

interface Pais {
    id: number;
    nombre: string;
    codigo_iso: string;
    codigo_iso3: string;
    estado: boolean;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaisesPaginados {
    data: Pais[];
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
    paises: PaisesPaginados;
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

export default function Index({ paises, filtros, flash }: Props) {
    const [buscar, setBuscar] = useState(filtros.buscar ?? '');
    const [porPagina, setPorPagina] = useState(
        filtros.por_pagina ?? 5,
    );
    const [orden, setOrden] = useState(filtros.orden ?? 'nombre');
    const [direccion, setDireccion] = useState(
        filtros.direccion ?? 'asc',
    );

    // Aplicar búsqueda y cantidad de registros.
    const aplicarFiltros = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        router.get(
            '/paises',
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

    // Limpiar la búsqueda.
    const limpiarBusqueda = () => {
        setBuscar('');

        router.get(
            '/paises',
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

    // Ordenamiento de columnas.
    const ordenarPor = (campo: string) => {
        const nuevaDireccion =
            orden === campo && direccion === 'asc' ? 'desc' : 'asc';

        setOrden(campo);
        setDireccion(nuevaDireccion);

        router.get(
            '/paises',
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

    // Icono del ordenamiento.
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

    // Valor aria-sort para cada columna.
    const ariaOrden = (campo: string) =>
        orden !== campo
            ? 'none'
            : direccion === 'asc'
              ? 'ascending'
              : 'descending';

    // Activar o desactivar país sin eliminarlo.
    const cambiarEstado = (pais: Pais) => {
        const accion = pais.estado ? 'desactivar' : 'activar';

        if (
            confirm(
                `¿Estás seguro de que deseas ${accion} el país "${pais.nombre}"?`,
            )
        ) {
            router.patch(
                `/paises/${pais.id}/estado`,
                {},
                {
                    preserveScroll: true,
                },
            );
        }
    };

    // Estilos de notificaciones.
    const estilosFlash = {
        created: {
            container:
                'border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-100',
            icon: (
                <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
            ),
            titulo: 'País creado',
        },
        updated: {
            container:
                'border-indigo-200 bg-indigo-50 text-indigo-900 dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:text-indigo-100',
            icon: (
                <Info className="h-5 w-5 shrink-0 text-indigo-600 dark:text-indigo-400" />
            ),
            titulo: 'País activado o actualizado',
        },
        deleted: {
            container:
                'border-rose-200 bg-rose-50 text-rose-900 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-100',
            icon: (
                <AlertTriangle className="h-5 w-5 shrink-0 text-rose-600 dark:text-rose-400" />
            ),
            titulo: 'País desactivado',
        },
    };

    const notificacion = flash?.success
        ? estilosFlash[flash.success.type]
        : null;

    // Traducción de Previous y Next.
    const esAnterior = (label: string) =>
        /previous|anterior/i.test(label);

    const esSiguiente = (label: string) =>
        /next|siguiente/i.test(label);

    // Estilos de los botones para ordenar columnas.
    const claseBotonOrden =
        'inline-flex items-center rounded-md px-1 py-1 -ml-1 text-sm font-semibold text-muted-foreground transition-colors hover:text-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:hover:text-indigo-300';

    return (
        <div className="min-h-full bg-muted/30">
            <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
                {/* CABECERA */}
                <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                    <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700 ring-1 ring-indigo-200/70 dark:bg-indigo-500/15 dark:text-indigo-300 dark:ring-indigo-400/20">
                            <Globe2 className="h-6 w-6" />
                        </div>

                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                                Países
                            </h1>
                            <p className="mt-1 max-w-xl text-sm leading-relaxed text-muted-foreground">
                                Administra los países y sus códigos
                                internacionales ISO.
                            </p>
                        </div>
                    </div>

                    <Button
                        asChild
                        className="h-10 w-full rounded-lg bg-indigo-600 px-4 font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:w-auto dark:bg-indigo-500 dark:hover:bg-indigo-400"
                    >
                        <Link
                            href="/paises/create"
                            className="inline-flex items-center justify-center gap-2"
                        >
                            <Plus className="h-4 w-4" />
                            Nuevo país
                        </Link>
                    </Button>
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
                        {/* Campo de búsqueda */}
                        <div className="w-full space-y-3 xl:max-w-md xl:flex-1">
                            <label
                                htmlFor="buscar-pais"
                                className="block text-sm font-semibold text-foreground"
                            >
                                Buscar país
                            </label>

                            <div className="relative">
                                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                                <Input
                                    id="buscar-pais"
                                    type="text"
                                    value={buscar}
                                    onChange={(e) =>
                                        setBuscar(e.target.value)
                                    }
                                    placeholder="Nombre o código ISO..."
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

                        {/* Cantidad de registros */}
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

                        {/* Acciones */}
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
                    <div className="flex flex-col gap-2 border-b border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="text-base font-semibold text-foreground">
                                Listado de países
                            </h2>
                            <p className="mt-0.5 text-sm text-muted-foreground">
                                Consulta y administra los registros.
                            </p>
                        </div>

                        <span className="inline-flex w-fit items-center rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold tabular-nums text-indigo-700 ring-1 ring-inset ring-indigo-100 dark:bg-indigo-500/15 dark:text-indigo-300 dark:ring-indigo-400/20">
                            {paises.total}{' '}
                            {paises.total === 1 ? 'país' : 'países'}
                        </span>
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
                                            onClick={() => ordenarPor('nombre')}
                                            className={claseBotonOrden}
                                        >
                                            Nombre
                                            {indicadorOrden('nombre')}
                                        </button>
                                    </TableHead>

                                    <TableHead
                                        aria-sort={ariaOrden('codigo_iso')}
                                        className="h-12 min-w-32"
                                    >
                                        <button
                                            type="button"
                                            onClick={() =>
                                                ordenarPor('codigo_iso')
                                            }
                                            className={claseBotonOrden}
                                        >
                                            Código ISO
                                            {indicadorOrden('codigo_iso')}
                                        </button>
                                    </TableHead>

                                    <TableHead
                                        aria-sort={ariaOrden('codigo_iso3')}
                                        className="h-12 min-w-32"
                                    >
                                        <button
                                            type="button"
                                            onClick={() =>
                                                ordenarPor('codigo_iso3')
                                            }
                                            className={claseBotonOrden}
                                        >
                                            Código ISO 3
                                            {indicadorOrden('codigo_iso3')}
                                        </button>
                                    </TableHead>

                                    <TableHead className="h-12 min-w-28 text-center text-sm font-semibold text-muted-foreground">
                                        Estado
                                    </TableHead>

                                    <TableHead className="h-12 pr-5 text-right text-sm font-semibold text-muted-foreground">
                                        Acciones
                                    </TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {paises.data.length === 0 ? (
                                    <TableRow className="hover:bg-transparent">
                                        <TableCell
                                            colSpan={5}
                                            className="h-64 text-center"
                                        >
                                            <div className="flex flex-col items-center justify-center gap-3">
                                                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-dashed border-border bg-muted">
                                                    <Search className="h-5 w-5 text-muted-foreground" />
                                                </div>

                                                <div>
                                                    <p className="font-semibold text-foreground">
                                                        No se encontraron países
                                                    </p>
                                                    <p className="mt-1 text-sm text-muted-foreground">
                                                        Prueba con otro nombre
                                                        o código ISO.
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
                                    paises.data.map((pais) => (
                                        <TableRow
                                            key={pais.id}
                                            className="group border-border/60 transition-colors odd:bg-transparent even:bg-muted/30 hover:bg-indigo-50/60 dark:hover:bg-indigo-500/10"
                                        >
                                            <TableCell className="py-3.5 pl-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors group-hover:bg-indigo-100 group-hover:text-indigo-700 dark:group-hover:bg-indigo-500/20 dark:group-hover:text-indigo-300">
                                                        <Globe2 className="h-4 w-4" />
                                                    </div>

                                                    <span className="text-sm font-semibold text-foreground sm:text-[0.95rem]">
                                                        {pais.nombre}
                                                    </span>
                                                </div>
                                            </TableCell>

                                            <TableCell className="py-3.5">
                                                <span className="inline-flex min-w-12 items-center justify-center rounded-md border border-indigo-100 bg-indigo-50 px-2.5 py-1 font-mono text-xs font-semibold tracking-wide text-indigo-700 dark:border-indigo-400/20 dark:bg-indigo-500/15 dark:text-indigo-300">
                                                    {pais.codigo_iso}
                                                </span>
                                            </TableCell>

                                            <TableCell className="py-3.5">
                                                <span className="inline-flex min-w-14 items-center justify-center rounded-md border border-border bg-muted px-2.5 py-1 font-mono text-xs font-semibold tracking-wide text-muted-foreground">
                                                    {pais.codigo_iso3}
                                                </span>
                                            </TableCell>

                                            {/* ESTADO */}
                                            <TableCell className="py-3.5 text-center">
                                                <span
                                                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                                                        pais.estado
                                                            ? 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/20'
                                                            : 'bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-200 dark:bg-rose-500/10 dark:text-rose-300 dark:ring-rose-500/20'
                                                    }`}
                                                >
                                                    <span
                                                        className={`h-1.5 w-1.5 rounded-full ${
                                                            pais.estado
                                                                ? 'bg-emerald-500'
                                                                : 'bg-rose-500'
                                                        }`}
                                                    />
                                                    {pais.estado
                                                        ? 'Activo'
                                                        : 'Inactivo'}
                                                </span>
                                            </TableCell>

                                            {/* ACCIONES */}
                                            <TableCell className="py-3.5 pr-5">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    {/* VER DETALLE */}
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        asChild
                                                        className="h-9 rounded-lg border-border px-2.5 text-foreground hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 focus-visible:ring-2 focus-visible:ring-indigo-500 sm:px-3 dark:hover:border-indigo-400/30 dark:hover:bg-indigo-500/15 dark:hover:text-indigo-300"
                                                    >
                                                        <Link
                                                            href={`/paises/${pais.id}`}
                                                            aria-label={`Ver detalle de ${pais.nombre}`}
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
                                                            href={`/paises/${pais.id}/edit`}
                                                            aria-label={`Editar ${pais.nombre}`}
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
                                                            cambiarEstado(pais)
                                                        }
                                                        aria-label={`${pais.estado ? 'Desactivar' : 'Activar'} ${pais.nombre}`}
                                                        className={
                                                            pais.estado
                                                                ? 'h-9 rounded-lg px-2.5 text-rose-600 hover:bg-rose-50 hover:text-rose-700 focus-visible:ring-2 focus-visible:ring-rose-500 sm:px-3 dark:text-rose-400 dark:hover:bg-rose-500/15 dark:hover:text-rose-300'
                                                                : 'h-9 rounded-lg px-2.5 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800 focus-visible:ring-2 focus-visible:ring-emerald-500 sm:px-3 dark:text-emerald-400 dark:hover:bg-emerald-500/15 dark:hover:text-emerald-300'
                                                        }
                                                    >
                                                        {pais.estado ? (
                                                            <CircleOff className="h-3.5 w-3.5 sm:mr-1.5" />
                                                        ) : (
                                                            <CheckCircle2 className="h-3.5 w-3.5 sm:mr-1.5" />
                                                        )}

                                                        <span className="hidden sm:inline">
                                                            {pais.estado
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
                                {paises.from ?? 0}
                            </span>{' '}
                            a{' '}
                            <span className="font-semibold tabular-nums text-foreground">
                                {paises.to ?? 0}
                            </span>{' '}
                            de{' '}
                            <span className="font-semibold tabular-nums text-foreground">
                                {paises.total}
                            </span>{' '}
                            registros
                        </p>

                        <nav
                            aria-label="Paginación de países"
                            className="flex flex-wrap items-center justify-center gap-1.5 sm:justify-end"
                        >
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                disabled={!paises.prev_page_url}
                                onClick={() =>
                                    paises.prev_page_url &&
                                    router.get(
                                        paises.prev_page_url,
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

                            {/* Indicador compacto solo en móvil */}
                            <span className="px-3 text-sm tabular-nums text-muted-foreground sm:hidden">
                                Página{' '}
                                <span className="font-semibold text-foreground">
                                    {paises.current_page}
                                </span>{' '}
                                de{' '}
                                <span className="font-semibold text-foreground">
                                    {paises.last_page}
                                </span>
                            </span>

                            {paises.links?.map((link, index) => {
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
                                            {link.label.replace(/&hellip;/g, '…')}
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
                                            link.active ? 'page' : undefined
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
                                disabled={!paises.next_page_url}
                                onClick={() =>
                                    paises.next_page_url &&
                                    router.get(
                                        paises.next_page_url,
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
                    Gestión de países · Job Portal
                </p>
            </div>
        </div>
    );
}
