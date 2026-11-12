import { Form, Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import {
    ArrowLeft,
    ArrowRight,
    BriefcaseBusiness,
    Check,
    Eye,
    EyeOff,
    Globe,
    Mail,
    Phone,
    ShieldCheck,
} from 'lucide-react';

import InputError from '@/components/input-error';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { login } from '@/routes';
import { store } from '@/routes/register';

interface RegisterProps {
    passwordRules?: string;
}

const inputClass =
    'h-12 rounded-lg border-slate-300 bg-white text-[15px] shadow-none placeholder:text-slate-400 focus-visible:border-indigo-600 focus-visible:ring-4 focus-visible:ring-indigo-600/15';

const labelClass = 'text-sm font-medium text-slate-700';

const toggleClass =
    'absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600/40';

const benefits = [
    'Crear y administrar el perfil de tu empresa.',
    'Publicar oportunidades laborales.',
    'Conectar con profesionales y candidatos.',
];

function Optional() {
    return <span className="font-normal text-slate-400">(opcional)</span>;
}

function SectionTitle({
    title,
    text,
}: {
    title: string;
    text: string;
}) {
    return (
        <div className="border-b border-slate-200 pb-3">
            <h3 className="text-base font-semibold text-slate-950">{title}</h3>
            <p className="mt-1 text-sm leading-5 text-slate-500">{text}</p>
        </div>
    );
}

export default function Register({ passwordRules }: RegisterProps) {
    const [mostrarPassword, setMostrarPassword] = useState(false);
    const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);

    return (
        <>
            <Head title="Registro de empresa" />

            <main className="grid min-h-screen bg-white text-slate-900 lg:grid-cols-[1.05fr_1fr]">
                {/* Panel de marca (fijo en escritorio mientras se desplaza el formulario) */}
                <aside className="relative hidden flex-col justify-between overflow-hidden bg-slate-950 p-12 text-white lg:sticky lg:top-0 lg:flex lg:h-screen xl:p-16">
                    <div className="pointer-events-none absolute -left-24 -top-24 h-[420px] w-[420px] rounded-full bg-indigo-600/30 blur-[120px]" />

                    <Link href="/" className="relative flex w-fit items-center gap-3">
                        <span className="flex size-10 items-center justify-center rounded-lg bg-indigo-600">
                            <BriefcaseBusiness className="size-5" />
                        </span>
                        <span className="text-xl font-bold tracking-tight">
                            JobPortal
                        </span>
                    </Link>

                    <div className="relative max-w-md">
                        <h1 className="text-5xl font-bold leading-[1.08] tracking-tight">
                            Creá tu cuenta empresarial.
                        </h1>

                        <p className="mt-5 text-base leading-7 text-slate-400">
                            Conectá tu empresa con profesionales, publicá
                            oportunidades laborales y encontrá el talento que
                            necesitás para crecer.
                        </p>

                        <p className="mt-12 text-sm font-semibold">
                            Al unirte a JobPortal vas a poder:
                        </p>
                        <ul className="mt-4 space-y-3">
                            {benefits.map((benefit) => (
                                <li
                                    key={benefit}
                                    className="flex items-center gap-3 text-sm text-slate-400"
                                >
                                    <Check className="size-4 shrink-0 text-indigo-400" />
                                    {benefit}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <p className="relative text-xs text-slate-500">
                        © {new Date().getFullYear()} JobPortal. Todos los
                        derechos reservados.
                    </p>
                </aside>

                {/* Panel del formulario */}
                <section className="flex min-h-screen flex-col">
                    <header className="flex h-[72px] items-center justify-between px-6 sm:px-10">
                        <Link
                            href="/"
                            className="flex items-center gap-2.5 lg:invisible"
                        >
                            <span className="flex size-9 items-center justify-center rounded-lg bg-indigo-600 text-white">
                                <BriefcaseBusiness className="size-[18px]" />
                            </span>
                            <span className="text-lg font-bold tracking-tight">
                                JobPortal
                            </span>
                        </Link>

                        <Link
                            href="/register"
                            className="group inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                        >
                            <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5" />
                            <span className="hidden sm:inline">
                                Cambiar tipo de cuenta
                            </span>
                            <span className="sm:hidden">Volver</span>
                        </Link>
                    </header>

                    <div className="flex flex-1 justify-center px-6 py-10 sm:px-10">
                        <div className="w-full max-w-md">
                            <h2 className="text-3xl font-bold tracking-tight text-slate-950">
                                Crear cuenta empresarial
                            </h2>
                            <p className="mt-2 text-sm leading-6 text-slate-500">
                                Completá los datos del responsable y de tu
                                empresa.
                            </p>

                            <Form
                                {...store.form()}
                                resetOnSuccess={[
                                    'password',
                                    'password_confirmation',
                                ]}
                                disableWhileProcessing
                                className="mt-8 space-y-10"
                            >
                                {({ processing, errors }) => (
                                    <>
                                        <input
                                            type="hidden"
                                            name="tipo"
                                            value="empresa"
                                        />

                                        {/* Datos del responsable */}
                                        <section className="space-y-5">
                                            <SectionTitle
                                                title="Datos del responsable"
                                                text="Información de la persona que administrará la cuenta empresarial."
                                            />

                                            <div className="grid gap-5 sm:grid-cols-2">
                                                <div className="space-y-2">
                                                    <Label
                                                        htmlFor="nombre"
                                                        className={labelClass}
                                                    >
                                                        Nombre
                                                    </Label>
                                                    <Input
                                                        id="nombre"
                                                        name="nombre"
                                                        type="text"
                                                        required
                                                        autoFocus
                                                        maxLength={255}
                                                        autoComplete="given-name"
                                                        placeholder="Tu nombre"
                                                        className={inputClass}
                                                    />
                                                    <InputError message={errors.nombre} />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label
                                                        htmlFor="apellido"
                                                        className={labelClass}
                                                    >
                                                        Apellido
                                                    </Label>
                                                    <Input
                                                        id="apellido"
                                                        name="apellido"
                                                        type="text"
                                                        required
                                                        maxLength={255}
                                                        autoComplete="family-name"
                                                        placeholder="Tu apellido"
                                                        className={inputClass}
                                                    />
                                                    <InputError message={errors.apellido} />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label
                                                    htmlFor="email"
                                                    className={labelClass}
                                                >
                                                    Correo electrónico
                                                </Label>
                                                <div className="relative">
                                                    <Mail className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                                                    <Input
                                                        id="email"
                                                        name="email"
                                                        type="email"
                                                        required
                                                        maxLength={255}
                                                        autoComplete="email"
                                                        placeholder="contacto@empresa.com"
                                                        className={`${inputClass} pl-11`}
                                                    />
                                                </div>
                                                <InputError message={errors.email} />
                                            </div>

                                            <div className="space-y-2">
                                                <Label
                                                    htmlFor="telefono"
                                                    className={labelClass}
                                                >
                                                    Teléfono <Optional />
                                                </Label>
                                                <div className="relative">
                                                    <Phone className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                                                    <Input
                                                        id="telefono"
                                                        name="telefono"
                                                        type="tel"
                                                        maxLength={30}
                                                        autoComplete="tel"
                                                        placeholder="+54 9 11 1234-5678"
                                                        className={`${inputClass} pl-11`}
                                                    />
                                                </div>
                                                <InputError message={errors.telefono} />
                                            </div>
                                        </section>

                                        {/* Información de la empresa */}
                                        <section className="space-y-5">
                                            <SectionTitle
                                                title="Información de la empresa"
                                                text="Contanos un poco sobre tu organización."
                                            />

                                            <div className="space-y-2">
                                                <Label
                                                    htmlFor="nombre_comercial"
                                                    className={labelClass}
                                                >
                                                    Nombre comercial
                                                </Label>
                                                <Input
                                                    id="nombre_comercial"
                                                    name="nombre_comercial"
                                                    type="text"
                                                    required
                                                    maxLength={150}
                                                    placeholder="Ej. Empresa Argentina"
                                                    className={inputClass}
                                                />
                                                <InputError message={errors.nombre_comercial} />
                                            </div>

                                            <div className="space-y-2">
                                                <Label
                                                    htmlFor="razon_social"
                                                    className={labelClass}
                                                >
                                                    Razón social <Optional />
                                                </Label>
                                                <Input
                                                    id="razon_social"
                                                    name="razon_social"
                                                    type="text"
                                                    maxLength={200}
                                                    placeholder="Razón social registrada"
                                                    className={inputClass}
                                                />
                                                <InputError message={errors.razon_social} />
                                            </div>

                                            <div className="space-y-2">
                                                <Label
                                                    htmlFor="cuit"
                                                    className={labelClass}
                                                >
                                                    CUIT <Optional />
                                                </Label>
                                                <Input
                                                    id="cuit"
                                                    name="cuit"
                                                    type="text"
                                                    inputMode="numeric"
                                                    maxLength={11}
                                                    placeholder="30712345678"
                                                    className={inputClass}
                                                />
                                                <p className="text-xs leading-5 text-slate-500">
                                                    Ingresá los 11 dígitos sin guiones.
                                                </p>
                                                <InputError message={errors.cuit} />
                                            </div>

                                            <div className="space-y-2">
                                                <Label
                                                    htmlFor="sitio_web"
                                                    className={labelClass}
                                                >
                                                    Sitio web <Optional />
                                                </Label>
                                                <div className="relative">
                                                    <Globe className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                                                    <Input
                                                        id="sitio_web"
                                                        name="sitio_web"
                                                        type="url"
                                                        maxLength={255}
                                                        placeholder="https://www.empresa.com"
                                                        className={`${inputClass} pl-11`}
                                                    />
                                                </div>
                                                <InputError message={errors.sitio_web} />
                                            </div>

                                            <div className="space-y-2">
                                                <Label
                                                    htmlFor="descripcion"
                                                    className={labelClass}
                                                >
                                                    Descripción de la empresa <Optional />
                                                </Label>
                                                <textarea
                                                    id="descripcion"
                                                    name="descripcion"
                                                    rows={4}
                                                    maxLength={5000}
                                                    placeholder="Contanos brevemente a qué se dedica tu empresa, cuáles son sus actividades y qué la distingue..."
                                                    className="flex min-h-28 w-full rounded-lg border border-slate-300 bg-white px-3 py-3 text-[15px] outline-none transition placeholder:text-slate-400 focus-visible:border-indigo-600 focus-visible:ring-4 focus-visible:ring-indigo-600/15"
                                                />
                                                <InputError message={errors.descripcion} />
                                            </div>
                                        </section>

                                        {/* Seguridad de la cuenta */}
                                        <section className="space-y-5">
                                            <SectionTitle
                                                title="Seguridad de la cuenta"
                                                text="Creá una contraseña para proteger el acceso a tu empresa."
                                            />

                                            <div className="space-y-2">
                                                <Label
                                                    htmlFor="password"
                                                    className={labelClass}
                                                >
                                                    Contraseña
                                                </Label>
                                                <div className="relative">
                                                    <Input
                                                        id="password"
                                                        name="password"
                                                        type={mostrarPassword ? 'text' : 'password'}
                                                        required
                                                        autoComplete="new-password"
                                                        placeholder="Creá una contraseña"
                                                        className={`${inputClass} pr-12`}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setMostrarPassword(!mostrarPassword)
                                                        }
                                                        className={toggleClass}
                                                        aria-label={
                                                            mostrarPassword
                                                                ? 'Ocultar contraseña'
                                                                : 'Mostrar contraseña'
                                                        }
                                                    >
                                                        {mostrarPassword ? (
                                                            <EyeOff className="size-4" />
                                                        ) : (
                                                            <Eye className="size-4" />
                                                        )}
                                                    </button>
                                                </div>
                                                <InputError message={errors.password} />
                                                {passwordRules && (
                                                    <p className="text-xs leading-5 text-slate-500">
                                                        {passwordRules}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label
                                                    htmlFor="password_confirmation"
                                                    className={labelClass}
                                                >
                                                    Confirmar contraseña
                                                </Label>
                                                <div className="relative">
                                                    <Input
                                                        id="password_confirmation"
                                                        name="password_confirmation"
                                                        type={mostrarConfirmacion ? 'text' : 'password'}
                                                        required
                                                        autoComplete="new-password"
                                                        placeholder="Repetí tu contraseña"
                                                        className={`${inputClass} pr-12`}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setMostrarConfirmacion(!mostrarConfirmacion)
                                                        }
                                                        className={toggleClass}
                                                        aria-label={
                                                            mostrarConfirmacion
                                                                ? 'Ocultar contraseña'
                                                                : 'Mostrar contraseña'
                                                        }
                                                    >
                                                        {mostrarConfirmacion ? (
                                                            <EyeOff className="size-4" />
                                                        ) : (
                                                            <Eye className="size-4" />
                                                        )}
                                                    </button>
                                                </div>
                                                <InputError message={errors.password_confirmation} />
                                            </div>
                                        </section>

                                        {/* Botón de registro */}
                                        <Button
                                            type="submit"
                                            disabled={processing}
                                            className="group h-12 w-full rounded-lg bg-indigo-600 text-[15px] font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus-visible:ring-4 focus-visible:ring-indigo-600/25 disabled:opacity-80"
                                        >
                                            {processing
                                                ? 'Creando cuenta empresarial...'
                                                : 'Crear cuenta empresarial'}
                                            {!processing && (
                                                <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-0.5" />
                                            )}
                                        </Button>
                                    </>
                                )}
                            </Form>

                            {/* Seguridad y verificación */}
                            <p className="mt-6 flex items-start gap-2 text-xs leading-5 text-slate-500">
                                <ShieldCheck className="mt-0.5 size-4 shrink-0 text-emerald-500" />
                                Te enviaremos un correo para verificar tu
                                dirección antes de acceder a las funciones
                                privadas de JobPortal.
                            </p>

                            {/* Acceso existente */}
                            <p className="mt-8 text-center text-sm text-slate-600">
                                ¿Ya tenés una cuenta?{' '}
                                <Link
                                    href={login()}
                                    className="font-semibold text-indigo-600 hover:text-indigo-700 hover:underline"
                                >
                                    Iniciá sesión
                                </Link>
                            </p>
                        </div>
                    </div>

                    {/* Pie */}
                    <footer className="flex flex-col items-center justify-between gap-3 px-6 py-5 text-xs text-slate-500 sm:flex-row sm:px-10">
                        <p className="lg:invisible">
                            © {new Date().getFullYear()} JobPortal. Todos los
                            derechos reservados.
                        </p>

                        <div className="flex gap-5">
                            <Link
                                href="/privacidad"
                                className="transition hover:text-slate-700"
                            >
                                Privacidad
                            </Link>

                            <Link
                                href="/terminos"
                                className="transition hover:text-slate-700"
                            >
                                Términos
                            </Link>

                            <Link
                                href="/contacto"
                                className="transition hover:text-slate-700"
                            >
                                Contacto
                            </Link>
                        </div>
                    </footer>
                </section>
            </main>
        </>
    );
}
