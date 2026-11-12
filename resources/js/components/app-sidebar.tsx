import { Link } from '@inertiajs/react';

import {
    Award,
    BookOpen,
    BriefcaseBusiness,
    GraduationCap,
    Languages,
    LayoutGrid,
    MapPin,
    MessageSquareQuote,
    Settings,
    Share2,
    ShieldCheck,
    UserRound,
    Users,
    Wallet,
} from 'lucide-react';

import type { LucideIcon } from 'lucide-react';

import AppLogo from '@/components/app-logo';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';

import { useAuth } from '@/hooks/use-auth';


import type { NavItem, NavMainItem } from '@/types';

// --------------------------------------------------
// TIPOS
// --------------------------------------------------

type CatalogSection = {
    title: string;
    permissions: string[];
    icon: LucideIcon;
    roles?: string[];
    items: NavItem[];
};

// --------------------------------------------------
// CATÁLOGOS ADMINISTRATIVOS
// --------------------------------------------------

const catalogSections: CatalogSection[] = [
    {
        title: 'Ubicaciones',
        permissions: [
            'listar ubicaciones',
            'gestionar ubicaciones',
        ],
        icon: MapPin,
        items: [
            { title: 'Países', href: '/paises' },
            { title: 'Provincias', href: '/provincias' },
            { title: 'Ciudades', href: '/ciudades' },
        ],
    },
    {
        title: 'Datos generales',
        permissions: [
            'listar datos generales',
            'gestionar datos generales',
        ],
        icon: Settings,
        items: [
            { title: 'Géneros', href: '/generos' },
            { title: 'Estados civiles', href: '/estado-civil' },
            { title: 'Beneficios', href: '/beneficios' },
            {
                title: 'Cantidad de empleados',
                href: '/cantidad-empleados',
            },
            { title: 'Monedas', href: '/monedas' },
            { title: 'Industrias', href: '/industrias' },
            {
                title: 'Modalidades de trabajo',
                href: '/modalidades-trabajo',
            },
        ],
    },
    {
        title: 'Formación',
        permissions: [
            'listar formacion',
            'gestionar formacion',
        ],
        icon: BookOpen,
        items: [
            {
                title: 'Áreas de estudio',
                href: '/areas-estudio',
            },
            {
                title: 'Niveles de estudio',
                href: '/niveles-estudio',
            },
            {
                title: 'Estados de estudio',
                href: '/estado-estudios',
            },
            {
                title: 'Idiomas',
                href: '/idiomas',
            },
        ],
    },
    {
        title: 'Experiencia laboral',
        permissions: [
            'listar experiencia laboral',
            'gestionar experiencia laboral',
        ],
        icon: BriefcaseBusiness,
        items: [
            {
                title: 'Áreas laborales',
                href: '/areas-laborales',
            },
            {
                title: 'Subáreas laborales',
                href: '/sub-areas-laborales',
            },
        ],
    },
    {
        title: 'Competencias',
        permissions: [
            'listar competencias',
            'gestionar competencias',
        ],
        roles: [
            'super-admin',
            'admin',
            'moderador',
        ],
        icon: Award,
        items: [
            {
                title: 'Categorías de habilidades',
                href: '/categorias-habilidades',
            },
            {
                title: 'Habilidades',
                href: '/habilidades',
            },
            {
                title: 'Niveles de habilidad',
                href: '/niveles-habilidades',
            },
            {
                title: 'Destrezas',
                href: '/destrezas',
            },
        ],
    },
    {
        title: 'Redes sociales',
        permissions: [
            'listar redes sociales',
            'gestionar redes sociales',
        ],
        icon: Share2,
        items: [
            {
                title: 'Redes sociales',
                href: '/redes-sociales',
            },
        ],
    },
];

// --------------------------------------------------
// SIDEBAR
// --------------------------------------------------

export function AppSidebar() {

    const {
        hasRole,
        hasAnyRole,
        can,
        canAny,
        isSuperAdmin,
    } = useAuth();

    // ----------------------------------------------
    // DASHBOARD SEGÚN EL ROL
    // ----------------------------------------------

    const dashboardHref = hasAnyRole([
        'super-admin',
        'admin',
        'moderador',
    ])
        ? '/admin/dashboard'
        : hasRole('representante_empresa')
            ? '/empresa/dashboard'
            : '/';

    // ----------------------------------------------
    // NAVEGACIÓN GENERAL
    // ----------------------------------------------

    const mainNavItems: NavMainItem[] = [
        {
            title: 'Dashboard',
            href: dashboardHref,
            icon: LayoutGrid,
        },
    ];


    // ----------------------------------------------
    // MENÚ DEL CANDIDATO
    // ----------------------------------------------

    if (hasRole('candidato')) {
        mainNavItems.push({
            title: 'Mi perfil profesional',
            icon: UserRound,
            items: [
                {
                    title: 'Estudios',
                    href: '/candidato/estudios',
                    icon: GraduationCap,
                },
                {
                    title: 'Experiencias laborales',
                    href: '/candidato/experiencias-laborales',
                    icon: BriefcaseBusiness,
                },
                {
                    title: 'Idiomas',
                    href: '/candidato/idiomas',
                    icon: Languages,
                },
                {
                    title: 'Salario pretendido',
                    href: '/candidato/salario-pretendido',
                    icon: Wallet,
                },
            ],
        });
    }


    // ----------------------------------------------
    // ADMINISTRACIÓN
    // ----------------------------------------------

    // Ambas rutas exigen role:super-admin.
    if (isSuperAdmin) {
        mainNavItems.push({
            title: 'Administración',
            icon: ShieldCheck,
            items: [
                {
                    title: 'Administradores',
                    href: '/admin/usuarios',
                    icon: Users,
                },
                {
                    title: 'Permisos',
                    href: '/admin/permisos',
                    icon: ShieldCheck,
                },
            ],
        });
    }

    // ----------------------------------------------
    // CATÁLOGOS
    // ----------------------------------------------

    catalogSections.forEach((section) => {
        // Verificar los permisos de lectura o gestión.
        const tienePermiso = canAny(section.permissions);

        // Verificar el rol cuando sea necesario.
        const tieneRol =
            !section.roles ||
            hasAnyRole(section.roles);

        if (tienePermiso && tieneRol) {
            mainNavItems.push({
                title: section.title,
                icon: section.icon,
                items: section.items,
            });
        }
    });

    // ----------------------------------------------
    // GESTIÓN DE CONTENIDO
    // ----------------------------------------------

    if (can('listar testimonios')) {
        mainNavItems.push({
            title: 'Gestión de contenido',
            icon: MessageSquareQuote,
            items: [
                {
                    title: 'Testimonios',
                    href: '/testimonios',
                    icon: MessageSquareQuote,
                },
            ],
        });
    }

    // ----------------------------------------------
    // RENDERIZADO
    // ----------------------------------------------

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboardHref} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>


            <SidebarContent className="min-w-0 overflow-x-hidden overflow-y-auto">
                <NavMain items={mainNavItems} />
            </SidebarContent>


            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
