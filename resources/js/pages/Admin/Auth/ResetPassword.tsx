import { Form, Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import {
    ArrowLeft,
    ArrowRight,
    CheckCircle2,
    Eye,
    EyeOff,
    KeyRound,
    LockKeyhole,
    ShieldCheck,
} from 'lucide-react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ResetPasswordProps {
    email?: string;
    token: string;
    passwordRules?: string;
}

export default function ResetPassword({
    email = '',
    token,
    passwordRules,
}: ResetPasswordProps) {
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] =
        useState(false);

    return (
        <>
            <Head title="Restablecer contraseña administrativa" />

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
                            Una nueva contraseña para proteger tu cuenta.
                        </h1>

                        <p className="mt-6 max-w-lg text-lg leading-relaxed text-slate-400">
                            Elegí una contraseña segura y diferente a las que
                            hayas utilizado anteriormente.
                        </p>

                        <div className="mt-10 space-y-5">
                            <div className="flex items-center gap-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10">
                                    <LockKeyhole className="h-5 w-5 text-indigo-300" />
                                </div>
                                <div>
                                    <p className="font-semibold text-white">
                                        Protección de tu cuenta
                                    </p>
                                    <p className="text-sm text-slate-400">
                                        Utilizá una contraseña difícil de
                                        adivinar.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10">
                                    <ShieldCheck className="h-5 w-5 text-indigo-300" />
                                </div>
                                <div>
                                    <p className="font-semibold text-white">
                                        Enlace temporal
                                    </p>
                                    <p className="text-sm text-slate-400">
                                        El enlace de recuperación tiene una
                                        vigencia limitada.
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
                                <KeyRound className="h-7 w-7 text-indigo-600" />
                            </div>

                            <p className="mb-3 text-sm font-bold uppercase tracking-widest text-indigo-600">
                                Nueva contraseña
                            </p>

                            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                                Restablecé tu acceso
                            </h2>

                            <p className="mt-3 text-sm leading-relaxed text-slate-500">
                                Ingresá tu nueva contraseña y confirmala para
                                recuperar el acceso al panel administrativo.
                            </p>
                        </div>

                        <Form
                            action="/admin/reset-password"
                            method="post"
                            className="space-y-5"
                        >
                            {({ processing, errors }) => (
                                <>
                                    <input
                                        type="hidden"
                                        name="token"
                                        value={token}
                                    />

                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="email"
                                            className="text-sm font-semibold text-slate-700"
                                        >
                                            Correo electrónico
                                        </Label>

                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            required
                                            defaultValue={email}
                                            autoComplete="email"
                                            className="h-12 rounded-xl border-slate-200 focus-visible:ring-indigo-500"
                                        />

                                        <InputError message={errors.email} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="password"
                                            className="text-sm font-semibold text-slate-700"
                                        >
                                            Nueva contraseña
                                        </Label>

                                        <div className="relative">
                                            <LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                                            <Input
                                                id="password"
                                                name="password"
                                                type={
                                                    showPassword
                                                        ? 'text'
                                                        : 'password'
                                                }
                                                required
                                                autoComplete="new-password"
                                                placeholder="Ingresá tu nueva contraseña"
                                                className="h-12 rounded-xl border-slate-200 pl-10 pr-12 focus-visible:ring-indigo-500"
                                            />

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowPassword(
                                                        !showPassword,
                                                    )
                                                }
                                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-indigo-600"
                                                aria-label={
                                                    showPassword
                                                        ? 'Ocultar contraseña'
                                                        : 'Mostrar contraseña'
                                                }
                                            >
                                                {showPassword ? (
                                                    <EyeOff className="h-4 w-4" />
                                                ) : (
                                                    <Eye className="h-4 w-4" />
                                                )}
                                            </button>
                                        </div>

                                        <InputError
                                            message={errors.password}
                                        />

                                        {passwordRules && (
                                            <p className="text-xs leading-relaxed text-slate-400">
                                                {passwordRules}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="password_confirmation"
                                            className="text-sm font-semibold text-slate-700"
                                        >
                                            Confirmar nueva contraseña
                                        </Label>

                                        <div className="relative">
                                            <LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                                            <Input
                                                id="password_confirmation"
                                                name="password_confirmation"
                                                type={
                                                    showPasswordConfirmation
                                                        ? 'text'
                                                        : 'password'
                                                }
                                                required
                                                autoComplete="new-password"
                                                placeholder="Repetí tu nueva contraseña"
                                                className="h-12 rounded-xl border-slate-200 pl-10 pr-12 focus-visible:ring-indigo-500"
                                            />

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowPasswordConfirmation(
                                                        !showPasswordConfirmation,
                                                    )
                                                }
                                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-indigo-600"
                                                aria-label={
                                                    showPasswordConfirmation
                                                        ? 'Ocultar contraseña'
                                                        : 'Mostrar contraseña'
                                                }
                                            >
                                                {showPasswordConfirmation ? (
                                                    <EyeOff className="h-4 w-4" />
                                                ) : (
                                                    <Eye className="h-4 w-4" />
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
                                        className="h-12 w-full rounded-xl bg-indigo-600 font-semibold shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700"
                                    >
                                        {processing
                                            ? 'Restableciendo contraseña...'
                                            : 'Guardar nueva contraseña'}

                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </>
                            )}
                        </Form>

                        <div className="mt-8 flex items-start gap-3 rounded-xl border border-indigo-100 bg-indigo-50/70 p-4">
                            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-indigo-600" />
                            <p className="text-xs leading-relaxed text-slate-600">
                                Una vez restablecida la contraseña, podrás
                                ingresar nuevamente desde el acceso
                                administrativo.
                            </p>
                        </div>

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
