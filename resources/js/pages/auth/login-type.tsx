import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    ArrowRight,
    BriefcaseBusiness,
    Building2,
    UserRoundSearch,
} from 'lucide-react';

const options = [
    {
        href: '/login?tipo=candidato',
        icon: UserRoundSearch,
        title: 'Soy candidato',
        text: 'Buscá oportunidades laborales, administrá tu perfil profesional y seguí tus postulaciones.',
        cta: 'Ingresar como candidato',
    },
    {
        href: '/login?tipo=empresa',
        icon: Building2,
        title: 'Soy empresa',
        text: 'Publicá ofertas laborales, administrá tus búsquedas y conectá con profesionales que se ajusten a lo que necesitás.',
        cta: 'Ingresar como empresa',
    },
];

export default function LoginType() {
    return (
        <>
            <Head title="Iniciar sesión | JobPortal" />

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
                            Bienvenido nuevamente.
                        </h1>

                        <p className="mt-5 text-base leading-7 text-slate-400">
                            Accedé a tu espacio de trabajo y continuá donde lo
                            dejaste.
                        </p>
                    </div>

                    <p className="relative text-xs text-slate-500">
                        © {new Date().getFullYear()} JobPortal. Todos los
                        derechos reservados.
                    </p>
                </aside>

                {/* Panel de opciones */}
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
                            href="/"
                            className="group inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                        >
                            <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5" />
                            <span>Volver al inicio</span>
                        </Link>
                    </header>

                    <div className="flex flex-1 items-center justify-center px-6 py-10 sm:px-10">
                        <div className="w-full max-w-md">
                            <h2 className="text-3xl font-bold tracking-tight text-slate-950">
                                Ingresá a JobPortal
                            </h2>
                            <p className="mt-2 text-sm leading-6 text-slate-500">
                                Seleccioná el tipo de cuenta para continuar.
                            </p>

                            <div className="mt-8 space-y-4">
                                {options.map(
                                    ({ href, icon: Icon, title, text, cta }) => (
                                        <Link
                                            key={href}
                                            href={href}
                                            className="group flex items-start gap-4 rounded-xl border border-slate-300 bg-white p-5 transition hover:border-indigo-600 hover:bg-indigo-50/40 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-600/15"
                                        >
                                            <span className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white">
                                                <Icon className="size-6 stroke-[1.5]" />
                                            </span>

                                            <div className="min-w-0 flex-1">
                                                <h3 className="text-lg font-bold tracking-tight text-slate-950">
                                                    {title}
                                                </h3>

                                                <p className="mt-1 text-sm leading-6 text-slate-500">
                                                    {text}
                                                </p>

                                                <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 group-hover:text-indigo-700">
                                                    {cta}
                                                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                                                </span>
                                            </div>
                                        </Link>
                                    ),
                                )}
                            </div>

                            {/* Registro */}
                            <p className="mt-8 text-center text-sm text-slate-600">
                                ¿Todavía no tenés una cuenta?{' '}
                                <Link
                                    href="/register"
                                    className="font-semibold text-indigo-600 hover:text-indigo-700 hover:underline"
                                >
                                    Registrate gratis
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
