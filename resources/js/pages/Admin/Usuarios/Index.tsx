import AppLayout from '@/layouts/app-layout';

import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { useEffect, useState, type FormEvent } from 'react';
import {
    ArrowRight,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    Mail,
    Pencil,
    Search,
    ShieldCheck,
    UserCheck,
    UserPlus,
    UserX,
    Users,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

interface Administrador {
    id: number;
    nombre: string;
    apellido: string | null;
    email: string;
    estado: boolean;
    email_verificado: boolean;
}

interface Paginacion<T> {
    data: T[];
    current_page: number;
    last_page: number;
    total: number;
    prev_page_url: string | null;
    next_page_url: string | null;
}

interface Props {
    administradores: Paginacion<Administrador>;
    filtros: {
        buscar: string;
        por_pagina: number;
    };
}

interface DatosFormulario {
    nombre: string;
    apellido: string;
    email: string;
    password: string;
    password_confirmation: string;
}

interface DatosEdicion {
    nombre: string;
    apellido: string;
}

const breadcrumbs = [
    { title: 'Panel administrativo', href: '/admin/dashboard' },
    { title: 'Administradores', href: '/admin/usuarios' },
];

export default function Index({ administradores, filtros }: Props) {
    const page = usePage();
    const flash = page.props.flash as { success?: string } | undefined;

    // Filtros y notificaciones.
    const [buscar, setBuscar] = useState(filtros.buscar);
    const [porPagina, setPorPagina] = useState(filtros.por_pagina);
    const [mensaje, setMensaje] = useState<string | null>(null);

    // Crear administrador.
    const { data, setData, post, processing, errors, reset } =
        useForm<DatosFormulario>({
            nombre: '',
            apellido: '',
            email: '',
            password: '',
            password_confirmation: '',
        });

    // Editar administrador.
    const [administradorEditando, setAdministradorEditando] =
        useState<Administrador | null>(null);
    const {
        data: datosEdicion,
        setData: setDatosEdicion,
        put: actualizar,
        processing: actualizando,
        errors: erroresEdicion,
        reset: reiniciarEdicion,
        clearErrors: limpiarErroresEdicion,
    } = useForm<DatosEdicion>({ nombre: '', apellido: '' });

    // Confirmación de cambio de estado.
    const [administradorEstado, setAdministradorEstado] =
        useState<Administrador | null>(null);
    const [cambiandoEstado, setCambiandoEstado] = useState(false);
    const [errorEstado, setErrorEstado] = useState<string | null>(null);
    const vaAActivar = administradorEstado
        ? !administradorEstado.estado
        : false;

    useEffect(() => {
        setMensaje(flash?.success ?? null);
        if (!flash?.success) return;

        const temporizador = window.setTimeout(() => {
            setMensaje(null);
        }, 4000);
        return () => window.clearTimeout(temporizador);
    }, [flash?.success]);

    function buscarUsuarios(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        router.get(
            '/admin/usuarios',
            { buscar, por_pagina: porPagina },
            { preserveState: true, replace: true, preserveScroll: true },
        );
    }

    function limpiarBusqueda() {
        setBuscar('');
        router.get(
            '/admin/usuarios',
            { por_pagina: porPagina },
            { preserveState: true, replace: true, preserveScroll: true },
        );
    }

    function cambiarPaginacion(valor: number) {
        setPorPagina(valor);
        router.get(
            '/admin/usuarios',
            { buscar, por_pagina: valor },
            { preserveState: true, replace: true, preserveScroll: true },
        );
    }

    function crearAdministrador(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        post('/admin/usuarios', {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    }

    function abrirEdicion(admin: Administrador) {
        limpiarErroresEdicion();
        setDatosEdicion({
            nombre: admin.nombre,
            apellido: admin.apellido ?? '',
        });
        setAdministradorEditando(admin);
    }

    function cerrarEdicion() {
        if (actualizando) return;
        setAdministradorEditando(null);
        limpiarErroresEdicion();
        reiniciarEdicion();
    }

    function actualizarAdministrador(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!administradorEditando) return;

        actualizar(`/admin/usuarios/${administradorEditando.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setAdministradorEditando(null);
                limpiarErroresEdicion();
                reiniciarEdicion();
            },
        });
    }

    function abrirCambioEstado(admin: Administrador) {
        setErrorEstado(null);
        setAdministradorEstado(admin);
    }

    function cerrarCambioEstado() {
        if (cambiandoEstado) return;
        setAdministradorEstado(null);
        setErrorEstado(null);
    }

    function confirmarCambioEstado(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!administradorEstado || cambiandoEstado) return;

        setCambiandoEstado(true);
        setErrorEstado(null);

        router.patch(
            `/admin/usuarios/${administradorEstado.id}/estado`,
            {},
            {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    setAdministradorEstado(null);
                },
                onError: () => {
                    setErrorEstado(
                        'No se pudo cambiar el estado del administrador. Revisá los permisos e intentá nuevamente.',
                    );
                },
                onFinish: () => {
                    setCambiandoEstado(false);
                },
            },
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Administradores | Talent Match" />

            <main className="min-h-full min-w-0 overflow-x-hidden bg-slate-50/70 px-4 py-6 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl space-y-6">
                    {/* Encabezado */}
                    <header className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                            <p className="flex items-center gap-2 text-sm font-medium text-indigo-600">
                                <ShieldCheck className="size-4" />
                                Administración de Talent Match
                            </p>
                            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                                Gestión de administradores
                            </h1>
                            <p className="mt-2 text-sm text-slate-500">
                                Registrá administradores, actualizá sus datos,
                                configurá sus permisos y gestioná su estado.
                            </p>
                        </div>
                        <span className="rounded-full border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700">
                            Exclusivo Super Admin
                        </span>
                    </header>

                    {/* Mensaje de éxito */}
                    {mensaje && (
                        <div
                            role="status"
                            className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800"
                        >
                            <CheckCircle2 className="size-5 shrink-0" />
                            {mensaje}
                        </div>
                    )}

                    <div className="grid min-w-0 grid-cols-1 gap-6 2xl:grid-cols-[minmax(0,1fr)_390px]">
                        {/* Listado */}
                        <section className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                            <div className="border-b border-slate-100 p-5">
                                <div className="flex items-center justify-between">
                                    <h2 className="flex items-center gap-2 font-semibold text-slate-900">
                                        <Users className="size-5 text-indigo-600" />
                                        Administradores registrados
                                    </h2>
                                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                                        {administradores.total}
                                    </span>
                                </div>

                                <form
                                    onSubmit={buscarUsuarios}
                                    className="mt-5 flex flex-wrap gap-2"
                                >
                                    <div className="relative min-w-48 flex-1">
                                        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
                                        <Input
                                            value={buscar}
                                            onChange={(e) => setBuscar(e.target.value)}
                                            placeholder="Nombre o correo..."
                                            className="h-10 pl-9"
                                        />
                                    </div>
                                    <Button
                                        type="submit"
                                        className="bg-indigo-600 hover:bg-indigo-700"
                                    >
                                        Buscar
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={limpiarBusqueda}
                                    >
                                        Limpiar
                                    </Button>
                                </form>
                            </div>

                            {/* Tabla */}
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-slate-50 text-xs text-slate-500 uppercase">
                                        <tr>
                                            <th className="px-5 py-3 font-semibold">
                                                Administrador
                                            </th>
                                            <th className="px-5 py-3 font-semibold">
                                                Estado
                                            </th>
                                            <th className="px-5 py-3 text-right font-semibold">
                                                Acciones
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {administradores.data.map((admin) => (
                                            <tr
                                                key={admin.id}
                                                className="hover:bg-slate-50/70"
                                            >
                                                <td className="px-5 py-4">
                                                    <p className="font-semibold text-slate-800">
                                                        {admin.nombre}{' '}
                                                        {admin.apellido}
                                                    </p>
                                                    <p className="mt-1 text-xs text-slate-500">
                                                        {admin.email}
                                                    </p>
                                                    <p className="mt-1 text-xs">
                                                        {admin.email_verificado ? (
                                                            <span className="text-emerald-600">
                                                                Correo verificado
                                                            </span>
                                                        ) : (
                                                            <span className="text-amber-600">
                                                                Correo pendiente
                                                            </span>
                                                        )}
                                                    </p>
                                                </td>
                                                <td className="px-5 py-4">
                                                    <span
                                                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${admin.estado
                                                            ? 'bg-emerald-50 text-emerald-700'
                                                            : 'bg-slate-100 text-slate-500'
                                                            }`}
                                                    >
                                                        {admin.estado ? 'Activo' : 'Inactivo'}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-4">
                                                    <div className="flex flex-wrap items-center justify-end gap-2">
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => abrirEdicion(admin)}
                                                            className="gap-1.5"
                                                        >
                                                            <Pencil className="size-3.5" />
                                                            Editar
                                                        </Button>

                                                        <Link
                                                            href={`/admin/permisos?usuario=${admin.id}`}
                                                            className="inline-flex items-center gap-1 rounded-lg border border-indigo-200 px-3 py-2 text-xs font-semibold text-indigo-700 hover:bg-indigo-50"
                                                        >
                                                            Permisos
                                                            <ArrowRight className="size-3.5" />
                                                        </Link>

                                                        <Button
                                                            type="button"
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => abrirCambioEstado(admin)}
                                                            className={
                                                                admin.estado
                                                                    ? 'gap-1.5 border-amber-200 text-amber-800 hover:bg-amber-50 hover:text-amber-900'
                                                                    : 'gap-1.5 border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800'
                                                            }
                                                        >
                                                            {admin.estado ? (
                                                                <UserX className="size-3.5" />
                                                            ) : (
                                                                <UserCheck className="size-3.5" />
                                                            )}
                                                            {admin.estado ? 'Desactivar' : 'Activar'}
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                {administradores.data.length === 0 && (
                                    <div className="p-12 text-center">
                                        <Users className="mx-auto size-10 text-slate-300" />
                                        <p className="mt-3 font-medium text-slate-700">
                                            No se encontraron administradores
                                        </p>
                                        <p className="mt-1 text-sm text-slate-500">
                                            Podés registrar uno desde el formulario.
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Paginación */}
                            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 p-4">
                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                    Mostrar
                                    <select
                                        value={porPagina}
                                        onChange={(e) =>
                                            cambiarPaginacion(Number(e.target.value))
                                        }
                                        className="rounded-lg border border-slate-200 bg-white px-2 py-1.5"
                                    >
                                        <option value={5}>5</option>
                                        <option value={10}>10</option>
                                        <option value={20}>20</option>
                                    </select>
                                    por página
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="mr-2 text-xs text-slate-500">
                                        {administradores.current_page} de{' '}
                                        {administradores.last_page}
                                    </span>
                                    {administradores.prev_page_url ? (
                                        <Link
                                            href={administradores.prev_page_url}
                                            preserveScroll
                                            className="rounded-lg border border-slate-200 p-2 hover:bg-slate-50"
                                        >
                                            <ChevronLeft className="size-4" />
                                        </Link>
                                    ) : (
                                        <span className="rounded-lg border border-slate-100 p-2 text-slate-300">
                                            <ChevronLeft className="size-4" />
                                        </span>
                                    )}
                                    {administradores.next_page_url ? (
                                        <Link
                                            href={administradores.next_page_url}
                                            preserveScroll
                                            className="rounded-lg border border-slate-200 p-2 hover:bg-slate-50"
                                        >
                                            <ChevronRight className="size-4" />
                                        </Link>
                                    ) : (
                                        <span className="rounded-lg border border-slate-100 p-2 text-slate-300">
                                            <ChevronRight className="size-4" />
                                        </span>
                                    )}
                                </div>
                            </div>
                        </section>

                        {/* Registro */}
                        <section className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                            <div className="flex items-center gap-3">
                                <div className="rounded-xl bg-indigo-50 p-3">
                                    <UserPlus className="size-5 text-indigo-600" />
                                </div>
                                <div>
                                    <h2 className="font-semibold text-slate-900">
                                        Nuevo administrador
                                    </h2>
                                    <p className="text-xs text-slate-500">
                                        Crear una cuenta con rol admin
                                    </p>
                                </div>
                            </div>

                            <form
                                onSubmit={crearAdministrador}
                                className="mt-6 space-y-4"
                            >
                                <div className="space-y-1.5">
                                    <Label htmlFor="nombre">Nombre</Label>
                                    <Input
                                        id="nombre"
                                        value={data.nombre}
                                        onChange={(e) => setData('nombre', e.target.value)}
                                        required
                                    />
                                    {errors.nombre && (
                                        <p className="text-xs text-red-600">
                                            {errors.nombre}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="apellido">Apellido</Label>
                                    <Input
                                        id="apellido"
                                        value={data.apellido}
                                        onChange={(e) => setData('apellido', e.target.value)}
                                        required
                                    />
                                    {errors.apellido && (
                                        <p className="text-xs text-red-600">
                                            {errors.apellido}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="email">Correo electrónico</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        required
                                    />
                                    {errors.email && (
                                        <p className="text-xs text-red-600">
                                            {errors.email}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="password">Contraseña</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        autoComplete="new-password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        required
                                    />
                                    {errors.password && (
                                        <p className="text-xs text-red-600">
                                            {errors.password}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="password_confirmation">
                                        Confirmar contraseña
                                    </Label>
                                    <Input
                                        id="password_confirmation"
                                        type="password"
                                        autoComplete="new-password"
                                        value={data.password_confirmation}
                                        onChange={(e) =>
                                            setData('password_confirmation', e.target.value)
                                        }
                                        required
                                    />
                                    {errors.password_confirmation && (
                                        <p className="text-xs text-red-600">
                                            {errors.password_confirmation}
                                        </p>
                                    )}
                                </div>
                                <p className="text-xs leading-5 text-slate-500">
                                    La contraseña debe tener al menos 12 caracteres,
                                    mayúsculas, minúsculas, números y símbolos.
                                </p>
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="h-11 w-full bg-indigo-600 text-white hover:bg-indigo-700"
                                >
                                    <UserPlus className="mr-2 size-4" />
                                    {processing ? 'Registrando...' : 'Crear administrador'}
                                </Button>
                            </form>

                            <div className="mt-5 flex gap-3 rounded-xl border border-indigo-100 bg-indigo-50/60 p-4">
                                <Mail className="size-5 shrink-0 text-indigo-600" />
                                <p className="text-xs leading-5 text-indigo-800">
                                    La cuenta se crea con el rol administrador.
                                    Su correo deberá verificarse antes de acceder
                                    a las funciones administrativas.
                                </p>
                            </div>
                        </section>
                    </div>
                </div>
            </main>

            {/* Modal: editar administrador */}
            <Dialog
                open={administradorEditando !== null}
                onOpenChange={(open) => {
                    if (!open) cerrarEdicion();
                }}
            >
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Pencil className="size-5 text-indigo-600" />
                            Editar administrador
                        </DialogTitle>
                        <DialogDescription>
                            Actualizá el nombre y apellido del administrador
                            seleccionado. Su correo, contraseña y permisos no
                            se modificarán.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={actualizarAdministrador} className="space-y-5">
                        <div className="space-y-1.5">
                            <Label>Correo electrónico</Label>
                            <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
                                {administradorEditando?.email}
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="editar_nombre">Nombre</Label>
                            <Input
                                id="editar_nombre"
                                value={datosEdicion.nombre}
                                onChange={(e) => setDatosEdicion('nombre', e.target.value)}
                                required
                                maxLength={100}
                                aria-invalid={Boolean(erroresEdicion.nombre)}
                            />
                            {erroresEdicion.nombre && (
                                <p className="text-xs text-red-600">
                                    {erroresEdicion.nombre}
                                </p>
                            )}
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="editar_apellido">Apellido</Label>
                            <Input
                                id="editar_apellido"
                                value={datosEdicion.apellido}
                                onChange={(e) => setDatosEdicion('apellido', e.target.value)}
                                required
                                maxLength={100}
                                aria-invalid={Boolean(erroresEdicion.apellido)}
                            />
                            {erroresEdicion.apellido && (
                                <p className="text-xs text-red-600">
                                    {erroresEdicion.apellido}
                                </p>
                            )}
                        </div>
                        <DialogFooter className="gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={cerrarEdicion}
                                disabled={actualizando}
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                disabled={actualizando}
                                className="bg-indigo-600 text-white hover:bg-indigo-700"
                            >
                                {actualizando ? 'Guardando...' : 'Guardar cambios'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Modal: activar/desactivar administrador */}
            <Dialog
                open={administradorEstado !== null}
                onOpenChange={(open) => {
                    if (!open) cerrarCambioEstado();
                }}
            >
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            {vaAActivar ? (
                                <UserCheck className="size-5 text-emerald-600" />
                            ) : (
                                <UserX className="size-5 text-amber-600" />
                            )}
                            {vaAActivar
                                ? 'Activar administrador'
                                : 'Desactivar administrador'}
                        </DialogTitle>
                        <DialogDescription>
                            {vaAActivar
                                ? 'La cuenta volverá a estar activa. El usuario podrá ingresar si cumple las demás condiciones de acceso.'
                                : 'La cuenta quedará inactiva. El administrador no podrá iniciar sesión y las sesiones existentes serán rechazadas en su siguiente solicitud web.'}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm">
                        <p className="font-semibold text-slate-900">
                            {administradorEstado?.nombre}{' '}
                            {administradorEstado?.apellido}
                        </p>
                        <p className="mt-1 text-slate-600">
                            {administradorEstado?.email}
                        </p>
                    </div>

                    <form onSubmit={confirmarCambioEstado} className="space-y-4">
                        {errorEstado && (
                            <p role="alert" className="text-sm text-red-600">
                                {errorEstado}
                            </p>
                        )}
                        <DialogFooter className="gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                disabled={cambiandoEstado}
                                onClick={cerrarCambioEstado}
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                disabled={cambiandoEstado}
                                className={
                                    vaAActivar
                                        ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                                        : 'bg-amber-600 text-white hover:bg-amber-700'
                                }
                            >
                                {cambiandoEstado
                                    ? 'Procesando...'
                                    : vaAActivar
                                        ? 'Confirmar activación'
                                        : 'Confirmar desactivación'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
