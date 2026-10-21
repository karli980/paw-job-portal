import { Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import {
    ArrowLeft,
    Check,
    Globe2,
    Hash,
    Save,
    ShieldCheck,
} from 'lucide-react';

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

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        nombre: '',
        codigo_iso: '',
        codigo_iso3: '',
        estado: true,
    });

    const submit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post('/paises');
    };

    return (
        <div className="min-h-full bg-gradient-to-br from-slate-50 via-white to-indigo-50/50 px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto w-full max-w-3xl space-y-8">

                {/* Cabecera */}
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-4">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-200">
                            <Globe2 className="h-7 w-7" />
                        </div>

                        <div className="space-y-1">
                            <div className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
                                Gestión geográfica
                            </div>
                            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                                Nuevo país
                            </h1>
                            <p className="max-w-lg text-sm leading-6 text-slate-500">
                                Registrá un país para utilizarlo en la configuración
                                y las búsquedas de empleo del portal.
                            </p>
                        </div>
                    </div>

                    <Button
                        variant="outline"
                        asChild
                        className="w-full border-slate-200 bg-white shadow-sm transition hover:bg-slate-50 sm:w-auto"
                    >
                        <Link href="/paises" className="flex items-center gap-2">
                            <ArrowLeft className="h-4 w-4" />
                            Volver al listado
                        </Link>
                    </Button>
                </div>

                {/* Formulario */}
                <Card className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xl shadow-slate-200/50">
                    <form onSubmit={submit}>
                        <CardHeader className="border-b border-slate-100 bg-slate-50/70 px-6 py-6 sm:px-8">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700">
                                    <ShieldCheck className="h-5 w-5" />
                                </div>

                                <div>
                                    <CardTitle className="text-lg font-bold text-slate-900">
                                        Información del país
                                    </CardTitle>
                                    <CardDescription className="mt-1">
                                        Completá los datos identificatorios.
                                        Los campos marcados con * son obligatorios.
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="space-y-7 px-6 py-8 sm:px-8">

                            {/* Nombre */}
                            <div className="space-y-2">
                                <Label
                                    htmlFor="nombre"
                                    className="text-sm font-semibold text-slate-700"
                                >
                                    Nombre del país <span className="text-red-500">*</span>
                                </Label>

                                <Input
                                    id="nombre"
                                    type="text"
                                    value={data.nombre}
                                    onChange={(e) => setData('nombre', e.target.value)}
                                    placeholder="Ej.: Argentina"
                                    autoComplete="off"
                                    aria-invalid={!!errors.nombre}
                                    className={`h-11 rounded-xl border-slate-200 bg-white px-4 transition focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                                        errors.nombre
                                            ? 'border-red-500 focus-visible:ring-red-500'
                                            : ''
                                    }`}
                                />

                                {errors.nombre && (
                                    <p className="text-sm font-medium text-red-600">
                                        {errors.nombre}
                                    </p>
                                )}

                                <p className="text-xs text-slate-400">
                                    Ingresá el nombre oficial o habitual del país.
                                </p>
                            </div>

                            {/* Códigos ISO */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <Hash className="h-4 w-4 text-indigo-600" />
                                    <h2 className="text-sm font-semibold text-slate-800">
                                        Códigos internacionales
                                    </h2>
                                </div>

                                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                                    {/* ISO 2 */}
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="codigo_iso"
                                            className="text-sm font-semibold text-slate-700"
                                        >
                                            Código ISO 3166-1 alfa-2{' '}
                                            <span className="text-red-500">*</span>
                                        </Label>

                                        <Input
                                            id="codigo_iso"
                                            type="text"
                                            value={data.codigo_iso}
                                            onChange={(e) =>
                                                setData(
                                                    'codigo_iso',
                                                    e.target.value.toUpperCase(),
                                                )
                                            }
                                            maxLength={2}
                                            placeholder="AR"
                                            autoComplete="off"
                                            aria-invalid={!!errors.codigo_iso}
                                            className={`h-11 rounded-xl border-slate-200 uppercase transition focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                                                errors.codigo_iso
                                                    ? 'border-red-500 focus-visible:ring-red-500'
                                                    : ''
                                            }`}
                                        />

                                        {errors.codigo_iso && (
                                            <p className="text-sm font-medium text-red-600">
                                                {errors.codigo_iso}
                                            </p>
                                        )}

                                        <p className="text-xs text-slate-400">
                                            Dos letras. Ejemplo: AR.
                                        </p>
                                    </div>

                                    {/* ISO 3 */}
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="codigo_iso3"
                                            className="text-sm font-semibold text-slate-700"
                                        >
                                            Código ISO 3166-1 alfa-3{' '}
                                            <span className="text-red-500">*</span>
                                        </Label>

                                        <Input
                                            id="codigo_iso3"
                                            type="text"
                                            value={data.codigo_iso3}
                                            onChange={(e) =>
                                                setData(
                                                    'codigo_iso3',
                                                    e.target.value.toUpperCase(),
                                                )
                                            }
                                            maxLength={3}
                                            placeholder="ARG"
                                            autoComplete="off"
                                            aria-invalid={!!errors.codigo_iso3}
                                            className={`h-11 rounded-xl border-slate-200 uppercase transition focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                                                errors.codigo_iso3
                                                    ? 'border-red-500 focus-visible:ring-red-500'
                                                    : ''
                                            }`}
                                        />

                                        {errors.codigo_iso3 && (
                                            <p className="text-sm font-medium text-red-600">
                                                {errors.codigo_iso3}
                                            </p>
                                        )}

                                        <p className="text-xs text-slate-400">
                                            Tres letras. Ejemplo: ARG.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Estado */}
                            <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5">
                                <div className="flex items-start gap-4">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                                        <Check className="h-5 w-5" />
                                    </div>

                                    <div className="min-w-0 flex-1 space-y-1">
                                        <Label
                                            htmlFor="estado"
                                            className="cursor-pointer text-sm font-semibold text-slate-800"
                                        >
                                            País activo
                                        </Label>

                                        <p className="text-sm leading-5 text-slate-500">
                                            Si está activo, podrá utilizarse en el
                                            portal según las reglas de tu aplicación.
                                        </p>

                                        {errors.estado && (
                                            <p className="text-sm font-medium text-red-600">
                                                {errors.estado}
                                            </p>
                                        )}
                                    </div>

                                    <Checkbox
                                        id="estado"
                                        checked={data.estado}
                                        onCheckedChange={(checked) =>
                                            setData('estado', checked === true)
                                        }
                                        aria-invalid={!!errors.estado}
                                        className="mt-1"
                                    />
                                </div>
                            </div>
                        </CardContent>

                        {/* Acciones */}
                        <CardFooter className="flex flex-col-reverse gap-3 border-t border-slate-100 bg-slate-50/70 px-6 py-5 sm:flex-row sm:justify-end sm:px-8">
                            <Button
                                variant="outline"
                                type="button"
                                asChild
                                className="w-full border-slate-200 bg-white sm:w-auto"
                            >
                                <Link href="/paises">Cancelar</Link>
                            </Button>

                            <Button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-indigo-600 text-white shadow-md shadow-indigo-200 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                            >
                                {processing ? (
                                    'Guardando...'
                                ) : (
                                    <>
                                        <Save className="mr-2 h-4 w-4" />
                                        Guardar país
                                    </>
                                )}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>

                <p className="text-center text-xs text-slate-400">
                    Verificá que los códigos ISO sean correctos antes de guardar.
                </p>
            </div>
        </div>
    );
}
