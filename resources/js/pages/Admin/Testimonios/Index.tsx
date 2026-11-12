
import { useAuth } from '@/hooks/use-auth';
import { router } from '@inertiajs/react';
import { useEffect, useState, type FormEvent } from 'react';
import {
    Search,
    MessageSquareQuote,
    CircleOff,
    CheckCircle2,
    Info,
    AlertTriangle,
    ChevronLeft,
    ChevronRight,
    Star,
    StarOff,
    Trash2,
    X,
    UserRound,
    Building2,
    ShieldCheck,
    ShieldAlert,
    CalendarDays,
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

interface Usuario {
    id: number;
    nombre: string;
    apellido: string;
    imagen?: string | null;
    estado: boolean;
}

interface Candidato {
    id: number;
    user_id: number;
    user?: Usuario | null;
}

interface Empresa {
    id: number;
    nombre_comercial: string;
    estado: boolean;
}

interface Testimonio {
    id: number;
    user_id: number;
    candidato_id: number | null;
    empresa_id: number | null;
    mensaje: string;
    consentimiento: boolean;
    consentimiento_at: string | null;
    consentimiento_revocado_at: string | null;
    estado: boolean;
    destacado: boolean;
    created_at: string;
    user?: Usuario | null;
    candidato?: Candidato | null;
    empresa?: Empresa | null;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface TestimoniosPaginados {
    data: Testimonio[];
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
    tipo: string;
    consentimiento: string;
    estado: string;
    destacado: string;
    per_page: number;
}

interface Props {
    testimonios: TestimoniosPaginados;
    filtros: Filtros;
    flash?: {
        success?: string | {
            type?: string;
            message: string;
        };
        error?: string;
    };
}

// --------------------------------------------------
// COMPONENTE
// --------------------------------------------------

export default function Index({
    testimonios,
    filtros,
    flash,
}: Props) {
    // --------------------------------------------------
    // PERMISOS
    // --------------------------------------------------

    const { can, canAny } = useAuth();

    const puedeModerar = can('moderar testimonios');
    const puedeDestacar = can('destacar testimonios');
    const puedeEliminar = can('eliminar testimonios');

    const puedeVerAcciones = canAny([
        'moderar testimonios',
        'destacar testimonios',
        'eliminar testimonios',
    ]);

    // --------------------------------------------------
    // ESTADOS
    // --------------------------------------------------

    const [buscar, setBuscar] = useState(filtros.buscar ?? '');
    const [tipo, setTipo] = useState(filtros.tipo ?? '');
    const [consentimiento, setConsentimiento] = useState(
        filtros.consentimiento ?? '',
    );
    const [estado, setEstado] = useState(filtros.estado ?? '');
    const [destacado, setDestacado] = useState(filtros.destacado ?? '');
    const [porPagina, setPorPagina] = useState(filtros.per_page ?? 10);
    const [mostrarNotificacion, setMostrarNotificacion] = useState(true);

    // --------------------------------------------------
    // NOTIFICACIONES
    // --------------------------------------------------

    useEffect(() => {
        setMostrarNotificacion(true);

        if (!flash?.success && !flash?.error) {
            return;
        }

        const temporizador = window.setTimeout(() => {
            setMostrarNotificacion(false);
        }, 4000);

        return () => window.clearTimeout(temporizador);
    }, [flash?.success, flash?.error]);

    const mensajeSuccess =
        typeof flash?.success === 'string'
            ? flash.success
            : flash?.success?.message;

    // --------------------------------------------------
    // BUSCADOR Y FILTROS
    // --------------------------------------------------

    const aplicarFiltros = (e?: FormEvent<HTMLFormElement>) => {
        e?.preventDefault();

        router.get(
            '/testimonios',
            {
                buscar,
                tipo,
                consentimiento,
                estado,
                destacado,
                per_page: porPagina,
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    };

    const limpiarFiltros = () => {
        setBuscar('');
        setTipo('');
        setConsentimiento('');
        setEstado('');
        setDestacado('');

        router.get(
            '/testimonios',
            {
                buscar: '',
                tipo: '',
                consentimiento: '',
                estado: '',
                destacado: '',
                per_page: porPagina,
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    };

    const cambiarPorPagina = (valor: number) => {
        setPorPagina(valor);

        router.get(
            '/testimonios',
            {
                buscar,
                tipo,
                consentimiento,
                estado,
                destacado,
                per_page: valor,
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    };

    const hayFiltrosActivos =
        buscar !== '' ||
        tipo !== '' ||
        consentimiento !== '' ||
        estado !== '' ||
        destacado !== '';

    // --------------------------------------------------
    // ACTIVAR / DESACTIVAR
    // --------------------------------------------------

    const cambiarEstado = (testimonio: Testimonio) => {
        const accion = testimonio.estado ? 'desactivar' : 'activar';

        if (
            confirm(
                `¿Estás seguro de que deseas ${accion} este testimonio?`,
            )
        ) {
            router.patch(
                `/testimonios/${testimonio.id}/estado`,
                {},
                {
                    preserveScroll: true,
                },
            );
        }
    };

    // --------------------------------------------------
    // DESTACAR / QUITAR DESTACADO
    // --------------------------------------------------

    const cambiarDestacado = (testimonio: Testimonio) => {
        const accion = testimonio.destacado
            ? 'quitar el destacado de'
            : 'destacar';

        if (
            confirm(
                `¿Deseas ${accion} este testimonio?`,
            )
        ) {
            router.patch(
                `/testimonios/${testimonio.id}/destacado`,
                {},
                {
                    preserveScroll: true,
                },
            );
        }
    };

    // --------------------------------------------------
    // ELIMINAR
    // --------------------------------------------------

    const eliminarTestimonio = (testimonio: Testimonio) => {
        if (
            confirm(
                '¿Estás seguro de que deseas eliminar este testimonio? Esta acción no se puede deshacer.',
            )
        ) {
            router.delete(`/testimonios/${testimonio.id}`, {
                preserveScroll: true,
            });
        }
    };

    // --------------------------------------------------
    // INFORMACIÓN DEL AUTOR
    // --------------------------------------------------

    const nombreAutor = (testimonio: Testimonio) => {
        if (!testimonio.user) {
            return 'Usuario no disponible';
        }

        return `${testimonio.user.nombre} ${testimonio.user.apellido}`;
    };

    const tipoAutor = (testimonio: Testimonio) => {
        if (testimonio.candidato_id !== null) {
            return 'Candidato';
        }

        if (testimonio.empresa_id !== null) {
            return 'Empresa';
        }

        return 'Sin perfil';
    };

    const subtituloAutor = (testimonio: Testimonio) => {
        if (testimonio.candidato_id !== null) {
            return 'Perfil de candidato';
        }

        if (testimonio.empresa_id !== null) {
            return testimonio.empresa?.nombre_comercial
                ? `Representante de ${testimonio.empresa.nombre_comercial}`
                : 'Empresa no disponible';
        }

        return 'Perfil no identificado';
    };

    const fechaFormato = (fecha: string) => {
        return new Date(fecha).toLocaleDateString('es-AR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

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
                            <MessageSquareQuote className="h-6 w-6" />
                        </div>

                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                                Testimonios
                            </h1>

                            <p className="mt-1 max-w-xl text-sm leading-relaxed text-muted-foreground">
                                Administra las opiniones de candidatos y
                                empresas que podrán aparecer en Talent Match.
                            </p>
                        </div>
                    </div>
                </header>

                {/* NOTIFICACIONES */}
                {mostrarNotificacion && (mensajeSuccess || flash?.error) && (
                    <div
                        role="status"
                        className={`flex items-start gap-3 rounded-xl border p-4 shadow-sm ${
                            flash?.error
                                ? 'border-rose-200 bg-rose-50 text-rose-900 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-100'
                                : 'border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-100'
                        }`}
                    >
                        {flash?.error ? (
                            <AlertTriangle className="h-5 w-5 shrink-0 text-rose-600 dark:text-rose-400" />
                        ) : (
                            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                        )}

                        <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold">
                                {flash?.error
                                    ? 'No se pudo completar la operación'
                                    : 'Operación realizada'}
                            </p>

                            <p className="mt-0.5 text-sm opacity-90">
                                {flash?.error ?? mensajeSuccess}
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => setMostrarNotificacion(false)}
                            aria-label="Cerrar notificación"
                            className="rounded-md p-1 opacity-70 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                )}

                {/* INFORMACIÓN */}
                <section className="grid gap-3 sm:grid-cols-3">
                    <div className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300">
                            <MessageSquareQuote className="h-5 w-5" />
                        </div>

                        <div>
                            <p className="text-sm font-semibold text-foreground">
                                Moderación
                            </p>
                            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                                Revisá los testimonios antes de habilitar su
                                publicación.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
                            <ShieldCheck className="h-5 w-5" />
                        </div>

                        <div>
                            <p className="text-sm font-semibold text-foreground">
                                Consentimiento
                            </p>
                            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                                Solo se pueden publicar testimonios con
                                autorización vigente.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300">
                            <Star className="h-5 w-5" />
                        </div>

                        <div>
                            <p className="text-sm font-semibold text-foreground">
                                Página principal
                            </p>
                            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                                Destacá las opiniones que quieras mostrar en
                                la portada.
                            </p>
                        </div>
                    </div>
                </section>

                {/* BUSCADOR Y FILTROS */}
                <section className="rounded-xl border border-border bg-card p-4 shadow-sm sm:p-5">
                    <form
                        onSubmit={aplicarFiltros}
                        className="flex flex-col gap-4"
                    >
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

                            {/* BUSCAR */}
                            <div className="space-y-2 lg:col-span-2">
                                <label
                                    htmlFor="buscar-testimonio"
                                    className="text-sm font-semibold text-foreground"
                                >
                                    Buscar testimonio
                                </label>

                                <div className="relative">
                                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                                    <Input
                                        id="buscar-testimonio"
                                        type="text"
                                        value={buscar}
                                        onChange={(e) =>
                                            setBuscar(e.target.value)
                                        }
                                        placeholder="Nombre del autor, empresa o mensaje..."
                                        autoComplete="off"
                                        className="h-10 rounded-lg border-border bg-background pl-9 pr-10 focus-visible:ring-indigo-500"
                                    />

                                    {buscar.length > 0 && (
                                        <button
                                            type="button"
                                            onClick={() => setBuscar('')}
                                            aria-label="Limpiar búsqueda"
                                            className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* TIPO */}
                            <div className="space-y-2">
                                <label
                                    htmlFor="filtro-tipo"
                                    className="text-sm font-semibold text-foreground"
                                >
                                    Tipo de perfil
                                </label>

                                <select
                                    id="filtro-tipo"
                                    value={tipo}
                                    onChange={(e) => setTipo(e.target.value)}
                                    className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                                >
                                    <option value="">Todos los perfiles</option>
                                    <option value="candidato">Candidatos</option>
                                    <option value="empresa">Empresas</option>
                                </select>
                            </div>

                            {/* CONSENTIMIENTO */}
                            <div className="space-y-2">
                                <label
                                    htmlFor="filtro-consentimiento"
                                    className="text-sm font-semibold text-foreground"
                                >
                                    Consentimiento
                                </label>

                                <select
                                    id="filtro-consentimiento"
                                    value={consentimiento}
                                    onChange={(e) =>
                                        setConsentimiento(e.target.value)
                                    }
                                    className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                                >
                                    <option value="">Todos</option>
                                    <option value="autorizados">
                                        Autorizados
                                    </option>
                                    <option value="no_autorizados">
                                        No autorizados / revocados
                                    </option>
                                </select>
                            </div>

                            {/* ESTADO */}
                            <div className="space-y-2">
                                <label
                                    htmlFor="filtro-estado"
                                    className="text-sm font-semibold text-foreground"
                                >
                                    Estado
                                </label>

                                <select
                                    id="filtro-estado"
                                    value={estado}
                                    onChange={(e) => setEstado(e.target.value)}
                                    className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                                >
                                    <option value="">Todos</option>
                                    <option value="activo">Activos</option>
                                    <option value="inactivo">Inactivos</option>
                                </select>
                            </div>

                            {/* DESTACADO */}
                            <div className="space-y-2">
                                <label
                                    htmlFor="filtro-destacado"
                                    className="text-sm font-semibold text-foreground"
                                >
                                    Publicación destacada
                                </label>

                                <select
                                    id="filtro-destacado"
                                    value={destacado}
                                    onChange={(e) =>
                                        setDestacado(e.target.value)
                                    }
                                    className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                                >
                                    <option value="">Todos</option>
                                    <option value="si">Destacados</option>
                                    <option value="no">No destacados</option>
                                </select>
                            </div>
                        </div>

                        {/* BOTONES Y PAGINACIÓN */}
                        <div className="flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-end sm:justify-between">
                            <div className="flex flex-wrap gap-2">
                                <Button
                                    type="submit"
                                    className="h-10 rounded-lg bg-indigo-600 px-5 font-medium text-white hover:bg-indigo-700 focus-visible:ring-2 focus-visible:ring-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400"
                                >
                                    <Search className="mr-2 h-4 w-4" />
                                    Buscar
                                </Button>

                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={limpiarFiltros}
                                    disabled={!hayFiltrosActivos}
                                    className="h-10 rounded-lg border-border px-4"
                                >
                                    <X className="mr-2 h-4 w-4" />
                                    Limpiar filtros
                                </Button>
                            </div>

                            <div className="w-full space-y-2 sm:w-48">
                                <label
                                    htmlFor="por-pagina"
                                    className="text-sm font-semibold text-foreground"
                                >
                                    Registros por página
                                </label>

                                <select
                                    id="por-pagina"
                                    value={porPagina}
                                    onChange={(e) =>
                                        cambiarPorPagina(Number(e.target.value))
                                    }
                                    className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                                >
                                    <option value={5}>5 registros</option>
                                    <option value={10}>10 registros</option>
                                    <option value={20}>20 registros</option>
                                </select>
                            </div>
                        </div>

                        {hayFiltrosActivos && (
                            <p className="text-xs text-muted-foreground">
                                {testimonios.total === 0
                                    ? 'No se encontraron testimonios con los filtros seleccionados.'
                                    : `${testimonios.total} ${
                                          testimonios.total === 1
                                              ? 'resultado encontrado'
                                              : 'resultados encontrados'
                                      }.`}
                            </p>
                        )}
                    </form>
                </section>

                {/* TABLA */}
                <section className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
                    <div className="flex flex-col gap-2 border-b border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="text-base font-semibold text-foreground">
                                Listado de testimonios
                            </h2>

                            <p className="mt-0.5 text-sm text-muted-foreground">
                                Revisá las opiniones y administrá su
                                publicación en la página principal.
                            </p>
                        </div>

                        <span className="inline-flex w-fit items-center rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold tabular-nums text-indigo-700 ring-1 ring-inset ring-indigo-100 dark:bg-indigo-500/15 dark:text-indigo-300 dark:ring-indigo-400/20">
                            {testimonios.total}{' '}
                            {testimonios.total === 1
                                ? 'testimonio'
                                : 'testimonios'}
                        </span>
                    </div>

                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-b border-border bg-muted/60 hover:bg-muted/60">
                                    <TableHead className="h-12 min-w-56 pl-5">
                                        Autor
                                    </TableHead>

                                    <TableHead className="h-12 min-w-48">
                                        Testimonio
                                    </TableHead>

                                    <TableHead className="h-12 min-w-40 text-center">
                                        Consentimiento
                                    </TableHead>

                                    <TableHead className="h-12 min-w-28 text-center">
                                        Estado
                                    </TableHead>

                                    <TableHead className="h-12 min-w-28 text-center">
                                        Destacado
                                    </TableHead>

                                    {puedeVerAcciones && (
                                        <TableHead className="h-12 min-w-36 pr-5 text-right">
                                            Acciones
                                        </TableHead>
                                    )}
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {testimonios.data.length === 0 ? (
                                    <TableRow className="hover:bg-transparent">
                                        <TableCell
                                            colSpan={puedeVerAcciones ? 6 : 5}
                                            className="h-64 text-center"
                                        >
                                            <div className="flex flex-col items-center justify-center gap-3">
                                                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-dashed border-border bg-muted">
                                                    <MessageSquareQuote className="h-5 w-5 text-muted-foreground" />
                                                </div>

                                                <div>
                                                    <p className="font-semibold text-foreground">
                                                        No hay testimonios
                                                    </p>

                                                    <p className="mt-1 text-sm text-muted-foreground">
                                                        Todavía no hay
                                                        testimonios registrados
                                                        o no coinciden con los
                                                        filtros.
                                                    </p>
                                                </div>

                                                {hayFiltrosActivos && (
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={limpiarFiltros}
                                                    >
                                                        Limpiar filtros
                                                    </Button>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    testimonios.data.map((testimonio) => {
                                        const consentimientoVigente =
                                            testimonio.consentimiento &&
                                            !testimonio.consentimiento_revocado_at;

                                        return (
                                            <TableRow
                                                key={testimonio.id}
                                                className="group border-border/60 transition-colors odd:bg-transparent even:bg-muted/30 hover:bg-indigo-50/60 dark:hover:bg-indigo-500/10"
                                            >
                                                {/* AUTOR */}
                                                <TableCell className="py-4 pl-5">
                                                    <div className="flex items-start gap-3">
                                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground group-hover:bg-indigo-100 group-hover:text-indigo-700 dark:group-hover:bg-indigo-500/20 dark:group-hover:text-indigo-300">
                                                            {testimonio.candidato_id !== null ? (
                                                                <UserRound className="h-5 w-5" />
                                                            ) : (
                                                                <Building2 className="h-5 w-5" />
                                                            )}
                                                        </div>

                                                        <div className="min-w-0">
                                                            <p className="text-sm font-semibold text-foreground">
                                                                {nombreAutor(testimonio)}
                                                            </p>

                                                            <p className="mt-0.5 text-xs text-muted-foreground">
                                                                {subtituloAutor(testimonio)}
                                                            </p>

                                                            <span className="mt-1 inline-flex rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                                                                {tipoAutor(testimonio)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </TableCell>

                                                {/* MENSAJE */}
                                                <TableCell className="py-4">
                                                    <div className="max-w-sm">
                                                        <p
                                                            className="text-sm leading-relaxed text-foreground"
                                                            title={testimonio.mensaje}
                                                        >
                                                            {testimonio.mensaje.length > 150
                                                                ? `${testimonio.mensaje.slice(0, 150)}…`
                                                                : testimonio.mensaje}
                                                        </p>

                                                        <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                                                            <CalendarDays className="h-3.5 w-3.5" />
                                                            {fechaFormato(testimonio.created_at)}
                                                        </p>
                                                    </div>
                                                </TableCell>

                                                {/* CONSENTIMIENTO */}
                                                <TableCell className="py-4 text-center">
                                                    {consentimientoVigente ? (
                                                        <div className="inline-flex flex-col items-center gap-1">
                                                            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/20">
                                                                <ShieldCheck className="h-3.5 w-3.5" />
                                                                Autorizado
                                                            </span>

                                                            {testimonio.consentimiento_at && (
                                                                <span className="text-[11px] text-muted-foreground">
                                                                    {fechaFormato(testimonio.consentimiento_at)}
                                                                </span>
                                                            )}
                                                        </div>
                                                    ) : testimonio.consentimiento_revocado_at ? (
                                                        <div className="inline-flex flex-col items-center gap-1">
                                                            <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700 ring-1 ring-inset ring-rose-200 dark:bg-rose-500/10 dark:text-rose-300 dark:ring-rose-500/20">
                                                                <ShieldAlert className="h-3.5 w-3.5" />
                                                                Revocado
                                                            </span>

                                                            <span className="text-[11px] text-muted-foreground">
                                                                {fechaFormato(testimonio.consentimiento_revocado_at)}
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 ring-1 ring-inset ring-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-500/20">
                                                            <ShieldAlert className="h-3.5 w-3.5" />
                                                            Sin autorización
                                                        </span>
                                                    )}
                                                </TableCell>

                                                {/* ESTADO */}
                                                <TableCell className="py-4 text-center">
                                                    <span
                                                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                                                            testimonio.estado
                                                                ? 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/20'
                                                                : 'bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-200 dark:bg-rose-500/10 dark:text-rose-300 dark:ring-rose-500/20'
                                                        }`}
                                                    >
                                                        <span
                                                            className={`h-1.5 w-1.5 rounded-full ${
                                                                testimonio.estado
                                                                    ? 'bg-emerald-500'
                                                                    : 'bg-rose-500'
                                                            }`}
                                                        />
                                                        {testimonio.estado
                                                            ? 'Activo'
                                                            : 'Inactivo'}
                                                    </span>
                                                </TableCell>

                                                {/* DESTACADO */}
                                                <TableCell className="py-4 text-center">
                                                    {testimonio.destacado ? (
                                                        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 ring-1 ring-inset ring-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-500/20">
                                                            <Star className="h-3.5 w-3.5 fill-current" />
                                                            Sí
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                                                            <StarOff className="h-3.5 w-3.5" />
                                                            No
                                                        </span>
                                                    )}
                                                </TableCell>

                                                {/* ACCIONES SEGÚN PERMISOS */}
                                                {puedeVerAcciones && (
                                                    <TableCell className="py-4 pr-5">
                                                        <div className="flex items-center justify-end gap-1.5">

                                                            {/* DESTACAR */}
                                                            {puedeDestacar && (
                                                                <Button
                                                                    type="button"
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() =>
                                                                        cambiarDestacado(testimonio)
                                                                    }
                                                                    disabled={
                                                                        !testimonio.destacado &&
                                                                        (
                                                                            !testimonio.estado ||
                                                                            !consentimientoVigente
                                                                        )
                                                                    }
                                                                    title={
                                                                        !testimonio.destacado &&
                                                                        !consentimientoVigente
                                                                            ? 'Necesita consentimiento vigente'
                                                                            : testimonio.destacado
                                                                              ? 'Quitar destacado'
                                                                              : 'Destacar'
                                                                    }
                                                                    className={
                                                                        testimonio.destacado
                                                                            ? 'h-9 rounded-lg border-amber-200 px-2.5 text-amber-700 hover:bg-amber-50 hover:text-amber-800 dark:border-amber-400/30 dark:text-amber-300 dark:hover:bg-amber-500/15'
                                                                            : 'h-9 rounded-lg border-border px-2.5 text-foreground hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 dark:hover:bg-indigo-500/15 dark:hover:text-indigo-300'
                                                                    }
                                                                >
                                                                    {testimonio.destacado ? (
                                                                        <StarOff className="h-3.5 w-3.5" />
                                                                    ) : (
                                                                        <Star className="h-3.5 w-3.5" />
                                                                    )}
                                                                </Button>
                                                            )}

                                                            {/* MODERAR */}
                                                            {puedeModerar && (
                                                                <Button
                                                                    type="button"
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() =>
                                                                        cambiarEstado(testimonio)
                                                                    }
                                                                    title={
                                                                        testimonio.estado
                                                                            ? 'Desactivar'
                                                                            : 'Activar'
                                                                    }
                                                                    className={
                                                                        testimonio.estado
                                                                            ? 'h-9 rounded-lg px-2.5 text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:text-rose-400 dark:hover:bg-rose-500/15'
                                                                            : 'h-9 rounded-lg px-2.5 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800 dark:text-emerald-400 dark:hover:bg-emerald-500/15'
                                                                    }
                                                                >
                                                                    {testimonio.estado ? (
                                                                        <CircleOff className="h-3.5 w-3.5" />
                                                                    ) : (
                                                                        <CheckCircle2 className="h-3.5 w-3.5" />
                                                                    )}
                                                                </Button>
                                                            )}

                                                            {/* ELIMINAR */}
                                                            {puedeEliminar && (
                                                                <Button
                                                                    type="button"
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() =>
                                                                        eliminarTestimonio(testimonio)
                                                                    }
                                                                    title="Eliminar testimonio"
                                                                    className="h-9 rounded-lg px-2.5 text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:text-rose-400 dark:hover:bg-rose-500/15"
                                                                >
                                                                    <Trash2 className="h-3.5 w-3.5" />
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                )}
                                            </TableRow>
                                        );
                                    })
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* PAGINACIÓN */}
                    <div className="flex flex-col gap-4 border-t border-border bg-muted/40 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-center text-sm text-muted-foreground sm:text-left">
                            Mostrando{' '}
                            <span className="font-semibold tabular-nums text-foreground">
                                {testimonios.from ?? 0}
                            </span>{' '}
                            a{' '}
                            <span className="font-semibold tabular-nums text-foreground">
                                {testimonios.to ?? 0}
                            </span>{' '}
                            de{' '}
                            <span className="font-semibold tabular-nums text-foreground">
                                {testimonios.total}
                            </span>{' '}
                            registros
                        </p>

                        <nav
                            aria-label="Paginación de testimonios"
                            className="flex flex-wrap items-center justify-center gap-1.5 sm:justify-end"
                        >
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                disabled={!testimonios.prev_page_url}
                                onClick={() =>
                                    testimonios.prev_page_url &&
                                    router.get(
                                        testimonios.prev_page_url,
                                        {},
                                        {
                                            preserveState: true,
                                            preserveScroll: true,
                                        },
                                    )
                                }
                                aria-label="Página anterior"
                                className="h-9 rounded-lg border-border bg-background px-3 disabled:opacity-50"
                            >
                                <ChevronLeft className="h-4 w-4" />
                                <span className="hidden sm:inline">
                                    Anterior
                                </span>
                            </Button>

                            <span className="px-3 text-sm tabular-nums text-muted-foreground sm:hidden">
                                Página{' '}
                                <span className="font-semibold text-foreground">
                                    {testimonios.current_page}
                                </span>{' '}
                                de{' '}
                                <span className="font-semibold text-foreground">
                                    {testimonios.last_page}
                                </span>
                            </span>

                            {testimonios.links?.map((link, index) => {
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
                                                ? 'hidden h-9 min-w-9 rounded-lg bg-indigo-600 px-3 text-white shadow-sm hover:bg-indigo-700 sm:inline-flex dark:bg-indigo-500 dark:hover:bg-indigo-400'
                                                : 'hidden h-9 min-w-9 rounded-lg border-border bg-background px-3 text-foreground hover:bg-indigo-50 hover:text-indigo-700 sm:inline-flex dark:hover:bg-indigo-500/15 dark:hover:text-indigo-300'
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
                                disabled={!testimonios.next_page_url}
                                onClick={() =>
                                    testimonios.next_page_url &&
                                    router.get(
                                        testimonios.next_page_url,
                                        {},
                                        {
                                            preserveState: true,
                                            preserveScroll: true,
                                        },
                                    )
                                }
                                aria-label="Página siguiente"
                                className="h-9 rounded-lg border-border bg-background px-3 disabled:opacity-50"
                            >
                                <span className="hidden sm:inline">
                                    Siguiente
                                </span>
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </nav>
                    </div>
                </section>

                {/* PIE */}
                <p className="pb-2 text-center text-xs text-muted-foreground">
                    Gestión de testimonios · Talent Match
                </p>
            </div>
        </div>
    );
}
