import { useEffect, useState, type FormEvent } from 'react';
import { router, useForm } from '@inertiajs/react';
import {
    Languages,
    Plus,
    Pencil,
    Trash2,
    BookOpen,
    PenLine,
    MessageCircle,
    CheckCircle2,
    Info,
    AlertTriangle,
    X,
    Globe2,
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

type NivelIdioma = 'basico' | 'intermedio' | 'avanzado' | 'nativo';

interface PivotIdioma {
    id: number;
    nivel_lectura: NivelIdioma;
    nivel_escritura: NivelIdioma;
    nivel_oral: NivelIdioma;
    estado: boolean;
}

interface Idioma {
    id: number;
    nombre: string;
    estado: boolean;
    pivot: PivotIdioma;
}

interface IdiomaCatalogo {
    id: number;
    nombre: string;
}

interface FlashSuccess {
    type: 'created' | 'updated' | 'deleted';
    message: string;
}

interface Props {
    idiomas: Idioma[];
    catalogo: IdiomaCatalogo[];
    flash?: {
        success?: FlashSuccess;
    };
}

// --------------------------------------------------
// CONSTANTES
// --------------------------------------------------

const niveles: { value: NivelIdioma; label: string }[] = [
    { value: 'basico', label: 'Básico' },
    { value: 'intermedio', label: 'Intermedio' },
    { value: 'avanzado', label: 'Avanzado' },
    { value: 'nativo', label: 'Nativo' },
];

// --------------------------------------------------
// COMPONENTE
// --------------------------------------------------

export default function Index({ idiomas, catalogo, flash }: Props) {
    const [modalAbierto, setModalAbierto] = useState(false);
    const [idiomaEditando, setIdiomaEditando] = useState<Idioma | null>(null);
    const [mostrarNotificacion, setMostrarNotificacion] = useState(true);

    const idiomasNoDisponibles = idiomas.filter(
        (idioma) => !idioma.estado,
    ).length;

    const {
        data,
        setData,
        post,
        put,
        processing,
        errors,
        reset,
        clearErrors,
    } = useForm({
        idioma_id: '',
        nivel_lectura: 'basico' as NivelIdioma,
        nivel_escritura: 'basico' as NivelIdioma,
        nivel_oral: 'basico' as NivelIdioma,
    });

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
            icon: <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />,
            titulo: 'Idioma agregado',
        },
        updated: {
            container:
                'border-indigo-200 bg-indigo-50 text-indigo-900 dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:text-indigo-100',
            icon: <Info className="h-5 w-5 shrink-0 text-indigo-600 dark:text-indigo-400" />,
            titulo: 'Idioma actualizado',
        },
        deleted: {
            container:
                'border-rose-200 bg-rose-50 text-rose-900 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-100',
            icon: <AlertTriangle className="h-5 w-5 shrink-0 text-rose-600 dark:text-rose-400" />,
            titulo: 'Idioma quitado',
        },
    };

    const notificacion = flash?.success
        ? estilosFlash[flash.success.type]
        : null;

    // --------------------------------------------------
    // FORMULARIO
    // --------------------------------------------------

    const abrirFormularioNuevo = () => {
        setIdiomaEditando(null);
        reset();
        clearErrors();
        setModalAbierto(true);
    };

    const abrirFormularioEdicion = (idioma: Idioma) => {
        setIdiomaEditando(idioma);
        clearErrors();

        setData({
            idioma_id: String(idioma.id),
            nivel_lectura: idioma.pivot.nivel_lectura,
            nivel_escritura: idioma.pivot.nivel_escritura,
            nivel_oral: idioma.pivot.nivel_oral,
        });

        setModalAbierto(true);
    };

    const cerrarFormulario = () => {
        if (processing) return;

        setModalAbierto(false);
        setIdiomaEditando(null);
        reset();
        clearErrors();
    };

    const guardarIdioma = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (idiomaEditando) {
            put(`/candidato/idiomas/${idiomaEditando.pivot.id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    setModalAbierto(false);
                    setIdiomaEditando(null);
                    reset();
                },
            });

            return;
        }

        post('/candidato/idiomas', {
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

    const quitarIdioma = (idioma: Idioma) => {
        const confirmar = window.confirm(
            `¿Estás seguro de que deseas quitar "${idioma.nombre}" de tu perfil?`,
        );

        if (!confirmar) return;

        router.delete(`/candidato/idiomas/${idioma.pivot.id}`, {
            preserveScroll: true,
        });
    };

    // --------------------------------------------------
    // UTILIDADES
    // --------------------------------------------------

    const obtenerNivel = (nivel: NivelIdioma) =>
        niveles.find((item) => item.value === nivel)?.label ?? nivel;

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
                            <Languages className="h-6 w-6" />
                        </div>

                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                                Mis idiomas
                            </h1>

                            <p className="mt-1 max-w-xl text-sm leading-relaxed text-muted-foreground">
                                Administrá los idiomas que conocés y tus
                                niveles de comprensión y comunicación.
                            </p>
                        </div>
                    </div>

                    <Button
                        type="button"
                        onClick={abrirFormularioNuevo}
                        disabled={catalogo.length === 0}
                        className="h-10 w-full rounded-lg bg-indigo-600 px-4 font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 focus-visible:ring-2 focus-visible:ring-indigo-500 sm:w-auto dark:bg-indigo-500 dark:hover:bg-indigo-400"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Agregar idioma
                    </Button>
                </header>

                {/* NOTIFICACIÓN */}

                {mostrarNotificacion && flash?.success && notificacion && (
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
                            onClick={() => setMostrarNotificacion(false)}
                            aria-label="Cerrar notificación"
                            className="rounded-md p-1 opacity-70 transition-opacity hover:opacity-100"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                )}

                {idiomasNoDisponibles > 0 && (
                    <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
                        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />

                        <div>
                            <p className="text-sm font-semibold">
                                Algunos idiomas ya no están disponibles
                            </p>

                            <p className="mt-1 text-sm leading-relaxed">
                                Tenés {idiomasNoDisponibles}{' '}
                                {idiomasNoDisponibles === 1
                                    ? 'idioma que fue desactivado'
                                    : 'idiomas que fueron desactivados'}{' '}
                                del catálogo general. Podés consultar los niveles
                                registrados o quitarlos de tu perfil, pero no
                                modificarlos mientras permanezcan inactivos.
                            </p>
                        </div>
                    </div>
                )}

                {/* RESUMEN */}

                <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300">
                            <Globe2 className="h-5 w-5" />
                        </div>

                        <div>
                            <p className="text-sm text-muted-foreground">
                                Idiomas registrados
                            </p>

                            <p className="text-2xl font-bold tabular-nums text-foreground">
                                {idiomas.length}
                            </p>
                        </div>
                    </div>
                </section>

                {/* LISTADO */}

                <section className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
                    <div className="flex flex-col gap-2 border-b border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="text-base font-semibold text-foreground">
                                Mi conocimiento de idiomas
                            </h2>

                            <p className="mt-0.5 text-sm text-muted-foreground">
                                Consultá y actualizá tus competencias lingüísticas.
                            </p>
                        </div>

                        <span className="inline-flex w-fit items-center rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold tabular-nums text-indigo-700 ring-1 ring-inset ring-indigo-100 dark:bg-indigo-500/15 dark:text-indigo-300 dark:ring-indigo-400/20">
                            {idiomas.length}{' '}
                            {idiomas.length === 1 ? 'idioma' : 'idiomas'}
                        </span>
                    </div>

                    <div className="space-y-4 p-4 sm:p-5">
                        {idiomas.length === 0 ? (
                            <div className="flex min-h-72 flex-col items-center justify-center gap-3 text-center">
                                <div className="flex h-16 w-16 items-center justify-center rounded-full border border-dashed border-border bg-muted">
                                    <Languages className="h-7 w-7 text-muted-foreground" />
                                </div>

                                <div>
                                    <h3 className="font-semibold text-foreground">
                                        Todavía no registraste idiomas
                                    </h3>

                                    <p className="mt-1 max-w-md text-sm text-muted-foreground">
                                        Agregá los idiomas que conocés para
                                        completar tu perfil profesional.
                                    </p>
                                </div>

                                {catalogo.length > 0 && (
                                    <Button
                                        type="button"
                                        onClick={abrirFormularioNuevo}
                                        className="mt-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
                                    >
                                        <Plus className="mr-2 h-4 w-4" />
                                        Agregar mi primer idioma
                                    </Button>
                                )}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                                {idiomas.map((idioma) => (
                                    <article
                                        key={idioma.pivot.id}
                                        className="group rounded-xl border border-border bg-background p-5 shadow-sm transition-all hover:border-indigo-200 hover:shadow-md dark:hover:border-indigo-400/30"
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex min-w-0 items-center gap-3">
                                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300">
                                                    <Languages className="h-5 w-5" />
                                                </div>

                                                <div className="min-w-0">
                                                    <h3 className="truncate text-base font-bold text-foreground">
                                                        {idioma.nombre}
                                                    </h3>

                                                    <p className="text-xs text-muted-foreground">
                                                        Competencias lingüísticas
                                                    </p>
                                                </div>
                                            </div>

                                            <span
                                                className={
                                                    idioma.estado
                                                        ? 'rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300'
                                                        : 'rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800 dark:bg-amber-500/10 dark:text-amber-300'
                                                }
                                            >
                                                {idioma.estado ? 'Activo' : 'No disponible'}
                                            </span>
                                        </div>

                                        <div className="mt-5 space-y-3">
                                            <div className="flex items-center justify-between gap-3">
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <BookOpen className="h-4 w-4 text-indigo-500" />
                                                    Lectura
                                                </div>

                                                <span className="rounded-md bg-muted px-3 py-1 text-xs font-semibold text-foreground">
                                                    {obtenerNivel(idioma.pivot.nivel_lectura)}
                                                </span>
                                            </div>

                                            <div className="flex items-center justify-between gap-3">
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <PenLine className="h-4 w-4 text-indigo-500" />
                                                    Escritura
                                                </div>

                                                <span className="rounded-md bg-muted px-3 py-1 text-xs font-semibold text-foreground">
                                                    {obtenerNivel(idioma.pivot.nivel_escritura)}
                                                </span>
                                            </div>

                                            <div className="flex items-center justify-between gap-3">
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <MessageCircle className="h-4 w-4 text-indigo-500" />
                                                    Oral
                                                </div>

                                                <span className="rounded-md bg-muted px-3 py-1 text-xs font-semibold text-foreground">
                                                    {obtenerNivel(idioma.pivot.nivel_oral)}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="mt-5 flex justify-end gap-2 border-t border-border pt-4">

                                            {idioma.estado && (
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => abrirFormularioEdicion(idioma)}
                                                    className="h-9 rounded-lg border-border px-3 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 dark:hover:bg-indigo-500/15"
                                                >
                                                    <Pencil className="mr-1.5 h-3.5 w-3.5" />
                                                    Editar
                                                </Button>
                                            )}

                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => quitarIdioma(idioma)}
                                                className="h-9 rounded-lg px-3 text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:text-rose-400 dark:hover:bg-rose-500/15"
                                            >
                                                <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                                                Quitar
                                            </Button>

                                        </div>
                                    </article>
                                ))}
                            </div>
                        )}
                    </div>
                </section>

                {catalogo.length === 0 && (
                    <p className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
                        No hay otros idiomas disponibles para agregar.
                    </p>
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
                <DialogContent className="max-h-[90vh] overflow-y-auto rounded-xl sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-xl">
                            <Languages className="h-5 w-5 text-indigo-600" />
                            {idiomaEditando ? 'Editar idioma' : 'Agregar idioma'}
                        </DialogTitle>

                        <DialogDescription>
                            {idiomaEditando
                                ? 'Actualizá tus niveles de conocimiento.'
                                : 'Seleccioná un idioma y especificá tus niveles de conocimiento.'}
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={guardarIdioma} className="space-y-5 pt-2">

                        {/* IDIOMA */}

                        <div className="space-y-2">
                            <label
                                htmlFor="idioma_id"
                                className="text-sm font-semibold text-foreground"
                            >
                                Idioma
                            </label>

                            {idiomaEditando ? (
                                <Input
                                    value={idiomaEditando.nombre}
                                    disabled
                                    className="h-10 rounded-lg bg-muted"
                                />
                            ) : (
                                <select
                                    id="idioma_id"
                                    value={data.idioma_id}
                                    onChange={(e) => setData('idioma_id', e.target.value)}
                                    required
                                    className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-indigo-500"
                                >
                                    <option value="">Seleccioná un idioma</option>

                                    {catalogo.map((idioma) => (
                                        <option key={idioma.id} value={idioma.id}>
                                            {idioma.nombre}
                                        </option>
                                    ))}
                                </select>
                            )}

                            {errors.idioma_id && (
                                <p className="text-sm text-rose-600">
                                    {errors.idioma_id}
                                </p>
                            )}
                        </div>

                        {/* NIVEL DE LECTURA */}

                        <div className="space-y-2">
                            <label
                                htmlFor="nivel_lectura"
                                className="flex items-center gap-2 text-sm font-semibold text-foreground"
                            >
                                <BookOpen className="h-4 w-4 text-indigo-500" />
                                Nivel de lectura
                            </label>

                            <select
                                id="nivel_lectura"
                                value={data.nivel_lectura}
                                onChange={(e) => setData('nivel_lectura', e.target.value as NivelIdioma)}
                                required
                                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                            >
                                {niveles.map((nivel) => (
                                    <option key={nivel.value} value={nivel.value}>
                                        {nivel.label}
                                    </option>
                                ))}
                            </select>

                            {errors.nivel_lectura && (
                                <p className="text-sm text-rose-600">
                                    {errors.nivel_lectura}
                                </p>
                            )}
                        </div>

                        {/* NIVEL DE ESCRITURA */}

                        <div className="space-y-2">
                            <label
                                htmlFor="nivel_escritura"
                                className="flex items-center gap-2 text-sm font-semibold text-foreground"
                            >
                                <PenLine className="h-4 w-4 text-indigo-500" />
                                Nivel de escritura
                            </label>

                            <select
                                id="nivel_escritura"
                                value={data.nivel_escritura}
                                onChange={(e) => setData('nivel_escritura', e.target.value as NivelIdioma)}
                                required
                                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                            >
                                {niveles.map((nivel) => (
                                    <option key={nivel.value} value={nivel.value}>
                                        {nivel.label}
                                    </option>
                                ))}
                            </select>

                            {errors.nivel_escritura && (
                                <p className="text-sm text-rose-600">
                                    {errors.nivel_escritura}
                                </p>
                            )}
                        </div>

                        {/* NIVEL ORAL */}

                        <div className="space-y-2">
                            <label
                                htmlFor="nivel_oral"
                                className="flex items-center gap-2 text-sm font-semibold text-foreground"
                            >
                                <MessageCircle className="h-4 w-4 text-indigo-500" />
                                Nivel oral
                            </label>

                            <select
                                id="nivel_oral"
                                value={data.nivel_oral}
                                onChange={(e) => setData('nivel_oral', e.target.value as NivelIdioma)}
                                required
                                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                            >
                                {niveles.map((nivel) => (
                                    <option key={nivel.value} value={nivel.value}>
                                        {nivel.label}
                                    </option>
                                ))}
                            </select>

                            {errors.nivel_oral && (
                                <p className="text-sm text-rose-600">
                                    {errors.nivel_oral}
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
                                disabled={processing || (!idiomaEditando && catalogo.length === 0)}
                                className="rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400"
                            >
                                {processing
                                    ? 'Guardando...'
                                    : idiomaEditando
                                        ? 'Guardar cambios'
                                        : 'Agregar idioma'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
