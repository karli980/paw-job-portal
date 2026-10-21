
import { Link, router } from '@inertiajs/react';
import { useState, type FormEvent } from 'react';
import {
    Search,
    Plus,
    Pencil,
    Trash2,
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
                <ArrowUpDown className="ml-2 h-3.5 w-3.5 text-slate-400" />
            );
        }

        return direccion === 'asc' ? (
            <ArrowUp className="ml-2 h-3.5 w-3.5 text-indigo-600" />
        ) : (
            <ArrowDown className="ml-2 h-3.5 w-3.5 text-indigo-600" />
        );
    };

    // Eliminar país.
    const eliminar = (id: number, nombre: string) => {
        if (
            confirm(
                `¿Estás seguro de que deseas eliminar el país "${nombre}"?`,
            )
        ) {
            router.delete(`/paises/${id}`, {
                preserveScroll: true,
            });
        }
    };

    // Estilos de notificaciones.
    const estilosFlash = {
        created: {
            container:
                'border-emerald-200 bg-emerald-50 text-emerald-900',
            icon: (
                <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
            ),
            titulo: 'País creado',
        },
        updated: {
            container: 'border-indigo-200 bg-indigo-50 text-indigo-900',
            icon: (
                <Info className="h-5 w-5 shrink-0 text-indigo-600" />
            ),
            titulo: 'Cambios guardados',
        },
        deleted: {
            container: 'border-rose-200 bg-rose-50 text-rose-900',
            icon: (
                <AlertTriangle className="h-5 w-5 shrink-0 text-rose-600" />
            ),
            titulo: 'País eliminado',
        },
    };

    const notificacion = flash?.success
        ? estilosFlash[flash.success.type]
        : null;

    // Laravel puede incluir Previous y Next en inglés
    // aunque la aplicación se muestre en español.
    const esAnterior = (label: string) =>
        /previous|anterior/i.test(label);

    const esSiguiente = (label: string) =>
        /next|siguiente/i.test(label);

    return (
        <div className="min-h-full bg-slate-50/70">
            <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">

                {/* CABECERA */}
                <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                    <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700 ring-1 ring-indigo-200/70">
                            <Globe2 className="h-6 w-6" />
                        </div>

                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                                Países
                            </h1>
                            <p className="mt-1 max-w-xl text-sm text-slate-500">
                                Administra los países y sus códigos
                                internacionales ISO.
                            </p>
                        </div>
                    </div>

                    <Button
                        asChild
                        className="h-10 rounded-lg bg-indigo-600 px-4 font-medium shadow-sm transition-colors hover:bg-indigo-700"
                    >
                        <Link
                            href="/paises/create"
                            className="inline-flex items-center gap-2"
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
                            <p className="mt-0.5 text-sm">
                                {flash.success.message}
                            </p>
                        </div>
                    </div>
                )}

                {/* PANEL DE BÚSQUEDA */}
                <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                    <form
                        onSubmit={aplicarFiltros}
                        className="flex flex-col gap-4 lg:flex-row lg:items-end"
                    >
                        <div className="flex-1 space-y-2">
                            <label
                                htmlFor="buscar-pais"
                                className="text-sm font-semibold text-slate-700"
                            >
                                Buscar país
                            </label>

                            <div className="relative">
                                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                                <Input
                                    id="buscar-pais"
                                    type="text"
                                    value={buscar}
                                    onChange={(e) =>
                                        setBuscar(e.target.value)
                                    }
                                    placeholder="Escribe un nombre o código ISO..."
                                    className="h-10 rounded-lg border-slate-200 pl-9 pr-10 transition-shadow focus-visible:ring-indigo-500"
                                />

                                {buscar && (
                                    <button
                                        type="button"
                                        onClick={limpiarBusqueda}
                                        aria-label="Limpiar búsqueda"
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-700"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2 lg:w-44">
                            <label
                                htmlFor="por-pagina"
                                className="text-sm font-semibold text-slate-700"
                            >
                                Registros por página
                            </label>

                            <select
                                id="por-pagina"
                                value={porPagina}
                                onChange={(e) =>
                                    setPorPagina(Number(e.target.value))
                                }
                                className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition-shadow focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value={5}>5 registros</option>
                                <option value={10}>10 registros</option>
                                <option value={20}>20 registros</option>
                            </select>
                        </div>

                        <Button
                            type="submit"
                            className="h-10 rounded-lg bg-slate-900 px-5 font-medium hover:bg-slate-800"
                        >
                            <Search className="mr-2 h-4 w-4" />
                            Buscar
                        </Button>
                    </form>
                </section>

                {/* TABLA */}
                <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                    <div className="flex flex-col gap-1 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="font-semibold text-slate-900">
                                Listado de países
                            </h2>
                            <p className="mt-1 text-sm text-slate-500">
                                Consulta y administra los registros.
                            </p>
                        </div>

                        <span className="inline-flex w-fit items-center rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 ring-1 ring-inset ring-indigo-100">
                            {paises.total}{' '}
                            {paises.total === 1 ? 'país' : 'países'}
                        </span>
                    </div>

                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-slate-200 bg-slate-50/80 hover:bg-slate-50/80">
                                    <TableHead className="h-12 min-w-48 pl-5">
                                        <button
                                            type="button"
                                            onClick={() => ordenarPor('nombre')}
                                            className="inline-flex items-center font-semibold text-slate-700 transition-colors hover:text-indigo-700"
                                        >
                                            Nombre
                                            {indicadorOrden('nombre')}
                                        </button>
                                    </TableHead>

                                    <TableHead className="h-12 min-w-32">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                ordenarPor('codigo_iso')
                                            }
                                            className="inline-flex items-center font-semibold text-slate-700 transition-colors hover:text-indigo-700"
                                        >
                                            Código ISO
                                            {indicadorOrden('codigo_iso')}
                                        </button>
                                    </TableHead>

                                    <TableHead className="h-12 min-w-32">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                ordenarPor('codigo_iso3')
                                            }
                                            className="inline-flex items-center font-semibold text-slate-700 transition-colors hover:text-indigo-700"
                                        >
                                            Código ISO 3
                                            {indicadorOrden('codigo_iso3')}
                                        </button>
                                    </TableHead>

                                    <TableHead className="h-12 pr-5 text-right font-semibold text-slate-700">
                                        Acciones
                                    </TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {paises.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={4}
                                            className="h-56 text-center"
                                        >
                                            <div className="flex flex-col items-center justify-center gap-3">
                                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                                                    <Search className="h-5 w-5 text-slate-400" />
                                                </div>

                                                <div>
                                                    <p className="font-semibold text-slate-800">
                                                        No se encontraron países
                                                    </p>
                                                    <p className="mt-1 text-sm text-slate-500">
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
                                                        className="mt-1"
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
                                            className="border-slate-100 transition-colors hover:bg-indigo-50/40"
                                        >
                                            <TableCell className="py-4 pl-5 font-medium text-slate-900">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600 transition-colors group-hover:bg-indigo-100">
                                                        <Globe2 className="h-4 w-4" />
                                                    </div>
                                                    <span>{pais.nombre}</span>
                                                </div>
                                            </TableCell>

                                            <TableCell className="py-4">
                                                <span className="inline-flex min-w-12 items-center justify-center rounded-md border border-indigo-100 bg-indigo-50 px-2.5 py-1 font-mono text-xs font-semibold tracking-wide text-indigo-700">
                                                    {pais.codigo_iso}
                                                </span>
                                            </TableCell>

                                            <TableCell className="py-4">
                                                <span className="inline-flex min-w-14 items-center justify-center rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 font-mono text-xs font-semibold tracking-wide text-slate-700">
                                                    {pais.codigo_iso3}
                                                </span>
                                            </TableCell>

                                            <TableCell className="py-4 pr-5">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        asChild
                                                        className="h-9 rounded-lg border-slate-200 px-3 text-slate-700 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
                                                    >
                                                        <Link
                                                            href={`/paises/${pais.id}/edit`}
                                                            aria-label={`Editar ${pais.nombre}`}
                                                        >
                                                            <Pencil className="mr-1.5 h-3.5 w-3.5" />
                                                            Editar
                                                        </Link>
                                                    </Button>

                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() =>
                                                            eliminar(
                                                                pais.id,
                                                                pais.nombre,
                                                            )
                                                        }
                                                        aria-label={`Eliminar ${pais.nombre}`}
                                                        className="h-9 rounded-lg px-3 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                                                    >
                                                        <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                                                        Eliminar
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
                    <div className="flex flex-col gap-4 border-t border-slate-100 bg-slate-50/60 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-sm text-slate-500">
                            Mostrando{' '}
                            <span className="font-semibold text-slate-800">
                                {paises.from ?? 0}
                            </span>{' '}
                            a{' '}
                            <span className="font-semibold text-slate-800">
                                {paises.to ?? 0}
                            </span>{' '}
                            de{' '}
                            <span className="font-semibold text-slate-800">
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
                                className="h-9 rounded-lg border-slate-200 bg-white px-3"
                            >
                                <ChevronLeft className="h-4 w-4" />
                                <span className="hidden sm:inline">
                                    Anterior
                                </span>
                            </Button>

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
                                            className="px-2 text-sm text-slate-400"
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
                                                ? 'h-9 min-w-9 rounded-lg bg-indigo-600 px-3 text-white shadow-sm hover:bg-indigo-700'
                                                : 'h-9 min-w-9 rounded-lg border-slate-200 bg-white px-3 text-slate-700 hover:bg-indigo-50 hover:text-indigo-700'
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
                                className="h-9 rounded-lg border-slate-200 bg-white px-3"
                            >
                                <span className="hidden sm:inline">
                                    Siguiente
                                </span>
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </nav>
                    </div>
                </section>

                <p className="pb-2 text-center text-xs text-slate-400">
                    Gestión de países · Job Portal
                </p>
            </div>
        </div>
    );
}
