import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    ArrowRight,
    BriefcaseBusiness,
    Building2,
    Check,
    UserRoundSearch,
} from 'lucide-react';

const options = [
    {
        href: '/register?tipo=candidato',
        icon: UserRoundSearch,
        title: 'Soy candidato',
        text: 'Buscá oportunidades laborales, creá tu perfil profesional y postulate a empleos.',
        perks: ['Perfil profesional gratuito', 'Postulaciones ilimitadas'],
        cta: 'Encontrar empleo',
    },
    {
        href: '/register?tipo=empresa',
        icon: Building2,
        title: 'Soy empresa',
        text: 'Publicá ofertas laborales, administrá tus búsquedas y conectá con nuevos talentos.',
        perks: ['Publicación de ofertas', 'Gestión de candidatos'],
        cta: 'Buscar talentos',
    },
];

export default function RegisterType() {
    return (
        <>
            <Head title="Crear cuenta" />

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
                            Creá tu cuenta en JobPortal.
                        </h1>

                        <p className="mt-5 text-base leading-7 text-slate-400">
                            Elegí la opción que mejor te representa y empezá a
                            aprovechar nuevas oportunidades hoy mismo.
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
                            <span className="hidden sm:inline">
                                Volver al inicio
                            </span>
                            <span className="sm:hidden">Volver</span>
                        </Link>
                    </header>

                    <div className="flex flex-1 items-center justify-center px-6 py-10 sm:px-10">
                        <div className="w-full max-w-md">
                            <h2 className="text-3xl font-bold tracking-tight text-slate-950">
                                Creá tu cuenta
                            </h2>
                            <p className="mt-2 text-sm leading-6 text-slate-500">
                                Elegí el tipo de cuenta que querés crear.
                            </p>

                            <div className="mt-8 space-y-4">
                                {options.map(
                                    ({ href, icon: Icon, title, text, perks, cta }) => (
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

                                                <ul className="mt-3 space-y-1.5 text-sm text-slate-600">
                                                    {perks.map((perk) => (
                                                        <li
                                                            key={perk}
                                                            className="flex items-center gap-2"
                                                        >
                                                            <Check className="size-4 shrink-0 text-indigo-600" />
                                                            {perk}
                                                        </li>
                                                    ))}
                                                </ul>

                                                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 group-hover:text-indigo-700">
                                                    {cta}
                                                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                                                </span>
                                            </div>
                                        </Link>
                                    ),
                                )}
                            </div>

                            {/* Inicio de sesión */}
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
