import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import {
    BriefcaseBusiness,
    CheckCircle2,
    MailCheck,
    RefreshCw,
} from 'lucide-react';

import { Button } from '@/components/ui/button';

interface VerifyEmailProps {
    status?: string | null;
}

export default function VerifyEmail({ status }: VerifyEmailProps) {
    const [processing, setProcessing] = useState(false);

    const { auth } = usePage<{
        auth: {
            user: {
                email?: string;
            };
        };
    }>().props;

    function resendVerification() {
        setProcessing(true);

        router.post(
            '/email/verification-notification',
            {},
            {
                preserveScroll: true,
                onFinish: () => setProcessing(false),
            },
        );
    }

    return (
        <>
            <Head title="Verificar correo electrónico" />

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
                            Un último paso para empezar.
                        </h1>

                        <p className="mt-5 text-base leading-7 text-slate-400">
                            Verificar tu correo nos ayuda a mantener tu cuenta
                            protegida y a que puedas acceder a todas las
                            funciones de JobPortal.
                        </p>
                    </div>

                    <p className="relative text-xs text-slate-500">
                        © {new Date().getFullYear()} JobPortal. Todos los
                        derechos reservados.
                    </p>
                </aside>

                {/* Panel de verificación */}
                <section className="flex min-h-screen flex-col">
                    <header className="flex h-[72px] items-center justify-center px-6 sm:px-10 lg:invisible">
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
                        <div className="w-full max-w-sm text-center">
                            <span className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-indigo-600 text-white">
                                <MailCheck className="size-8 stroke-[1.5]" />
                            </span>

                            <h2 className="mt-7 text-3xl font-bold tracking-tight text-slate-950">
                                Verificá tu correo
                            </h2>

                            <p className="mx-auto mt-3 max-w-xs text-sm leading-6 text-slate-500">
                                Antes de continuar, necesitamos que verifiques
                                tu dirección de correo electrónico.
                            </p>

                            {auth.user?.email && (
                                <p className="mx-auto mt-5 w-fit max-w-full break-all rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-900">
                                    {auth.user.email}
                                </p>
                            )}

                            {status && (
                                <div
                                    role="status"
                                    className="mt-6 flex items-center justify-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
                                >
                                    <CheckCircle2 className="size-4 shrink-0" />
                                    <span>{status}</span>
                                </div>
                            )}

                            <Button
                                className="mt-8 h-12 w-full rounded-lg bg-indigo-600 text-[15px] font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus-visible:ring-4 focus-visible:ring-indigo-600/25 disabled:opacity-80"
                                onClick={resendVerification}
                                disabled={processing}
                            >
                                <RefreshCw
                                    className={`mr-2 size-4 ${processing ? 'animate-spin' : ''}`}
                                />
                                {processing
                                    ? 'Enviando...'
                                    : 'Reenviar correo de verificación'}
                            </Button>

                            <Button
                                variant="ghost"
                                className="mt-2 h-12 w-full rounded-lg text-[15px] font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                                onClick={() => router.post('/logout')}
                            >
                                Cerrar sesión
                            </Button>

                            <p className="mt-6 text-xs leading-5 text-slate-500">
                                Si no lo ves en tu bandeja de entrada, revisá
                                la carpeta de spam.
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
