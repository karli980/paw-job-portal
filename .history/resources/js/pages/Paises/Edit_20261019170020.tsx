import { Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

interface Pais {
    id: number;
    nombre: string;
    codigo_iso: string;
    codigo_iso3: string;
    estado: boolean;
}

interface Props {
    pais: Pais;
}

export default function Edit({ pais }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        nombre: pais.nombre,
        codigo_iso: pais.codigo_iso,
        codigo_iso3: pais.codigo_iso3,
        estado: pais.estado,
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        put(`/paises/${pais.id}`);
    };

    return (
        <div className="mx-auto w-full max-w-3xl space-y-6 p-6 md:p-8">
            {/* Cabecera de la página */}
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                        Editar país
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Modifica los datos de <span className="font-medium text-gray-700">{pais.nombre}</span>.
                    </p>
                </div>
                <Button variant="outline" asChild className="w-fit">
                    <Link href="/paises" className="flex items-center gap-2">
                        <ArrowLeft className="h-4 w-4" />
                        Volver al listado
                    </Link>
                </Button>
            </div>

            {/* Tarjeta del Formulario */}
            <Card className="border-gray-200 shadow-sm">
                <form onSubmit={submit}>
                    <CardHeader>
                        <CardTitle className="text-lg text-gray-900">Detalles del país</CardTitle>
                        <CardDescription>
                            Actualiza la información del país. Los códigos y el nombre deben seguir siendo únicos.
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        {/* Campo: Nombre */}
                        <div className="space-y-2">
                            <Label htmlFor="nombre" className="text-gray-900">
                                Nombre <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="nombre"
                                type="text"
                                value={data.nombre}
                                onChange={(e) => setData('nombre', e.target.value)}
                                placeholder="Ej: Argentina"
                                className={errors.nombre ? 'border-red-500 focus-visible:ring-red-500' : ''}
                            />
                            {errors.nombre && (
                                <p className="text-sm font-medium text-red-500">{errors.nombre}</p>
                            )}
                        </div>

                        {/* Grid para los códigos ISO */}
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            {/* Campo: Código ISO 2 */}
                            <div className="space-y-2">
                                <Label htmlFor="codigo_iso" className="text-gray-900">
                                    Código ISO (2 letras) <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="codigo_iso"
                                    type="text"
                                    value={data.codigo_iso}
                                    onChange={(e) => setData('codigo_iso', e.target.value)}
                                    maxLength={2}
                                    placeholder="Ej: AR"
                                    className={errors.codigo_iso ? 'border-red-500 focus-visible:ring-red-500' : ''}
                                />
                                {errors.codigo_iso && (
                                    <p className="text-sm font-medium text-red-500">{errors.codigo_iso}</p>
                                )}
                            </div>

                            {/* Campo: Código ISO 3 */}
                            <div className="space-y-2">
                                <Label htmlFor="codigo_iso3" className="text-gray-900">
                                    Código ISO3 (3 letras) <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="codigo_iso3"
                                    type="text"
                                    value={data.codigo_iso3}
                                    onChange={(e) => setData('codigo_iso3', e.target.value)}
                                    maxLength={3}
                                    placeholder="Ej: ARG"
                                    className={errors.codigo_iso3 ? 'border-red-500 focus-visible:ring-red-500' : ''}
                                />
                                {errors.codigo_iso3 && (
                                    <p className="text-sm font-medium text-red-500">{errors.codigo_iso3}</p>
                                )}
                            </div>
                        </div>

                        {/* Campo: Estado (Checkbox) */}
                        <div className="space-y-2 rounded-lg border border-gray-200 bg-gray-50/50 p-4">
                            <div className="flex items-center space-x-3">
                                <Checkbox
                                    id="estado"
                                    checked={data.estado}
                                    onCheckedChange={(checked) => setData('estado', checked as boolean)}
                                />
                                <div className="space-y-1 leading-none">
                                    <Label
                                        htmlFor="estado"
                                        className="cursor-pointer text-sm font-medium leading-none text-gray-900 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                        País Activo
                                    </Label>
                                    <p className="text-sm text-gray-500">
                                        Si está desmarcado, el país no aparecerá en la lista principal.
                                    </p>
                                </div>
                            </div>
                            {errors.estado && (
                                <p className="mt-2 text-sm font-medium text-red-500">{errors.estado}</p>
                            )}
                        </div>
                    </CardContent>

                    <CardFooter className="flex items-center justify-end gap-4 border-t border-gray-100 bg-gray-50/50 px-6 py-4">
                        <Button variant="outline" type="button" asChild>
                            <Link href="/paises">Cancelar</Link>
                        </Button>
                        <Button
                            type="submit"
                            disabled={processing}
                            className="bg-gray-900 hover:bg-gray-800"
                        >
                            {processing ? (
                                'Actualizando...'
                            ) : (
                                <>
                                    <Save className="mr-2 h-4 w-4" />
                                    Guardar cambios
                                </>
                            )}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
