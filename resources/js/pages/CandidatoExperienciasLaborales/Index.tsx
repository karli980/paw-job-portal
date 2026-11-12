import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { router, useForm } from '@inertiajs/react';
import {
    BriefcaseBusiness,
    Plus,
    Pencil,
    Trash2,
    Building2,
    CalendarDays,
    Users,
    Layers3,
    CheckCircle2,
    Info,
    AlertTriangle,
    X,
    Clock3,
    MapPin,
    ClipboardList,
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

interface SubAreaLaboral {
    id: number;
    nombre: string;
    estado: boolean;
    area_laboral_id: number;
}

interface AreaLaboral {
    id: number;
    nombre: string;
    estado: boolean;
    sub_areas_laborales: SubAreaLaboral[];
}

interface AreaLaboralRelacion {
    id: number;
    nombre: string;
    estado: boolean;
}

interface SubAreaLaboralRelacion {
    id: number;
    nombre: string;
    estado: boolean;
    area_laboral_id: number;
    area_laboral: AreaLaboralRelacion;
}

interface ExperienciaLaboral {
    id: number;
    candidato_id: number;
    sub_area_laboral_id: number;
    nombre_empleador: string;
    puesto: string;
    fecha_inicio: string;
    fecha_finalizacion: string | null;
    trabaja_actualmente: boolean;
    responsabilidades: string;
    personas_a_cargo: number | null;
    estado: boolean;
    sub_area_laboral: SubAreaLaboralRelacion;
}

interface FlashSuccess {
    type: 'created' | 'updated' | 'deleted';
    message: string;
}

interface Props {
    experiencias: ExperienciaLaboral[];
    areas: AreaLaboral[];
    flash?: {
        success?: FlashSuccess;
    };
}

type FormularioExperiencia = {
    area_laboral_id: string;
    sub_area_laboral_id: string;
    nombre_empleador: string;
    puesto: string;
    fecha_inicio: string;
    fecha_finalizacion: string;
    trabaja_actualmente: boolean;
    responsabilidades: string;
    personas_a_cargo: string;
};

// --------------------------------------------------
// COMPONENTE
// --------------------------------------------------

export default function Index({
    experiencias,
    areas,
    flash,
}: Props) {
    const [modalAbierto, setModalAbierto] = useState(false);
    const [experienciaEditando, setExperienciaEditando] =
        useState<ExperienciaLaboral | null>(null);
    const [mostrarNotificacion, setMostrarNotificacion] = useState(true);

    const {
        data,
        setData,
        post,
        put,
        processing,
        errors,
        reset,
        clearErrors,
    } = useForm<FormularioExperiencia>({
        area_laboral_id: '',
        sub_area_laboral_id: '',
        nombre_empleador: '',
        puesto: '',
        fecha_inicio: '',
        fecha_finalizacion: '',
        trabaja_actualmente: false,
        responsabilidades: '',
        personas_a_cargo: '',
    });

    // --------------------------------------------------
    // RESUMEN
    // --------------------------------------------------

    const experienciasActuales = experiencias.filter(
        (experiencia) => experiencia.trabaja_actualmente,
    ).length;

    const experienciasAnteriores =
        experiencias.length - experienciasActuales;

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
            titulo: 'Experiencia agregada',
        },
        updated: {
            container:
                'border-indigo-200 bg-indigo-50 text-indigo-900 dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:text-indigo-100',
            icon: (
                <Info className="h-5 w-5 shrink-0 text-indigo-600 dark:text-indigo-400" />
            ),
            titulo: 'Experiencia actualizada',
        },
        deleted: {
            container:
                'border-rose-200 bg-rose-50 text-rose-900 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-100',
            icon: (
                <AlertTriangle className="h-5 w-5 shrink-0 text-rose-600 dark:text-rose-400" />
            ),
            titulo: 'Experiencia quitada',
        },
    };

    const notificacion = flash?.success
        ? estilosFlash[flash.success.type]
        : null;

    // --------------------------------------------------
    // ÁREAS Y SUBÁREAS DEL FORMULARIO
    // --------------------------------------------------

    /*
     * Para crear experiencias se utilizan solamente las áreas
     * y subáreas activas que llegan desde el controlador.
     *
     * Para editar, se incorpora temporalmente la clasificación
     * histórica de la experiencia si fue desactivada.
     * Así se puede conservar sin permitir nuevas selecciones.
     */

    const areasFormulario = useMemo(() => {
        if (!experienciaEditando) {
            return areas;
        }

        const subAreaActual = experienciaEditando.sub_area_laboral;
        const areaActual = subAreaActual.area_laboral;

        const resultado = areas.map((area) => ({
            ...area,
            sub_areas_laborales: [...area.sub_areas_laborales],
        }));

        const areaExistente = resultado.find(
            (area) => area.id === areaActual.id,
        );

        const subAreaHistorica: SubAreaLaboral = {
            id: subAreaActual.id,
            nombre: subAreaActual.nombre,
            estado: subAreaActual.estado,
            area_laboral_id: subAreaActual.area_laboral_id,
        };

        if (!areaExistente) {
            resultado.push({
                id: areaActual.id,
                nombre: areaActual.nombre,
                estado: areaActual.estado,
                sub_areas_laborales: [subAreaHistorica],
            });
        } else {
            const subAreaExistente =
                areaExistente.sub_areas_laborales.some(
                    (subArea) => subArea.id === subAreaActual.id,
                );

            if (!subAreaExistente) {
                areaExistente.sub_areas_laborales.push(
                    subAreaHistorica,
                );
            }
        }

        return resultado;
    }, [areas, experienciaEditando]);

    const areaSeleccionada = areasFormulario.find(
        (area) => String(area.id) === data.area_laboral_id,
    );

    const subAreasDisponibles =
        areaSeleccionada?.sub_areas_laborales ?? [];

    // --------------------------------------------------
    // FORMULARIO
    // --------------------------------------------------

    const abrirFormularioNuevo = () => {
        setExperienciaEditando(null);
        reset();
        clearErrors();
        setModalAbierto(true);
    };

    const abrirFormularioEdicion = (
        experiencia: ExperienciaLaboral,
    ) => {
        setExperienciaEditando(experiencia);
        clearErrors();

        setData({
            area_laboral_id: String(
                experiencia.sub_area_laboral.area_laboral.id,
            ),
            sub_area_laboral_id: String(
                experiencia.sub_area_laboral.id,
            ),
            nombre_empleador: experiencia.nombre_empleador,
            puesto: experiencia.puesto,
            fecha_inicio: experiencia.fecha_inicio.slice(0, 10),
            fecha_finalizacion:
                experiencia.fecha_finalizacion?.slice(0, 10) ?? '',
            trabaja_actualmente: experiencia.trabaja_actualmente,
            responsabilidades: experiencia.responsabilidades,
            personas_a_cargo:
                experiencia.personas_a_cargo !== null
                    ? String(experiencia.personas_a_cargo)
                    : '',
        });

        setModalAbierto(true);
    };

    const cerrarFormulario = () => {
        if (processing) return;

        setModalAbierto(false);
        setExperienciaEditando(null);
        reset();
        clearErrors();
    };

    const cambiarArea = (areaId: string) => {
        setData('area_laboral_id', areaId);
        setData('sub_area_laboral_id', '');
    };

    const cambiarTrabajoActual = (trabajaActualmente: boolean) => {
        setData('trabaja_actualmente', trabajaActualmente);

        if (trabajaActualmente) {
            setData('fecha_finalizacion', '');
        }
    };

    const guardarExperiencia = (
        e: FormEvent<HTMLFormElement>,
    ) => {
        e.preventDefault();

        if (experienciaEditando) {
            put(
                `/candidato/experiencias-laborales/${experienciaEditando.id}`,
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        setModalAbierto(false);
                        setExperienciaEditando(null);
                        reset();
                    },
                },
            );

            return;
        }

        post('/candidato/experiencias-laborales', {
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

    const quitarExperiencia = (
        experiencia: ExperienciaLaboral,
    ) => {
        const confirmar = window.confirm(
            `¿Estás seguro de que deseas quitar la experiencia en "${experiencia.nombre_empleador}" de tu perfil?`,
        );

        if (!confirmar) return;

        router.delete(
            `/candidato/experiencias-laborales/${experiencia.id}`,
            {
                preserveScroll: true,
            },
        );
    };

    // --------------------------------------------------
    // UTILIDADES
    // --------------------------------------------------

    const formatearFecha = (fecha: string | null) => {
        if (!fecha) return '';

        const [anio, mes, dia] = fecha.slice(0, 10).split('-');

        return `${dia}/${mes}/${anio}`;
    };

    const obtenerPeriodo = (
        experiencia: ExperienciaLaboral,
    ) => {
        const inicio = formatearFecha(experiencia.fecha_inicio);

        if (experiencia.trabaja_actualmente) {
            return `${inicio} · Actualidad`;
        }

        return `${inicio} · ${formatearFecha(
            experiencia.fecha_finalizacion,
        )}`;
    };

    const clasificacionNoDisponible = (
        experiencia: ExperienciaLaboral,
    ) =>
        !experiencia.sub_area_laboral.estado ||
        !experiencia.sub_area_laboral.area_laboral.estado;

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
                            <BriefcaseBusiness className="h-6 w-6" />
                        </div>

                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                                Mis experiencias laborales
                            </h1>

                            <p className="mt-1 max-w-xl text-sm leading-relaxed text-muted-foreground">
                                Registrá tu trayectoria profesional,
                                los puestos que ocupaste y las
                                responsabilidades que asumiste.
                            </p>
                        </div>
                    </div>

                    <Button
                        type="button"
                        onClick={abrirFormularioNuevo}
                        disabled={areas.length === 0}
                        className="h-10 w-full rounded-lg bg-indigo-600 px-4 font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 focus-visible:ring-2 focus-visible:ring-indigo-500 sm:w-auto dark:bg-indigo-500 dark:hover:bg-indigo-400"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Agregar experiencia
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
                                <BriefcaseBusiness className="h-5 w-5" />
                            </div>

                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Experiencias registradas
                                </p>

                                <p className="text-2xl font-bold tabular-nums text-foreground">
                                    {experiencias.length}
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
                                    Trabajo actual
                                </p>

                                <p className="text-2xl font-bold tabular-nums text-foreground">
                                    {experienciasActuales}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-50 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300">
                                <CalendarDays className="h-5 w-5" />
                            </div>

                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Experiencias anteriores
                                </p>

                                <p className="text-2xl font-bold tabular-nums text-foreground">
                                    {experienciasAnteriores}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* AVISO DE CATÁLOGO */}

                {experiencias.some(clasificacionNoDisponible) && (
                    <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
                        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />

                        <div>
                            <p className="text-sm font-semibold">
                                Algunas clasificaciones ya no están disponibles
                            </p>

                            <p className="mt-1 text-sm leading-relaxed">
                                Una o más áreas o subáreas de tu historial
                                fueron desactivadas del catálogo general.
                                Tus experiencias se conservan y podés
                                seguir editando sus datos sin cambiar
                                esa clasificación histórica.
                            </p>
                        </div>
                    </div>
                )}

                {/* LISTADO */}

                <section className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
                    <div className="flex flex-col gap-2 border-b border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="text-base font-semibold text-foreground">
                                Mi trayectoria profesional
                            </h2>

                            <p className="mt-0.5 text-sm text-muted-foreground">
                                Consultá y actualizá tus antecedentes laborales.
                            </p>
                        </div>

                        <span className="inline-flex w-fit items-center rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold tabular-nums text-indigo-700 ring-1 ring-inset ring-indigo-100 dark:bg-indigo-500/15 dark:text-indigo-300 dark:ring-indigo-400/20">
                            {experiencias.length}{' '}
                            {experiencias.length === 1
                                ? 'experiencia'
                                : 'experiencias'}
                        </span>
                    </div>

                    <div className="space-y-4 p-4 sm:p-5">
                        {experiencias.length === 0 ? (
                            <div className="flex min-h-72 flex-col items-center justify-center gap-3 text-center">
                                <div className="flex h-16 w-16 items-center justify-center rounded-full border border-dashed border-border bg-muted">
                                    <BriefcaseBusiness className="h-7 w-7 text-muted-foreground" />
                                </div>

                                <div>
                                    <h3 className="font-semibold text-foreground">
                                        Todavía no registraste experiencias laborales
                                    </h3>

                                    <p className="mt-1 max-w-md text-sm text-muted-foreground">
                                        Agregá tus trabajos anteriores o actuales
                                        para completar tu perfil profesional.
                                    </p>
                                </div>

                                {areas.length > 0 && (
                                    <Button
                                        type="button"
                                        onClick={abrirFormularioNuevo}
                                        className="mt-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
                                    >
                                        <Plus className="mr-2 h-4 w-4" />
                                        Agregar mi primera experiencia
                                    </Button>
                                )}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                                {experiencias.map((experiencia) => {
                                    const clasificacionInactiva =
                                        clasificacionNoDisponible(
                                            experiencia,
                                        );

                                    return (
                                        <article
                                            key={experiencia.id}
                                            className="group rounded-xl border border-border bg-background p-5 shadow-sm transition-all hover:border-indigo-200 hover:shadow-md dark:hover:border-indigo-400/30"
                                        >
                                            {/* EMPRESA Y PUESTO */}

                                            <div className="flex items-start justify-between gap-3">
                                                <div className="flex min-w-0 items-center gap-3">
                                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300">
                                                        <Building2 className="h-5 w-5" />
                                                    </div>

                                                    <div className="min-w-0">
                                                        <h3 className="truncate text-base font-bold text-foreground">
                                                            {experiencia.nombre_empleador}
                                                        </h3>

                                                        <p className="mt-0.5 truncate text-sm text-muted-foreground">
                                                            {experiencia.puesto}
                                                        </p>
                                                    </div>
                                                </div>

                                                <span
                                                    className={
                                                        experiencia.trabaja_actualmente
                                                            ? 'shrink-0 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300'
                                                            : 'shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-500/15 dark:text-slate-300'
                                                    }
                                                >
                                                    {experiencia.trabaja_actualmente
                                                        ? 'Actual'
                                                        : 'Anterior'}
                                                </span>
                                            </div>

                                            {/* CLASIFICACIÓN */}

                                            <div className="mt-5 space-y-3">
                                                <div className="flex items-start gap-2.5">
                                                    <Layers3 className="mt-0.5 h-4 w-4 shrink-0 text-indigo-500" />

                                                    <div className="min-w-0">
                                                        <p className="text-xs text-muted-foreground">
                                                            Área laboral
                                                        </p>

                                                        <p className="text-sm font-medium text-foreground">
                                                            {experiencia.sub_area_laboral.area_laboral.nombre}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-start gap-2.5">
                                                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-indigo-500" />

                                                    <div className="min-w-0">
                                                        <p className="text-xs text-muted-foreground">
                                                            Subárea laboral
                                                        </p>

                                                        <p className="text-sm font-medium text-foreground">
                                                            {experiencia.sub_area_laboral.nombre}
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
                                                            {obtenerPeriodo(experiencia)}
                                                        </p>
                                                    </div>
                                                </div>

                                                {experiencia.personas_a_cargo !== null && (
                                                    <div className="flex items-start gap-2.5">
                                                        <Users className="mt-0.5 h-4 w-4 shrink-0 text-indigo-500" />

                                                        <div className="min-w-0">
                                                            <p className="text-xs text-muted-foreground">
                                                                Personas a cargo
                                                            </p>

                                                            <p className="text-sm font-medium text-foreground">
                                                                {experiencia.personas_a_cargo}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* RESPONSABILIDADES */}

                                            <div className="mt-5 rounded-lg bg-muted/50 p-3">
                                                <div className="mb-2 flex items-center gap-2">
                                                    <ClipboardList className="h-4 w-4 text-indigo-500" />

                                                    <p className="text-xs font-semibold text-foreground">
                                                        Responsabilidades
                                                    </p>
                                                </div>

                                                <p className="line-clamp-4 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                                                    {experiencia.responsabilidades}
                                                </p>
                                            </div>

                                            {/* AVISO DE CLASIFICACIÓN HISTÓRICA */}

                                            {clasificacionInactiva && (
                                                <div className="mt-4 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
                                                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />

                                                    <p className="text-xs leading-relaxed">
                                                        Esta clasificación pertenece
                                                        al historial y ya no está
                                                        disponible en el catálogo.
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
                                                            experiencia,
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
                                                        quitarExperiencia(
                                                            experiencia,
                                                        )
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

                {/* AVISO SIN ÁREAS */}

                {areas.length === 0 && (
                    <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
                        Por el momento no hay áreas laborales disponibles
                        para registrar nuevas experiencias. Tus experiencias
                        existentes se conservan.
                    </div>
                )}

                <p className="pb-2 text-center text-xs text-muted-foreground">
                    Perfil profesional · Talent Match
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
                            <BriefcaseBusiness className="h-5 w-5 text-indigo-600" />

                            {experienciaEditando
                                ? 'Editar experiencia laboral'
                                : 'Agregar experiencia laboral'}
                        </DialogTitle>

                        <DialogDescription>
                            {experienciaEditando
                                ? 'Actualizá la información de tu experiencia profesional.'
                                : 'Completá los datos de tu empleo actual o anterior.'}
                        </DialogDescription>
                    </DialogHeader>

                    <form
                        onSubmit={guardarExperiencia}
                        className="space-y-5 pt-2"
                    >
                        {/* EMPRESA Y PUESTO */}

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <label
                                    htmlFor="nombre_empleador"
                                    className="text-sm font-semibold text-foreground"
                                >
                                    Empresa o empleador
                                    <span className="text-rose-500"> *</span>
                                </label>

                                <Input
                                    id="nombre_empleador"
                                    value={data.nombre_empleador}
                                    onChange={(e) =>
                                        setData(
                                            'nombre_empleador',
                                            e.target.value,
                                        )
                                    }
                                    required
                                    maxLength={150}
                                    placeholder="Ej.: Empresa S.A."
                                    className="h-10 rounded-lg"
                                />

                                {errors.nombre_empleador && (
                                    <p className="text-sm text-rose-600">
                                        {errors.nombre_empleador}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label
                                    htmlFor="puesto"
                                    className="text-sm font-semibold text-foreground"
                                >
                                    Puesto desempeñado
                                    <span className="text-rose-500"> *</span>
                                </label>

                                <Input
                                    id="puesto"
                                    value={data.puesto}
                                    onChange={(e) =>
                                        setData('puesto', e.target.value)
                                    }
                                    required
                                    maxLength={150}
                                    placeholder="Ej.: Analista de sistemas"
                                    className="h-10 rounded-lg"
                                />

                                {errors.puesto && (
                                    <p className="text-sm text-rose-600">
                                        {errors.puesto}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* ÁREA LABORAL */}

                        <div className="space-y-2">
                            <label
                                htmlFor="area_laboral_id"
                                className="flex items-center gap-2 text-sm font-semibold text-foreground"
                            >
                                <Layers3 className="h-4 w-4 text-indigo-500" />
                                Área laboral
                                <span className="text-rose-500"> *</span>
                            </label>

                            <select
                                id="area_laboral_id"
                                value={data.area_laboral_id}
                                onChange={(e) =>
                                    cambiarArea(e.target.value)
                                }
                                required
                                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-indigo-500"
                            >
                                <option value="">
                                    Seleccioná un área laboral
                                </option>

                                {areasFormulario.map((area) => (
                                    <option
                                        key={area.id}
                                        value={area.id}
                                    >
                                        {area.nombre}
                                        {!area.estado
                                            ? ' (No disponible - histórica)'
                                            : ''}
                                    </option>
                                ))}
                            </select>

                            {errors.area_laboral_id && (
                                <p className="text-sm text-rose-600">
                                    {errors.area_laboral_id}
                                </p>
                            )}
                        </div>

                        {/* SUBÁREA LABORAL */}

                        <div className="space-y-2">
                            <label
                                htmlFor="sub_area_laboral_id"
                                className="flex items-center gap-2 text-sm font-semibold text-foreground"
                            >
                                <MapPin className="h-4 w-4 text-indigo-500" />
                                Subárea laboral
                                <span className="text-rose-500"> *</span>
                            </label>

                            <select
                                id="sub_area_laboral_id"
                                value={data.sub_area_laboral_id}
                                onChange={(e) =>
                                    setData(
                                        'sub_area_laboral_id',
                                        e.target.value,
                                    )
                                }
                                required
                                disabled={!data.area_laboral_id}
                                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground"
                            >
                                <option value="">
                                    {data.area_laboral_id
                                        ? 'Seleccioná una subárea laboral'
                                        : 'Primero seleccioná un área laboral'}
                                </option>

                                {subAreasDisponibles.map((subArea) => (
                                    <option
                                        key={subArea.id}
                                        value={subArea.id}
                                    >
                                        {subArea.nombre}
                                        {!subArea.estado
                                            ? ' (No disponible - histórica)'
                                            : ''}
                                    </option>
                                ))}
                            </select>

                            {errors.sub_area_laboral_id && (
                                <p className="text-sm text-rose-600">
                                    {errors.sub_area_laboral_id}
                                </p>
                            )}

                            {data.area_laboral_id &&
                                subAreasDisponibles.length === 0 && (
                                    <p className="text-xs text-amber-700 dark:text-amber-300">
                                        Esta área no tiene subáreas disponibles.
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
                                        setData(
                                            'fecha_inicio',
                                            e.target.value,
                                        )
                                    }
                                    required
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
                                    {!data.trabaja_actualmente && (
                                        <span className="text-rose-500">
                                            *
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
                                    disabled={data.trabaja_actualmente}
                                    required={!data.trabaja_actualmente}
                                    min={data.fecha_inicio || undefined}
                                    className="h-10 rounded-lg disabled:bg-muted"
                                />

                                {errors.fecha_finalizacion && (
                                    <p className="text-sm text-rose-600">
                                        {errors.fecha_finalizacion}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* TRABAJO ACTUAL */}

                        <div className="rounded-lg border border-border bg-muted/40 p-4">
                            <label
                                htmlFor="trabaja_actualmente"
                                className="flex cursor-pointer items-start gap-3"
                            >
                                <input
                                    id="trabaja_actualmente"
                                    type="checkbox"
                                    checked={data.trabaja_actualmente}
                                    onChange={(e) =>
                                        cambiarTrabajoActual(
                                            e.target.checked,
                                        )
                                    }
                                    className="mt-0.5 h-4 w-4 rounded border-border accent-indigo-600"
                                />

                                <span>
                                    <span className="block text-sm font-semibold text-foreground">
                                        Actualmente trabajo en esta empresa
                                    </span>

                                    <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">
                                        Al marcar esta opción, no será
                                        necesario indicar una fecha de
                                        finalización.
                                    </span>
                                </span>
                            </label>

                            {errors.trabaja_actualmente && (
                                <p className="mt-2 text-sm text-rose-600">
                                    {errors.trabaja_actualmente}
                                </p>
                            )}
                        </div>

                        {/* RESPONSABILIDADES */}

                        <div className="space-y-2">
                            <label
                                htmlFor="responsabilidades"
                                className="flex items-center gap-2 text-sm font-semibold text-foreground"
                            >
                                <ClipboardList className="h-4 w-4 text-indigo-500" />
                                Responsabilidades y tareas
                                <span className="text-rose-500"> *</span>
                            </label>

                            <textarea
                                id="responsabilidades"
                                value={data.responsabilidades}
                                onChange={(e) =>
                                    setData(
                                        'responsabilidades',
                                        e.target.value,
                                    )
                                }
                                required
                                rows={5}
                                placeholder="Describí las principales tareas, funciones y responsabilidades que desempeñabas..."
                                className="w-full resize-y rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-shadow placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-indigo-500"
                            />

                            {errors.responsabilidades && (
                                <p className="text-sm text-rose-600">
                                    {errors.responsabilidades}
                                </p>
                            )}
                        </div>

                        {/* PERSONAS A CARGO */}

                        <div className="space-y-2">
                            <label
                                htmlFor="personas_a_cargo"
                                className="flex items-center gap-2 text-sm font-semibold text-foreground"
                            >
                                <Users className="h-4 w-4 text-indigo-500" />
                                Personas a cargo
                                <span className="text-xs font-normal text-muted-foreground">
                                    (Opcional)
                                </span>
                            </label>

                            <Input
                                id="personas_a_cargo"
                                type="number"
                                min="0"
                                max="65535"
                                step="1"
                                value={data.personas_a_cargo}
                                onChange={(e) =>
                                    setData(
                                        'personas_a_cargo',
                                        e.target.value,
                                    )
                                }
                                placeholder="Ej.: 5"
                                className="h-10 rounded-lg sm:max-w-xs"
                            />

                            <p className="text-xs text-muted-foreground">
                                Indicá la cantidad de personas que estaban
                                bajo tu supervisión, si corresponde.
                            </p>

                            {errors.personas_a_cargo && (
                                <p className="text-sm text-rose-600">
                                    {errors.personas_a_cargo}
                                </p>
                            )}
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
                                    areasFormulario.length === 0
                                }
                                className="rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400"
                            >
                                {processing
                                    ? 'Guardando...'
                                    : experienciaEditando
                                      ? 'Guardar cambios'
                                      : 'Agregar experiencia'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
