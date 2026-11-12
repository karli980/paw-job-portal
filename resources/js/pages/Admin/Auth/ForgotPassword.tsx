
import { Form, Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    ArrowRight,
    CheckCircle2,
    KeyRound,
    LockKeyhole,
    Mail,
    ShieldCheck,
} from 'lucide-react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ForgotPasswordProps {
    status?: string;
}

export default function ForgotPassword({ status }: ForgotPasswordProps) {
    return (
        <>
            <Head title="Recuperar contraseña administrativa" />

            <main className="min-h-screen bg-white lg:grid lg:grid-cols-2">
                {/* Panel institucional */}
                <section className="relative hidden min-h-screen overflow-hidden bg-slate-950 px-12 py-14 text-white lg:flex lg:flex-col lg:justify-between xl:px-20">
                    <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-indigo-600/20 blur-3xl" />
                    <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-violet-600/20 blur-3xl" />

                    <div className="relative z-10">
                        <Link
                            href="/admin/login"
                            className="inline-flex items-center gap-3"
                        >
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 shadow-lg shadow-indigo-950/40">
                                <ShieldCheck className="h-6 w-6 text-white" />
                            </div>

                            <div>
                                <p className="text-xl font-bold tracking-tight">
                                    Talent Match
                                </p>
                                <p className="text-xs font-medium tracking-widest text-indigo-300">
                                    ADMINISTRACIÓN
                                </p>
                            </div>
                        </Link>
                    </div>

                    <div className="relative z-10 max-w-xl">
                        <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                            <KeyRound className="h-8 w-8 text-indigo-300" />
                        </div>

                        <h1 className="text-4xl font-bold leading-tight tracking-tight xl:text-5xl">
                            Recuperá el acceso a tu cuenta.
                        </h1>

                        <p className="mt-6 max-w-lg text-lg leading-relaxed text-slate-400">
                            Sabemos que pueden surgir imprevistos. Te
                            enviaremos un enlace seguro para que puedas
                            establecer una nueva contraseña administrativa.
                        </p>

                        <div className="mt-10 space-y-5">
                            <div className="flex items-center gap-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10">
                                    <LockKeyhole className="h-5 w-5 text-indigo-300" />
                                </div>
                                <div>
                                    <p className="font-semibold text-white">
                                        Recuperación segura
                                    </p>
                                    <p className="text-sm text-slate-400">
                                        Enlaces individuales y temporales.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10">
                                    <ShieldCheck className="h-5 w-5 text-indigo-300" />
                                </div>
                                <div>
                                    <p className="font-semibold text-white">
                                        Acceso protegido
                                    </p>
                                    <p className="text-sm text-slate-400">
                                        Exclusivo para cuentas administrativas.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <p className="relative z-10 text-xs text-slate-500">
                        © {new Date().getFullYear()} Talent Match. Todos los
                        derechos reservados.
                    </p>
                </section>

                {/* Formulario */}
                <section className="flex min-h-screen items-center justify-center px-6 py-12 sm:px-10">
                    <div className="w-full max-w-md">
                        <Link
                            href="/admin/login"
                            className="mb-10 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-indigo-600"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Volver al acceso administrativo
                        </Link>

                        <div className="mb-8">
                            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50">
                                <Mail className="h-7 w-7 text-indigo-600" />
                            </div>

                            <p className="mb-3 text-sm font-bold uppercase tracking-widest text-indigo-600">
                                Recuperación de acceso
                            </p>

                            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                                ¿Olvidaste tu contraseña?
                            </h2>

                            <p className="mt-3 text-sm leading-relaxed text-slate-500">
                                Ingresá el correo electrónico asociado a tu
                                cuenta administrativa. Si corresponde a una
                                cuenta autorizada, recibirás un enlace para
                                restablecer tu contraseña.
                            </p>
                        </div>

                        {status && (
                            <div className="mb-6 flex gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
                                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
                                <p>{status}</p>
                            </div>
                        )}

                        <Form
                            action="/admin/forgot-password"
                            method="post"
                            className="space-y-6"
                        >
                            {({ processing, errors }) => (
                                <>
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="email"
                                            className="text-sm font-semibold text-slate-700"
                                        >
                                            Correo electrónico
                                        </Label>

                                        <div className="relative">
                                            <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                                            <Input
                                                id="email"
                                                name="email"
                                                type="email"
                                                required
                                                autoFocus
                                                autoComplete="email"
                                                placeholder="admin@talentmatch.com"
                                                className="h-12 rounded-xl border-slate-200 pl-10 focus-visible:ring-indigo-500"
                                            />
                                        </div>

                                        <InputError message={errors.email} />
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="h-12 w-full rounded-xl bg-indigo-600 font-semibold shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700"
                                    >
                                        {processing
                                            ? 'Enviando solicitud...'
                                            : 'Enviar enlace de recuperación'}

                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </>
                            )}
                        </Form>

                        <p className="mt-8 text-center text-xs leading-relaxed text-slate-400">
                            Si no solicitaste recuperar tu contraseña, podés
                            ignorar el mensaje que recibas.
                        </p>

                        <div className="mt-10 border-t border-slate-100 pt-6 text-center">
                            <p className="text-xs text-slate-400">
                                Talent Match · Panel de administración
                            </p>
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
}
