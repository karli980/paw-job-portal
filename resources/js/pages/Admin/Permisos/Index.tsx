import AppLayout from '@/layouts/app-layout';
import { Head, router, usePage } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';
import {
    AlertCircle,
    CheckCircle2,
    ChevronRight,
    Info,
    LockKeyhole,
    RotateCcw,
    Save,
    Search,
    ShieldCheck,
    UserRound,
    Users,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Administrador {
    id: number;
    nombre: string;
    apellido: string | null;
    email: string;
    estado: boolean;
}

interface AdministradorSeleccionado {
    id: number;
    nombre: string;
    apellido: string | null;
    email: string;
    permisosDirectos: string[];
    permisosHeredados: string[];
    permisosEfectivos: string[];
}

interface Permiso {
    id: number;
    nombre: string;
    reservado: boolean;
}

interface GrupoPermisos {
    nombre: string;
    permisos: Permiso[];
}

interface Props {
    administradores: Administrador[];
    administradorSeleccionado: AdministradorSeleccionado | null;
    gruposPermisos: GrupoPermisos[];
}

interface Mensaje {
    tipo: 'success' | 'error';
    texto: string;
}

const breadcrumbs = [
    {
        title: 'Panel administrativo',
        href: '/admin/dashboard',
    },
    {
        title: 'Gestión de permisos',
        href: '/admin/permisos',
    },
];

function nombreCompleto(usuario: {
    nombre: string;
    apellido: string | null;
}): string {
    return `${usuario.nombre} ${usuario.apellido ?? ''}`.trim();
}

function iniciales(usuario: {
    nombre: string;
    apellido: string | null;
}): string {
    return `${usuario.nombre.charAt(0)}${usuario.apellido?.charAt(0) ?? ''}`
        .toUpperCase();
}

function permisosEditables(grupos: GrupoPermisos[]): Set<string> {
    return new Set(
        grupos.flatMap((grupo) =>
            grupo.permisos
                .filter((permiso) => !permiso.reservado)
                .map((permiso) => permiso.nombre),
        ),
    );
}

function directosEditables(
    administrador: AdministradorSeleccionado | null,
    gestionables: Set<string>,
): string[] {
    return (
        administrador?.permisosDirectos.filter((permiso) =>
            gestionables.has(permiso),
        ) ?? []
    );
}

export default function Index({
    administradores,
    administradorSeleccionado,
    gruposPermisos,
}: Props) {
    const page = usePage();

    const flash = page.props.flash as
        | { success?: string; error?: string }
        | undefined;

    const [buscar, setBuscar] = useState('');
    const [guardando, setGuardando] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [mensaje, setMensaje] = useState<Mensaje | null>(null);

    const gestionables = useMemo(
        () => permisosEditables(gruposPermisos),
        [gruposPermisos],
    );

    const [seleccionados, setSeleccionados] = useState<string[]>(() =>
        directosEditables(
            administradorSeleccionado,
            permisosEditables(gruposPermisos),
        ),
    );

    useEffect(() => {
        setSeleccionados(
            directosEditables(administradorSeleccionado, gestionables),
        );
        setError(null);
    }, [administradorSeleccionado, gestionables]);

    useEffect(() => {
        const texto = flash?.error ?? flash?.success;

        if (!texto) return;

        setMensaje({
            tipo: flash?.error ? 'error' : 'success',
            texto,
        });

        const temporizador = window.setTimeout(() => {
            setMensaje(null);
        }, 4000);

        return () => window.clearTimeout(temporizador);
    }, [flash?.success, flash?.error]);

    const administradoresFiltrados = useMemo(() => {
        const termino = buscar.trim().toLowerCase();

        if (!termino) return administradores;

        return administradores.filter((administrador) => {
            const texto =
                `${nombreCompleto(administrador)} ${administrador.email}`.toLowerCase();

            return texto.includes(termino);
        });
    }, [administradores, buscar]);

    const originales = directosEditables(
        administradorSeleccionado,
        gestionables,
    );

    const cambiosSinGuardar =
        [...originales].sort().join('|') !==
        [...seleccionados].sort().join('|');

    const heredados = new Set(
        administradorSeleccionado?.permisosHeredados ?? [],
    );

    const directosOriginales = new Set(
        administradorSeleccionado?.permisosDirectos ?? [],
    );

    const permisosTotales = new Set([
        ...heredados,
        ...seleccionados,
        ...Array.from(directosOriginales).filter(
            (permiso) => !gestionables.has(permiso),
        ),
    ]).size;

    function seleccionarAdministrador(id: number) {
        if (administradorSeleccionado?.id === id) return;

        if (
            cambiosSinGuardar &&
            !window.confirm(
                'Tenés cambios sin guardar. ¿Querés descartarlos y seleccionar otro administrador?',
            )
        ) {
            return;
        }

        setError(null);

        router.get(
            '/admin/permisos',
            { usuario: id },
            {
                preserveScroll: true,
                preserveState: false,
            },
        );
    }

    function cambiarPermiso(nombre: string, activo: boolean) {
        if (!gestionables.has(nombre) || heredados.has(nombre)) {
            return;
        }

        setSeleccionados((actuales) =>
            activo
                ? [...new Set([...actuales, nombre])]
                : actuales.filter((permiso) => permiso !== nombre),
        );

        setError(null);
    }

    function restaurarCambios() {
        setSeleccionados(originales);
        setError(null);
    }

    function guardarCambios() {
        if (
            !administradorSeleccionado ||
            !cambiosSinGuardar ||
            guardando
        ) {
            return;
        }

        setError(null);
        setMensaje(null);

        router.put(
            `/admin/permisos/${administradorSeleccionado.id}`,
            {
                permisos: seleccionados,
            },
            {
                preserveScroll: true,
                onStart: () => setGuardando(true),
                onFinish: () => setGuardando(false),
                onError: (errores) => {
                    setError(
                        errores.permisos ??
                            'No fue posible actualizar los permisos.',
                    );
                },
            },
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gestión de permisos | Talent Match" />

            <div className="min-h-full bg-slate-50/70 px-4 py-6 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl space-y-6">
                    {/* Encabezado */}
                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                        <div>
                            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-indigo-600">
                                <ShieldCheck className="h-4 w-4" />
                                Administración de accesos
                            </div>

                            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                                Gestión de permisos
                            </h1>

                            <p className="mt-2 text-sm text-slate-500">
                                Administrá los permisos individuales de los
                                administradores de Talent Match.
                            </p>
                        </div>

                        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700">
                            <LockKeyhole className="h-4 w-4" />
                            Exclusivo Super Admin
                        </div>
                    </div>

                    {/* Notificaciones */}
                    {mensaje && (
                        <div
                            role="status"
                            className={`flex items-start gap-3 rounded-xl border p-4 text-sm ${
                                mensaje.tipo === 'success'
                                    ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                                    : 'border-red-200 bg-red-50 text-red-800'
                            }`}
                        >
                            {mensaje.tipo === 'success' ? (
                                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
                            ) : (
                                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                            )}

                            <span>{mensaje.texto}</span>
                        </div>
                    )}

                    {error && (
                        <div
                            role="alert"
                            className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
                        >
                            <AlertCircle className="h-5 w-5 shrink-0" />
                            {error}
                        </div>
                    )}

                    {/* Área principal */}
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
                        {/* Administradores */}
                        <section className="h-fit overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                            <div className="border-b border-slate-100 p-5">
                                <div className="flex items-center justify-between">
                                    <h2 className="flex items-center gap-2 font-semibold text-slate-900">
                                        <Users className="h-5 w-5 text-indigo-600" />
                                        Administradores
                                    </h2>

                                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                                        {administradores.length}
                                    </span>
                                </div>

                                <p className="mt-2 text-xs text-slate-500">
                                    Seleccioná una cuenta para administrar sus
                                    permisos.
                                </p>

                                <div className="relative mt-4">
                                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />

                                    <Input
                                        value={buscar}
                                        onChange={(e) =>
                                            setBuscar(e.target.value)
                                        }
                                        placeholder="Buscar administrador..."
                                        className="h-10 pl-9"
                                    />
                                </div>
                            </div>

                            <div className="max-h-[570px] space-y-1 overflow-y-auto p-2">
                                {administradoresFiltrados.length === 0 ? (
                                    <div className="px-4 py-12 text-center">
                                        <UserRound className="mx-auto h-9 w-9 text-slate-300" />

                                        <p className="mt-3 text-sm font-medium text-slate-700">
                                            No se encontraron administradores
                                        </p>

                                        <p className="mt-1 text-xs text-slate-500">
                                            Probá con otro nombre o correo.
                                        </p>
                                    </div>
                                ) : (
                                    administradoresFiltrados.map(
                                        (administrador) => {
                                            const activo =
                                                administradorSeleccionado?.id ===
                                                administrador.id;

                                            return (
                                                <button
                                                    key={administrador.id}
                                                    type="button"
                                                    disabled={guardando}
                                                    onClick={() =>
                                                        seleccionarAdministrador(
                                                            administrador.id,
                                                        )
                                                    }
                                                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors disabled:opacity-60 ${
                                                        activo
                                                            ? 'bg-indigo-50 ring-1 ring-indigo-200'
                                                            : 'hover:bg-slate-50'
                                                    }`}
                                                >
                                                    <div
                                                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${
                                                            activo
                                                                ? 'bg-indigo-600 text-white'
                                                                : 'bg-slate-100 text-slate-600'
                                                        }`}
                                                    >
                                                        {iniciales(
                                                            administrador,
                                                        )}
                                                    </div>

                                                    <div className="min-w-0 flex-1">
                                                        <p
                                                            className={`truncate text-sm font-semibold ${
                                                                activo
                                                                    ? 'text-indigo-800'
                                                                    : 'text-slate-800'
                                                            }`}
                                                        >
                                                            {nombreCompleto(
                                                                administrador,
                                                            )}
                                                        </p>

                                                        <p className="truncate text-xs text-slate-500">
                                                            {
                                                                administrador.email
                                                            }
                                                        </p>

                                                        <span
                                                            className={`mt-1 inline-block text-xs ${
                                                                administrador.estado
                                                                    ? 'text-emerald-600'
                                                                    : 'text-slate-400'
                                                            }`}
                                                        >
                                                            {administrador.estado
                                                                ? 'Activo'
                                                                : 'Inactivo'}
                                                        </span>
                                                    </div>

                                                    <ChevronRight
                                                        className={`h-4 w-4 shrink-0 ${
                                                            activo
                                                                ? 'text-indigo-600'
                                                                : 'text-slate-300'
                                                        }`}
                                                    />
                                                </button>
                                            );
                                        },
                                    )
                                )}
                            </div>
                        </section>

                        {/* Panel de permisos */}
                        <section className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                            {!administradorSeleccionado ? (
                                <div className="flex min-h-[450px] flex-col items-center justify-center p-8 text-center">
                                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50">
                                        <ShieldCheck className="h-8 w-8 text-indigo-500" />
                                    </div>

                                    <h2 className="mt-5 text-lg font-semibold text-slate-900">
                                        Ningún administrador seleccionado
                                    </h2>

                                    <p className="mt-2 max-w-md text-sm text-slate-500">
                                        Seleccioná un administrador de la lista
                                        para consultar y configurar sus
                                        permisos individuales.
                                    </p>
                                </div>
                            ) : (
                                <>
                                    {/* Usuario seleccionado */}
                                    <div className="border-b border-slate-100 p-5 sm:p-6">
                                        <div className="flex flex-wrap items-start justify-between gap-4">
                                            <div>
                                                <p className="text-xs font-semibold tracking-wider text-indigo-600 uppercase">
                                                    Administrador seleccionado
                                                </p>

                                                <h2 className="mt-1 text-xl font-bold text-slate-900">
                                                    {nombreCompleto(
                                                        administradorSeleccionado,
                                                    )}
                                                </h2>

                                                <p className="mt-1 text-sm text-slate-500">
                                                    {
                                                        administradorSeleccionado.email
                                                    }
                                                </p>
                                            </div>

                                            <span className="rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700">
                                                Rol: Administrador
                                            </span>
                                        </div>

                                        <div className="mt-5 grid grid-cols-2 gap-3">
                                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                                <p className="text-xs text-slate-500">
                                                    Permisos efectivos
                                                </p>
                                                <p className="mt-1 text-2xl font-bold text-slate-900">
                                                    {permisosTotales}
                                                </p>
                                            </div>

                                            <div className="rounded-xl border border-indigo-100 bg-indigo-50/70 p-4">
                                                <p className="text-xs text-indigo-600">
                                                    Individuales gestionables
                                                </p>
                                                <p className="mt-1 text-2xl font-bold text-indigo-700">
                                                    {seleccionados.length}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Explicación */}
                                    <div className="mx-5 mt-5 flex gap-3 rounded-xl border border-blue-100 bg-blue-50/70 p-4 text-sm text-blue-800 sm:mx-6">
                                        <Info className="mt-0.5 h-5 w-5 shrink-0" />
                                        <p>
                                            Los permisos heredados del rol
                                            aparecen marcados y bloqueados.
                                            Podés activar o desactivar los
                                            permisos individuales disponibles.
                                        </p>
                                    </div>

                                    {/* Grupos */}
                                    <div className="space-y-5 p-5 sm:p-6">
                                        {gruposPermisos.map((grupo) => (
                                            <div
                                                key={grupo.nombre}
                                                className="overflow-hidden rounded-xl border border-slate-200"
                                            >
                                                <div className="border-b border-slate-100 bg-slate-50 px-4 py-3">
                                                    <h3 className="text-sm font-semibold text-slate-800">
                                                        {grupo.nombre}
                                                    </h3>
                                                </div>

                                                <div className="divide-y divide-slate-100">
                                                    {grupo.permisos.map(
                                                        (permiso) => {
                                                            const heredado =
                                                                heredados.has(
                                                                    permiso.nombre,
                                                                );

                                                            const directo =
                                                                seleccionados.includes(
                                                                    permiso.nombre,
                                                                );

                                                            const reservado =
                                                                permiso.reservado;

                                                            const marcado =
                                                                heredado ||
                                                                directo ||
                                                                (reservado &&
                                                                    directosOriginales.has(
                                                                        permiso.nombre,
                                                                    ));

                                                            const bloqueado =
                                                                heredado ||
                                                                reservado ||
                                                                guardando;

                                                            return (
                                                                <label
                                                                    key={
                                                                        permiso.id
                                                                    }
                                                                    className={`flex items-center justify-between gap-3 px-4 py-3.5 ${
                                                                        bloqueado
                                                                            ? 'bg-slate-50/40'
                                                                            : 'cursor-pointer hover:bg-indigo-50/30'
                                                                    }`}
                                                                >
                                                                    <div className="flex min-w-0 items-center gap-3">
                                                                        <input
                                                                            type="checkbox"
                                                                            checked={
                                                                                marcado
                                                                            }
                                                                            disabled={
                                                                                bloqueado
                                                                            }
                                                                            onChange={(
                                                                                e,
                                                                            ) =>
                                                                                cambiarPermiso(
                                                                                    permiso.nombre,
                                                                                    e
                                                                                        .target
                                                                                        .checked,
                                                                                )
                                                                            }
                                                                            className="h-4 w-4 shrink-0 rounded border-slate-300 accent-indigo-600"
                                                                        />

                                                                        <span className="text-sm text-slate-700">
                                                                            {
                                                                                permiso.nombre
                                                                            }
                                                                        </span>
                                                                    </div>

                                                                    <span
                                                                        className={`shrink-0 rounded-full px-2 py-1 text-[11px] font-medium ${
                                                                            reservado
                                                                                ? 'bg-amber-50 text-amber-700'
                                                                                : heredado
                                                                                  ? 'bg-slate-100 text-slate-600'
                                                                                  : directo
                                                                                    ? 'bg-indigo-50 text-indigo-700'
                                                                                    : 'bg-slate-50 text-slate-400'
                                                                        }`}
                                                                    >
                                                                        {reservado
                                                                            ? 'Reservado'
                                                                            : heredado
                                                                              ? 'Heredado'
                                                                              : directo
                                                                                ? 'Individual'
                                                                                : 'Sin asignar'}
                                                                    </span>
                                                                </label>
                                                            );
                                                        },
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Acciones */}
                                    <div className="sticky bottom-0 flex flex-col gap-3 border-t border-slate-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                                        <div className="text-xs text-slate-500">
                                            {cambiosSinGuardar ? (
                                                <span className="font-medium text-amber-700">
                                                    Hay cambios sin guardar.
                                                </span>
                                            ) : (
                                                'No hay cambios pendientes.'
                                            )}
                                        </div>

                                        <div className="flex flex-wrap gap-2">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                disabled={
                                                    !cambiosSinGuardar ||
                                                    guardando
                                                }
                                                onClick={restaurarCambios}
                                            >
                                                <RotateCcw className="mr-2 h-4 w-4" />
                                                Descartar
                                            </Button>

                                            <Button
                                                type="button"
                                                disabled={
                                                    !cambiosSinGuardar ||
                                                    guardando
                                                }
                                                onClick={guardarCambios}
                                                className="bg-indigo-600 text-white hover:bg-indigo-700"
                                            >
                                                <Save className="mr-2 h-4 w-4" />
                                                {guardando
                                                    ? 'Guardando...'
                                                    : 'Guardar permisos'}
                                            </Button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </section>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
