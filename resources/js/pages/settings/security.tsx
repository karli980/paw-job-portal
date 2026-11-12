
import { Form, Head } from '@inertiajs/react';
import { useRef } from 'react';

import SecurityController from '@/actions/App/Http/Controllers/Settings/SecurityController';

import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

import { edit } from '@/routes/security';

// --------------------------------------------------
// TIPOS
// --------------------------------------------------

type Props = {
    passwordRules: string;
    hasPassword: boolean;
};

// --------------------------------------------------
// CONFIGURACIÓN DE SEGURIDAD
// --------------------------------------------------

export default function Security(props: Props) {
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);

    return (
        <>
            <Head title="Seguridad de la cuenta" />

            <h1 className="sr-only">
                Seguridad de la cuenta
            </h1>

            <div className="space-y-6">
                {/* ENCABEZADO */}
                <Heading
                    variant="small"
                    title={
                        props.hasPassword
                            ? 'Actualizar contraseña'
                            : 'Crear contraseña'
                    }
                    description={
                        props.hasPassword
                            ? 'Mantené tu cuenta protegida utilizando una contraseña segura. Podés actualizarla cuando lo necesites.'
                            : 'Creá una contraseña para acceder a tu cuenta mediante correo electrónico y contraseña, además de los métodos de inicio de sesión que ya utilizás.'
                    }
                />

                {/* FORMULARIO DE SEGURIDAD */}
                <Form
                    {...SecurityController.update.form()}
                    options={{
                        preserveScroll: true,
                    }}
                    resetOnError={[
                        'password',
                        'password_confirmation',
                        'current_password',
                    ]}
                    resetOnSuccess
                    onError={(errors) => {
                        if (errors.password) {
                            passwordInput.current?.focus();
                        }

                        if (errors.current_password) {
                            currentPasswordInput.current?.focus();
                        }
                    }}
                    className="space-y-6"
                >
                    {({ errors, processing }) => (
                        <>
                            {/* CONTRASEÑA ACTUAL */}
                            {props.hasPassword && (
                                <div className="grid gap-2">
                                    <Label htmlFor="current_password">
                                        Contraseña actual
                                    </Label>

                                    <PasswordInput
                                        id="current_password"
                                        ref={currentPasswordInput}
                                        name="current_password"
                                        className="mt-1 block w-full"
                                        autoComplete="current-password"
                                        placeholder="Ingresá tu contraseña actual"
                                    />

                                    <InputError
                                        message={errors.current_password}
                                    />
                                </div>
                            )}

                            {/* NUEVA CONTRASEÑA */}
                            <div className="grid gap-2">
                                <Label htmlFor="password">
                                    {props.hasPassword
                                        ? 'Nueva contraseña'
                                        : 'Crear contraseña'}
                                </Label>

                                <PasswordInput
                                    id="password"
                                    ref={passwordInput}
                                    name="password"
                                    className="mt-1 block w-full"
                                    autoComplete="new-password"
                                    placeholder="Ingresá una contraseña segura"
                                    passwordrules={props.passwordRules}
                                />

                                <InputError
                                    message={errors.password}
                                />
                            </div>

                            {/* CONFIRMAR CONTRASEÑA */}
                            <div className="grid gap-2">
                                <Label htmlFor="password_confirmation">
                                    Confirmar contraseña
                                </Label>

                                <PasswordInput
                                    id="password_confirmation"
                                    name="password_confirmation"
                                    className="mt-1 block w-full"
                                    autoComplete="new-password"
                                    placeholder="Repetí la nueva contraseña"
                                    passwordrules={props.passwordRules}
                                />

                                <InputError
                                    message={errors.password_confirmation}
                                />
                            </div>

                            {/* BOTÓN DE GUARDADO */}
                            <div className="flex items-center gap-4">
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    data-test="update-password-button"
                                    className="bg-indigo-600 text-white hover:bg-indigo-700"
                                >
                                    {processing
                                        ? 'Guardando...'
                                        : props.hasPassword
                                          ? 'Guardar cambios'
                                          : 'Crear contraseña'}
                                </Button>
                            </div>
                        </>
                    )}
                </Form>
            </div>
        </>
    );
}

// --------------------------------------------------
// BREADCRUMBS
// --------------------------------------------------

Security.layout = {
    breadcrumbs: [
        {
            title: 'Seguridad de la cuenta',
            href: edit(),
        },
    ],
};
