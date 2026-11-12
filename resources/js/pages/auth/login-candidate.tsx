import { Form, Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import {
    ArrowLeft,
    ArrowRight,
    BriefcaseBusiness,
    CheckCircle2,
    Eye,
    EyeOff,
    Github,
    LockKeyhole,
    Mail,
    ShieldCheck,
} from 'lucide-react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { store } from '@/routes/login';

type Props = {
    status?: string;
    canResetPassword: boolean;
};

const inputClass =
    'h-12 rounded-lg border-slate-300 bg-white pl-11 text-[15px] shadow-none placeholder:text-slate-400 focus-visible:border-indigo-600 focus-visible:ring-4 focus-visible:ring-indigo-600/15';

const socialClass =
    'flex h-12 items-center justify-center gap-2.5 rounded-lg border border-slate-300 bg-white text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-600/15';

const benefits = [
    {
        icon: BriefcaseBusiness,
        title: 'Encontrá nuevas oportunidades',
        text: 'Explorá ofertas laborales acordes a tu perfil.',
    },
    {
        icon: CheckCircle2,
        title: 'Gestioná tus postulaciones',
        text: 'Seguí tus procesos de selección desde un solo lugar.',
    },
    {
        icon: ShieldCheck,
        title: 'Tu perfil siempre disponible',
        text: 'Accedé a tu información profesional cuando la necesites.',
    },
];

export default function LoginCandidate({ status, canResetPassword }: Props) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <>
            <Head title="Ingresar como candidato | JobPortal" />

            <main className="grid min-h-screen bg-white text-slate-900 lg:grid-cols-[1.05fr_1fr]">
                {/* Panel de marca (solo escritorio) */}
                <aside className="relative hidden flex-col justify-between overflow-hidden bg-slate-950 p-12 text-white lg:flex xl:p-16">
                    <div className="pointer-events-none absolute -left-24 -top-24 h-[420px] w-[420px] rounded-full bg-indigo-600/30 blur-[120px]" />

                    <Link href="/" className="relative flex w-fit items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                            <BriefcaseBusiness className="h-5 w-5" />
                        </span>
                        <span className="text-xl font-bold tracking-tight">
                            JobPortal
                        </span>
                    </Link>

                    <div className="relative max-w-md">
                        <h1 className="text-5xl font-bold leading-[1.08] tracking-tight">
                            Tu próximo trabajo puede empezar acá.
                        </h1>

                        <p className="mt-5 text-base leading-7 text-slate-400">
                            Ingresá y seguí construyendo tu futuro profesional.
                        </p>

                        <ul className="mt-12 space-y-6">
                            {benefits.map(({ icon: Icon, title, text }) => (
                                <li key={title} className="flex items-start gap-4">
                                    <Icon className="mt-0.5 h-5 w-5 shrink-0 text-indigo-400" />
                                    <div>
                                        <p className="text-sm font-semibold">
                                            {title}
                                        </p>
                                        <p className="mt-0.5 text-sm leading-6 text-slate-400">
                                            {text}
                                        </p>
                                    </div>
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
                            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white">
                                <BriefcaseBusiness className="h-[18px] w-[18px]" />
                            </span>
                            <span className="text-lg font-bold tracking-tight">
                                JobPortal
                            </span>
                        </Link>

                        <Link
                            href="/login"
                            className="group inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                        >
                            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
                            <span className="hidden sm:inline">
                                Cambiar tipo de cuenta
                            </span>
                            <span className="sm:hidden">Volver</span>
                        </Link>
                    </header>

                    <div className="flex flex-1 items-center justify-center px-6 py-10 sm:px-10">
                        <div className="w-full max-w-sm">
                            <h2 className="text-3xl font-bold tracking-tight text-slate-950">
                                ¡Bienvenido nuevamente!
                            </h2>
                            <p className="mt-2 text-sm leading-6 text-slate-500">
                                Ingresá a tu cuenta de candidato.
                            </p>

                            {status && (
                                <div
                                    role="status"
                                    className="mt-6 flex items-start gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
                                >
                                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                                    <span>{status}</span>
                                </div>
                            )}

                            <Form
                                {...store.form()}
                                resetOnSuccess={['password']}
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

                                        {/* Correo */}
                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="email"
                                                className="text-sm font-medium text-slate-700"
                                            >
                                                Correo electrónico
                                            </Label>

                                            <div className="relative">
                                                <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                                                <Input
                                                    id="email"
                                                    name="email"
                                                    type="email"
                                                    required
                                                    autoFocus
                                                    autoComplete="username"
                                                    placeholder="nombre@ejemplo.com"
                                                    className={inputClass}
                                                />
                                            </div>

                                            <InputError message={errors.email} />
                                        </div>

                                        {/* Contraseña */}
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between gap-2">
                                                <Label
                                                    htmlFor="password"
                                                    className="text-sm font-medium text-slate-700"
                                                >
                                                    Contraseña
                                                </Label>

                                                {canResetPassword && (
                                                    <Link
                                                        href="/forgot-password"
                                                        className="text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:underline"
                                                    >
                                                        ¿La olvidaste?
                                                    </Link>
                                                )}
                                            </div>

                                            <div className="relative">
                                                <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                                                <Input
                                                    id="password"
                                                    name="password"
                                                    type={showPassword ? 'text' : 'password'}
                                                    required
                                                    autoComplete="current-password"
                                                    placeholder="Ingresá tu contraseña"
                                                    className={`${inputClass} pr-12`}
                                                />

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setShowPassword((current) => !current)
                                                    }
                                                    aria-label={
                                                        showPassword
                                                            ? 'Ocultar contraseña'
                                                            : 'Mostrar contraseña'
                                                    }
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600/40"
                                                >
                                                    {showPassword ? (
                                                        <EyeOff className="h-4 w-4" />
                                                    ) : (
                                                        <Eye className="h-4 w-4" />
                                                    )}
                                                </button>
                                            </div>

                                            <InputError message={errors.password} />
                                        </div>

                                        {/* Recordarme */}
                                        <label className="flex cursor-pointer items-center gap-2.5">
                                            <input
                                                type="checkbox"
                                                name="remember"
                                                value="1"
                                                className="h-4 w-4 rounded border-slate-300 accent-indigo-600"
                                            />

                                            <span className="text-sm text-slate-600">
                                                Recordarme en este dispositivo
                                            </span>
                                        </label>

                                        {/* Botón */}
                                        <Button
                                            type="submit"
                                            disabled={processing}
                                            className="group h-12 w-full rounded-lg bg-indigo-600 text-[15px] font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus-visible:ring-4 focus-visible:ring-indigo-600/25 disabled:opacity-80"
                                        >
                                            {processing
                                                ? 'Ingresando...'
                                                : 'Ingresar a mi cuenta'}

                                            {!processing && (
                                                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                                            )}
                                        </Button>
                                    </>
                                )}
                            </Form>

                            {/* Separador */}
                            <div className="my-7 flex items-center gap-4">
                                <span className="h-px flex-1 bg-slate-200" />
                                <span className="text-xs text-slate-400">
                                    o continuá con
                                </span>
                                <span className="h-px flex-1 bg-slate-200" />
                            </div>

                            {/* Google y GitHub */}
                            <div className="grid grid-cols-2 gap-3">
                                <a href="/auth/google/redirect" className={socialClass}>
                                    <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" aria-hidden="true">
                                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09Z" />
                                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z" />
                                        <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z" />
                                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38Z" />
                                    </svg>
                                    Google
                                </a>

                                <a href="/auth/github/redirect" className={socialClass}>
                                    <Github className="h-[18px] w-[18px]" />
                                    GitHub
                                </a>
                            </div>

                            {/* Registro */}
                            <p className="mt-8 text-center text-sm text-slate-600">
                                ¿Todavía no tenés una cuenta?{' '}
                                <Link
                                    href="/register?tipo=candidato"
                                    className="font-semibold text-indigo-600 hover:text-indigo-700 hover:underline"
                                >
                                    Crear cuenta de candidato
                                </Link>
                            </p>

                            <p className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500">
                                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                                Tu información está protegida por JobPortal.
                            </p>
                        </div>
                    </div>

                    {/* Pie (solo móvil; en escritorio va en el panel de marca) */}
                    <footer className="px-6 py-5 text-center text-xs text-slate-500 lg:hidden">
                        © {new Date().getFullYear()} JobPortal. Todos los
                        derechos reservados.
                    </footer>
                </section>
            </main>
        </>
    );
}
