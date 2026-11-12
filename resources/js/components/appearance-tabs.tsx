import type { LucideIcon } from 'lucide-react';
import { Monitor, Moon, Sun } from 'lucide-react';
import type { HTMLAttributes } from 'react';

import type { Appearance } from '@/hooks/use-appearance';
import { useAppearance } from '@/hooks/use-appearance';
import { cn } from '@/lib/utils';

// --------------------------------------------------
// SELECTOR DE APARIENCIA - TALENT MATCH
// --------------------------------------------------

export default function AppearanceToggleTab({
    className = '',
    ...props
}: HTMLAttributes<HTMLDivElement>) {
    const { appearance, updateAppearance } = useAppearance();

    // ----------------------------------------------
    // OPCIONES DE APARIENCIA
    // ----------------------------------------------

    const tabs: {
        value: Appearance;
        icon: LucideIcon;
        label: string;
    }[] = [
        {
            value: 'light',
            icon: Sun,
            label: 'Claro',
        },
        {
            value: 'dark',
            icon: Moon,
            label: 'Oscuro',
        },
        {
            value: 'system',
            icon: Monitor,
            label: 'Sistema',
        },
    ];

    // ----------------------------------------------
    // RENDERIZADO
    // ----------------------------------------------

    return (
        <div
            className={cn(
                'inline-flex flex-wrap gap-1 rounded-lg bg-neutral-100 p-1 dark:bg-neutral-800',
                className,
            )}
            {...props}
        >
            {tabs.map(({ value, icon: Icon, label }) => {
                const isActive = appearance === value;

                return (
                    <button
                        key={value}
                        type="button"
                        onClick={() => updateAppearance(value)}
                        aria-pressed={isActive}
                        className={cn(
                            'flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all duration-200',
                            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500',
                            isActive
                                ? 'bg-white text-indigo-700 shadow-sm dark:bg-neutral-700 dark:text-indigo-300'
                                : 'text-neutral-500 hover:bg-neutral-200/60 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-700/60 dark:hover:text-white',
                        )}
                    >
                        <Icon className="size-4 shrink-0" />

                        <span>{label}</span>
                    </button>
                );
            })}
        </div>
    );
}
