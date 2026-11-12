import { Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import {
    ArrowLeft,
    Check,
    Loader2,
    Save,
    ShieldCheck,
    MapPin,
    Globe,
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

interface Pais {
    id: number;
    nombre: string;
    codigo_iso: string;
}

interface Provincia {
    id: number;
    nombre: string;
    estado: boolean;
    pais_id: number;
    pais: Pais;
}

interface Props {
    provincia: Provincia;
}

export default function Edit({ provincia }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        nombre: provincia.nombre,
        estado: provincia.estado,
    });

    const submit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        put(`/provincias/${provincia.id}`);
    };

    // Clases reutilizables para los campos.
    const claseInput =
        'h-10 rounded-lg border-border bg-background px-3 transition-shadow focus-visible:ring-indigo-500';

    const claseInputError =
        'border-rose-500 focus-visible:ring-rose-500';

    const claseError =
        'text-sm font-medium text-rose-600';

    return (
        <div className="min-h-full bg-muted/30">
            <div className="mx-auto w-full max-w-4xl space-y-6 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">

                {/* Cabecera */}
                <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                    <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700 ring-1 ring-indigo-200/70">
                            <MapPin className="h-6 w-6" />
                        </div>

                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                                Editar provincia
                            </h1>

                            <p className="mt-1 max-w-xl text-sm leading-relaxed text-muted-foreground">
                                Modificá los datos de{' '}
                                <span className="font-semibold text-foreground">
                                    {provincia.nombre}
                                </span>.
                            </p>
                        </div>
                    </div>

                    <Button
                        variant="outline"
                        asChild
                        className="h-10 w-full rounded-lg border-border bg-card font-medium shadow-sm transition-colors hover:bg-muted sm:w-auto"
                    >
                        <Link
                            href="/provincias"
                            className="inline-flex items-center justify-center gap-2"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Volver al listado
                        </Link>
                    </Button>
                </header>

                {/* Formulario */}
                <Card className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
                    <form onSubmit={submit}>
                        <CardHeader className="border-b border-border bg-muted/50 px-6 py-5">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700">
                                    <ShieldCheck className="h-5 w-5" />
                                </div>

                                <div>
                                    <CardTitle className="text-lg font-bold text-foreground">
                                        Información de la provincia
                                    </CardTitle>

                                    <CardDescription className="mt-1 text-muted-foreground">
                                        Actualizá los datos del registro.
                                        Los campos marcados con{' '}
                                        <span className="text-rose-500">*</span>{' '}
                                        son obligatorios.
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="space-y-7 px-6 py-6">

                            {/* País asignado */}
                            <div className="flex items-start gap-3 rounded-xl border border-indigo-200 bg-indigo-50/70 p-4 dark:border-indigo-900 dark:bg-indigo-950/30">
                                <Globe className="mt-0.5 h-5 w-5 shrink-0 text-indigo-700 dark:text-indigo-300" />

                                <div className="min-w-0">
                                    <p className="text-sm font-semibold text-indigo-950 dark:text-indigo-100">
                                        País asignado
                                    </p>

                                    <p className="mt-1 text-sm text-indigo-900/80 dark:text-indigo-200">
                                        {provincia.pais?.nombre ?? 'Argentina'}
                                    </p>

                                    <p className="mt-1 text-xs leading-relaxed text-indigo-800/80 dark:text-indigo-300">
                                        La provincia conserva su país
                                        asignado. En este formulario no se
                                        modifica esa relación.
                                    </p>
                                </div>
                            </div>

                            {/* Nombre */}
                            <div className="space-y-2">
                                <Label
                                    htmlFor="nombre"
                                    className="text-sm font-semibold text-foreground"
                                >
                                    Nombre de la provincia{' '}
                                    <span className="text-rose-500">*</span>
                                </Label>

                                <Input
                                    id="nombre"
                                    type="text"
                                    value={data.nombre}
                                    onChange={(e) =>
                                        setData('nombre', e.target.value)
                                    }
                                    maxLength={100}
                                    autoComplete="off"
                                    placeholder="Ej.: Salta"
                                    aria-invalid={!!errors.nombre}
                                    aria-describedby={
                                        errors.nombre
                                            ? 'nombre-error'
                                            : undefined
                                    }
                                    className={`${claseInput} ${
                                        errors.nombre ? claseInputError : ''
                                    }`}
                                />

                                {errors.nombre && (
                                    <p
                                        id="nombre-error"
                                        role="alert"
                                        className={claseError}
                                    >
                                        {errors.nombre}
                                    </p>
                                )}

                                <p className="text-xs text-muted-foreground">
                                    Máximo 100 caracteres.
                                </p>
                            </div>

                            {/* Estado */}
                            <div className="rounded-xl border border-border bg-muted/50 p-4 transition-colors hover:bg-muted/70">
                                <div className="flex items-start gap-4">
                                    <div
                                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors ${
                                            data.estado
                                                ? 'bg-emerald-100 text-emerald-700'
                                                : 'bg-muted text-muted-foreground'
                                        }`}
                                    >
                                        <Check className="h-5 w-5" />
                                    </div>

                                    <div className="min-w-0 flex-1 space-y-1">
                                        <Label
                                            htmlFor="estado"
                                            className="cursor-pointer text-sm font-semibold text-foreground"
                                        >
                                            Provincia activa
                                        </Label>

                                        <p className="text-sm leading-5 text-muted-foreground">
                                            Indica si esta provincia está
                                            disponible en el sistema.
                                        </p>

                                        <p className="text-sm font-medium text-foreground">
                                            {data.estado ? 'Activa' : 'Inactiva'}
                                        </p>

                                        {errors.estado && (
                                            <p
                                                id="estado-error"
                                                role="alert"
                                                className={claseError}
                                            >
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
                                        aria-describedby={
                                            errors.estado
                                                ? 'estado-error'
                                                : undefined
                                        }
                                        className="mt-1 h-5 w-5 border-slate-300 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background data-[state=checked]:border-indigo-600 data-[state=checked]:bg-indigo-600 data-[state=checked]:text-white"
                                    />
                                </div>
                            </div>
                        </CardContent>

                        {/* Acciones */}
                        <CardFooter className="flex flex-col-reverse gap-3 border-t border-border bg-muted/40 px-6 py-4 sm:flex-row sm:justify-end">
                            <Button
                                variant="outline"
                                type="button"
                                asChild
                                className="h-10 w-full rounded-lg border-border bg-background font-medium sm:w-auto"
                            >
                                <Link href="/provincias">
                                    Cancelar
                                </Link>
                            </Button>

                            <Button
                                type="submit"
                                disabled={processing}
                                className="h-10 w-full rounded-lg bg-indigo-600 px-5 font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                            >
                                {processing ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Actualizando...
                                    </>
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

                <p className="pb-2 text-center text-xs text-muted-foreground">
                    Los cambios se reflejarán en el listado después de guardar.
                </p>
            </div>
        </div>
    );
}
