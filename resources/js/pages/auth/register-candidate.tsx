import { Head, Link } from '@inertiajs/react';
import { Form } from '@inertiajs/react';
import {
    ArrowLeft,
    ArrowRight,
    BriefcaseBusiness,
    Check,
    Eye,
    EyeOff,
    Mail,
    ShieldCheck,
} from 'lucide-react';
import { useState } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface RegisterCandidatoProps {
    passwordRules?: string;
}

const inputClass =
    'h-12 rounded-lg border-slate-300 bg-white text-[15px] shadow-none placeholder:text-slate-400 focus-visible:border-indigo-600 focus-visible:ring-4 focus-visible:ring-indigo-600/15';

const labelClass = 'text-sm font-medium text-slate-700';

const toggleClass =
    'absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600/40';

const socialClass =
    'flex h-12 items-center justify-center gap-2.5 rounded-lg border border-slate-300 bg-white text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-600/15';

const benefits = [
    'Crear tu perfil profesional.',
    'Buscar oportunidades laborales.',
    'Postularte a ofertas de empleo.',
];

export default function RegisterCandidato({
    passwordRules,
}: RegisterCandidatoProps) {
    const [mostrarPassword, setMostrarPassword] = useState(false);
    const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);

    return (
        <>
            <Head title="Registro de candidato" />

            <main className="grid min-h-screen bg-white text-slate-900 lg:grid-cols-[1.05fr_1fr]">
                {/* Panel de marca (solo escritorio) */}
                <aside className="relative hidden flex-col justify-between overflow-hidden bg-slate-950 p-12 text-white lg:flex xl:p-16">
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
                            Creá tu cuenta de candidato.
                        </h1>

                        <p className="mt-5 text-base leading-7 text-slate-400">
                            Encontrá nuevas oportunidades laborales, construí tu
                            perfil profesional y conectá con empresas que buscan
                            tu talento.
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

                    <div className="flex flex-1 items-center justify-center px-6 py-10 sm:px-10">
                        <div className="w-full max-w-md">
                            <h2 className="text-3xl font-bold tracking-tight text-slate-950">
                                Crear cuenta
                            </h2>
                            <p className="mt-2 text-sm leading-6 text-slate-500">
                                Completá tus datos para comenzar.
                            </p>

                            <Form
                                action="/register"
                                method="post"
                                resetOnSuccess={[
                                    'password',
                                    'password_confirmation',
                                ]}
                                disableWhileProcessing
                                className="mt-8 space-y-5"
                            >
                                {({ processing, errors }) => (
                                    <>
                                        <input
                                            type="hidden"
                                            name="tipo"
                                            value="candidato"
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
                                                    placeholder="Tu nombre"
                                                    autoComplete="given-name"
                                                    required
                                                    maxLength={255}
                                                    className={inputClass}
                                                />
                                                <InputError
                                                    message={errors.nombre}
                                                />
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
                                                    placeholder="Tu apellido"
                                                    autoComplete="family-name"
                                                    required
                                                    maxLength={255}
                                                    className={inputClass}
                                                />
                                                <InputError
                                                    message={errors.apellido}
                                                />
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
                                                    placeholder="nombre@ejemplo.com"
                                                    autoComplete="email"
                                                    required
                                                    maxLength={255}
                                                    className={`${inputClass} pl-11`}
                                                />
                                            </div>
                                            <InputError message={errors.email} />
                                        </div>

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
                                                    type={
                                                        mostrarPassword
                                                            ? 'text'
                                                            : 'password'
                                                    }
                                                    placeholder="Creá una contraseña"
                                                    autoComplete="new-password"
                                                    required
                                                    className={`${inputClass} pr-12`}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setMostrarPassword(
                                                            !mostrarPassword,
                                                        )
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
                                            <InputError
                                                message={errors.password}
                                            />
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
                                                    type={
                                                        mostrarConfirmacion
                                                            ? 'text'
                                                            : 'password'
                                                    }
                                                    placeholder="Repetí tu contraseña"
                                                    autoComplete="new-password"
                                                    required
                                                    className={`${inputClass} pr-12`}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setMostrarConfirmacion(
                                                            !mostrarConfirmacion,
                                                        )
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
                                            <InputError
                                                message={
                                                    errors.password_confirmation
                                                }
                                            />
                                        </div>

                                        <Button
                                            type="submit"
                                            disabled={processing}
                                            className="group h-12 w-full rounded-lg bg-indigo-600 text-[15px] font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus-visible:ring-4 focus-visible:ring-indigo-600/25 disabled:opacity-80"
                                        >
                                            {processing
                                                ? 'Creando cuenta...'
                                                : 'Crear cuenta'}
                                            {!processing && (
                                                <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-0.5" />
                                            )}
                                        </Button>
                                    </>
                                )}
                            </Form>

                            {/* Separador */}
                            <div className="my-7 flex items-center gap-4">
                                <span className="h-px flex-1 bg-slate-200" />
                                <span className="text-xs text-slate-400">
                                    o registrate con
                                </span>
                                <span className="h-px flex-1 bg-slate-200" />
                            </div>

                            {/* Opciones OAuth */}
                            <div className="grid grid-cols-2 gap-3">
                                <a href="/auth/google/redirect" className={socialClass}>
                                    <svg
                                        className="size-[18px]"
                                        viewBox="0 0 24 24"
                                        aria-hidden="true"
                                    >
                                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09Z" />
                                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z" />
                                        <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z" />
                                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38Z" />
                                    </svg>
                                    Google
                                </a>

                                <a href="/auth/github/redirect" className={socialClass}>
                                    <svg
                                        viewBox="0 0 24 24"
                                        aria-hidden="true"
                                        className="size-[18px] fill-current"
                                    >
                                        <path d="M12 .9a11.1 11.1 0 0 0-3.51 21.63c.56.1.76-.24.76-.54v-2.08c-3.1.67-3.76-1.32-3.76-1.32-.51-1.3-1.24-1.65-1.24-1.65-1.02-.7.08-.69.08-.69 1.13.08 1.73 1.16 1.73 1.16 1 .1.77 2.08 3.55 1.58.1-.73.4-1.22.72-1.5-2.48-.28-5.09-1.24-5.09-5.52 0-1.22.44-2.22 1.16-3-.12-.28-.5-1.42.11-2.96 0 0 .95-.3 3.05 1.15a10.6 10.6 0 0 1 5.56 0c2.1-1.45 3.04-1.15 3.04-1.15.61 1.54.23 2.68.12 2.96.72.78 1.15 1.78 1.15 3 0 4.3-2.61 5.24-5.1 5.52.4.35.76 1.02.76 2.06v3.04c0 .3.2.65.77.54A11.1 11.1 0 0 0 12 .9Z" />
                                    </svg>
                                    GitHub
                                </a>
                            </div>

                            {/* Seguridad */}
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
                                    href="/login"
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
