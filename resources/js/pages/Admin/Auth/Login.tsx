import { Form, Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import {
    ArrowLeft,
    ArrowRight,
    Eye,
    EyeOff,
    LockKeyhole,
    Mail,
    ShieldCheck,
    Users,
    Settings,
    ClipboardCheck,
} from 'lucide-react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Props = {
    status?: string;
};

const inputClass =
    'h-12 rounded-lg border-slate-300 bg-white pl-11 text-[15px] shadow-none placeholder:text-slate-400 focus-visible:border-indigo-600 focus-visible:ring-4 focus-visible:ring-indigo-600/15';

const benefits = [
    {
        icon: Users,
        title: 'Gestión de usuarios',
        text: 'Administrá las cuentas y los perfiles de la plataforma.',
    },
    {
        icon: ClipboardCheck,
        title: 'Control de contenidos',
        text: 'Supervisá y moderá la información publicada.',
    },
    {
        icon: Settings,
        title: 'Administración centralizada',
        text: 'Gestioná los módulos y las configuraciones del sistema.',
    },
];

export default function AdminLogin({ status }: Props) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <>
            <Head title="Acceso administrativo | Talent Match" />

            <main className="grid min-h-screen bg-white text-slate-900 lg:grid-cols-[1.05fr_1fr]">

                {/* Panel de marca */}
                <aside className="relative hidden flex-col justify-between overflow-hidden bg-slate-950 p-12 text-white lg:flex xl:p-16">

                    <div className="pointer-events-none absolute -left-24 -top-24 h-[420px] w-[420px] rounded-full bg-indigo-600/30 blur-[120px]" />

                    <div className="pointer-events-none absolute -bottom-24 -right-24 h-[350px] w-[350px] rounded-full bg-violet-600/20 blur-[120px]" />

                    <Link href="/" className="relative flex w-fit items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                            <ShieldCheck className="h-5 w-5" />
                        </span>

                        <span className="text-xl font-bold tracking-tight">
                            Talent Match
                        </span>
                    </Link>

                    <div className="relative max-w-md">

                        <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-indigo-400/30 bg-indigo-500/10 px-3 py-1.5 text-xs font-medium text-indigo-300">
                            <ShieldCheck className="h-3.5 w-3.5" />
                            Área de administración
                        </span>

                        <h1 className="text-5xl font-bold leading-[1.08] tracking-tight">
                            Gestioná tu plataforma desde un solo lugar.
                        </h1>

                        <p className="mt-5 text-base leading-7 text-slate-400">
                            Accedé al entorno administrativo de Talent Match
                            para gestionar usuarios, contenidos y permisos.
                        </p>

                        <ul className="mt-12 space-y-6">
                            {benefits.map(({ icon: Icon, title, text }) => (
                                <li
                                    key={title}
                                    className="flex items-start gap-4"
                                >
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
                        © {new Date().getFullYear()} Talent Match. Todos los
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
                                <ShieldCheck className="h-[18px] w-[18px]" />
                            </span>

                            <span className="text-lg font-bold tracking-tight">
                                Talent Match
                            </span>
                        </Link>

                        <Link
                            href="/"
                            className="group inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                        >
                            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />

                            <span>Volver al sitio</span>
                        </Link>
                    </header>

                    <div className="flex flex-1 items-center justify-center px-6 py-10 sm:px-10">

                        <div className="w-full max-w-sm">

                            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                                <ShieldCheck className="h-6 w-6" />
                            </div>

                            <h2 className="text-3xl font-bold tracking-tight text-slate-950">
                                Acceso administrativo
                            </h2>

                            <p className="mt-2 text-sm leading-6 text-slate-500">
                                Ingresá con tus credenciales autorizadas para
                                administrar Talent Match.
                            </p>

                            {status && (
                                <div
                                    role="status"
                                    className="mt-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
                                >
                                    {status}
                                </div>
                            )}

                            <Form
                                action="/admin/login"
                                method="post"
                                resetOnSuccess={['password']}
                                disableWhileProcessing
                                className="mt-8 space-y-5"
                            >
                                {({ processing, errors }) => (
                                    <>

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
                                                    placeholder="admin@ejemplo.com"
                                                    className={inputClass}
                                                />
                                            </div>

                                            <InputError message={errors.email} />
                                        </div>

                                        {/* Contraseña */}
                                        <div className="space-y-2">

                                            <Label
                                                htmlFor="password"
                                                className="text-sm font-medium text-slate-700"
                                            >
                                                Contraseña
                                            </Label>

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
                                                        setShowPassword(
                                                            (current) => !current
                                                        )
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
                                        {/* Recordarme y recuperar contraseña */}
                                        <div className="flex flex-wrap items-center justify-between gap-3">

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

                                            <Link
                                                href="/admin/forgot-password"
                                                className="text-sm font-semibold text-indigo-600 transition hover:text-indigo-700 hover:underline"
                                            >
                                                ¿Olvidaste tu contraseña?
                                            </Link>

                                        </div>

                                        {/* Botón */}
                                        <Button
                                            type="submit"
                                            disabled={processing}
                                            className="group h-12 w-full rounded-lg bg-indigo-600 text-[15px] font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus-visible:ring-4 focus-visible:ring-indigo-600/25 disabled:opacity-80"
                                        >
                                            {processing
                                                ? 'Ingresando...'
                                                : 'Ingresar al panel'}

                                            {!processing && (
                                                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                                            )}
                                        </Button>
                                    </>
                                )}
                            </Form>

                            <div className="mt-8 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3.5">

                                <div className="flex items-start gap-3">

                                    <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-indigo-600" />

                                    <div>
                                        <p className="text-sm font-semibold text-slate-800">
                                            Acceso restringido
                                        </p>

                                        <p className="mt-1 text-xs leading-5 text-slate-500">
                                            Este espacio está reservado para
                                            administradores y moderadores
                                            autorizados de la plataforma.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <footer className="px-6 py-5 text-center text-xs text-slate-500 lg:hidden">
                        © {new Date().getFullYear()} Talent Match. Todos los
                        derechos reservados.
                    </footer>
                </section>
            </main>
        </>
    );
}
