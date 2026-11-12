import { Form, Head, usePage } from '@inertiajs/react';
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { edit } from '@/routes/profile';
import type { Auth } from '@/types';

type PageProps = {
    auth: Auth;
};

export default function Profile() {
    const { auth } = usePage<PageProps>().props;
    const usuario = auth.user;

    if (!usuario) {
        return null;
    }

    return (
        <>
            <Head title="Configuración del perfil" />

            <h1 className="sr-only">Configuración del perfil</h1>

            <div className="space-y-6">
                <Heading
                    variant="small"
                    title="Perfil"
                    description="Actualizá tu nombre, apellido y correo electrónico."
                />

                <Form
                    {...ProfileController.update.form()}
                    options={{
                        preserveScroll: true,
                    }}
                    className="space-y-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="nombre">Nombre</Label>

                                <Input
                                    id="nombre"
                                    name="nombre"
                                    defaultValue={usuario.nombre}
                                    required
                                    autoComplete="given-name"
                                    placeholder="Tu nombre"
                                />

                                <InputError message={errors.nombre} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="apellido">Apellido</Label>

                                <Input
                                    id="apellido"
                                    name="apellido"
                                    defaultValue={usuario.apellido}
                                    required
                                    autoComplete="family-name"
                                    placeholder="Tu apellido"
                                />

                                <InputError message={errors.apellido} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email">
                                    Correo electrónico
                                </Label>

                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    defaultValue={usuario.email}
                                    required
                                    autoComplete="email"
                                    placeholder="correo@ejemplo.com"
                                />

                                <InputError message={errors.email} />
                            </div>

                            <div className="flex items-center gap-4">
                                <Button
                                    disabled={processing}
                                    data-test="update-profile-button"
                                >
                                    Guardar cambios
                                </Button>
                            </div>
                        </>
                    )}
                </Form>
            </div>

            
        </>
    );
}

Profile.layout = {
    breadcrumbs: [
        {
            title: 'Configuración del perfil',
            href: edit(),
        },
    ],
};
