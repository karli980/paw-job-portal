
import { Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import {
    ArrowLeft,
    Check,
    Loader2,
    Save,
    ShieldCheck,
    Users,
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

interface CantidadEmpleado {
    id: number;
    nombre: string;
    minimo: number;
    maximo: number | null;
    estado: boolean;
}

interface Props {
    cantidadEmpleado: CantidadEmpleado;
}

export default function Edit({ cantidadEmpleado }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        nombre: cantidadEmpleado.nombre,
        minimo: String(cantidadEmpleado.minimo),
        maximo:
            cantidadEmpleado.maximo !== null
                ? String(cantidadEmpleado.maximo)
                : '',
        estado: cantidadEmpleado.estado,
    });

    const submit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        put(`/cantidad-empleados/${cantidadEmpleado.id}`);
    };

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
                            <Users className="h-6 w-6" />
                        </div>

                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                                Editar rango de empleados
                            </h1>

                            <p className="mt-1 max-w-xl text-sm leading-relaxed text-muted-foreground">
                                Modificá los datos del rango{' '}
                                <span className="font-semibold text-foreground">
                                    {cantidadEmpleado.nombre}
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
                            href="/cantidad-empleados"
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
                                        Información del rango
                                    </CardTitle>

                                    <CardDescription className="mt-1 text-muted-foreground">
                                        Actualizá los datos del rango de empleados.
                                        Los campos marcados con{' '}
                                        <span className="text-rose-500">*</span>{' '}
                                        son obligatorios.
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="space-y-7 px-6 py-6">

                            {/* Nombre */}
                            <div className="space-y-2">
                                <Label
                                    htmlFor="nombre"
                                    className="text-sm font-semibold text-foreground"
                                >
                                    Nombre del rango{' '}
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
                                    placeholder="Ej.: Pequeña empresa"
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

                            {/* Cantidad mínima */}
                            <div className="space-y-2">
                                <Label
                                    htmlFor="minimo"
                                    className="text-sm font-semibold text-foreground"
                                >
                                    Cantidad mínima{' '}
                                    <span className="text-rose-500">*</span>
                                </Label>

                                <Input
                                    id="minimo"
                                    type="number"
                                    min="0"
                                    step="1"
                                    required
                                    value={data.minimo}
                                    onChange={(e) =>
                                        setData('minimo', e.target.value)
                                    }
                                    aria-invalid={!!errors.minimo}
                                    aria-describedby={
                                        errors.minimo
                                            ? 'minimo-error'
                                            : undefined
                                    }
                                    className={`${claseInput} ${
                                        errors.minimo ? claseInputError : ''
                                    }`}
                                />

                                {errors.minimo && (
                                    <p
                                        id="minimo-error"
                                        role="alert"
                                        className={claseError}
                                    >
                                        {errors.minimo}
                                    </p>
                                )}

                                <p className="text-xs text-muted-foreground">
                                    Número mínimo de empleados que comprende este rango.
                                </p>
                            </div>

                            {/* Cantidad máxima */}
                            <div className="space-y-2">
                                <Label
                                    htmlFor="maximo"
                                    className="text-sm font-semibold text-foreground"
                                >
                                    Cantidad máxima
                                </Label>

                                <Input
                                    id="maximo"
                                    type="number"
                                    min={data.minimo || '0'}
                                    step="1"
                                    value={data.maximo}
                                    onChange={(e) =>
                                        setData('maximo', e.target.value)
                                    }
                                    placeholder="Dejar vacío si no tiene límite"
                                    aria-invalid={!!errors.maximo}
                                    aria-describedby={
                                        errors.maximo
                                            ? 'maximo-error'
                                            : undefined
                                    }
                                    className={`${claseInput} ${
                                        errors.maximo ? claseInputError : ''
                                    }`}
                                />

                                {errors.maximo && (
                                    <p
                                        id="maximo-error"
                                        role="alert"
                                        className={claseError}
                                    >
                                        {errors.maximo}
                                    </p>
                                )}

                                <p className="text-xs text-muted-foreground">
                                    Campo opcional. Si lo dejás vacío, el rango no tendrá un límite máximo.
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
                                            Rango activo
                                        </Label>

                                        <p className="text-sm leading-5 text-muted-foreground">
                                            Indica si este rango de empleados está activo en el sistema.
                                        </p>

                                        <p className="text-sm font-medium text-foreground">
                                            {data.estado ? 'Activo' : 'Inactivo'}
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
                                <Link href="/cantidad-empleados">
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
