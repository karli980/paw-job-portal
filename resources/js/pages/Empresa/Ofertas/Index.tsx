import { Head, Link, router } from '@inertiajs/react';
import { useState, type FormEvent } from 'react';
import {
    BriefcaseBusiness,
    CheckCircle2,
    Clock3,
    FilePenLine,
    Pencil,
    Filter,
    PauseCircle,
    Search,
    X,
} from 'lucide-react';


import { Badge } from '@/components/ui/badge';
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


interface Empresa {
    id: number;
    nombre_comercial: string;
}

interface Estado {
    id: number;
    nombre: string;
}

interface Catalogo {
    id: number;
    nombre: string;
}

interface Oferta {
    id: number;
    puede_editar?: boolean;
    titulo: string | null;
    resumen: string | null;
    vacantes: number;
    fecha_publicacion: string | null;
    fecha_vencimiento: string | null;
    created_at: string;
    estado_oferta: Estado | null;
    modalidad_trabajo: Catalogo | null;
    area_laboral: Catalogo | null;
    sub_area_laboral: Catalogo | null;
}

interface PaginaLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface OfertasPaginadas {
    data: Oferta[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
    links: PaginaLink[];
}

interface Estadisticas {
    total: number;
    publicadas: number;
    borradores: number;
    pausadas: number;
}

interface Filtros {
    buscar: string;
    estado_id: number | string | null;
    per_page: number;
}

interface Permisos {
    crear: boolean;
}

interface Props {
    empresa: Empresa;
    ofertas: OfertasPaginadas;
    estadisticas: Estadisticas;
    estados: Estado[];
    filtros: Filtros;
    permisos?: Permisos;
}

function formatoFecha(fecha: string | null): string {
    if (!fecha) return '—';

    const soloFecha = fecha.slice(0, 10);
    const partes = soloFecha.split('-');

    if (partes.length === 3) {
        return `${partes[2]}/${partes[1]}/${partes[0]}`;
    }

    return '—';
}

function estiloEstado(nombre?: string) {
    switch (nombre) {
        case 'Publicada':
            return 'border-emerald-200 bg-emerald-50 text-emerald-700';
        case 'Borrador':
            return 'border-slate-200 bg-slate-100 text-slate-700';
        case 'Pausada':
            return 'border-amber-200 bg-amber-50 text-amber-700';
        case 'Expirada':
            return 'border-rose-200 bg-rose-50 text-rose-700';
        case 'Cerrada':
            return 'border-blue-200 bg-blue-50 text-blue-700';
        case 'Archivada':
            return 'border-zinc-200 bg-zinc-100 text-zinc-600';
        default:
            return 'border-slate-200 bg-slate-50 text-slate-600';
    }
}

export default function Index({
    empresa,
    ofertas,
    estadisticas,
    estados,
    filtros,
    permisos,
}: Props) {
    const [buscar, setBuscar] = useState(filtros.buscar ?? '');
    const [estadoId, setEstadoId] = useState(
        String(filtros.estado_id ?? ''),
    );
    const [porPagina, setPorPagina] = useState(
        String(filtros.per_page ?? 10),
    );

    const urlListado = `/empresa/${empresa.id}/ofertas`;

    function aplicarFiltros(
        nuevoBuscar = buscar,
        nuevoEstado = estadoId,
        nuevoPorPagina = porPagina,
    ) {
        router.get(
            urlListado,
            {
                buscar: nuevoBuscar.trim() || undefined,
                estado_id: nuevoEstado || undefined,
                per_page: Number(nuevoPorPagina),
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    }

    function enviarBusqueda(evento: FormEvent<HTMLFormElement>) {
        evento.preventDefault();
        aplicarFiltros();
    }

    function limpiarFiltros() {
        setBuscar('');
        setEstadoId('');
        setPorPagina('10');
        aplicarFiltros('', '', '10');
    }

    const hayFiltros =
        Boolean(filtros.buscar) ||
        Boolean(filtros.estado_id) ||
        filtros.per_page !== 10;

    const indicadores = [
        {
            etiqueta: 'Total de ofertas',
            valor: estadisticas.total,
            icono: BriefcaseBusiness,
            iconoClase: 'bg-indigo-50 text-indigo-600',
        },
        {
            etiqueta: 'Publicadas',
            valor: estadisticas.publicadas,
            icono: CheckCircle2,
            iconoClase: 'bg-emerald-50 text-emerald-600',
        },
        {
            etiqueta: 'Borradores',
            valor: estadisticas.borradores,
            icono: FilePenLine,
            iconoClase: 'bg-slate-100 text-slate-600',
        },
        {
            etiqueta: 'Pausadas',
            valor: estadisticas.pausadas,
            icono: PauseCircle,
            iconoClase: 'bg-amber-50 text-amber-600',
        },
    ];

    return (
        <>
            <Head title="Gestión de ofertas laborales" />

            <main className="min-h-screen bg-slate-50/60 p-4 text-slate-900 sm:p-6 lg:p-8">
                <div className="mx-auto max-w-7xl space-y-7">
                    {/* Encabezado */}
                    <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="space-y-2">
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-600">
                                Talent Match / Empresas
                            </p>

                            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                                Gestión de ofertas laborales
                            </h1>

                            <p className="text-sm text-slate-500">
                                Administrá las búsquedas de talento de{' '}
                                <span className="font-semibold text-slate-700">
                                    {empresa.nombre_comercial}
                                </span>
                                .
                            </p>
                        </div>



                        {permisos?.crear && (
                            <Button asChild className="bg-indigo-600 hover:bg-indigo-700">
                                <Link href={`/empresa/${empresa.id}/ofertas/crear`}>
                                    <FilePenLine className="mr-2 size-4" />
                                    Nueva oferta
                                </Link>
                            </Button>
                        )}


                    </header>

                    {/* Indicadores */}
                    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        {indicadores.map((indicador) => {
                            const Icono = indicador.icono;

                            return (
                                <div
                                    key={indicador.etiqueta}
                                    className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="space-y-3">
                                            <p className="text-sm font-medium text-slate-500">
                                                {indicador.etiqueta}
                                            </p>

                                            <p className="text-3xl font-bold tracking-tight text-slate-900">
                                                {indicador.valor}
                                            </p>
                                        </div>

                                        <div
                                            className={`rounded-xl p-3 ${indicador.iconoClase}`}
                                        >
                                            <Icono className="size-5" />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </section>

                    {/* Filtros y listado */}
                    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                        <div className="space-y-5 border-b border-slate-100 p-5 sm:p-6">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <div>
                                    <h2 className="text-lg font-semibold">
                                        Ofertas de la empresa
                                    </h2>
                                    <p className="mt-1 text-sm text-slate-500">
                                        Consultá y organizá tus ofertas laborales.
                                    </p>
                                </div>

                                <Badge
                                    variant="secondary"
                                    className="rounded-full px-3 py-1"
                                >
                                    {ofertas.total} resultados
                                </Badge>
                            </div>

                            <form
                                onSubmit={enviarBusqueda}
                                className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_210px_130px_auto]"
                            >
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                                    <Input
                                        value={buscar}
                                        onChange={(evento) =>
                                            setBuscar(evento.target.value)
                                        }
                                        placeholder="Buscar por título..."
                                        aria-label="Buscar ofertas por título"
                                        className="h-10 pl-10"
                                    />
                                </div>

                                <div className="relative">
                                    <Filter className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                                    <select
                                        value={estadoId}
                                        onChange={(evento) => {
                                            const nuevo = evento.target.value;
                                            setEstadoId(nuevo);
                                            aplicarFiltros(buscar, nuevo, porPagina);
                                        }}
                                        aria-label="Filtrar por estado"
                                        className="h-10 w-full rounded-md border border-slate-200 bg-white pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                                    >
                                        <option value="">Todos los estados</option>
                                        {estados.map((estado) => (
                                            <option key={estado.id} value={estado.id}>
                                                {estado.nombre}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <select
                                    value={porPagina}
                                    onChange={(evento) => {
                                        const nuevo = evento.target.value;
                                        setPorPagina(nuevo);
                                        aplicarFiltros(buscar, estadoId, nuevo);
                                    }}
                                    aria-label="Ofertas por página"
                                    className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                                >
                                    <option value="5">5 por página</option>
                                    <option value="10">10 por página</option>
                                    <option value="20">20 por página</option>
                                </select>

                                <Button
                                    type="submit"
                                    className="h-10 bg-indigo-600 hover:bg-indigo-700"
                                >
                                    <Search className="mr-2 size-4" />
                                    Buscar
                                </Button>
                            </form>

                            {hayFiltros && (
                                <button
                                    type="button"
                                    onClick={limpiarFiltros}
                                    className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-800"
                                >
                                    <X className="size-4" />
                                    Limpiar filtros
                                </button>
                            )}
                        </div>

                        {/* Tabla */}
                        {ofertas.data.length === 0 ? (
                            <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                                <div className="mb-4 rounded-full bg-indigo-50 p-4">
                                    <BriefcaseBusiness className="size-8 text-indigo-500" />
                                </div>

                                <h3 className="text-lg font-semibold">
                                    {hayFiltros
                                        ? 'No encontramos ofertas'
                                        : 'Todavía no hay ofertas laborales'}
                                </h3>

                                <p className="mt-2 max-w-sm text-sm text-slate-500">
                                    {hayFiltros
                                        ? 'Probá con otros términos o cambiá los filtros.'
                                        : 'Cuando registres tu primera oferta laboral, aparecerá en este listado.'}
                                </p>

                                {hayFiltros && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="mt-5"
                                        onClick={limpiarFiltros}
                                    >
                                        Mostrar todas
                                    </Button>
                                )}
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-slate-50/70">
                                            <TableHead className="min-w-60 pl-6">
                                                Oferta laboral
                                            </TableHead>
                                            <TableHead>Estado</TableHead>
                                            <TableHead>Modalidad</TableHead>
                                            <TableHead>Vacantes</TableHead>
                                            <TableHead>Publicación</TableHead>
                                            <TableHead>Vencimiento</TableHead>
                                            <TableHead className="min-w-32 text-right pr-6">Acciones</TableHead>
                                        </TableRow>
                                    </TableHeader>

                                    <TableBody>
                                        {ofertas.data.map((oferta) => (
                                            <TableRow key={oferta.id}>
                                                <TableCell className="py-4 pl-6">
                                                    <div className="space-y-1">
                                                        <p className="font-semibold text-slate-900">
                                                            {oferta.titulo ||
                                                                'Oferta sin título'}
                                                        </p>

                                                        <p className="text-xs text-slate-500">
                                                            {oferta.area_laboral?.nombre ||
                                                                'Área sin definir'}
                                                        </p>
                                                    </div>
                                                </TableCell>

                                                <TableCell>
                                                    <Badge
                                                        variant="outline"
                                                        className={estiloEstado(
                                                            oferta.estado_oferta?.nombre,
                                                        )}
                                                    >
                                                        {oferta.estado_oferta?.nombre ||
                                                            'Sin estado'}
                                                    </Badge>
                                                </TableCell>

                                                <TableCell className="text-sm text-slate-600">
                                                    {oferta.modalidad_trabajo?.nombre ||
                                                        'Sin definir'}
                                                </TableCell>

                                                <TableCell className="text-sm text-slate-600">
                                                    {oferta.vacantes}
                                                </TableCell>

                                                <TableCell className="text-sm text-slate-600">
                                                    {formatoFecha(
                                                        oferta.fecha_publicacion,
                                                    )}
                                                </TableCell>

                                                <TableCell className="text-sm text-slate-600">
                                                    {formatoFecha(
                                                        oferta.fecha_vencimiento,
                                                    )}
                                                </TableCell>

                                                <TableCell className="pr-6 text-right">
                                                    {oferta.puede_editar === true ? (
                                                        <Button asChild size="sm" variant="outline">
                                                            <Link href={`/empresa/${empresa.id}/ofertas/${oferta.id}/editar`}>
                                                                <Pencil className="mr-2 size-4" />
                                                                Editar
                                                            </Link>
                                                        </Button>
                                                    ) : (
                                                        <span className="text-xs text-slate-400">—</span>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}

                        {/* Paginación */}
                        {ofertas.total > 0 && (
                            <div className="flex flex-col gap-4 border-t border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                                <p className="text-sm text-slate-500">
                                    Mostrando {ofertas.from ?? 0}–{ofertas.to ?? 0}
                                    {' '}de {ofertas.total} ofertas
                                </p>

                                <div className="flex flex-wrap gap-1">
                                    {ofertas.links.map((link, index) => {
                                        const etiqueta = link.label
                                            .replace(/&laquo;|&raquo;/g, '')
                                            .replace(/&amp;/g, '&')
                                            .trim();

                                        const texto = link.label.includes('Previous')
                                            ? 'Anterior'
                                            : link.label.includes('Next')
                                                ? 'Siguiente'
                                                : etiqueta;

                                        return (
                                            <Button
                                                key={`${index}-${link.label}`}
                                                type="button"
                                                size="sm"
                                                variant={
                                                    link.active
                                                        ? 'default'
                                                        : 'outline'
                                                }
                                                disabled={!link.url}
                                                className={
                                                    link.active
                                                        ? 'bg-indigo-600 hover:bg-indigo-700'
                                                        : ''
                                                }
                                                onClick={() => {
                                                    if (link.url) {
                                                        router.visit(link.url, {
                                                            preserveState: true,
                                                            preserveScroll: true,
                                                        });
                                                    }
                                                }}
                                            >
                                                {texto}
                                            </Button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </section>

                    <p className="flex items-center gap-2 text-xs text-slate-400">
                        <Clock3 className="size-3.5" />
                        Las ofertas se muestran según la información registrada
                        por la empresa.
                    </p>
                </div>
            </main>
        </>
    );

}
