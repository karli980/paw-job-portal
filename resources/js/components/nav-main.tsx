import { Link, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

import {
    ChevronDown,
    ChevronsDownUp,
    ChevronsUpDown,
} from 'lucide-react';

import { Button } from '@/components/ui/button';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    useSidebar,
} from '@/components/ui/sidebar';

import { useCurrentUrl } from '@/hooks/use-current-url';

import type {
    NavGroup,
    NavMainItem,
} from '@/types';

// --------------------------------------------------
// TIPOS
// --------------------------------------------------

type NavDropdownProps = {
    item: NavGroup;
    open: boolean;
    onToggle: () => void;
    isCollapsed: boolean;
};

// --------------------------------------------------
// GRUPO DE NAVEGACIÓN
// --------------------------------------------------

function NavDropdown({
    item,
    open,
    onToggle,
    isCollapsed,
}: NavDropdownProps) {
    const { isCurrentUrl } = useCurrentUrl();

    const hasActiveChild = item.items.some((child) =>
        isCurrentUrl(child.href),
    );

    // ----------------------------------------------
    // SIDEBAR CONTRAÍDO
    // ----------------------------------------------

    if (isCollapsed) {
        return (
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            type="button"
                            isActive={hasActiveChild}
                            tooltip={item.title}
                            aria-label={item.title}
                        >
                            {item.icon && <item.icon />}

                            <span>{item.title}</span>
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                        side="right"
                        align="start"
                        sideOffset={8}
                        className="max-h-[70vh] min-w-56 overflow-y-auto"
                    >
                        <DropdownMenuLabel>
                            {item.title}
                        </DropdownMenuLabel>

                        <DropdownMenuSeparator />

                        {item.items.map((child) => (
                            <DropdownMenuItem
                                key={child.title}
                                asChild
                            >
                                <Link
                                    href={child.href}
                                    prefetch
                                    className={
                                        isCurrentUrl(child.href)
                                            ? 'bg-accent font-medium'
                                            : ''
                                    }
                                >
                                    {child.icon && (
                                        <child.icon className="size-4" />
                                    )}

                                    <span>{child.title}</span>
                                </Link>
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        );
    }

    // ----------------------------------------------
    // SIDEBAR EXPANDIDO
    // ----------------------------------------------

    return (
        <SidebarMenuItem>
            <SidebarMenuButton
                type="button"
                onClick={onToggle}
                isActive={hasActiveChild}
                tooltip={item.title}
                aria-expanded={open}
            >
                {item.icon && <item.icon />}

                <span>{item.title}</span>

                <ChevronDown
                    className={`ml-auto size-4 transition-transform duration-200 ${
                        open ? 'rotate-180' : ''
                    }`}
                />
            </SidebarMenuButton>

            {open && (
                <SidebarMenuSub>
                    {item.items.map((child) => (
                        <SidebarMenuSubItem key={child.title}>
                            <SidebarMenuSubButton
                                asChild
                                isActive={isCurrentUrl(child.href)}
                            >
                                <Link href={child.href} prefetch>
                                    {child.icon && (
                                        <child.icon className="size-4" />
                                    )}

                                    <span>{child.title}</span>
                                </Link>
                            </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                    ))}
                </SidebarMenuSub>
            )}
        </SidebarMenuItem>
    );
}

// --------------------------------------------------
// NAVEGACIÓN PRINCIPAL
// --------------------------------------------------

export function NavMain({
    items,
}: {
    items: NavMainItem[];
}) {
    const { isCurrentUrl } = useCurrentUrl();
    const { state, isMobile } = useSidebar();
    const { url } = usePage();

    const isCollapsed =
        state === 'collapsed' && !isMobile;

    // Obtener únicamente los grupos desplegables.
    const groups = items.filter(
        (item): item is NavGroup => 'items' in item,
    );

    // ----------------------------------------------
    // ESTADO COMPARTIDO DE LAS CARPETAS
    // ----------------------------------------------

    const [expandedGroups, setExpandedGroups] = useState<string[]>(
        () =>
            groups
                .filter((group) =>
                    group.items.some((child) =>
                        isCurrentUrl(child.href),
                    ),
                )
                .map((group) => group.title),
    );

    const previousUrl = useRef(url);

    // Abrir el grupo de la página activa cuando
    // cambia la ruta de Inertia.
    useEffect(() => {
        if (previousUrl.current === url) {
            return;
        }

        previousUrl.current = url;

        const activeGroups = groups
            .filter((group) =>
                group.items.some((child) =>
                    isCurrentUrl(child.href),
                ),
            )
            .map((group) => group.title);

        if (activeGroups.length === 0) {
            return;
        }

        setExpandedGroups((current) => [
            ...new Set([...current, ...activeGroups]),
        ]);
    }, [url, groups, isCurrentUrl]);

    // ----------------------------------------------
    // EXPANDIR TODAS LAS CARPETAS
    // ----------------------------------------------

    const expandAll = () => {
        setExpandedGroups(
            groups.map((group) => group.title),
        );
    };

    // ----------------------------------------------
    // CONTRAER TODAS LAS CARPETAS
    // ----------------------------------------------

    const collapseAll = () => {
        setExpandedGroups([]);
    };

    // ----------------------------------------------
    // ABRIR / CERRAR UNA CARPETA
    // ----------------------------------------------

    const toggleGroup = (title: string) => {
        setExpandedGroups((current) => {
            if (current.includes(title)) {
                return current.filter(
                    (group) => group !== title,
                );
            }

            return [...current, title];
        });
    };

    const allExpanded =
        groups.length > 0 &&
        groups.every((group) =>
            expandedGroups.includes(group.title),
        );

    const allCollapsed =
        groups.every(
            (group) =>
                !expandedGroups.includes(group.title),
        );

    // ----------------------------------------------
    // RENDERIZADO
    // ----------------------------------------------

    return (
        <SidebarGroup className="px-2 py-0">
            {/* Encabezado y controles globales */}
            {!isCollapsed && (
                <div className="mb-1 flex items-center justify-between px-2">
                    <SidebarGroupLabel className="px-0">
                        Navegación
                    </SidebarGroupLabel>

                    {groups.length > 0 && (
                        <div className="flex items-center gap-1">
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="size-7 text-muted-foreground"
                                onClick={expandAll}
                                disabled={allExpanded}
                                title="Expandir todas las carpetas"
                                aria-label="Expandir todas las carpetas"
                            >
                                <ChevronsUpDown className="size-4" />
                            </Button>

                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="size-7 text-muted-foreground"
                                onClick={collapseAll}
                                disabled={allCollapsed}
                                title="Contraer todas las carpetas"
                                aria-label="Contraer todas las carpetas"
                            >
                                <ChevronsDownUp className="size-4" />
                            </Button>
                        </div>
                    )}
                </div>
            )}

            {/* Elementos de navegación */}
            <SidebarMenu>
                {items.map((item) => {
                    // ----------------------------------
                    // GRUPOS DESPLEGABLES
                    // ----------------------------------

                    if ('items' in item) {
                        if (item.items.length === 0) {
                            return null;
                        }

                        return (
                            <NavDropdown
                                key={item.title}
                                item={item}
                                open={expandedGroups.includes(
                                    item.title,
                                )}
                                onToggle={() =>
                                    toggleGroup(item.title)
                                }
                                isCollapsed={isCollapsed}
                            />
                        );
                    }

                    // ----------------------------------
                    // ENLACES INDIVIDUALES
                    // ----------------------------------

                    return (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                asChild
                                isActive={
                                    item.isActive ??
                                    isCurrentUrl(item.href)
                                }
                                tooltip={{
                                    children: item.title,
                                }}
                            >
                                <Link href={item.href} prefetch>
                                    {item.icon && <item.icon />}

                                    <span>{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}
