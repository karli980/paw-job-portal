import { Head, Link } from '@inertiajs/react';
import {
    Activity,
    ArrowRight,
    Building2,
    BriefcaseBusiness,
    FileText,
    ShieldCheck,
    Users,
    UserRound,
    Settings,
    MessageSquareQuote,
} from 'lucide-react';

import { useAuth } from '@/hooks/use-auth';
import { dashboard } from '@/routes';

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

import { Button } from '@/components/ui/button';

const indicadores = [
    {
        titulo: 'Usuarios registrados',
        descripcion: 'Total de cuentas de la plataforma',
        valor: '—',
        icono: Users,
    },
    {
        titulo: 'Candidatos',
        descripcion: 'Personas buscando empleo',
        valor: '—',
        icono: UserRound,
    },
    {
        titulo: 'Empresas',
        descripcion: 'Organizaciones registradas',
        valor: '—',
        icono: Building2,
    },
    {
        titulo: 'Ofertas laborales',
        descripcion: 'Oportunidades publicadas',
        valor: '—',
        icono: BriefcaseBusiness,
    },
];

const accesos = [
    {
        titulo: 'Testimonios',
        descripcion: 'Administrar y moderar testimonios.',
        icono: MessageSquareQuote,
        href: '/testimonios',
        disponible: true,
    },
    {
        titulo: 'Usuarios',
        descripcion: 'Consultar y administrar las cuentas.',
        icono: Users,
        disponible: false,
    },
    {
        titulo: 'Roles',
        descripcion: 'Gestionar roles de la plataforma.',
        icono: ShieldCheck,
        disponible: false,
    },
    {
        titulo: 'Permisos',
        descripcion: 'Administrar permisos de acceso.',
        icono: Settings,
        disponible: false,
    },
];

export default function Dashboard() {
    const { user } = useAuth();

    const nombre = user
        ? `${user.nombre ?? ''} ${user.apellido ?? ''}`.trim()
        : 'Super Administrador';

    return (
        <>
            <Head title="Dashboard | Super Admin" />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                {/* Encabezado */}
                <div className="flex flex-col gap-4 rounded-2xl border bg-gradient-to-br from-indigo-600 to-violet-700 p-6 text-white shadow-sm md:flex-row md:items-center md:justify-between md:p-8">
                    <div>
                        <div className="mb-2 flex items-center gap-2 text-sm font-medium text-indigo-100">
                            <ShieldCheck className="size-4" />
                            Panel de Super Administración
                        </div>

                        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                            ¡Bienvenido, {nombre}!
                        </h1>

                        <p className="mt-2 max-w-2xl text-sm text-indigo-100 md:text-base">
                            Desde aquí podés supervisar y administrar los
                            principales recursos de Talent Match.
                        </p>
                    </div>

                    <div className="flex items-center gap-2 self-start rounded-xl border border-white/20 bg-white/10 px-4 py-3 md:self-center">
                        <Activity className="size-5" />
                        <div>
                            <p className="text-sm font-semibold">
                                Plataforma
                            </p>
                            <p className="text-xs text-indigo-100">
                                En desarrollo
                            </p>
                        </div>
                    </div>
                </div>

                {/* Indicadores */}
                <section className="space-y-4">
                    <div>
                        <h2 className="text-lg font-semibold tracking-tight">
                            Resumen general
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Indicadores principales de Talent Match.
                        </p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        {indicadores.map((indicador) => {
                            const Icono = indicador.icono;

                            return (
                                <Card key={indicador.titulo}>
                                    <CardContent className="flex items-start justify-between gap-4 p-5">
                                        <div className="space-y-2">
                                            <p className="text-sm font-medium text-muted-foreground">
                                                {indicador.titulo}
                                            </p>

                                            <p className="text-3xl font-bold tracking-tight">
                                                {indicador.valor}
                                            </p>

                                            <p className="text-xs text-muted-foreground">
                                                {indicador.descripcion}
                                            </p>
                                        </div>

                                        <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300">
                                            <Icono className="size-5" />
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>

                    <p className="text-xs text-muted-foreground">
                        Los indicadores se conectarán con los datos reales de
                        la base de datos en la siguiente etapa.
                    </p>
                </section>

                {/* Accesos rápidos */}
                <section className="space-y-4">
                    <div>
                        <h2 className="text-lg font-semibold tracking-tight">
                            Administración
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Accesos a las principales herramientas de gestión.
                        </p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        {accesos.map((acceso) => {
                            const Icono = acceso.icono;

                            return (
                                <Card
                                    key={acceso.titulo}
                                    className="transition-shadow hover:shadow-md"
                                >
                                    <CardHeader className="pb-3">
                                        <div className="mb-2 flex items-center justify-between">
                                            <div className="rounded-xl bg-muted p-3">
                                                <Icono className="size-5 text-indigo-600 dark:text-indigo-400" />
                                            </div>

                                            {!acceso.disponible && (
                                                <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                                                    Próximamente
                                                </span>
                                            )}
                                        </div>

                                        <CardTitle className="text-base">
                                            {acceso.titulo}
                                        </CardTitle>

                                        <CardDescription>
                                            {acceso.descripcion}
                                        </CardDescription>
                                    </CardHeader>

                                    <CardContent>
                                        {acceso.disponible ? (
                                            <Button
                                                asChild
                                                variant="outline"
                                                className="w-full justify-between"
                                            >
                                                <Link href={acceso.href!}>
                                                    Acceder
                                                    <ArrowRight className="size-4" />
                                                </Link>
                                            </Button>
                                        ) : (
                                            <Button
                                                variant="outline"
                                                className="w-full justify-between"
                                                disabled
                                            >
                                                En preparación
                                                <ArrowRight className="size-4" />
                                            </Button>
                                        )}
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </section>

                {/* Actividad */}
                <section>
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Activity className="size-5 text-indigo-600 dark:text-indigo-400" />
                                <CardTitle>Actividad de la plataforma</CardTitle>
                            </div>

                            <CardDescription>
                                Aquí se visualizarán los últimos movimientos
                                administrativos y eventos importantes.
                            </CardDescription>
                        </CardHeader>

                        <CardContent>
                            <div className="flex min-h-40 flex-col items-center justify-center rounded-xl border border-dashed bg-muted/30 p-6 text-center">
                                <div className="mb-3 rounded-full bg-muted p-3">
                                    <FileText className="size-6 text-muted-foreground" />
                                </div>

                                <p className="font-medium">
                                    Actividad reciente
                                </p>

                                <p className="mt-1 max-w-md text-sm text-muted-foreground">
                                    En una próxima etapa conectaremos esta
                                    sección con los registros de actividad
                                    del sistema.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </section>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
