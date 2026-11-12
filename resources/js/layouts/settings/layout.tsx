import { Link } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';

import {
    Palette,
    ShieldCheck,
    UserRound,
} from 'lucide-react';

import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

import { useCurrentUrl } from '@/hooks/use-current-url';
import { cn, toUrl } from '@/lib/utils';

import { edit as editAppearance } from '@/routes/appearance';
import { edit } from '@/routes/profile';
import { edit as editSecurity } from '@/routes/security';

import type { NavItem } from '@/types';

// --------------------------------------------------
// NAVEGACIÓN DE CONFIGURACIÓN
// --------------------------------------------------

const sidebarNavItems: NavItem[] = [
    {
        title: 'Mi perfil',
        href: edit(),
        icon: UserRound,
    },
    {
        title: 'Seguridad',
        href: editSecurity(),
        icon: ShieldCheck,
    },
    {
        title: 'Apariencia',
        href: editAppearance(),
        icon: Palette,
    },
];

// --------------------------------------------------
// LAYOUT DE CONFIGURACIÓN
// --------------------------------------------------

export default function SettingsLayout({
    children,
}: PropsWithChildren) {
    const { isCurrentOrParentUrl } = useCurrentUrl();

    return (
        <div className="px-4 py-6">
            {/* ENCABEZADO */}
            <Heading
                title="Configuración"
                description="Administrá tu perfil, la seguridad de tu cuenta y las preferencias de apariencia."
            />

            <div className="flex flex-col lg:flex-row lg:gap-12">
                {/* MENÚ LATERAL */}
                <aside className="w-full max-w-xl lg:w-52">
                    <nav
                        className="flex flex-col gap-1"
                        aria-label="Configuración de la cuenta"
                    >
                        {sidebarNavItems.map((item, index) => {
                            const isActive =
                                isCurrentOrParentUrl(item.href);

                            return (
                                <Button
                                    key={`${toUrl(item.href)}-${index}`}
                                    size="sm"
                                    variant="ghost"
                                    asChild
                                    className={cn(
                                        'h-10 w-full justify-start gap-3 rounded-lg px-3 text-sm font-medium transition-colors',
                                        isActive
                                            ? 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 hover:text-indigo-800 dark:bg-indigo-500/15 dark:text-indigo-300'
                                            : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                                    )}
                                >
                                    <Link
                                        href={item.href}
                                        aria-current={
                                            isActive ? 'page' : undefined
                                        }
                                    >
                                        {item.icon && (
                                            <item.icon className="size-4 shrink-0" />
                                        )}

                                        <span>{item.title}</span>
                                    </Link>
                                </Button>
                            );
                        })}
                    </nav>
                </aside>

                {/* SEPARADOR EN MÓVILES */}
                <Separator className="my-6 lg:hidden" />

                {/* CONTENIDO DE CONFIGURACIÓN */}
                <div className="min-w-0 flex-1 md:max-w-2xl">
                    <section className="max-w-xl space-y-12">
                        {children}
                    </section>
                </div>
            </div>
        </div>
    );
}
