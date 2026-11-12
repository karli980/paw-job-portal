import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { router, useForm } from '@inertiajs/react';
import {
    GraduationCap,
    Plus,
    Pencil,
    Trash2,
    Building2,
    CalendarDays,
    BookOpen,
    Globe2,
    Layers3,
    Award,
    CheckCircle2,
    Info,
    AlertTriangle,
    X,
    Clock3,
    MapPin,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

// --------------------------------------------------
// TIPOS
// --------------------------------------------------

interface Catalogo {
    id: number;
    nombre: string;
    estado?: boolean;
}

interface PaisRelacion {
    id: number;
    nombre: string;
    estado: boolean;
}

interface EstadoEstudioRelacion {
    id: number;
    nombre: string;
    estado: boolean;
}

interface AreaEstudioRelacion {
    id: number;
    nombre: string;
    estado: boolean;
}

interface NivelEstudioRelacion {
    id: number;
    nombre: string;
    estado: boolean;
}

interface Estudio {
    id: number;
    candidato_id: number;
    pais_id: number;
    estado_estudio_id: number;
    area_estudio_id: number;
    nivel_estudio_id: number;
    titulo: string;
    institucion: string;
    fecha_inicio: string;
    fecha_finalizacion: string | null;
    estado: boolean;
    pais: PaisRelacion;
    estado_estudio: EstadoEstudioRelacion;
    area_estudio: AreaEstudioRelacion;
    nivel_estudio: NivelEstudioRelacion;
}

interface FlashSuccess {
    type: 'created' | 'updated' | 'deleted';
    message: string;
}

interface Props {
    estudios: Estudio[];
    paises: Catalogo[];
    estadosEstudio: Catalogo[];
    areasEstudio: Catalogo[];
    nivelesEstudio: Catalogo[];
    flash?: {
        success?: FlashSuccess;
    };
}

type FormularioEstudio = {
    pais_id: string;
    estado_estudio_id: string;
    area_estudio_id: string;
    nivel_estudio_id: string;
    titulo: string;
    institucion: string;
    fecha_inicio: string;
    fecha_finalizacion: string;
};

// --------------------------------------------------
// UTILIDADES
// --------------------------------------------------

const obtenerFechaActual = () => {
    const hoy = new Date();
    const anio = hoy.getFullYear();
    const mes = String(hoy.getMonth() + 1).padStart(2, '0');
    const dia = String(hoy.getDate()).padStart(2, '0');

    return `${anio}-${mes}-${dia}`;
};

// --------------------------------------------------
// COMPONENTE
// --------------------------------------------------

export default function Index({
    estudios,
    paises,
    estadosEstudio,
    areasEstudio,
    nivelesEstudio,
    flash,
}: Props) {
    const [modalAbierto, setModalAbierto] = useState(false);
    const [estudioEditando, setEstudioEditando] =
        useState<Estudio | null>(null);
    const [mostrarNotificacion, setMostrarNotificacion] = useState(true);

    const hoy = obtenerFechaActual();

    const {
        data,
        setData,
        post,
        put,
        processing,
        errors,
        reset,
        clearErrors,
    } = useForm<FormularioEstudio>({
        pais_id: '',
        estado_estudio_id: '',
        area_estudio_id: '',
        nivel_estudio_id: '',
        titulo: '',
        institucion: '',
        fecha_inicio: '',
        fecha_finalizacion: '',
    });

    // --------------------------------------------------
    // RESUMEN
    // --------------------------------------------------

    const estudiosEnCurso = estudios.filter(
        (estudio) =>
            estudio.estado_estudio.nombre.toLowerCase() === 'en curso',
    ).length;

    const estudiosGraduados = estudios.filter(
        (estudio) =>
            estudio.estado_estudio.nombre.toLowerCase() === 'graduado',
    ).length;

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

    const estilosFlash = {
        created: {
            container:
                'border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-100',
            icon: (
                <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
            ),
            titulo: 'Estudio agregado',
        },
        updated: {
            container:
                'border-indigo-200 bg-indigo-50 text-indigo-900 dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:text-indigo-100',
            icon: (
                <Info className="h-5 w-5 shrink-0 text-indigo-600 dark:text-indigo-400" />
            ),
            titulo: 'Estudio actualizado',
        },
        deleted: {
            container:
                'border-rose-200 bg-rose-50 text-rose-900 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-100',
            icon: (
                <AlertTriangle className="h-5 w-5 shrink-0 text-rose-600 dark:text-rose-400" />
            ),
            titulo: 'Estudio quitado',
        },
    };

    const notificacion = flash?.success
        ? estilosFlash[flash.success.type]
        : null;

    // --------------------------------------------------
    // CATÁLOGOS DEL FORMULARIO
    // --------------------------------------------------

    /*
     * Para crear estudios se utilizan solamente los catálogos
     * activos que llegan desde el controlador.
     *
     * Para editar, se incorpora temporalmente cada relación
     * histórica si fue desactivada.
     *
     * De esta manera el candidato puede conservar sus datos
     * históricos sin habilitar esas opciones para nuevas altas.
     */

    const paisesFormulario = useMemo(() => {
        if (!estudioEditando || estudioEditando.pais.estado) {
            return paises;
        }

        const existe = paises.some(
            (pais) => pais.id === estudioEditando.pais.id,
        );

        return existe
            ? paises
            : [
                  ...paises,
                  {
                      id: estudioEditando.pais.id,
                      nombre: estudioEditando.pais.nombre,
                      estado: false,
                  },
              ];
    }, [paises, estudioEditando]);

    const estadosFormulario = useMemo(() => {
        if (
            !estudioEditando ||
            estudioEditando.estado_estudio.estado
        ) {
            return estadosEstudio;
        }

        const existe = estadosEstudio.some(
            (estado) => estado.id === estudioEditando.estado_estudio.id,
        );

        return existe
            ? estadosEstudio
            : [
                  ...estadosEstudio,
                  {
                      id: estudioEditando.estado_estudio.id,
                      nombre: estudioEditando.estado_estudio.nombre,
                      estado: false,
                  },
              ];
    }, [estadosEstudio, estudioEditando]);

    const areasFormulario = useMemo(() => {
        if (!estudioEditando || estudioEditando.area_estudio.estado) {
            return areasEstudio;
        }

        const existe = areasEstudio.some(
            (area) => area.id === estudioEditando.area_estudio.id,
        );

        return existe
            ? areasEstudio
            : [
                  ...areasEstudio,
                  {
                      id: estudioEditando.area_estudio.id,
                      nombre: estudioEditando.area_estudio.nombre,
                      estado: false,
                  },
              ];
    }, [areasEstudio, estudioEditando]);

    const nivelesFormulario = useMemo(() => {
        if (!estudioEditando || estudioEditando.nivel_estudio.estado) {
            return nivelesEstudio;
        }

        const existe = nivelesEstudio.some(
            (nivel) => nivel.id === estudioEditando.nivel_estudio.id,
        );

        return existe
            ? nivelesEstudio
            : [
                  ...nivelesEstudio,
                  {
                      id: estudioEditando.nivel_estudio.id,
                      nombre: estudioEditando.nivel_estudio.nombre,
                      estado: false,
                  },
              ];
    }, [nivelesEstudio, estudioEditando]);

    // --------------------------------------------------
    // ESTADO ACADÉMICO Y FECHAS
    // --------------------------------------------------

    const estadoSeleccionado = estadosFormulario.find(
        (estado) => String(estado.id) === data.estado_estudio_id,
    );

    const esEnCurso =
        estadoSeleccionado?.nombre.toLowerCase() === 'en curso';

    const esGraduado =
        estadoSeleccionado?.nombre.toLowerCase() === 'graduado';

    const cambiarEstadoEstudio = (estadoId: string) => {
        setData('estado_estudio_id', estadoId);

        const estado = estadosFormulario.find(
            (item) => String(item.id) === estadoId,
        );

        if (estado?.nombre.toLowerCase() === 'en curso') {
            setData('fecha_finalizacion', '');
        }
    };

    const cambiarFechaInicio = (fecha: string) => {
        setData('fecha_inicio', fecha);

        if (
            data.fecha_finalizacion &&
            fecha &&
            data.fecha_finalizacion < fecha
        ) {
            setData('fecha_finalizacion', '');
        }
    };

    // --------------------------------------------------
    // FORMULARIO
    // --------------------------------------------------

    const abrirFormularioNuevo = () => {
        setEstudioEditando(null);
        reset();
        clearErrors();
        setModalAbierto(true);
    };

    const abrirFormularioEdicion = (estudio: Estudio) => {
        setEstudioEditando(estudio);
        clearErrors();

        setData({
            pais_id: String(estudio.pais_id),
            estado_estudio_id: String(estudio.estado_estudio_id),
            area_estudio_id: String(estudio.area_estudio_id),
            nivel_estudio_id: String(estudio.nivel_estudio_id),
            titulo: estudio.titulo,
            institucion: estudio.institucion,
            fecha_inicio: estudio.fecha_inicio.slice(0, 10),
            fecha_finalizacion:
                estudio.fecha_finalizacion?.slice(0, 10) ?? '',
        });

        setModalAbierto(true);
    };

    const cerrarFormulario = () => {
        if (processing) return;

        setModalAbierto(false);
        setEstudioEditando(null);
        reset();
        clearErrors();
    };

    const guardarEstudio = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (estudioEditando) {
            put(`/candidato/estudios/${estudioEditando.id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    setModalAbierto(false);
                    setEstudioEditando(null);
                    reset();
                },
            });

            return;
        }

        post('/candidato/estudios', {
            preserveScroll: true,
            onSuccess: () => {
                setModalAbierto(false);
                reset();
            },
        });
    };

    // --------------------------------------------------
    // ELIMINACIÓN LÓGICA
    // --------------------------------------------------

    const quitarEstudio = (estudio: Estudio) => {
        const confirmar = window.confirm(
            `¿Estás seguro de que deseas quitar "${estudio.titulo}" de tu perfil académico?`,
        );

        if (!confirmar) return;

        router.delete(`/candidato/estudios/${estudio.id}`, {
            preserveScroll: true,
        });
    };

    // --------------------------------------------------
    // UTILIDADES
    // --------------------------------------------------

    const formatearFecha = (fecha: string | null) => {
        if (!fecha) return '';

        const [anio, mes, dia] = fecha.slice(0, 10).split('-');

        return `${dia}/${mes}/${anio}`;
    };

    const obtenerPeriodo = (estudio: Estudio) => {
        const inicio = formatearFecha(estudio.fecha_inicio);
        const estado = estudio.estado_estudio.nombre.toLowerCase();

        if (estado === 'en curso') {
            return `${inicio} · En curso`;
        }

        if (!estudio.fecha_finalizacion) {
            return `${inicio} · Sin fecha de finalización`;
        }

        return `${inicio} · ${formatearFecha(
            estudio.fecha_finalizacion,
        )}`;
    };

    const tieneCatalogosNoDisponibles = (estudio: Estudio) =>
        !estudio.pais.estado ||
        !estudio.estado_estudio.estado ||
        !estudio.area_estudio.estado ||
        !estudio.nivel_estudio.estado;

    const catalogosDisponibles =
        paises.length > 0 &&
        estadosEstudio.length > 0 &&
        areasEstudio.length > 0 &&
        nivelesEstudio.length > 0;

    const obtenerEstiloEstado = (nombre: string) => {
        switch (nombre.toLowerCase()) {
            case 'en curso':
                return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300';

            case 'graduado':
                return 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300';

            case 'abandonado':
                return 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300';

            default:
                return 'bg-slate-100 text-slate-700 dark:bg-slate-500/15 dark:text-slate-300';
        }
    };

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
                            <GraduationCap className="h-6 w-6" />
                        </div>

                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                                Mis estudios
                            </h1>

                            <p className="mt-1 max-w-xl text-sm leading-relaxed text-muted-foreground">
                                Registrá tu formación académica, las
                                instituciones donde estudiaste y tus
                                títulos obtenidos o en curso.
                            </p>
                        </div>
                    </div>

                    <Button
                        type="button"
                        onClick={abrirFormularioNuevo}
                        disabled={!catalogosDisponibles}
                        className="h-10 w-full rounded-lg bg-indigo-600 px-4 font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 focus-visible:ring-2 focus-visible:ring-indigo-500 sm:w-auto dark:bg-indigo-500 dark:hover:bg-indigo-400"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Agregar estudio
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
                                className="rounded-md p-1 opacity-70 transition-opacity hover:opacity-100"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    )}

                {/* RESUMEN */}

                <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300">
                                <GraduationCap className="h-5 w-5" />
                            </div>

                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Estudios registrados
                                </p>

                                <p className="text-2xl font-bold tabular-nums text-foreground">
                                    {estudios.length}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
                                <Clock3 className="h-5 w-5" />
                            </div>

                            <div>
                                <p className="text-sm text-muted-foreground">
                                    En curso
                                </p>

                                <p className="text-2xl font-bold tabular-nums text-foreground">
                                    {estudiosEnCurso}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-50 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300">
                                <Award className="h-5 w-5" />
                            </div>

                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Graduados
                                </p>

                                <p className="text-2xl font-bold tabular-nums text-foreground">
                                    {estudiosGraduados}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* AVISO DE CATÁLOGOS */}

                {estudios.some(tieneCatalogosNoDisponibles) && (
                    <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
                        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />

                        <div>
                            <p className="text-sm font-semibold">
                                Algunos datos académicos ya no están disponibles
                            </p>

                            <p className="mt-1 text-sm leading-relaxed">
                                Uno o más países, estados académicos,
                                áreas o niveles de estudio de tu historial
                                fueron desactivados del catálogo general.
                                Tus estudios se conservan y podés seguir
                                editando sus datos sin cambiar esas
                                selecciones históricas.
                            </p>
                        </div>
                    </div>
                )}

                {/* LISTADO */}

                <section className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
                    <div className="flex flex-col gap-2 border-b border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="text-base font-semibold text-foreground">
                                Mi formación académica
                            </h2>

                            <p className="mt-0.5 text-sm text-muted-foreground">
                                Consultá y actualizá tus antecedentes educativos.
                            </p>
                        </div>

                        <span className="inline-flex w-fit items-center rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold tabular-nums text-indigo-700 ring-1 ring-inset ring-indigo-100 dark:bg-indigo-500/15 dark:text-indigo-300 dark:ring-indigo-400/20">
                            {estudios.length}{' '}
                            {estudios.length === 1
                                ? 'estudio'
                                : 'estudios'}
                        </span>
                    </div>

                    <div className="space-y-4 p-4 sm:p-5">
                        {estudios.length === 0 ? (
                            <div className="flex min-h-72 flex-col items-center justify-center gap-3 text-center">
                                <div className="flex h-16 w-16 items-center justify-center rounded-full border border-dashed border-border bg-muted">
                                    <GraduationCap className="h-7 w-7 text-muted-foreground" />
                                </div>

                                <div>
                                    <h3 className="font-semibold text-foreground">
                                        Todavía no registraste estudios
                                    </h3>

                                    <p className="mt-1 max-w-md text-sm text-muted-foreground">
                                        Agregá tu formación académica para
                                        completar tu perfil profesional.
                                    </p>
                                </div>

                                {catalogosDisponibles && (
                                    <Button
                                        type="button"
                                        onClick={abrirFormularioNuevo}
                                        className="mt-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
                                    >
                                        <Plus className="mr-2 h-4 w-4" />
                                        Agregar mi primer estudio
                                    </Button>
                                )}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                                {estudios.map((estudio) => {
                                    const catalogosInactivos =
                                        tieneCatalogosNoDisponibles(estudio);

                                    return (
                                        <article
                                            key={estudio.id}
                                            className="group rounded-xl border border-border bg-background p-5 shadow-sm transition-all hover:border-indigo-200 hover:shadow-md dark:hover:border-indigo-400/30"
                                        >
                                            {/* TÍTULO E INSTITUCIÓN */}

                                            <div className="flex items-start justify-between gap-3">
                                                <div className="flex min-w-0 items-center gap-3">
                                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300">
                                                        <BookOpen className="h-5 w-5" />
                                                    </div>

                                                    <div className="min-w-0">
                                                        <h3 className="text-base font-bold text-foreground">
                                                            {estudio.titulo}
                                                        </h3>

                                                        <p className="mt-0.5 flex items-center gap-1.5 text-sm text-muted-foreground">
                                                            <Building2 className="h-3.5 w-3.5 shrink-0" />
                                                            <span className="truncate">
                                                                {estudio.institucion}
                                                            </span>
                                                        </p>
                                                    </div>
                                                </div>

                                                <span
                                                    className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${obtenerEstiloEstado(estudio.estado_estudio.nombre)}`}
                                                >
                                                    {estudio.estado_estudio.nombre}
                                                </span>
                                            </div>

                                            {/* INFORMACIÓN ACADÉMICA */}

                                            <div className="mt-5 space-y-3">
                                                <div className="flex items-start gap-2.5">
                                                    <Layers3 className="mt-0.5 h-4 w-4 shrink-0 text-indigo-500" />

                                                    <div className="min-w-0">
                                                        <p className="text-xs text-muted-foreground">
                                                            Área de estudio
                                                        </p>

                                                        <p className="text-sm font-medium text-foreground">
                                                            {estudio.area_estudio.nombre}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-start gap-2.5">
                                                    <Award className="mt-0.5 h-4 w-4 shrink-0 text-indigo-500" />

                                                    <div className="min-w-0">
                                                        <p className="text-xs text-muted-foreground">
                                                            Nivel de estudio
                                                        </p>

                                                        <p className="text-sm font-medium text-foreground">
                                                            {estudio.nivel_estudio.nombre}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-start gap-2.5">
                                                    <Globe2 className="mt-0.5 h-4 w-4 shrink-0 text-indigo-500" />

                                                    <div className="min-w-0">
                                                        <p className="text-xs text-muted-foreground">
                                                            País
                                                        </p>

                                                        <p className="text-sm font-medium text-foreground">
                                                            {estudio.pais.nombre}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-start gap-2.5">
                                                    <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-indigo-500" />

                                                    <div className="min-w-0">
                                                        <p className="text-xs text-muted-foreground">
                                                            Período
                                                        </p>

                                                        <p className="text-sm font-medium text-foreground">
                                                            {obtenerPeriodo(estudio)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* AVISO DE CATÁLOGOS HISTÓRICOS */}

                                            {catalogosInactivos && (
                                                <div className="mt-4 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
                                                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />

                                                    <p className="text-xs leading-relaxed">
                                                        Uno o más datos de este
                                                        estudio pertenecen al
                                                        historial y ya no están
                                                        disponibles en el catálogo.
                                                    </p>
                                                </div>
                                            )}

                                            {/* ACCIONES */}

                                            <div className="mt-5 flex justify-end gap-2 border-t border-border pt-4">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>
                                                        abrirFormularioEdicion(
                                                            estudio,
                                                        )
                                                    }
                                                    className="h-9 rounded-lg border-border px-3 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 dark:hover:bg-indigo-500/15"
                                                >
                                                    <Pencil className="mr-1.5 h-3.5 w-3.5" />
                                                    Editar
                                                </Button>

                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() =>
                                                        quitarEstudio(estudio)
                                                    }
                                                    className="h-9 rounded-lg px-3 text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:text-rose-400 dark:hover:bg-rose-500/15"
                                                >
                                                    <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                                                    Quitar
                                                </Button>
                                            </div>
                                        </article>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </section>

                {/* AVISO SIN CATÁLOGOS */}

                {!catalogosDisponibles && (
                    <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
                        Por el momento no están disponibles todos los
                        catálogos necesarios para registrar nuevos estudios.
                        Tus estudios existentes se conservan y podés seguir
                        consultándolos.
                    </div>
                )}

                <p className="pb-2 text-center text-xs text-muted-foreground">
                    Perfil académico · Talent Match
                </p>
            </div>

            {/* FORMULARIO AGREGAR / EDITAR */}

            <Dialog
                open={modalAbierto}
                onOpenChange={(abierto) => {
                    if (!abierto) cerrarFormulario();
                }}
            >
                <DialogContent className="max-h-[90vh] overflow-y-auto rounded-xl sm:max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-xl">
                            <GraduationCap className="h-5 w-5 text-indigo-600" />

                            {estudioEditando
                                ? 'Editar estudio'
                                : 'Agregar estudio'}
                        </DialogTitle>

                        <DialogDescription>
                            {estudioEditando
                                ? 'Actualizá la información de tu formación académica.'
                                : 'Completá los datos de tus estudios y formación.'}
                        </DialogDescription>
                    </DialogHeader>

                    <form
                        onSubmit={guardarEstudio}
                        className="space-y-5 pt-2"
                    >
                        {/* TÍTULO E INSTITUCIÓN */}

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <label
                                    htmlFor="titulo"
                                    className="text-sm font-semibold text-foreground"
                                >
                                    Título o carrera
                                    <span className="text-rose-500"> *</span>
                                </label>

                                <Input
                                    id="titulo"
                                    value={data.titulo}
                                    onChange={(e) =>
                                        setData('titulo', e.target.value)
                                    }
                                    required
                                    maxLength={150}
                                    placeholder="Ej.: Licenciatura en Sistemas"
                                    className="h-10 rounded-lg"
                                />

                                {errors.titulo && (
                                    <p className="text-sm text-rose-600">
                                        {errors.titulo}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label
                                    htmlFor="institucion"
                                    className="text-sm font-semibold text-foreground"
                                >
                                    Institución educativa
                                    <span className="text-rose-500"> *</span>
                                </label>

                                <Input
                                    id="institucion"
                                    value={data.institucion}
                                    onChange={(e) =>
                                        setData('institucion', e.target.value)
                                    }
                                    required
                                    maxLength={150}
                                    placeholder="Ej.: Universidad Nacional"
                                    className="h-10 rounded-lg"
                                />

                                {errors.institucion && (
                                    <p className="text-sm text-rose-600">
                                        {errors.institucion}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* PAÍS */}

                        <div className="space-y-2">
                            <label
                                htmlFor="pais_id"
                                className="flex items-center gap-2 text-sm font-semibold text-foreground"
                            >
                                <Globe2 className="h-4 w-4 text-indigo-500" />
                                País
                                <span className="text-rose-500"> *</span>
                            </label>

                            <select
                                id="pais_id"
                                value={data.pais_id}
                                onChange={(e) =>
                                    setData('pais_id', e.target.value)
                                }
                                required
                                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-indigo-500"
                            >
                                <option value="">
                                    Seleccioná un país
                                </option>

                                {paisesFormulario.map((pais) => (
                                    <option
                                        key={pais.id}
                                        value={pais.id}
                                    >
                                        {pais.nombre}
                                        {pais.estado === false
                                            ? ' (No disponible - histórica)'
                                            : ''}
                                    </option>
                                ))}
                            </select>

                            {errors.pais_id && (
                                <p className="text-sm text-rose-600">
                                    {errors.pais_id}
                                </p>
                            )}
                        </div>

                        {/* ÁREA Y NIVEL */}

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <label
                                    htmlFor="area_estudio_id"
                                    className="flex items-center gap-2 text-sm font-semibold text-foreground"
                                >
                                    <Layers3 className="h-4 w-4 text-indigo-500" />
                                    Área de estudio
                                    <span className="text-rose-500"> *</span>
                                </label>

                                <select
                                    id="area_estudio_id"
                                    value={data.area_estudio_id}
                                    onChange={(e) =>
                                        setData(
                                            'area_estudio_id',
                                            e.target.value,
                                        )
                                    }
                                    required
                                    className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-indigo-500"
                                >
                                    <option value="">
                                        Seleccioná un área
                                    </option>

                                    {areasFormulario.map((area) => (
                                        <option
                                            key={area.id}
                                            value={area.id}
                                        >
                                            {area.nombre}
                                            {area.estado === false
                                                ? ' (No disponible - histórica)'
                                                : ''}
                                        </option>
                                    ))}
                                </select>

                                {errors.area_estudio_id && (
                                    <p className="text-sm text-rose-600">
                                        {errors.area_estudio_id}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label
                                    htmlFor="nivel_estudio_id"
                                    className="flex items-center gap-2 text-sm font-semibold text-foreground"
                                >
                                    <Award className="h-4 w-4 text-indigo-500" />
                                    Nivel de estudio
                                    <span className="text-rose-500"> *</span>
                                </label>

                                <select
                                    id="nivel_estudio_id"
                                    value={data.nivel_estudio_id}
                                    onChange={(e) =>
                                        setData(
                                            'nivel_estudio_id',
                                            e.target.value,
                                        )
                                    }
                                    required
                                    className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-indigo-500"
                                >
                                    <option value="">
                                        Seleccioná un nivel
                                    </option>

                                    {nivelesFormulario.map((nivel) => (
                                        <option
                                            key={nivel.id}
                                            value={nivel.id}
                                        >
                                            {nivel.nombre}
                                            {nivel.estado === false
                                                ? ' (No disponible - histórica)'
                                                : ''}
                                        </option>
                                    ))}
                                </select>

                                {errors.nivel_estudio_id && (
                                    <p className="text-sm text-rose-600">
                                        {errors.nivel_estudio_id}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* ESTADO ACADÉMICO */}

                        <div className="space-y-2">
                            <label
                                htmlFor="estado_estudio_id"
                                className="flex items-center gap-2 text-sm font-semibold text-foreground"
                            >
                                <BookOpen className="h-4 w-4 text-indigo-500" />
                                Estado académico
                                <span className="text-rose-500"> *</span>
                            </label>

                            <select
                                id="estado_estudio_id"
                                value={data.estado_estudio_id}
                                onChange={(e) =>
                                    cambiarEstadoEstudio(e.target.value)
                                }
                                required
                                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-indigo-500"
                            >
                                <option value="">
                                    Seleccioná el estado de tus estudios
                                </option>

                                {estadosFormulario.map((estado) => (
                                    <option
                                        key={estado.id}
                                        value={estado.id}
                                    >
                                        {estado.nombre}
                                        {estado.estado === false
                                            ? ' (No disponible - histórica)'
                                            : ''}
                                    </option>
                                ))}
                            </select>

                            {errors.estado_estudio_id && (
                                <p className="text-sm text-rose-600">
                                    {errors.estado_estudio_id}
                                </p>
                            )}

                            {esEnCurso && (
                                <p className="text-xs leading-relaxed text-emerald-700 dark:text-emerald-300">
                                    Tu formación está en curso. No necesitás
                                    indicar una fecha de finalización.
                                </p>
                            )}

                            {esGraduado && (
                                <p className="text-xs leading-relaxed text-indigo-700 dark:text-indigo-300">
                                    Como el estado es Graduado, deberás
                                    indicar la fecha en que finalizaste
                                    tus estudios.
                                </p>
                            )}
                        </div>

                        {/* FECHAS */}

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <label
                                    htmlFor="fecha_inicio"
                                    className="flex items-center gap-2 text-sm font-semibold text-foreground"
                                >
                                    <CalendarDays className="h-4 w-4 text-indigo-500" />
                                    Fecha de inicio
                                    <span className="text-rose-500"> *</span>
                                </label>

                                <Input
                                    id="fecha_inicio"
                                    type="date"
                                    value={data.fecha_inicio}
                                    onChange={(e) =>
                                        cambiarFechaInicio(e.target.value)
                                    }
                                    required
                                    max={hoy}
                                    className="h-10 rounded-lg"
                                />

                                {errors.fecha_inicio && (
                                    <p className="text-sm text-rose-600">
                                        {errors.fecha_inicio}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label
                                    htmlFor="fecha_finalizacion"
                                    className="flex items-center gap-2 text-sm font-semibold text-foreground"
                                >
                                    <CalendarDays className="h-4 w-4 text-indigo-500" />
                                    Fecha de finalización

                                    {esGraduado && (
                                        <span className="text-rose-500">
                                            *
                                        </span>
                                    )}

                                    {!esGraduado && (
                                        <span className="text-xs font-normal text-muted-foreground">
                                            (Opcional)
                                        </span>
                                    )}
                                </label>

                                <Input
                                    id="fecha_finalizacion"
                                    type="date"
                                    value={data.fecha_finalizacion}
                                    onChange={(e) =>
                                        setData(
                                            'fecha_finalizacion',
                                            e.target.value,
                                        )
                                    }
                                    disabled={esEnCurso}
                                    required={esGraduado}
                                    min={data.fecha_inicio || undefined}
                                    max={hoy}
                                    className="h-10 rounded-lg disabled:bg-muted"
                                />

                                {errors.fecha_finalizacion && (
                                    <p className="text-sm text-rose-600">
                                        {errors.fecha_finalizacion}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* ACLARACIÓN */}

                        <div className="rounded-lg border border-border bg-muted/40 p-4">
                            <div className="flex items-start gap-3">
                                <Info className="mt-0.5 h-5 w-5 shrink-0 text-indigo-500" />

                                <div>
                                    <p className="text-sm font-semibold text-foreground">
                                        Información sobre las fechas
                                    </p>

                                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                                        Si seleccionás «En Curso», la fecha
                                        de finalización se dejará vacía
                                        automáticamente. Para «Graduado»,
                                        la fecha de finalización es obligatoria.
                                        Para «Abandonado», es opcional.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* BOTONES */}

                        <DialogFooter className="gap-2 pt-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={cerrarFormulario}
                                disabled={processing}
                                className="rounded-lg"
                            >
                                Cancelar
                            </Button>

                            <Button
                                type="submit"
                                disabled={
                                    processing ||
                                    paisesFormulario.length === 0 ||
                                    estadosFormulario.length === 0 ||
                                    areasFormulario.length === 0 ||
                                    nivelesFormulario.length === 0
                                }
                                className="rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400"
                            >
                                {processing
                                    ? 'Guardando...'
                                    : estudioEditando
                                      ? 'Guardar cambios'
                                      : 'Agregar estudio'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
