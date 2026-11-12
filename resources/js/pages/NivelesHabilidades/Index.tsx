
import { Link, router } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';
import {
    Search,
    Plus,
    Eye,
    Pencil,
    Trash2,
    CheckCircle2,
    Info,
    AlertTriangle,
    Tags,
    X,
    Percent,
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

interface NivelHabilidad {
    id: number;
    nombre: string;
    porcentaje: number | null;
    descripcion: string | null;
    estado: boolean;
}

interface Props {
    nivelHabilidad: NivelHabilidad[];
    flash?: {
        success?: {
            type: 'created' | 'updated' | 'deleted';
            message: string;
        };
    };
}

// --------------------------------------------------
// UTILIDADES
// --------------------------------------------------

const normalizar = (texto: string) =>
    texto
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim();

// --------------------------------------------------
// COMPONENTE
// --------------------------------------------------

export default function Index({ nivelHabilidad, flash }: Props) {
    const [buscar, setBuscar] = useState('');
    const [busquedaAplicada, setBusquedaAplicada] = useState('');
    const [mostrarNotificacion, setMostrarNotificacion] = useState(true);

    // Ocultar automáticamente la notificación después de 4 segundos.
    useEffect(() => {
        setMostrarNotificacion(true);

        if (!flash?.success) return;

        const temporizador = window.setTimeout(() => {
            setMostrarNotificacion(false);
        }, 4000);

        return () => window.clearTimeout(temporizador);
    }, [flash?.success]);

    // Filtrar por nombre.
    const visibles = useMemo(() => {
        const texto = normalizar(busquedaAplicada);

        if (!texto) return nivelHabilidad;

        return nivelHabilidad.filter((item) =>
            normalizar(item.nombre).includes(texto),
        );
    }, [nivelHabilidad, busquedaAplicada]);

    const total = nivelHabilidad.length;
    const cantidadVisible = visibles.length;
    const hayBusqueda = busquedaAplicada.trim().length > 0;

    const ejecutarBusqueda = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setBusquedaAplicada(buscar);
    };

    const limpiarBusqueda = () => {
        setBuscar('');
        setBusquedaAplicada('');
    };

    // Activar o desactivar un nivel de habilidad.
    const cambiarEstado = (item: NivelHabilidad) => {
        const accion = item.estado ? 'desactivar' : 'activar';

        if (
            confirm(
                `¿Estás seguro de que deseas ${accion} el nivel "${item.nombre}"?`,
            )
        ) {
            router.patch(
                `/niveles-habilidades/${item.id}/estado`,
                {},
                { preserveScroll: true },
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
            titulo: 'Nivel de habilidad creado',
        },
        updated: {
            container:
                'border-indigo-200 bg-indigo-50 text-indigo-900 dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:text-indigo-100',
            icon: (
                <Info className="h-5 w-5 shrink-0 text-indigo-600 dark:text-indigo-400" />
            ),
            titulo: 'Cambios guardados',
        },
        deleted: {
            container:
                'border-rose-200 bg-rose-50 text-rose-900 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-100',
            icon: (
                <AlertTriangle className="h-5 w-5 shrink-0 text-rose-600 dark:text-rose-400" />
            ),
            titulo: 'Nivel de habilidad desactivado',
        },
    };

    const notificacion = flash?.success
        ? estilosFlash[flash.success.type]
        : null;

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
                            <Tags className="h-6 w-6" />
                        </div>

                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                                Niveles de habilidad
                            </h1>
                            <p className="mt-1 max-w-xl text-sm leading-relaxed text-muted-foreground">
                                Administra los niveles de dominio y sus porcentajes de referencia.
                            </p>
                        </div>
                    </div>

                    <Button
                        asChild
                        className="h-10 w-full rounded-lg bg-indigo-600 px-4 font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:w-auto dark:bg-indigo-500 dark:hover:bg-indigo-400"
                    >
                        <Link
                            href="/niveles-habilidades/create"
                            className="inline-flex items-center justify-center gap-2"
                        >
                            <Plus className="h-4 w-4" />
                            Nuevo nivel
                        </Link>
                    </Button>
                </header>

                {/* NOTIFICACIÓN */}
                {mostrarNotificacion && flash?.success && notificacion && (
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

                        <button
                            type="button"
                            onClick={() => setMostrarNotificacion(false)}
                            aria-label="Cerrar notificación"
                            className="ml-auto rounded-md p-1 opacity-70 transition-opacity hover:opacity-100"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                )}

                {/* BÚSQUEDA */}
                <section className="rounded-xl border border-border bg-card p-4 shadow-sm sm:p-5">
                    <form
                        onSubmit={ejecutarBusqueda}
                        className="flex flex-col gap-3 sm:flex-row sm:items-end"
                    >
                        <div className="w-full max-w-md space-y-2">
                            <label
                                htmlFor="buscar-nivel-habilidad"
                                className="text-sm font-semibold text-foreground"
                            >
                                Buscar nivel
                            </label>

                            <div className="relative">
                                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                                <Input
                                    id="buscar-nivel-habilidad"
                                    type="text"
                                    value={buscar}
                                    onChange={(e) => setBuscar(e.target.value)}
                                    placeholder="Escribe el nombre del nivel..."
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

                        <div className="flex gap-2">
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
                                onClick={limpiarBusqueda}
                                disabled={!buscar && !busquedaAplicada}
                                className="h-10 rounded-lg border-border px-4"
                            >
                                Limpiar
                            </Button>
                        </div>
                    </form>

                    {hayBusqueda && (
                        <p
                            className="mt-3 text-xs text-muted-foreground"
                            aria-live="polite"
                        >
                            {cantidadVisible === 0
                                ? 'No se encontraron coincidencias. Prueba con otro nombre.'
                                : `${cantidadVisible} ${
                                      cantidadVisible === 1
                                          ? 'resultado encontrado'
                                          : 'resultados encontrados'
                                  }.`}
                        </p>
                    )}
                </section>

                {/* TABLA */}
                <section className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
                    <div className="flex flex-col gap-2 border-b border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="text-base font-semibold text-foreground">
                                Listado de niveles
                            </h2>
                            <p className="mt-0.5 text-sm text-muted-foreground">
                                Consulta y administra los niveles de dominio.
                            </p>
                        </div>

                        <span className="inline-flex w-fit items-center rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold tabular-nums text-indigo-700 ring-1 ring-inset ring-indigo-100 dark:bg-indigo-500/15 dark:text-indigo-300 dark:ring-indigo-400/20">
                            {hayBusqueda
                                ? `${cantidadVisible} de ${total} ${
                                      total === 1 ? 'nivel' : 'niveles'
                                  }`
                                : `${total} ${
                                      total === 1 ? 'nivel' : 'niveles'
                                  }`}
                        </span>
                    </div>

                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-b border-border bg-muted/60 hover:bg-muted/60">
                                    <TableHead className="h-12 min-w-48 pl-5 text-sm font-semibold text-muted-foreground">
                                        Nombre
                                    </TableHead>

                                    <TableHead className="h-12 min-w-40 text-sm font-semibold text-muted-foreground">
                                        Porcentaje
                                    </TableHead>

                                    <TableHead className="h-12 min-w-32 text-center text-sm font-semibold text-muted-foreground">
                                        Estado
                                    </TableHead>

                                    <TableHead className="h-12 whitespace-nowrap pr-5 text-right text-sm font-semibold text-muted-foreground">
                                        Acciones
                                    </TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {visibles.length === 0 ? (
                                    <TableRow className="hover:bg-transparent">
                                        <TableCell
                                            colSpan={4}
                                            className="h-64 text-center"
                                        >
                                            <div className="flex flex-col items-center justify-center gap-3">
                                                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-dashed border-border bg-muted">
                                                    <Search className="h-5 w-5 text-muted-foreground" />
                                                </div>

                                                <div>
                                                    <p className="font-semibold text-foreground">
                                                        {total === 0
                                                            ? 'Aún no hay niveles registrados'
                                                            : 'No se encontraron niveles'}
                                                    </p>

                                                    <p className="mt-1 text-sm text-muted-foreground">
                                                        {total === 0
                                                            ? 'Crea el primero con el botón "Nuevo nivel".'
                                                            : 'Prueba con otro nombre o limpia la búsqueda.'}
                                                    </p>
                                                </div>

                                                {(buscar || busquedaAplicada) && (
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
                                    visibles.map((item) => (
                                        <TableRow
                                            key={item.id}
                                            className="group border-border/60 transition-colors odd:bg-transparent even:bg-muted/30 hover:bg-indigo-50/60 dark:hover:bg-indigo-500/10"
                                        >
                                            {/* NOMBRE */}
                                            <TableCell className="py-3.5 pl-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors group-hover:bg-indigo-100 group-hover:text-indigo-700 dark:group-hover:bg-indigo-500/20 dark:group-hover:text-indigo-300">
                                                        <Tags className="h-4 w-4" />
                                                    </div>

                                                    <span className="text-sm font-semibold text-foreground sm:text-[0.95rem]">
                                                        {item.nombre}
                                                    </span>
                                                </div>
                                            </TableCell>

                                            {/* PORCENTAJE */}
                                            <TableCell className="py-3.5">
                                                {item.porcentaje !== null &&
                                                item.porcentaje !== undefined ? (
                                                    <div className="flex min-w-32 items-center gap-3">
                                                        <div
                                                            className="h-2 w-20 overflow-hidden rounded-full bg-muted"
                                                            role="progressbar"
                                                            aria-label={`Porcentaje de ${item.nombre}`}
                                                            aria-valuemin={0}
                                                            aria-valuemax={100}
                                                            aria-valuenow={item.porcentaje}
                                                        >
                                                            <div
                                                                className="h-full rounded-full bg-indigo-600 transition-all dark:bg-indigo-400"
                                                                style={{
                                                                    width: `${item.porcentaje}%`,
                                                                }}
                                                            />
                                                        </div>

                                                        <span className="inline-flex items-center gap-1 text-sm font-semibold tabular-nums text-foreground">
                                                            {item.porcentaje}
                                                            <Percent className="h-3.5 w-3.5 text-muted-foreground" />
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <span className="text-sm italic text-muted-foreground">
                                                        No definido
                                                    </span>
                                                )}
                                            </TableCell>

                                            {/* ESTADO */}
                                            <TableCell className="py-3.5 text-center">
                                                {item.estado ? (
                                                    <span className="inline-flex items-center justify-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/15 dark:text-emerald-300">
                                                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                                        Activo
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center justify-center gap-1.5 rounded-full border border-border bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground">
                                                        <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60" />
                                                        Inactivo
                                                    </span>
                                                )}
                                            </TableCell>

                                            {/* ACCIONES */}
                                            <TableCell className="py-3.5 pr-5">
                                                <div className="flex flex-nowrap items-center justify-end gap-1.5">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        asChild
                                                        className="h-9 shrink-0 rounded-lg border-border px-2.5 text-foreground hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 focus-visible:ring-2 focus-visible:ring-indigo-500 sm:px-3 dark:hover:border-indigo-400/30 dark:hover:bg-indigo-500/15 dark:hover:text-indigo-300"
                                                    >
                                                        <Link
                                                            href={`/niveles-habilidades/${item.id}`}
                                                            aria-label={`Ver ${item.nombre}`}
                                                            className="inline-flex items-center gap-1.5 whitespace-nowrap"
                                                        >
                                                            <Eye className="h-3.5 w-3.5" />
                                                            <span>Ver</span>
                                                        </Link>
                                                    </Button>

                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        asChild
                                                        className="h-9 shrink-0 rounded-lg border-border px-2.5 text-foreground hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 focus-visible:ring-2 focus-visible:ring-indigo-500 sm:px-3 dark:hover:border-indigo-400/30 dark:hover:bg-indigo-500/15 dark:hover:text-indigo-300"
                                                    >
                                                        <Link
                                                            href={`/niveles-habilidades/${item.id}/edit`}
                                                            aria-label={`Editar ${item.nombre}`}
                                                            className="inline-flex items-center gap-1.5 whitespace-nowrap"
                                                        >
                                                            <Pencil className="h-3.5 w-3.5" />
                                                            <span>Editar</span>
                                                        </Link>
                                                    </Button>

                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => cambiarEstado(item)}
                                                        aria-label={`${item.estado ? 'Desactivar' : 'Activar'} ${item.nombre}`}
                                                        className={`h-9 shrink-0 rounded-lg px-2.5 whitespace-nowrap focus-visible:ring-2 sm:px-3 ${
                                                            item.estado
                                                                ? 'text-rose-600 hover:bg-rose-50 hover:text-rose-700 focus-visible:ring-rose-500 dark:text-rose-400 dark:hover:bg-rose-500/15 dark:hover:text-rose-300'
                                                                : 'text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800 focus-visible:ring-emerald-500 dark:text-emerald-400 dark:hover:bg-emerald-500/15 dark:hover:text-emerald-300'
                                                        }`}
                                                    >
                                                        {item.estado ? (
                                                            <Trash2 className="h-3.5 w-3.5 sm:mr-1.5" />
                                                        ) : (
                                                            <CheckCircle2 className="h-3.5 w-3.5 sm:mr-1.5" />
                                                        )}

                                                        <span className="hidden sm:inline">
                                                            {item.estado
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
                </section>

                {/* PIE */}
                <p className="pb-2 text-center text-xs text-muted-foreground">
                    Gestión de niveles de habilidad · Job Portal
                </p>
            </div>
        </div>
    );
}
