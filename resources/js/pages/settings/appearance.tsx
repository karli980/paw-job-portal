
import { Head } from '@inertiajs/react';

import AppearanceTabs from '@/components/appearance-tabs';
import Heading from '@/components/heading';

import { edit as editAppearance } from '@/routes/appearance';

// --------------------------------------------------
// CONFIGURACIÓN DE APARIENCIA
// --------------------------------------------------

export default function Appearance() {
    return (
        <>
            <Head title="Apariencia" />

            <h1 className="sr-only">
                Configuración de apariencia
            </h1>

            <div className="space-y-6">
                {/* ENCABEZADO */}
                <Heading
                    variant="small"
                    title="Apariencia"
                    description="Personalizá la apariencia de Talent Match seleccionando el tema visual que prefieras."
                />

                {/* SELECTOR DE TEMA */}
                <AppearanceTabs />
            </div>
        </>
    );
}

// --------------------------------------------------
// BREADCRUMBS
// --------------------------------------------------

Appearance.layout = {
    breadcrumbs: [
        {
            title: 'Apariencia',
            href: editAppearance(),
        },
    ],
};
