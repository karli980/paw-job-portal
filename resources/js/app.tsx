import { createInertiaApp } from '@inertiajs/react';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { initializeTheme } from '@/hooks/use-appearance';
import AppLayout from '@/layouts/app-layout';
import AuthLayout from '@/layouts/auth-layout';
import SettingsLayout from '@/layouts/settings/layout';

const appName = import.meta.env.VITE_APP_NAME || 'JobPortal';

void createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),

    layout: (name) => {
        switch (true) {
            // Páginas públicas sin layout adicional

            case name === 'welcome':
            case name === 'auth/register-type':
            case name === 'auth/register-candidate':
            case name === 'auth/register':
            case name === 'auth/login-type':
            case name === 'auth/login-candidate':
            case name === 'auth/login-empresa':
            case name === 'auth/login':
            case name === 'auth/verify-email':
            case name === 'auth/forgot-password':
            case name === 'auth/reset-password':
            case name === 'Admin/Auth/Login':
            case name === 'Admin/Auth/ForgotPassword':
            case name === 'Admin/Auth/ResetPassword':
                return null;



            // Páginas de autenticación
            case name.startsWith('auth/'):
                return AuthLayout;


            // Páginas que ya incluyen su propio AppLayout.
            // Evitamos renderizar dos menús laterales.
            case name === 'Admin/Usuarios/Index':
                return null;

            // Páginas de configuración.
            case name.startsWith('settings/'):
                return [AppLayout, SettingsLayout];




            // Resto de la aplicación
            default:
                return AppLayout;
        }
    },

    strictMode: true,

    withApp(app) {
        return (
            <TooltipProvider delayDuration={0}>
                {app}
                <Toaster />
            </TooltipProvider>
        );
    },

    progress: {
        color: '#4B5563',
    },
});

initializeTheme();

