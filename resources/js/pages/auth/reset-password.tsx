import { Form, Head } from '@inertiajs/react';
import {
    ArrowLeft,
    BriefcaseBusiness,
    KeyRound,
    LoaderCircle,
    LockKeyhole,
    Mail,
} from 'lucide-react';

import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { login } from '@/routes';
import { update } from '@/routes/password';
import TextLink from '@/components/text-link';

type Props = {
    token: string;
    email: string;
    passwordRules: string;
};

const inputClass =
    'h-12 rounded-lg border-slate-300 bg-white text-[15px] shadow-none placeholder:text-slate-400 focus-visible:border-indigo-600 focus-visible:ring-4 focus-visible:ring-indigo-600/15';

const labelClass = 'text-sm font-medium text-slate-700';

export default function ResetPassword({
    token,
    email,
    passwordRules,
}: Props) {
    return (
        <>
            <Head title="Crear nueva contraseña | JobPortal" />

            <main className="grid min-h-screen bg-white text-slate-900 lg:grid-cols-[1.05fr_1fr]">
                {/* Panel de marca (solo escritorio) */}
                <aside className="relative hidden flex-col justify-between overflow-hidden bg-slate-950 p-12 text-white lg:flex xl:p-16">
                    <div className="pointer-events-none absolute -left-24 -top-24 h-[420px] w-[420px] rounded-full bg-indigo-600/30 blur-[120px]" />

                    <div className="relative flex w-fit items-center gap-3">
                        <span className="flex size-10 items-center justify-center rounded-lg bg-indigo-600">
                            <BriefcaseBusiness className="size-5" />
                        </span>
                        <span className="text-xl font-bold tracking-tight">
                            JobPortal
                        </span>
                    </div>

                    <div className="relative max-w-md">
                        <h1 className="text-5xl font-bold leading-[1.08] tracking-tight">
                            Volvé a acceder a tu cuenta.
                        </h1>

                        <p className="mt-5 text-base leading-7 text-slate-400">
                            Elegí una contraseña segura para seguir
                            aprovechando todo lo que JobPortal tiene para
                            ofrecerte.
                        </p>
                    </div>

                    <p className="relative text-xs text-slate-500">
                        © {new Date().getFullYear()} JobPortal. Todos los
                        derechos reservados.
                    </p>
                </aside>

                {/* Panel del formulario */}
                <section className="flex min-h-screen flex-col">
                    <header className="flex h-[72px] items-center px-6 sm:px-10 lg:invisible">
                        <div className="flex items-center gap-2.5">
                            <span className="flex size-9 items-center justify-center rounded-lg bg-indigo-600 text-white">
                                <BriefcaseBusiness className="size-[18px]" />
                            </span>
                            <span className="text-lg font-bold tracking-tight">
                                JobPortal
                            </span>
                        </div>
                    </header>

                    <div className="flex flex-1 items-center justify-center px-6 py-10 sm:px-10">
                        <div className="w-full max-w-sm">
                            <span className="flex size-14 items-center justify-center rounded-xl bg-indigo-600 text-white">
                                <KeyRound className="size-7 stroke-[1.5]" />
                            </span>

                            <h2 className="mt-6 text-3xl font-bold tracking-tight text-slate-950">
                                Creá una nueva contraseña
                            </h2>

                            <p className="mt-2 text-sm leading-6 text-slate-500">
                                Elegí una contraseña segura para volver a
                                acceder a tu cuenta de JobPortal.
                            </p>

                            <Form
                                {...update.form()}
                                transform={(data) => ({
                                    ...data,
                                    token,
                                    email,
                                })}
                                resetOnSuccess={[
                                    'password',
                                    'password_confirmation',
                                ]}
                                className="mt-8"
                            >
                                {({ processing, errors }) => (
                                    <div className="space-y-5">
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
                                                    type="email"
                                                    name="email"
                                                    autoComplete="email"
                                                    value={email}
                                                    readOnly
                                                    className={`${inputClass} border-slate-200 bg-slate-50 pl-11 text-slate-500`}
                                                />
                                            </div>

                                            <InputError message={errors.email} />
                                        </div>

                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="password"
                                                className={labelClass}
                                            >
                                                Nueva contraseña
                                            </Label>

                                            <PasswordInput
                                                id="password"
                                                name="password"
                                                autoComplete="new-password"
                                                autoFocus
                                                placeholder="Ingresá tu nueva contraseña"
                                                passwordrules={passwordRules}
                                                className={inputClass}
                                            />

                                            <InputError message={errors.password} />
                                        </div>

                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="password_confirmation"
                                                className={labelClass}
                                            >
                                                Confirmar contraseña
                                            </Label>

                                            <PasswordInput
                                                id="password_confirmation"
                                                name="password_confirmation"
                                                autoComplete="new-password"
                                                placeholder="Repetí tu nueva contraseña"
                                                passwordrules={passwordRules}
                                                className={inputClass}
                                            />

                                            <InputError
                                                message={
                                                    errors.password_confirmation
                                                }
                                            />
                                        </div>

                                        <p className="flex items-start gap-2 text-xs leading-5 text-slate-500">
                                            <LockKeyhole className="mt-0.5 size-4 shrink-0 text-indigo-600" />
                                            Utilizá una contraseña segura que no
                                            hayas usado anteriormente en otros
                                            servicios.
                                        </p>

                                        <Button
                                            type="submit"
                                            className="h-12 w-full rounded-lg bg-indigo-600 text-[15px] font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus-visible:ring-4 focus-visible:ring-indigo-600/25 disabled:opacity-80"
                                            disabled={processing}
                                            data-test="reset-password-button"
                                        >
                                            {processing ? (
                                                <>
                                                    <LoaderCircle className="mr-2 size-4 animate-spin" />
                                                    Actualizando contraseña...
                                                </>
                                            ) : (
                                                'Guardar nueva contraseña'
                                            )}
                                        </Button>
                                    </div>
                                )}
                            </Form>

                            <div className="mt-8 text-center">
                                <TextLink
                                    href={login()}
                                    className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-700"
                                >
                                    <ArrowLeft className="size-4" />
                                    Volver al inicio de sesión
                                </TextLink>
                            </div>
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
