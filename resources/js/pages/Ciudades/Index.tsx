import { Link, router } from '@inertiajs/react';
import { useEffect, useState, type FormEvent } from 'react';
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
    MapPin,
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

interface Provincia {
    id: number;
    nombre: string;
}

interface Ciudad {
    id: number;
    nombre: string;
    codigo_postal: string | null;
    estado: boolean;
    provincia_id: number;
    provincia: Provincia;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface CiudadesPaginadas {
    data: Ciudad[];
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
    provincia_id: number | string;
}

interface FlashSuccess {
    type: 'created' | 'updated' | 'deleted';
    message: string;
}

interface Props {
    ciudades: CiudadesPaginadas;
    provincias: Provincia[];
    filtros: Filtros;
    flash?: {
        success?: FlashSuccess;
    };
}

// --------------------------------------------------
// COMPONENTE
// --------------------------------------------------

export default function Index({
    ciudades,
    provincias,
    filtros,
    flash,
}: Props) {
    const [buscar, setBuscar] = useState(filtros.buscar ?? '');
    const [porPagina, setPorPagina] = useState(filtros.por_pagina ?? 5);
    const [orden, setOrden] = useState(filtros.orden ?? 'nombre');
    const [direccion, setDireccion] = useState(
        filtros.direccion ?? 'asc',
    );
    const [provinciaId, setProvinciaId] = useState(
        String(filtros.provincia_id ?? ''),
    );
    const [mostrarNotificacion, setMostrarNotificacion] = useState(true);

    // --------------------------------------------------
    // NOTIFICACIONES
    // --------------------------------------------------

    useEffect(() => {
        setMostrarNotificacion(true);

        if (!flash?.success) {
            return;
        }

        const temporizador = window.setTimeout(() => {
            setMostrarNotificacion(false);
        }, 4000);

        return () => window.clearTimeout(temporizador);
    }, [flash?.success]);

    // --------------------------------------------------
    // FILTROS
    // --------------------------------------------------

    const parametros = (
        cambios: Partial<{
            buscar: string;
            orden: string;
            direccion: string;
            por_pagina: number;
            provincia_id: string;
        }> = {},
    ) => ({
        buscar,
        orden,
        direccion,
        por_pagina: porPagina,
        provincia_id: provinciaId,
        ...cambios,
    });

    const navegarConFiltros = (
        cambios: Partial<{
            buscar: string;
            orden: string;
            direccion: string;
            por_pagina: number;
            provincia_id: string;
        }> = {},
    ) => {
        router.get('/ciudades', parametros(cambios), {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const aplicarFiltros = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        navegarConFiltros();
    };

    const limpiarBusqueda = () => {
        setBuscar('');
        navegarConFiltros({ buscar: '' });
    };

    const cambiarProvincia = (valor: string) => {
        setProvinciaId(valor);
        navegarConFiltros({ provincia_id: valor });
    };

    const cambiarPorPagina = (valor: number) => {
        setPorPagina(valor);
        navegarConFiltros({ por_pagina: valor });
    };

    // --------------------------------------------------
    // ORDENAMIENTO
    // --------------------------------------------------

    const ordenarPor = (campo: string) => {
        const nuevaDireccion =
            orden === campo && direccion === 'asc' ? 'desc' : 'asc';

        setOrden(campo);
        setDireccion(nuevaDireccion);

        navegarConFiltros({
            orden: campo,
            direccion: nuevaDireccion,
        });
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

    const claseBotonOrden =
        'inline-flex items-center rounded-md px-1 py-1 -ml-1 text-sm font-semibold text-muted-foreground transition-colors hover:text-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:hover:text-indigo-300';

    // --------------------------------------------------
    // ACTIVAR / DESACTIVAR
    // --------------------------------------------------

    const cambiarEstado = (ciudad: Ciudad) => {
        const accion = ciudad.estado ? 'desactivar' : 'activar';

        if (
            confirm(
                `¿Estás seguro de que deseas ${accion} la ciudad "${ciudad.nombre}"?`,
            )
        ) {
            router.patch(
                `/ciudades/${ciudad.id}/toggle-estado`,
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
            titulo: 'Ciudad creada',
        },
        updated: {
            container:
                'border-indigo-200 bg-indigo-50 text-indigo-900 dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:text-indigo-100',
            icon: (
                <Info className="h-5 w-5 shrink-0 text-indigo-600 dark:text-indigo-400" />
            ),
            titulo: 'Ciudad actualizada',
        },
        deleted: {
            container:
                'border-rose-200 bg-rose-50 text-rose-900 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-100',
            icon: (
                <AlertTriangle className="h-5 w-5 shrink-0 text-rose-600 dark:text-rose-400" />
            ),
            titulo: 'Ciudad desactivada',
        },
    };

    const notificacion = flash?.success
        ? estilosFlash[flash.success.type]
        : null;

    const esAnterior = (label: string) =>
        /previous|anterior/i.test(label);

    const esSiguiente = (label: string) =>
        /next|siguiente/i.test(label);

    // --------------------------------------------------
    // VISTA
    // --------------------------------------------------

    return (
        <div className="min-h-full bg-muted/30">
            <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
                {/* CABECERA */}
                <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                    <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700 ring-1 ring-indigo-200/70 dark:bg-indigo-500/15 dark:text-indigo-300 dark:ring-indigo-400/20">
                            <MapPin className="h-6 w-6" />
                        </div>

                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                                Ciudades
                            </h1>
                            <p className="mt-1 max-w-xl text-sm leading-relaxed text-muted-foreground">
                                Administra las ciudades y sus provincias para
                                el portal de empleo.
                            </p>
                        </div>
                    </div>

                    <Button
                        asChild
                        className="h-10 w-full rounded-lg bg-indigo-600 px-4 font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:w-auto dark:bg-indigo-500 dark:hover:bg-indigo-400"
                    >
                        <Link
                            href="/ciudades/create"
                            className="inline-flex items-center justify-center gap-2"
                        >
                            <Plus className="h-4 w-4" />
                            Nueva ciudad
                        </Link>
                    </Button>
                </header>

                {/* NOTIFICACIÓN */}
                {mostrarNotificacion &&
                    flash?.success &&
                    notificacion && (
                        <div
                            role="status"
                            className={`flex items-start gap-3 rounded-xl border p-4 shadow-sm ${notificacion.container}`}
                        >
                            {notificacion.icon}

                            <div className="min-w-0 flex-1">
                                <p className="text-sm font-semibold">
                                    {notificacion.titulo}
                                </p>
                                <p className="mt-0.5 text-sm opacity-90">
                                    {flash.success.message}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setMostrarNotificacion(false)
                                }
                                aria-label="Cerrar notificación"
                                className="rounded-md p-1 opacity-70 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    )}

                {/* BUSCADOR Y FILTROS */}
                <section className="rounded-xl border border-border bg-card p-4 shadow-sm sm:p-5">
                    <form
                        onSubmit={aplicarFiltros}
                        className="flex flex-col gap-4"
                    >
                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(240px,1fr)_220px_auto] lg:items-end">
                            <div className="space-y-2">
                                <label
                                    htmlFor="buscar-ciudad"
                                    className="text-sm font-semibold text-foreground"
                                >
                                    Buscar ciudad
                                </label>

                                <div className="relative">
                                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                                    <Input
                                        id="buscar-ciudad"
                                        type="text"
                                        value={buscar}
                                        onChange={(e) =>
                                            setBuscar(e.target.value)
                                        }
                                        placeholder="Ciudad, código postal o provincia..."
                                        autoComplete="off"
                                        className="h-10 rounded-lg border-border bg-background pl-9 pr-10 transition-shadow focus-visible:ring-indigo-500"
                                    />

                                    {buscar.length > 0 && (
                                        <button
                                            type="button"
                                            onClick={limpiarBusqueda}
                                            aria-label="Limpiar búsqueda"
                                            title="Limpiar búsqueda"
                                            className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label
                                    htmlFor="provincia-id"
                                    className="text-sm font-semibold text-foreground"
                                >
                                    Filtrar por provincia
                                </label>

                                <select
                                    id="provincia-id"
                                    value={provinciaId}
                                    onChange={(e) =>
                                        cambiarProvincia(e.target.value)
                                    }
                                    className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-indigo-500"
                                >
                                    <option value="">
                                        Todas las provincias
                                    </option>
                                    {provincias.map((provincia) => (
                                        <option
                                            key={provincia.id}
                                            value={provincia.id}
                                        >
                                            {provincia.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                <Button
                                    type="submit"
                                    className="h-10 rounded-lg bg-indigo-600 px-5 font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:bg-indigo-500 dark:hover:bg-indigo-400"
                                >
                                    <Search className="mr-2 h-4 w-4" />
                                    Buscar
                                </Button>

                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        setBuscar('');
                                        setProvinciaId('');
                                        navegarConFiltros({
                                            buscar: '',
                                            provincia_id: '',
                                        });
                                    }}
                                    disabled={
                                        !buscar &&
                                        !filtros.buscar &&
                                        !provinciaId
                                    }
                                    className="h-10 rounded-lg border-border px-4"
                                >
                                    <X className="mr-2 h-4 w-4" />
                                    Limpiar
                                </Button>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="text-xs text-muted-foreground">
                                {(filtros.buscar?.trim() ||
                                    String(filtros.provincia_id ?? '')) && (
                                    <span aria-live="polite">
                                        {ciudades.total === 0
                                            ? 'No se encontraron coincidencias con los filtros seleccionados.'
                                            : `${ciudades.total} ${
                                                  ciudades.total === 1
                                                      ? 'resultado encontrado'
                                                      : 'resultados encontrados'
                                              }.`}
                                    </span>
                                )}
                            </div>

                            <div className="flex items-center gap-3">
                                <label
                                    htmlFor="por-pagina"
                                    className="whitespace-nowrap text-sm font-semibold text-foreground"
                                >
                                    Registros por página
                                </label>

                                <select
                                    id="por-pagina"
                                    value={porPagina}
                                    onChange={(e) =>
                                        cambiarPorPagina(
                                            Number(e.target.value),
                                        )
                                    }
                                    className="h-10 rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-indigo-500"
                                >
                                    <option value={5}>5</option>
                                    <option value={10}>10</option>
                                    <option value={20}>20</option>
                                </select>
                            </div>
                        </div>
                    </form>
                </section>

                {/* TABLA */}
                <section className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
                    <div className="flex flex-col gap-2 border-b border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="text-base font-semibold text-foreground">
                                Listado de ciudades
                            </h2>
                            <p className="mt-0.5 text-sm text-muted-foreground">
                                Consulta y administra las ciudades registradas.
                            </p>
                        </div>

                        <span className="inline-flex w-fit items-center rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold tabular-nums text-indigo-700 ring-1 ring-inset ring-indigo-100 dark:bg-indigo-500/15 dark:text-indigo-300 dark:ring-indigo-400/20">
                            {ciudades.total}{' '}
                            {ciudades.total === 1 ? 'ciudad' : 'ciudades'}
                        </span>
                    </div>

                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-b border-border bg-muted/60 hover:bg-muted/60">
                                    <TableHead
                                        aria-sort={ariaOrden('nombre')}
                                        className="h-12 min-w-56 pl-5"
                                    >
                                        <button
                                            type="button"
                                            onClick={() =>
                                                ordenarPor('nombre')
                                            }
                                            className={claseBotonOrden}
                                        >
                                            Ciudad
                                            {indicadorOrden('nombre')}
                                        </button>
                                    </TableHead>

                                    <TableHead
                                        aria-sort={ariaOrden('codigo_postal')}
                                        className="h-12 min-w-36"
                                    >
                                        <button
                                            type="button"
                                            onClick={() =>
                                                ordenarPor('codigo_postal')
                                            }
                                            className={claseBotonOrden}
                                        >
                                            Código postal
                                            {indicadorOrden('codigo_postal')}
                                        </button>
                                    </TableHead>

                                    <TableHead
                                        aria-sort={ariaOrden('provincia')}
                                        className="h-12 min-w-48"
                                    >
                                        <button
                                            type="button"
                                            onClick={() =>
                                                ordenarPor('provincia')
                                            }
                                            className={claseBotonOrden}
                                        >
                                            Provincia
                                            {indicadorOrden('provincia')}
                                        </button>
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
                                            className={`${claseBotonOrden} justify-center`}
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
                                {ciudades.data.length === 0 ? (
                                    <TableRow className="hover:bg-transparent">
                                        <TableCell
                                            colSpan={5}
                                            className="h-64 text-center"
                                        >
                                            <div className="flex flex-col items-center justify-center gap-3">
                                                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-dashed border-border bg-muted">
                                                    <MapPin className="h-5 w-5 text-muted-foreground" />
                                                </div>

                                                <div>
                                                    <p className="font-semibold text-foreground">
                                                        No se encontraron ciudades
                                                    </p>
                                                    <p className="mt-1 text-sm text-muted-foreground">
                                                        Prueba con otros
                                                        términos o cambia la
                                                        provincia seleccionada.
                                                    </p>
                                                </div>

                                                {(buscar || provinciaId) && (
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => {
                                                            setBuscar('');
                                                            setProvinciaId('');
                                                            navegarConFiltros({
                                                                buscar: '',
                                                                provincia_id: '',
                                                            });
                                                        }}
                                                        className="mt-1 focus-visible:ring-2 focus-visible:ring-indigo-500"
                                                    >
                                                        Limpiar filtros
                                                    </Button>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    ciudades.data.map((ciudad) => (
                                        <TableRow
                                            key={ciudad.id}
                                            className="group border-border/60 transition-colors odd:bg-transparent even:bg-muted/30 hover:bg-indigo-50/60 dark:hover:bg-indigo-500/10"
                                        >
                                            <TableCell className="py-3.5 pl-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors group-hover:bg-indigo-100 group-hover:text-indigo-700 dark:group-hover:bg-indigo-500/20 dark:group-hover:text-indigo-300">
                                                        <MapPin className="h-4 w-4" />
                                                    </div>
                                                    <span className="text-sm font-semibold text-foreground sm:text-[0.95rem]">
                                                        {ciudad.nombre}
                                                    </span>
                                                </div>
                                            </TableCell>

                                            <TableCell className="py-3.5">
                                                <span className="text-sm text-muted-foreground">
                                                    {ciudad.codigo_postal ||
                                                        '—'}
                                                </span>
                                            </TableCell>

                                            <TableCell className="py-3.5">
                                                <span className="text-sm text-foreground">
                                                    {ciudad.provincia?.nombre ??
                                                        'Sin provincia'}
                                                </span>
                                            </TableCell>

                                            <TableCell className="py-3.5 text-center">
                                                <span
                                                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                                                        ciudad.estado
                                                            ? 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/20'
                                                            : 'bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-200 dark:bg-rose-500/10 dark:text-rose-300 dark:ring-rose-500/20'
                                                    }`}
                                                >
                                                    <span
                                                        className={`h-1.5 w-1.5 rounded-full ${
                                                            ciudad.estado
                                                                ? 'bg-emerald-500'
                                                                : 'bg-rose-500'
                                                        }`}
                                                    />
                                                    {ciudad.estado
                                                        ? 'Activo'
                                                        : 'Inactivo'}
                                                </span>
                                            </TableCell>

                                            <TableCell className="py-3.5 pr-5">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        asChild
                                                        className="h-9 rounded-lg border-border px-2.5 text-foreground hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 focus-visible:ring-2 focus-visible:ring-indigo-500 sm:px-3 dark:hover:border-indigo-400/30 dark:hover:bg-indigo-500/15 dark:hover:text-indigo-300"
                                                    >
                                                        <Link
                                                            href={`/ciudades/${ciudad.id}`}
                                                            aria-label={`Ver detalle de ${ciudad.nombre}`}
                                                            title="Ver detalle"
                                                        >
                                                            <Eye className="h-3.5 w-3.5 sm:mr-1.5" />
                                                            <span className="hidden sm:inline">
                                                                Ver
                                                            </span>
                                                        </Link>
                                                    </Button>

                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        asChild
                                                        className="h-9 rounded-lg border-border px-2.5 text-foreground hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 focus-visible:ring-2 focus-visible:ring-indigo-500 sm:px-3 dark:hover:border-indigo-400/30 dark:hover:bg-indigo-500/15 dark:hover:text-indigo-300"
                                                    >
                                                        <Link
                                                            href={`/ciudades/${ciudad.id}/edit`}
                                                            aria-label={`Editar ${ciudad.nombre}`}
                                                        >
                                                            <Pencil className="h-3.5 w-3.5 sm:mr-1.5" />
                                                            <span className="hidden sm:inline">
                                                                Editar
                                                            </span>
                                                        </Link>
                                                    </Button>

                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() =>
                                                            cambiarEstado(ciudad)
                                                        }
                                                        aria-label={`${
                                                            ciudad.estado
                                                                ? 'Desactivar'
                                                                : 'Activar'
                                                        } ${ciudad.nombre}`}
                                                        className={
                                                            ciudad.estado
                                                                ? 'h-9 rounded-lg px-2.5 text-rose-600 hover:bg-rose-50 hover:text-rose-700 focus-visible:ring-2 focus-visible:ring-rose-500 sm:px-3 dark:text-rose-400 dark:hover:bg-rose-500/15 dark:hover:text-rose-300'
                                                                : 'h-9 rounded-lg px-2.5 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800 focus-visible:ring-2 focus-visible:ring-emerald-500 sm:px-3 dark:text-emerald-400 dark:hover:bg-emerald-500/15 dark:hover:text-emerald-300'
                                                        }
                                                    >
                                                        {ciudad.estado ? (
                                                            <CircleOff className="h-3.5 w-3.5 sm:mr-1.5" />
                                                        ) : (
                                                            <CheckCircle2 className="h-3.5 w-3.5 sm:mr-1.5" />
                                                        )}
                                                        <span className="hidden sm:inline">
                                                            {ciudad.estado
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
                                {ciudades.from ?? 0}
                            </span>{' '}
                            a{' '}
                            <span className="font-semibold tabular-nums text-foreground">
                                {ciudades.to ?? 0}
                            </span>{' '}
                            de{' '}
                            <span className="font-semibold tabular-nums text-foreground">
                                {ciudades.total}
                            </span>{' '}
                            registros
                        </p>

                        <nav
                            aria-label="Paginación de ciudades"
                            className="flex flex-wrap items-center justify-center gap-1.5 sm:justify-end"
                        >
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                disabled={!ciudades.prev_page_url}
                                onClick={() =>
                                    ciudades.prev_page_url &&
                                    router.get(
                                        ciudades.prev_page_url,
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
                                    {ciudades.current_page}
                                </span>{' '}
                                de{' '}
                                <span className="font-semibold text-foreground">
                                    {ciudades.last_page}
                                </span>
                            </span>

                            {ciudades.links?.map((link, index) => {
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
                                            link.active ? 'default' : 'outline'
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
                                disabled={!ciudades.next_page_url}
                                onClick={() =>
                                    ciudades.next_page_url &&
                                    router.get(
                                        ciudades.next_page_url,
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
                    Gestión de ciudades · Job Portal
                </p>
            </div>
        </div>
    );
}
