import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    Building2,
    CheckCircle2,
    Globe2,
    Mail,
    Phone,
    ContactRound,
    ImageUp,
    LoaderCircle,
    MapPin,
    Save,
    Share2,
    Trash2,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { DescripcionEditor } from '@/components/empresa/descripcion-editor';
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import {
    FaDiscord,
    FaFacebookF,
    FaGithub,
    FaInstagram,
    FaLinkedinIn,
    FaPinterestP,
    FaTelegram,
    FaTiktok,
    FaWhatsapp,
    FaXTwitter,
    FaYoutube,
} from 'react-icons/fa6';

interface Pais {
    id: number;
    nombre: string;
    codigo_iso: string;
}

interface Ubicacion {
    id: number;
    nombre: string;
}

interface Catalogo {
    id: number;
    nombre: string;
}

interface Empresa {
    id: number;
    nombre_comercial: string;
    razon_social: string | null;
    cuit: string | null;
    descripcion: string | null;
    sitio_web: string | null;
    pais_id: number | null;
    provincia_id: number | null;
    ciudad_id: number | null;
    industria_id: number | null;
    cantidad_de_empleados_id: number | null;
    direccion: string | null;
    contacto?: {
        id: number;
        email: string | null;
        telefono: string | null;
        estado: boolean | number;
    } | null;
}

interface RedSocialCatalogo {
    id: number;
    nombre: string;
    icono: string | null;
}

interface RedSocialEmpresa {
    id: number;
    red_social_id: number;
    nombre: string;
    url_perfil: string;
    estado: boolean | number;
    catalogo_activo: boolean | number;
    icono: string | null;
}

interface Props {
    empresa: Empresa;
    logoUrl: string | null;
    paises: Pais[];
    industrias: Catalogo[];
    cantidadesEmpleados: Catalogo[];
    redesDisponibles: RedSocialCatalogo[];
    redesEmpresa: RedSocialEmpresa[];
}

/**
 * Iconos corporativos: interpreta el nombre y el campo icono del catálogo.
 * No inserta HTML recibido desde la base de datos.
 */
function IconoRedSocial({
    nombre,
    icono,
    className = 'size-5',
}: {
    nombre: string;
    icono?: string | null;
    className?: string;
}) {
    const etiqueta = `${nombre} ${icono ?? ''}`
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();

    const marcas = [
        { coincide: /facebook|fa-facebook/, Icono: FaFacebookF, color: 'text-blue-600' },
        { coincide: /instagram|fa-instagram/, Icono: FaInstagram, color: 'text-pink-600' },
        { coincide: /linkedin|fa-linkedin/, Icono: FaLinkedinIn, color: 'text-blue-700' },
        { coincide: /twitter|x-twitter|\bx\b/, Icono: FaXTwitter, color: 'text-slate-900' },
        { coincide: /youtube|fa-youtube/, Icono: FaYoutube, color: 'text-red-600' },
        { coincide: /tiktok|tik-tok/, Icono: FaTiktok, color: 'text-slate-900' },
        { coincide: /whatsapp|what.?sapp/, Icono: FaWhatsapp, color: 'text-green-600' },
        { coincide: /telegram/, Icono: FaTelegram, color: 'text-sky-500' },
        { coincide: /pinterest/, Icono: FaPinterestP, color: 'text-red-600' },
        { coincide: /github/, Icono: FaGithub, color: 'text-slate-900' },
        { coincide: /discord/, Icono: FaDiscord, color: 'text-indigo-600' },
    ];
    const encontrada = marcas.find(({ coincide }) => coincide.test(etiqueta));
    if (encontrada) {
        const Icono = encontrada.Icono;
        return <Icono aria-hidden="true" className={`${className} ${encontrada.color}`} />;
    }
    return <Globe2 aria-hidden="true" className={`${className} text-slate-500`} />;
}

const inputClass =
    'mt-2 block w-full rounded-lg border border-slate-300 bg-white px-3 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500';
const labelClass = 'block text-sm font-medium text-slate-700';
const buttonPrimary =
    'inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50';

function MensajeError({ mensaje }: { mensaje?: string }) {
    return mensaje ? (
        <p className="mt-2 text-sm text-red-600" role="alert">
            {mensaje}
        </p>
    ) : null;
}

function Seccion({
    icono: Icono,
    titulo,
    descripcion,
    children,
}: {
    icono: LucideIcon;
    titulo: string;
    descripcion: string;
    children: ReactNode;
}) {
    return (
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
                <Icono className="size-5 shrink-0 text-indigo-600" />
                <div>
                    <h3 className="text-lg font-semibold text-slate-900">
                        {titulo}
                    </h3>
                    <p className="text-sm text-slate-500">{descripcion}</p>
                </div>
            </div>
            {children}
        </section>
    );
}

export default function Edit({
    empresa,
    logoUrl,
    paises,
    industrias,
    cantidadesEmpleados,
    redesDisponibles,
    redesEmpresa,

}: Props) {
    // Este formulario guarda únicamente los datos generales de la empresa.
    const {
        data,
        setData,
        put,
        processing,
        errors,
        recentlySuccessful,
    } = useForm({
        nombre_comercial: empresa.nombre_comercial ?? '',
        razon_social: empresa.razon_social ?? '',
        cuit: empresa.cuit ?? '',
        descripcion: empresa.descripcion ?? '',
        sitio_web: empresa.sitio_web ?? '',
        pais_id: empresa.pais_id === null ? '' : String(empresa.pais_id),
        provincia_id:
            empresa.provincia_id === null ? '' : String(empresa.provincia_id),
        ciudad_id: empresa.ciudad_id === null ? '' : String(empresa.ciudad_id),
        industria_id:
            empresa.industria_id === null ? '' : String(empresa.industria_id),
        cantidad_de_empleados_id:
            empresa.cantidad_de_empleados_id === null
                ? ''
                : String(empresa.cantidad_de_empleados_id),
        direccion: empresa.direccion ?? '',
    });

    const [provincias, setProvincias] = useState<Ubicacion[]>([]);
    const [ciudades, setCiudades] = useState<Ubicacion[]>([]);
    const [cargandoProvincias, setCargandoProvincias] = useState(false);
    const [cargandoCiudades, setCargandoCiudades] = useState(false);
    const [errorProvincias, setErrorProvincias] = useState<string | null>(null);
    const [errorCiudades, setErrorCiudades] = useState<string | null>(null);

    const paisSeleccionado = paises.find(
        (pais) => String(pais.id) === data.pais_id,
    );
    const esArgentina =
        paisSeleccionado?.codigo_iso.toUpperCase() === 'AR';

    // Provincias habilitadas, con cancelación si cambia el país.
    useEffect(() => {
        if (!esArgentina) {
            setProvincias([]);
            setCargandoProvincias(false);
            setErrorProvincias(null);
            return;
        }

        const controller = new AbortController();
        setCargandoProvincias(true);
        setErrorProvincias(null);

        async function cargar() {
            try {
                const respuesta = await fetch(
                    '/registro/ubicaciones/provincias',
                    {
                        signal: controller.signal,
                        headers: { Accept: 'application/json' },
                    },
                );
                if (!respuesta.ok) {
                    throw new Error('No se pudieron cargar las provincias.');
                }
                const resultado: Ubicacion[] = await respuesta.json();
                if (!controller.signal.aborted) setProvincias(resultado);
            } catch {
                if (!controller.signal.aborted) {
                    setProvincias([]);
                    setErrorProvincias('No se pudieron cargar las provincias.');
                }
            } finally {
                if (!controller.signal.aborted) setCargandoProvincias(false);
            }
        }

        void cargar();
        return () => controller.abort();
    }, [esArgentina]);

    // Ciudades habilitadas para la provincia seleccionada.
    useEffect(() => {
        if (!esArgentina || !data.provincia_id) {
            setCiudades([]);
            setCargandoCiudades(false);
            setErrorCiudades(null);
            return;
        }

        const controller = new AbortController();
        setCargandoCiudades(true);
        setErrorCiudades(null);

        async function cargar() {
            try {
                const respuesta = await fetch(
                    '/registro/ubicaciones/ciudades?provincia_id=' +
                    encodeURIComponent(data.provincia_id),
                    {
                        signal: controller.signal,
                        headers: { Accept: 'application/json' },
                    },
                );
                if (!respuesta.ok) {
                    throw new Error('No se pudieron cargar las ciudades.');
                }
                const resultado: Ubicacion[] = await respuesta.json();
                if (!controller.signal.aborted) setCiudades(resultado);
            } catch {
                if (!controller.signal.aborted) {
                    setCiudades([]);
                    setErrorCiudades('No se pudieron cargar las ciudades.');
                }
            } finally {
                if (!controller.signal.aborted) setCargandoCiudades(false);
            }
        }

        void cargar();
        return () => controller.abort();
    }, [esArgentina, data.provincia_id]);

    function cambiarPais(paisId: string) {
        setData((actual) => ({
            ...actual,
            pais_id: paisId,
            provincia_id: '',
            ciudad_id: '',
        }));
        setProvincias([]);
        setCiudades([]);
        setErrorProvincias(null);
        setErrorCiudades(null);
    }

    function cambiarProvincia(provinciaId: string) {
        setData((actual) => ({
            ...actual,
            provincia_id: provinciaId,
            ciudad_id: '',
        }));
        setCiudades([]);
        setErrorCiudades(null);
    }

    function guardarPerfil(evento: FormEvent<HTMLFormElement>) {
        evento.preventDefault();
        put(`/empresa/${empresa.id}/perfil`, { preserveScroll: true });
    }

    const ubicacionPendiente =
        !data.pais_id ||
        (esArgentina && (!data.provincia_id || !data.ciudad_id));

    // Formulario independiente para los datos de contacto institucional.
    const contactoForm = useForm({
        email: empresa.contacto?.email ?? '',
        telefono: empresa.contacto?.telefono ?? '',
    });
    const [mensajeContacto, setMensajeContacto] = useState('');

    function guardarContacto(evento: FormEvent<HTMLFormElement>) {
        evento.preventDefault();
        setMensajeContacto('');
        contactoForm.put(`/empresa/${empresa.id}/contacto`, {
            preserveScroll: true,
            onSuccess: () => {
                setMensajeContacto('Información de contacto guardada correctamente.');
            },
        });
    }

    // Este segundo formulario maneja solo las redes sociales.
    const redesForm = useForm({ red_social_id: '', url_perfil: '' });
    const [editandoRedId, setEditandoRedId] = useState<number | null>(null);
    const [operandoRedId, setOperandoRedId] = useState<number | null>(null);
    const [mensajeRed, setMensajeRed] = useState('');
    const [errorAccionRed, setErrorAccionRed] = useState('');

    const redesAgregables = redesDisponibles.filter(
        (catalogo) =>
            !redesEmpresa.some(
                (red) =>
                    red.red_social_id === catalogo.id && Boolean(red.estado),
            ),
    );

    function limpiarFormularioRed() {
        setEditandoRedId(null);
        redesForm.reset();
        redesForm.clearErrors();
    }

    function iniciarEdicionRed(red: RedSocialEmpresa) {
        setEditandoRedId(red.id);
        redesForm.setData({
            red_social_id: String(red.red_social_id),
            url_perfil: red.url_perfil,
        });
        redesForm.clearErrors();
        setMensajeRed('');
        setErrorAccionRed('');
    }

    function guardarRed(evento: FormEvent<HTMLFormElement>) {
        evento.preventDefault();
        setMensajeRed('');
        setErrorAccionRed('');

        if (editandoRedId !== null) {
            redesForm.put(
                `/empresa/${empresa.id}/redes-sociales/${editandoRedId}`,
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        limpiarFormularioRed();
                        setMensajeRed('Red social actualizada correctamente.');
                    },
                },
            );
            return;
        }

        redesForm.post(`/empresa/${empresa.id}/redes-sociales`, {
            preserveScroll: true,
            onSuccess: () => {
                limpiarFormularioRed();
                setMensajeRed('Red social agregada o reactivada correctamente.');
            },
        });
    }

    function desactivarRed(red: RedSocialEmpresa) {
        if (!window.confirm(`¿Querés desactivar ${red.nombre}?`)) return;
        setMensajeRed('');
        setErrorAccionRed('');
        setOperandoRedId(red.id);

        router.delete(`/empresa/${empresa.id}/redes-sociales/${red.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                limpiarFormularioRed();
                setMensajeRed('Red social desactivada correctamente.');
            },
            onError: () => setErrorAccionRed('No se pudo desactivar la red social.'),
            onFinish: () => setOperandoRedId(null),
        });
    }

    function reactivarRed(red: RedSocialEmpresa) {
        setMensajeRed('');
        setErrorAccionRed('');
        setOperandoRedId(red.id);

        router.post(
            `/empresa/${empresa.id}/redes-sociales`,
            { red_social_id: red.red_social_id, url_perfil: red.url_perfil },
            {
                preserveScroll: true,
                onSuccess: () => {
                    limpiarFormularioRed();
                    setMensajeRed('Red social reactivada correctamente.');
                },
                onError: () =>
                    setErrorAccionRed('No se pudo reactivar la red social.'),
                onFinish: () => setOperandoRedId(null),
            },
        );
    }

    const redSeleccionada = redesEmpresa.find((red) => red.id === editandoRedId);
    const redParaVistaPrevia = editandoRedId !== null
        ? redesEmpresa.find((red) => red.id === editandoRedId)
        : redesDisponibles.find(
            (red) => String(red.id) === redesForm.data.red_social_id,
        );
    const redExistenteInactiva = redesEmpresa.find(
        (red) =>
            String(red.red_social_id) === redesForm.data.red_social_id &&
            !Boolean(red.estado),
    );
    const redesOcupadas = operandoRedId !== null || redesForm.processing;

    // Formulario independiente: el logo no modifica los datos generales.
    const logoForm = useForm({ logo: null as File | null });
    const logoInputRef = useRef<HTMLInputElement>(null);
    const [vistaPreviaLogo, setVistaPreviaLogo] = useState<string | null>(null);
    const [eliminandoLogo, setEliminandoLogo] = useState(false);
    const [mensajeLogo, setMensajeLogo] = useState('');
    const [errorAccionLogo, setErrorAccionLogo] = useState('');

    // Liberar la URL temporal cuando se cambie de archivo o se desmonte.
    useEffect(() => {
        if (!logoForm.data.logo) {
            setVistaPreviaLogo(null);
            return;
        }
        const temporal = URL.createObjectURL(logoForm.data.logo);
        setVistaPreviaLogo(temporal);
        return () => URL.revokeObjectURL(temporal);
    }, [logoForm.data.logo]);

    function guardarLogo(evento: FormEvent<HTMLFormElement>) {
        evento.preventDefault();
        if (!logoForm.data.logo) return;
        setMensajeLogo('');
        setErrorAccionLogo('');

        logoForm.post(`/empresa/${empresa.id}/logo`, {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => {
                logoForm.reset();
                if (logoInputRef.current) logoInputRef.current.value = '';
                setMensajeLogo('Logo empresarial actualizado correctamente.');
            },
            onError: () => setErrorAccionLogo('Revisá el archivo seleccionado.'),
        });
    }

    function eliminarLogo() {
        if (!logoUrl || eliminandoLogo || logoForm.processing) return;
        if (!window.confirm('¿Querés eliminar el logo de esta empresa?')) return;
        setMensajeLogo('');
        setErrorAccionLogo('');
        setEliminandoLogo(true);

        router.delete(`/empresa/${empresa.id}/logo`, {
            preserveScroll: true,
            onSuccess: () => {
                logoForm.reset();
                if (logoInputRef.current) logoInputRef.current.value = '';
                setMensajeLogo('Logo eliminado correctamente.');
            },
            onError: () => setErrorAccionLogo('No se pudo eliminar el logo.'),
            onFinish: () => setEliminandoLogo(false),
        });
    }

    // Cada pestaña tiene su propio formulario y su propio botón de guardado.
    const [pestanaActiva, setPestanaActiva] = useState<'datos' | 'contacto' | 'redes'>('datos');

    return (
        <>
            <Head title={`Perfil de ${empresa.nombre_comercial} - Talent Match`} />

            <main className="min-h-screen bg-slate-50 text-slate-900">
                <header className="border-b border-slate-200 bg-white">
                    <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-5">
                        <div className="flex items-center gap-3">
                            <div className="rounded-xl bg-indigo-600 p-3 text-white">
                                <Building2 className="size-6" />
                            </div>
                            <div>
                                <h1 className="font-bold">Talent Match</h1>
                                <p className="text-xs text-slate-500">
                                    Administración empresarial
                                </p>
                            </div>
                        </div>
                        <Link
                            href="/empresa/dashboard"
                            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-indigo-600"
                        >
                            <ArrowLeft className="size-4" />
                            Volver al dashboard
                        </Link>
                    </div>
                </header>

                <div className="mx-auto max-w-5xl space-y-6 px-6 py-10">
                    <div>
                        <p className="mb-2 text-sm font-medium text-indigo-600">
                            Mi empresa / Perfil empresarial
                        </p>
                        <h2 className="text-3xl font-bold tracking-tight">
                            {empresa.nombre_comercial}
                        </h2>
                        <p className="mt-2 text-slate-500">
                            Completá los datos institucionales y la ubicación de tu empresa.
                        </p>
                    </div>

                    {/* Navegación entre formularios independientes. */}
                    <nav aria-label="Secciones del perfil empresarial" className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
                        <button
                            type="button"
                            aria-pressed={pestanaActiva === 'datos'}
                            onClick={() => setPestanaActiva('datos')}
                            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition ${pestanaActiva === 'datos'
                                    ? 'bg-indigo-600 text-white shadow-sm'
                                    : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50'
                                }`}
                        >
                            <Building2 className="size-4" />
                            Datos de la empresa
                        </button>
                        <button
                            type="button"
                            aria-pressed={pestanaActiva === 'contacto'}
                            onClick={() => setPestanaActiva('contacto')}
                            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition ${pestanaActiva === 'contacto'
                                    ? 'bg-indigo-600 text-white shadow-sm'
                                    : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50'
                                }`}
                        >
                            <ContactRound className="size-4" />
                            Información de contacto
                        </button>
                        <button
                            type="button"
                            aria-pressed={pestanaActiva === 'redes'}
                            onClick={() => setPestanaActiva('redes')}
                            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition ${pestanaActiva === 'redes'
                                    ? 'bg-indigo-600 text-white shadow-sm'
                                    : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50'
                                }`}
                        >
                            <Share2 className="size-4" />
                            Redes sociales
                        </button>
                    </nav>

                    {pestanaActiva === 'datos' && (
                        <>
                            {ubicacionPendiente && (
                                <div role="status" className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                                    La ubicación empresarial está pendiente. Será necesaria
                                    antes de publicar ofertas laborales.
                                </div>
                            )}

                            {recentlySuccessful && (
                                <div role="status" className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
                                    <CheckCircle2 className="size-5" />
                                    Perfil empresarial actualizado correctamente.
                                </div>
                            )}

                            {/* El logo tiene un formulario separado del resto del perfil. */}
                            <Seccion
                                icono={ImageUp}
                                titulo="Identidad visual"
                                descripcion="Este logo identificará a la empresa en sus ofertas laborales."
                            >
                                <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
                                    <div className="flex size-36 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-3">
                                        {vistaPreviaLogo || logoUrl ? (
                                            <img
                                                src={vistaPreviaLogo ?? logoUrl ?? undefined}
                                                alt={`Logo de ${empresa.nombre_comercial}`}
                                                className="h-full w-full object-contain"
                                            />
                                        ) : (
                                            <div className="flex flex-col items-center gap-2 text-slate-400">
                                                <Building2 className="size-12" aria-hidden="true" />
                                                <span className="text-xs">Sin logo</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="min-w-0 flex-1 space-y-4">
                                        <form onSubmit={guardarLogo} className="space-y-3">
                                            <div>
                                                <label htmlFor="logo_empresa" className={labelClass}>
                                                    Subir o reemplazar logo
                                                </label>
                                                <input
                                                    ref={logoInputRef}
                                                    id="logo_empresa"
                                                    type="file"
                                                    accept="image/jpeg,image/png,image/webp"
                                                    onChange={(evento) => {
                                                        logoForm.setData('logo', evento.target.files?.[0] ?? null);
                                                        logoForm.clearErrors();
                                                        setMensajeLogo('');
                                                        setErrorAccionLogo('');
                                                    }}
                                                    disabled={logoForm.processing || eliminandoLogo}
                                                    className={`${inputClass} file:mr-3 file:rounded-md file:border-0 file:bg-indigo-50 file:px-3 file:py-2 file:font-medium file:text-indigo-700`}
                                                />
                                                <p className="mt-2 text-xs text-slate-500">
                                                    JPG, PNG o WebP. Máximo 2 MB. Recomendado: imagen cuadrada y fondo transparente.
                                                </p>
                                                <MensajeError mensaje={logoForm.errors.logo} />
                                            </div>

                                            {logoForm.progress && (
                                                <div>
                                                    <progress
                                                        value={logoForm.progress.percentage}
                                                        max="100"
                                                        className="h-2 w-full"
                                                    />
                                                    <p className="text-xs text-slate-500">
                                                        Subiendo: {logoForm.progress.percentage}%
                                                    </p>
                                                </div>
                                            )}

                                            <div className="flex flex-wrap gap-3">
                                                <button
                                                    type="submit"
                                                    disabled={!logoForm.data.logo || logoForm.processing || eliminandoLogo}
                                                    className={buttonPrimary}
                                                >
                                                    {logoForm.processing ? (
                                                        <LoaderCircle className="size-4 animate-spin" />
                                                    ) : (
                                                        <ImageUp className="size-4" />
                                                    )}
                                                    {logoForm.processing ? 'Subiendo...' : 'Guardar logo'}
                                                </button>
                                            </div>
                                        </form>

                                        {logoUrl && (
                                            <button
                                                type="button"
                                                onClick={eliminarLogo}
                                                disabled={logoForm.processing || eliminandoLogo}
                                                className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                                            >
                                                <Trash2 className="size-4" />
                                                {eliminandoLogo ? 'Eliminando...' : 'Eliminar logo actual'}
                                            </button>
                                        )}
                                    </div>
                                </div>
                                {mensajeLogo && (
                                    <p role="status" className="mt-4 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">
                                        {mensajeLogo}
                                    </p>
                                )}
                                {errorAccionLogo && (
                                    <p role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                                        {errorAccionLogo}
                                    </p>
                                )}
                            </Seccion>

                            {/* FORMULARIO 1: Perfil empresarial. */}
                            <form onSubmit={guardarPerfil} className="space-y-6">
                                <Seccion
                                    icono={Building2}
                                    titulo="Identificación empresarial"
                                    descripcion="Datos principales de la empresa."
                                >
                                    <div className="grid gap-5 md:grid-cols-2">
                                        <div>
                                            <label htmlFor="nombre_comercial" className={labelClass}>Nombre comercial *</label>
                                            <input
                                                id="nombre_comercial"
                                                value={data.nombre_comercial}
                                                onChange={(e) => setData('nombre_comercial', e.target.value)}
                                                required
                                                maxLength={150}
                                                className={inputClass}
                                            />
                                            <MensajeError mensaje={errors.nombre_comercial} />
                                        </div>
                                        <div>
                                            <label htmlFor="razon_social" className={labelClass}>Razón social</label>
                                            <input
                                                id="razon_social"
                                                value={data.razon_social}
                                                onChange={(e) => setData('razon_social', e.target.value)}
                                                maxLength={200}
                                                className={inputClass}
                                            />
                                            <MensajeError mensaje={errors.razon_social} />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label htmlFor="cuit" className={labelClass}>CUIT</label>
                                            <input
                                                id="cuit"
                                                value={data.cuit}
                                                onChange={(e) => setData('cuit', e.target.value)}
                                                inputMode="numeric"
                                                maxLength={11}
                                                placeholder="11 dígitos, sin guiones"
                                                className={inputClass}
                                            />
                                            <MensajeError mensaje={errors.cuit} />
                                        </div>
                                    </div>
                                </Seccion>

                                <Seccion
                                    icono={Building2}
                                    titulo="Clasificación empresarial"
                                    descripcion="Indicá el sector económico y el tamaño de tu empresa."
                                >
                                    <div className="grid gap-5 md:grid-cols-2">
                                        <div>
                                            <label htmlFor="industria_id" className={labelClass}>Industria principal</label>
                                            <select
                                                id="industria_id"
                                                value={data.industria_id}
                                                onChange={(e) => setData('industria_id', e.target.value)}
                                                className={inputClass}
                                            >
                                                <option value="">Seleccionar industria</option>
                                                {industrias.map((industria) => (
                                                    <option key={industria.id} value={industria.id}>
                                                        {industria.nombre}
                                                    </option>
                                                ))}
                                            </select>
                                            <MensajeError mensaje={errors.industria_id} />
                                        </div>
                                        <div>
                                            <label htmlFor="cantidad_de_empleados_id" className={labelClass}>Cantidad de empleados</label>
                                            <select
                                                id="cantidad_de_empleados_id"
                                                value={data.cantidad_de_empleados_id}
                                                onChange={(e) => setData('cantidad_de_empleados_id', e.target.value)}
                                                className={inputClass}
                                            >
                                                <option value="">Seleccionar cantidad de empleados</option>
                                                {cantidadesEmpleados.map((cantidad) => (
                                                    <option key={cantidad.id} value={cantidad.id}>
                                                        {cantidad.nombre}
                                                    </option>
                                                ))}
                                            </select>
                                            <MensajeError mensaje={errors.cantidad_de_empleados_id} />
                                        </div>
                                    </div>
                                </Seccion>

                                <Seccion
                                    icono={MapPin}
                                    titulo="Ubicación empresarial"
                                    descripcion="Seleccioná el país donde está radicada tu empresa."
                                >
                                    <div className="grid gap-5 md:grid-cols-2">
                                        <div className="md:col-span-2">
                                            <label htmlFor="pais_id" className={labelClass}>País *</label>
                                            <select
                                                id="pais_id"
                                                value={data.pais_id}
                                                onChange={(e) => cambiarPais(e.target.value)}
                                                required
                                                className={inputClass}
                                            >
                                                <option value="">Seleccionar país</option>
                                                {paises.map((pais) => (
                                                    <option key={pais.id} value={pais.id}>{pais.nombre}</option>
                                                ))}
                                            </select>
                                            <MensajeError mensaje={errors.pais_id} />
                                        </div>
                                        <div>
                                            <label htmlFor="provincia_id" className={labelClass}>Provincia {esArgentina ? '*' : ''}</label>
                                            <select
                                                id="provincia_id"
                                                value={data.provincia_id}
                                                onChange={(e) => cambiarProvincia(e.target.value)}
                                                disabled={!esArgentina || cargandoProvincias || provincias.length === 0}
                                                required={esArgentina}
                                                className={inputClass}
                                            >
                                                <option value="">
                                                    {cargandoProvincias ? 'Cargando provincias...' : 'Seleccionar provincia'}
                                                </option>
                                                {provincias.map((provincia) => (
                                                    <option key={provincia.id} value={provincia.id}>{provincia.nombre}</option>
                                                ))}
                                            </select>
                                            <MensajeError mensaje={errors.provincia_id} />
                                            <MensajeError mensaje={errorProvincias ?? undefined} />
                                        </div>
                                        <div>
                                            <label htmlFor="ciudad_id" className={labelClass}>Ciudad {esArgentina ? '*' : ''}</label>
                                            <select
                                                id="ciudad_id"
                                                value={data.ciudad_id}
                                                onChange={(e) => setData('ciudad_id', e.target.value)}
                                                disabled={!esArgentina || !data.provincia_id || cargandoCiudades || ciudades.length === 0}
                                                required={esArgentina}
                                                className={inputClass}
                                            >
                                                <option value="">
                                                    {cargandoCiudades ? 'Cargando ciudades...' : 'Seleccionar ciudad'}
                                                </option>
                                                {ciudades.map((ciudad) => (
                                                    <option key={ciudad.id} value={ciudad.id}>{ciudad.nombre}</option>
                                                ))}
                                            </select>
                                            <MensajeError mensaje={errors.ciudad_id} />
                                            <MensajeError mensaje={errorCiudades ?? undefined} />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label htmlFor="direccion" className={labelClass}>
                                                Dirección de la empresa
                                                <span className="ml-2 text-xs font-normal text-slate-400">
                                                    Opcional
                                                </span>
                                            </label>
                                            <input
                                                id="direccion"
                                                name="direccion"
                                                type="text"
                                                value={data.direccion}
                                                onChange={(e) => setData('direccion', e.target.value)}
                                                placeholder="Ej. Av. Belgrano 1250, piso 2, oficina B"
                                                maxLength={255}
                                                className={inputClass}
                                            />
                                            <MensajeError mensaje={errors.direccion} />
                                            <p className="mt-2 text-xs text-slate-500">
                                                Podés indicar la calle, número, piso u oficina de tu empresa.
                                            </p>
                                        </div>
                                    </div>
                                    <p className="mt-5 rounded-lg bg-slate-50 p-3 text-sm text-slate-600">
                                        {esArgentina
                                            ? 'Para las empresas de Argentina, seleccioná provincia y ciudad. También podés agregar una dirección física de manera opcional.'
                                            : 'Si tu empresa está ubicada fuera de Argentina, podés escribir su dirección física en el campo Dirección de la empresa. No es necesario seleccionar provincia ni ciudad.'}
                                    </p>
                                </Seccion>

                                <Seccion
                                    icono={Globe2}
                                    titulo="Información institucional"
                                    descripcion="Presentá tu empresa a los candidatos."
                                >
                                    <div className="space-y-5">
                                        <div>
                                            <label htmlFor="descripcion" className={labelClass}>Descripción de la empresa</label>
                                            <DescripcionEditor
                                                value={data.descripcion}
                                                onChange={(html) => setData('descripcion', html)}
                                                disabled={processing}
                                            />
                                            <p className="mt-2 text-xs text-slate-500">
                                                Presentá a tu empresa con subtítulos, negritas,
                                                listas y enlaces. Máximo 5.000 caracteres de texto.
                                            </p>
                                            <MensajeError mensaje={errors.descripcion} />
                                        </div>
                                        <div>
                                            <label htmlFor="sitio_web" className={labelClass}>Sitio web</label>
                                            <input
                                                id="sitio_web"
                                                type="url"
                                                value={data.sitio_web}
                                                onChange={(e) => setData('sitio_web', e.target.value)}
                                                placeholder="https://www.empresa.com"
                                                className={inputClass}
                                            />
                                            <MensajeError mensaje={errors.sitio_web} />
                                        </div>
                                    </div>
                                </Seccion>

                                <div className="flex flex-wrap items-center justify-between gap-4">
                                    <Link href="/empresa/dashboard" className="text-sm font-medium text-slate-600 hover:text-indigo-600">
                                        Cancelar y volver
                                    </Link>
                                    <button
                                        type="submit"
                                        disabled={
                                            processing ||
                                            (esArgentina && (
                                                cargandoProvincias || cargandoCiudades ||
                                                Boolean(errorProvincias) || Boolean(errorCiudades)
                                            ))
                                        }
                                        className={buttonPrimary}
                                    >
                                        {processing ? (
                                            <LoaderCircle className="size-4 animate-spin" />
                                        ) : (
                                            <Save className="size-4" />
                                        )}
                                        {processing ? 'Guardando...' : 'Guardar datos de la empresa'}
                                    </button>
                                </div>
                            </form>
                        </>
                    )}

                    {pestanaActiva === 'contacto' && (
                        <Seccion
                            icono={ContactRound}
                            titulo="Información de contacto empresarial"
                            descripcion="Administrá los canales de contacto institucionales de tu empresa, independientemente de los datos personales del representante."
                        >
                            <form onSubmit={guardarContacto} className="space-y-6">
                                <div className="rounded-lg border border-indigo-100 bg-indigo-50 px-4 py-3 text-sm text-indigo-900">
                                    Tanto el correo electrónico como el teléfono son opcionales. Podés completar uno, ambos o dejarlos vacíos.
                                </div>

                                {mensajeContacto && (
                                    <div role="status" className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
                                        <CheckCircle2 className="size-5 shrink-0" />
                                        {mensajeContacto}
                                    </div>
                                )}

                                <div className="grid gap-5 md:grid-cols-2">
                                    <div>
                                        <label htmlFor="contacto_email" className={labelClass}>
                                            <span className="inline-flex items-center gap-2"><Mail className="size-4 text-indigo-600" /> Correo electrónico</span>
                                            <span className="ml-2 text-xs font-normal text-slate-400">Opcional</span>
                                        </label>
                                        <input
                                            id="contacto_email"
                                            type="email"
                                            autoComplete="email"
                                            maxLength={255}
                                            placeholder="contacto@empresa.com"
                                            value={contactoForm.data.email}
                                            onChange={(e) => {
                                                contactoForm.setData('email', e.target.value);
                                                setMensajeContacto('');
                                            }}
                                            disabled={contactoForm.processing}
                                            aria-invalid={Boolean(contactoForm.errors.email)}
                                            className={inputClass}
                                        />
                                        <MensajeError mensaje={contactoForm.errors.email} />
                                    </div>
                                    <div>
                                        <label htmlFor="contacto_telefono" className={labelClass}>
                                            <span className="inline-flex items-center gap-2"><Phone className="size-4 text-indigo-600" /> Teléfono empresarial</span>
                                            <span className="ml-2 text-xs font-normal text-slate-400">Opcional</span>
                                        </label>
                                        <input
                                            id="contacto_telefono"
                                            type="tel"
                                            autoComplete="tel"
                                            maxLength={30}
                                            placeholder="+54 387 4567890"
                                            value={contactoForm.data.telefono}
                                            onChange={(e) => {
                                                contactoForm.setData('telefono', e.target.value);
                                                setMensajeContacto('');
                                            }}
                                            disabled={contactoForm.processing}
                                            aria-invalid={Boolean(contactoForm.errors.telefono)}
                                            className={inputClass}
                                        />
                                        <MensajeError mensaje={contactoForm.errors.telefono} />
                                    </div>
                                </div>

                                <div className="flex justify-end border-t border-slate-100 pt-5">
                                    <button type="submit" disabled={contactoForm.processing} className={buttonPrimary}>
                                        {contactoForm.processing ? <LoaderCircle className="size-4 animate-spin" /> : <Save className="size-4" />}
                                        {contactoForm.processing ? 'Guardando...' : 'Guardar información de contacto'}
                                    </button>
                                </div>
                            </form>
                        </Seccion>
                    )}

                    {pestanaActiva === 'redes' && (
                        <Seccion
                            icono={Share2}
                            titulo="Redes sociales empresariales"
                            descripcion="Agregá los perfiles corporativos que podrán ver los candidatos."
                        >
                            <p className="mb-5 rounded-lg bg-indigo-50 p-3 text-sm text-indigo-900">
                                Los enlaces sociales se guardan por separado. No necesitás guardar nuevamente los datos de la empresa.
                            </p>
                            {mensajeRed && (
                                <p role="status" className="mb-4 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800">
                                    {mensajeRed}
                                </p>
                            )}
                            {errorAccionRed && (
                                <p role="alert" className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                                    {errorAccionRed}
                                </p>
                            )}

                            <form onSubmit={guardarRed} className="space-y-4">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div>
                                        <label htmlFor="red_social_id" className={labelClass}>Red social</label>
                                        {editandoRedId !== null ? (
                                            <div className={`${inputClass} flex items-center gap-2 bg-slate-50`}>
                                                {redSeleccionada && (
                                                    <IconoRedSocial nombre={redSeleccionada.nombre} icono={redSeleccionada.icono} />
                                                )}
                                                {redSeleccionada?.nombre ?? 'Red social'}
                                            </div>
                                        ) : (
                                            <select
                                                id="red_social_id"
                                                value={redesForm.data.red_social_id}
                                                onChange={(e) => redesForm.setData('red_social_id', e.target.value)}
                                                required
                                                disabled={redesAgregables.length === 0 || redesOcupadas}
                                                className={inputClass}
                                            >
                                                <option value="">Seleccionar red social</option>
                                                {redesAgregables.map((red) => (
                                                    <option key={red.id} value={red.id}>{red.nombre}</option>
                                                ))}
                                            </select>
                                        )}
                                        {redParaVistaPrevia && editandoRedId === null && (
                                            <div className="mt-3 inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
                                                <IconoRedSocial nombre={redParaVistaPrevia.nombre} icono={redParaVistaPrevia.icono} className="size-6" />
                                                <span>{redParaVistaPrevia.nombre}</span>
                                            </div>
                                        )}
                                        <MensajeError mensaje={redesForm.errors.red_social_id} />
                                    </div>
                                    <div>
                                        <label htmlFor="url_perfil" className={labelClass}>URL del perfil</label>
                                        <input
                                            id="url_perfil"
                                            type="url"
                                            maxLength={2048}
                                            placeholder="https://www.linkedin.com/company/..."
                                            required
                                            value={redesForm.data.url_perfil}
                                            onChange={(e) => redesForm.setData('url_perfil', e.target.value)}
                                            disabled={redesOcupadas}
                                            className={inputClass}
                                        />
                                        <MensajeError mensaje={redesForm.errors.url_perfil} />
                                    </div>
                                </div>

                                {editandoRedId === null && redExistenteInactiva && (
                                    <p className="text-sm text-amber-700">
                                        Esta red social estaba desactivada. Al guardar, se reactivará con la URL indicada.
                                    </p>
                                )}

                                <div className="flex flex-wrap gap-3">
                                    <button
                                        type="submit"
                                        disabled={redesOcupadas || (editandoRedId === null && redesAgregables.length === 0)}
                                        className={buttonPrimary}
                                    >
                                        {redesForm.processing ? 'Guardando...' : editandoRedId === null ? 'Agregar red social' : 'Actualizar red social'}
                                    </button>
                                    {editandoRedId !== null && (
                                        <button
                                            type="button"
                                            onClick={limpiarFormularioRed}
                                            disabled={redesOcupadas}
                                            className="rounded-lg border border-slate-300 px-5 py-3 text-sm font-medium hover:bg-slate-50 disabled:opacity-50"
                                        >
                                            Cancelar edición
                                        </button>
                                    )}
                                </div>
                            </form>

                            <div className="mt-8 space-y-3">
                                <h4 className="font-semibold">Redes sociales registradas</h4>
                                {redesEmpresa.length === 0 ? (
                                    <p className="rounded-lg bg-slate-50 p-4 text-sm text-slate-500">
                                        Esta empresa todavía no tiene redes sociales registradas.
                                    </p>
                                ) : (
                                    redesEmpresa.map((red) => {
                                        const activa = Boolean(red.estado);
                                        const catalogoActivo = Boolean(red.catalogo_activo);
                                        const urlSegura = /^https?:\/\//i.test(red.url_perfil);
                                        return (
                                            <div key={red.id} className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-slate-200 p-4">
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-center gap-2 font-medium">
                                                        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                                                            <IconoRedSocial nombre={red.nombre} icono={red.icono} />
                                                        </span>
                                                        <span>{red.nombre}</span>
                                                        {!activa && <span className="ml-2 text-xs text-amber-700">Desactivada</span>}
                                                        {!catalogoActivo && <span className="ml-2 text-xs text-slate-500">Catálogo inactivo</span>}
                                                    </div>
                                                    {urlSegura ? (
                                                        <a href={red.url_perfil} target="_blank" rel="noopener noreferrer" className="break-all text-sm text-indigo-600 hover:underline">
                                                            {red.url_perfil}
                                                        </a>
                                                    ) : (
                                                        <p className="break-all text-sm text-slate-500">{red.url_perfil}</p>
                                                    )}
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    {activa ? (
                                                        <>
                                                            <button type="button" disabled={redesOcupadas} onClick={() => iniciarEdicionRed(red)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm hover:bg-slate-50 disabled:opacity-50">
                                                                Editar
                                                            </button>
                                                            <button type="button" disabled={redesOcupadas} onClick={() => desactivarRed(red)} className="rounded-lg border border-red-200 px-3 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50">
                                                                {operandoRedId === red.id ? 'Procesando...' : 'Desactivar'}
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <button type="button" disabled={redesOcupadas || !catalogoActivo} onClick={() => reactivarRed(red)} className="rounded-lg border border-indigo-200 px-3 py-2 text-sm text-indigo-600 hover:bg-indigo-50 disabled:opacity-50">
                                                            {operandoRedId === red.id ? 'Procesando...' : 'Reactivar'}
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </Seccion>
                    )}
                </div>
            </main>
        </>
    );
}
