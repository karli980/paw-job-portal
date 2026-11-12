import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    BriefcaseBusiness,
    Building2,
    ChartColumn,
    ClipboardList,
    MapPin,
    Users,
} from 'lucide-react';

interface Empresa {
    id: number;
    nombre_comercial: string;
}

interface DashboardProps {
    empresas: Empresa[];
}

export default function Dashboard({ empresas }: DashboardProps) {
    return (
        <>
            <Head title="Dashboard empresarial - Talent Match" />

            <main className="min-h-screen bg-slate-50 text-slate-900">
                <header className="border-b border-slate-200 bg-white">
                    <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
                        <div className="flex items-center gap-3">
                            <div className="flex size-11 items-center justify-center rounded-xl bg-indigo-600 text-white">
                                <BriefcaseBusiness className="size-6" />
                            </div>

                            <div>
                                <h1 className="text-lg font-bold">
                                    Talent Match
                                </h1>
                                <p className="text-xs text-slate-500">
                                    Panel empresarial
                                </p>
                            </div>
                        </div>

                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-indigo-600"
                        >
                            <ArrowLeft className="size-4" />
                            Ir al inicio
                        </Link>
                    </div>
                </header>

                <div className="mx-auto max-w-6xl space-y-10 px-6 py-10">
                    <section>
                        <h2 className="text-3xl font-bold tracking-tight">
                            Dashboard empresarial
                        </h2>

                        <p className="mt-2 text-slate-500">
                            Administrá tus empresas, ofertas laborales
                            y procesos de selección desde un solo lugar.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Building2 className="size-5 text-indigo-600" />
                            <h3 className="text-xl font-semibold">
                                Mis empresas
                            </h3>
                        </div>

                        {empresas.length === 0 ? (
                            <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-800">
                                No tenés empresas activas asociadas
                                a tu cuenta.
                            </div>
                        ) : (
                            <div className="grid gap-4 md:grid-cols-2">
                                {empresas.map((empresa) => (
                                    <article
                                        key={empresa.id}
                                        className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="rounded-lg bg-indigo-50 p-3 text-indigo-600">
                                                <Building2 className="size-6" />
                                            </div>

                                            <div>
                                                <h4 className="font-semibold">
                                                    {empresa.nombre_comercial}
                                                </h4>
                                                <p className="text-xs text-slate-500">
                                                    Empresa #{empresa.id}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mt-5 border-t border-slate-100 pt-4">
                                            <Link
                                                href={`/empresa/${empresa.id}/perfil`}
                                                className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                                            >
                                                <MapPin className="size-4" />
                                                Completar o editar perfil empresarial
                                            </Link>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        )}
                    </section>

                    <section className="space-y-4">
                        <h3 className="text-xl font-semibold">
                            Módulos empresariales
                        </h3>

                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {[
                                {
                                    titulo: 'Ofertas laborales',
                                    descripcion:
                                        'Crear, publicar y administrar búsquedas laborales.',
                                    Icono: ClipboardList,
                                },
                                {
                                    titulo: 'Postulaciones',
                                    descripcion:
                                        'Gestionar los candidatos y sus procesos de selección.',
                                    Icono: Users,
                                },
                                {
                                    titulo: 'Estadísticas',
                                    descripcion:
                                        'Consultar indicadores y resultados de las ofertas.',
                                    Icono: ChartColumn,
                                },
                            ].map((modulo) => (
                                <article
                                    key={modulo.titulo}
                                    className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
                                >
                                    <modulo.Icono className="size-6 text-indigo-600" />

                                    <h4 className="mt-4 font-semibold">
                                        {modulo.titulo}
                                    </h4>

                                    <p className="mt-2 text-sm leading-6 text-slate-500">
                                        {modulo.descripcion}
                                    </p>

                                    <p className="mt-5 text-xs font-medium text-indigo-600">
                                        Próximamente
                                    </p>
                                </article>
                            ))}
                        </div>
                    </section>
                </div>
            </main>
        </>
    );
}
