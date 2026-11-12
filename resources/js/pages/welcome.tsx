
import { Head, Link, router } from '@inertiajs/react';
import { useState, type FormEvent } from 'react';
import {
    ArrowRight,
    BriefcaseBusiness,
    MapPin,
    Search,
    Target,
    TrendingUp,
    Users,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Welcome() {
    const [keyword, setKeyword] = useState('');
    const [location, setLocation] = useState('');

    function handleSearch(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        // Preparado para conectar con el listado público de empleos.
        router.get(
            '/empleos',
            {
                palabra_clave: keyword.trim(),
                ubicacion: location.trim(),
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    }

    return (
        <>
            <Head title="Encontrá tu próximo empleo" />

            <div className="min-h-screen bg-white text-slate-900">
                {/* Navegación */}
                <header className="border-b border-slate-100">
                    <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
                        <Link
                            href="/"
                            className="flex items-center gap-3"
                            aria-label="Ir al inicio"
                        >
                            <span className="flex size-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm">
                                <BriefcaseBusiness className="size-5" />
                            </span>

                            <span className="text-xl font-bold tracking-tight">
                                JobPortal
                            </span>
                        </Link>

                        <nav className="flex items-center gap-3">
                            <Link
                                href="/login"
                                className="hidden rounded-lg px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-indigo-600 sm:inline-flex"
                            >
                                Ingresar
                            </Link>

                            <Button asChild className="rounded-xl bg-indigo-600 hover:bg-indigo-700">
                                <Link href="/register">
                                    Crear cuenta
                                </Link>
                            </Button>
                        </nav>
                    </div>
                </header>

                <main>
                    {/* Hero y buscador */}
                    <section className="relative isolate overflow-hidden bg-slate-50">
                        <div
                            aria-hidden="true"
                            className="pointer-events-none absolute -right-24 -top-24 -z-10 size-96 rounded-full bg-indigo-100/70 blur-3xl"
                        />

                        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-[1.05fr_0.95fr]">
                            <div className="max-w-2xl">
                                <span className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white px-4 py-2 text-xs font-semibold tracking-wide text-indigo-700 shadow-sm">
                                    <span className="size-2 rounded-full bg-indigo-500" />
                                    TU PRÓXIMA OPORTUNIDAD COMIENZA AQUÍ
                                </span>

                                <h1 className="mt-7 text-4xl font-bold leading-tight tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                                    Encontrá el trabajo que te impulse a{' '}
                                    <span className="text-indigo-600">
                                        crecer.
                                    </span>
                                </h1>

                                <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
                                    Explorá oportunidades laborales y conectá
                                    tu talento con empresas que buscan personas
                                    como vos.
                                </p>

                                <div className="mt-8 flex flex-wrap gap-5 text-sm text-slate-600">
                                    <span className="flex items-center gap-2">
                                        <Target className="size-4 text-indigo-600" />
                                        Oportunidades para tu perfil
                                    </span>

                                    <span className="flex items-center gap-2">
                                        <TrendingUp className="size-4 text-indigo-600" />
                                        Crecimiento profesional
                                    </span>
                                </div>
                            </div>

                            {/* Tarjeta de búsqueda */}
                            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60 sm:p-8">
                                <div className="mb-6">
                                    <h2 className="text-xl font-bold text-slate-900">
                                        Buscá tu próximo empleo
                                    </h2>

                                    <p className="mt-2 text-sm text-slate-500">
                                        Empezá con un puesto o una ubicación.
                                    </p>
                                </div>

                                <form
                                    onSubmit={handleSearch}
                                    className="space-y-5"
                                >
                                    <div className="space-y-2">
                                        <label
                                            htmlFor="keyword"
                                            className="text-sm font-medium text-slate-700"
                                        >
                                            Palabra clave
                                        </label>

                                        <div className="relative">
                                            <Search className="pointer-events-none absolute left-3.5 top-1/2 size-5 -translate-y-1/2 text-slate-400" />

                                            <Input
                                                id="keyword"
                                                name="palabra_clave"
                                                value={keyword}
                                                onChange={(event) =>
                                                    setKeyword(event.target.value)
                                                }
                                                placeholder="Ej. Desarrollador, Diseño..."
                                                className="h-12 rounded-xl border-slate-200 pl-11 focus-visible:ring-indigo-500"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label
                                            htmlFor="location"
                                            className="text-sm font-medium text-slate-700"
                                        >
                                            Ubicación
                                        </label>

                                        <div className="relative">
                                            <MapPin className="pointer-events-none absolute left-3.5 top-1/2 size-5 -translate-y-1/2 text-slate-400" />

                                            <Input
                                                id="location"
                                                name="ubicacion"
                                                value={location}
                                                onChange={(event) =>
                                                    setLocation(event.target.value)
                                                }
                                                placeholder="Ciudad, provincia o remoto"
                                                className="h-12 rounded-xl border-slate-200 pl-11 focus-visible:ring-indigo-500"
                                            />
                                        </div>
                                    </div>

                                    <Button
                                        type="submit"
                                        className="h-12 w-full rounded-xl bg-indigo-600 text-base font-semibold hover:bg-indigo-700"
                                    >
                                        <Search className="mr-2 size-5" />
                                        Buscar empleos
                                        <ArrowRight className="ml-auto size-5" />
                                    </Button>
                                </form>

                                <p className="mt-5 text-center text-xs leading-5 text-slate-500">
                                    Tu próximo paso profesional puede empezar
                                    hoy.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Beneficios */}
                    <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
                        <div className="mx-auto max-w-2xl text-center">
                            <span className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
                                Una nueva forma de buscar
                            </span>

                            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                                Tu talento merece nuevas oportunidades
                            </h2>

                            <p className="mt-4 leading-7 text-slate-600">
                                Una plataforma pensada para acercarte a las
                                oportunidades que mejor se adapten a vos.
                            </p>
                        </div>

                        <div className="mt-12 grid gap-6 md:grid-cols-3">
                            <article className="rounded-2xl border border-slate-200 p-6 transition hover:-translate-y-1 hover:shadow-lg">
                                <div className="flex size-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                                    <Target className="size-6" />
                                </div>

                                <h3 className="mt-5 text-lg font-semibold">
                                    Encontrá tu rumbo
                                </h3>

                                <p className="mt-2 text-sm leading-6 text-slate-600">
                                    Descubrí oportunidades alineadas con tus
                                    habilidades y objetivos profesionales.
                                </p>
                            </article>

                            <article className="rounded-2xl border border-slate-200 p-6 transition hover:-translate-y-1 hover:shadow-lg">
                                <div className="flex size-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                                    <Users className="size-6" />
                                </div>

                                <h3 className="mt-5 text-lg font-semibold">
                                    Conectá con empresas
                                </h3>

                                <p className="mt-2 text-sm leading-6 text-slate-600">
                                    Acercate a organizaciones que buscan
                                    incorporar nuevos talentos.
                                </p>
                            </article>

                            <article className="rounded-2xl border border-slate-200 p-6 transition hover:-translate-y-1 hover:shadow-lg">
                                <div className="flex size-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                                    <TrendingUp className="size-6" />
                                </div>

                                <h3 className="mt-5 text-lg font-semibold">
                                    Crecé profesionalmente
                                </h3>

                                <p className="mt-2 text-sm leading-6 text-slate-600">
                                    Encontrá nuevas posibilidades para
                                    desarrollar tu carrera.
                                </p>
                            </article>
                        </div>
                    </section>
                </main>

                {/* Pie de página */}
                <footer className="border-t border-slate-200 bg-slate-50">
                    <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-8">
                        <p>
                            © {new Date().getFullYear()} JobPortal.
                            Todos los derechos reservados.
                        </p>

                        <Link
                            href="/login"
                            className="font-medium text-indigo-600 transition hover:text-indigo-700"
                        >
                            Accedé a tu cuenta
                        </Link>
                    </div>
                </footer>
            </div>
        </>
    );
}
