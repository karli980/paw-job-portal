import type { InertiaLinkProps } from '@inertiajs/react';
import type { LucideIcon } from 'lucide-react';

export type BreadcrumbItem = {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
};

/**
 * Enlace individual de navegación.
 */
export type NavItem = {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
};

/**
 * Grupo desplegable con enlaces secundarios.
 */
export type NavGroup = {
    title: string;
    icon?: LucideIcon | null;
    items: NavItem[];
};

/**
 * Elementos admitidos en la navegación principal.
 */
export type NavMainItem = NavItem | NavGroup;
