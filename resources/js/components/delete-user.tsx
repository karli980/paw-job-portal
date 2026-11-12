
import { Form } from '@inertiajs/react';
import { useRef } from 'react';

import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';

import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';

import { Button } from '@/components/ui/button';

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';

import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/use-auth';

// --------------------------------------------------
// ELIMINACIÓN DE CUENTA - TALENT MATCH
// --------------------------------------------------

export default function DeleteUser() {
    const passwordInput = useRef<HTMLInputElement>(null);

    const { hasRole, hasAnyRole } = useAuth();

    // ----------------------------------------------
    // CONTROL DE VISIBILIDAD
    // ----------------------------------------------

    const esCuentaAdministrativa = hasAnyRole([
        'super-admin',
        'admin',
        'moderador',
    ]);

    const esRepresentanteEmpresa = hasRole(
        'representante_empresa',
    );

    const esCandidato = hasRole('candidato');

    // Solamente los candidatos pueden visualizar
    // la opción de eliminar su propia cuenta.
    const puedeEliminarCuenta =
        esCandidato &&
        !esCuentaAdministrativa &&
        !esRepresentanteEmpresa;

    if (!puedeEliminarCuenta) {
        return null;
    }

    // ----------------------------------------------
    // RENDERIZADO
    // ----------------------------------------------

    return (
        <div className="space-y-6">
            {/* ENCABEZADO */}
            <Heading
                variant="small"
                title="Eliminar cuenta"
                description="Solicitá la eliminación de tu cuenta de Talent Match."
            />

            {/* ZONA DE ADVERTENCIA */}
            <div className="space-y-4 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-200/10 dark:bg-red-700/10">
                <div className="space-y-1 text-red-700 dark:text-red-100">
                    <p className="font-semibold">
                        Advertencia
                    </p>

                    <p className="text-sm">
                        Esta acción puede ser irreversible.
                        Antes de continuar, asegurate de
                        comprender qué información será
                        eliminada de tu cuenta.
                    </p>
                </div>

                {/* DIÁLOGO DE CONFIRMACIÓN */}
                <Dialog>
                    <DialogTrigger asChild>
                        <Button
                            type="button"
                            variant="destructive"
                            data-test="delete-user-button"
                        >
                            Eliminar mi cuenta
                        </Button>
                    </DialogTrigger>

                    <DialogContent>
                        <DialogTitle>
                            ¿Estás seguro de que querés
                            eliminar tu cuenta?
                        </DialogTitle>

                        <DialogDescription>
                            Estás por solicitar la eliminación
                            de tu cuenta de Talent Match.

                            Para confirmar esta operación,
                            ingresá tu contraseña actual.
                        </DialogDescription>

                        {/* FORMULARIO */}
                        <Form
                            {...ProfileController.destroy.form()}
                            options={{
                                preserveScroll: true,
                            }}
                            onError={() =>
                                passwordInput.current?.focus()
                            }
                            resetOnSuccess
                            className="space-y-6"
                        >
                            {({
                                resetAndClearErrors,
                                processing,
                                errors,
                            }) => (
                                <>
                                    {/* CONTRASEÑA */}
                                    <div className="grid gap-2">
                                        <Label htmlFor="password">
                                            Contraseña actual
                                        </Label>

                                        <PasswordInput
                                            id="password"
                                            name="password"
                                            ref={passwordInput}
                                            placeholder="Ingresá tu contraseña"
                                            autoComplete="current-password"
                                        />

                                        <InputError
                                            message={errors.password}
                                        />
                                    </div>

                                    {/* BOTONES */}
                                    <DialogFooter className="gap-2">
                                        <DialogClose asChild>
                                            <Button
                                                type="button"
                                                variant="secondary"
                                                onClick={() =>
                                                    resetAndClearErrors()
                                                }
                                            >
                                                Cancelar
                                            </Button>
                                        </DialogClose>

                                        <Button
                                            type="submit"
                                            variant="destructive"
                                            disabled={processing}
                                            data-test="confirm-delete-user-button"
                                        >
                                            {processing
                                                ? 'Eliminando...'
                                                : 'Confirmar eliminación'}
                                        </Button>
                                    </DialogFooter>
                                </>
                            )}
                        </Form>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}
