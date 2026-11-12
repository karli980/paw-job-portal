import { Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import {
    ArrowLeft,
    Check,
    Layers3,
    Loader2,
    Save,
    ShieldCheck,
    BriefcaseBusiness,
    AlertCircle,
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

// --------------------------------------------------
// TIPOS
// --------------------------------------------------

interface AreaLaboral {
    id: number;
    nombre: string;
    estado?: boolean;
}

interface SubAreaLaboral {
    id: number;
    area_laboral_id: number;
    nombre: string;
    estado: boolean;
    area_laboral?: AreaLaboral | null;
    areaLaboral?: AreaLaboral | null;
}

interface Props {
    subAreaLaboral: SubAreaLaboral;
    areasLaborales: AreaLaboral[];
}

// --------------------------------------------------
// COMPONENTE
// --------------------------------------------------

export default function Edit({
    subAreaLaboral,
    areasLaborales,
}: Props) {
    const { data, setData, put, processing, errors } = useForm({
        area_laboral_id: String(subAreaLaboral.area_laboral_id),
        nombre: subAreaLaboral.nombre,
        estado: Boolean(subAreaLaboral.estado),
    });

    // --------------------------------------------------
    // ENVÍO DEL FORMULARIO
    // --------------------------------------------------

    const submit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        put(`/sub-areas-laborales/${subAreaLaboral.id}`);
    };

    // --------------------------------------------------
    // CLASES REUTILIZABLES
    // --------------------------------------------------

    const claseInput =
        'h-10 rounded-lg border-border bg-background px-3 transition-shadow focus-visible:ring-indigo-500';

    const claseInputError =
        'border-rose-500 focus-visible:ring-rose-500';

    const claseError =
        'text-sm font-medium text-rose-600 dark:text-rose-400';

    // --------------------------------------------------
    // ÁREA LABORAL ACTUAL
    // --------------------------------------------------

    const areaActual =
        subAreaLaboral.area_laboral ??
        subAreaLaboral.areaLaboral ??
        null;

    const areaActualIncluida = areasLaborales.some(
        (area) =>
            String(area.id) ===
            String(subAreaLaboral.area_laboral_id),
    );

    return (
        <div className="min-h-full bg-muted/30">
            <div className="mx-auto w-full max-w-4xl space-y-6 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">

                {/* CABECERA */}
                <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                    <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700 ring-1 ring-indigo-200/70 dark:bg-indigo-500/15 dark:text-indigo-300 dark:ring-indigo-400/20">
                            <Layers3 className="h-6 w-6" />
                        </div>

                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                                Editar sub área laboral
                            </h1>

                            <p className="mt-1 max-w-xl text-sm leading-relaxed text-muted-foreground">
                                Modificá los datos de{' '}
                                <span className="font-semibold text-foreground">
                                    {subAreaLaboral.nombre}
                                </span>
                                .
                            </p>
                        </div>
                    </div>

                    <Button
                        variant="outline"
                        asChild
                        className="h-10 w-full rounded-lg border-border bg-card font-medium shadow-sm transition-colors hover:bg-muted sm:w-auto"
                    >
                        <Link
                            href="/sub-areas-laborales"
                            className="inline-flex items-center justify-center gap-2"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Volver al listado
                        </Link>
                    </Button>
                </header>

                {/* FORMULARIO */}
                <Card className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
                    <form onSubmit={submit}>
                        <CardHeader className="border-b border-border bg-muted/50 px-6 py-5">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300">
                                    <ShieldCheck className="h-5 w-5" />
                                </div>

                                <div>
                                    <CardTitle className="text-lg font-bold text-foreground">
                                        Información de la sub área laboral
                                    </CardTitle>

                                    <CardDescription className="mt-1 text-muted-foreground">
                                        Actualizá los datos del registro. Los
                                        campos marcados con{' '}
                                        <span className="text-rose-500">*</span>{' '}
                                        son obligatorios.
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="space-y-7 px-6 py-6">

                            {/* ÁREA LABORAL */}
                            <div className="space-y-2">
                                <Label
                                    htmlFor="area_laboral_id"
                                    className="text-sm font-semibold text-foreground"
                                >
                                    Área laboral{' '}
                                    <span className="text-rose-500">*</span>
                                </Label>

                                <div className="relative">
                                    <BriefcaseBusiness className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                                    <select
                                        id="area_laboral_id"
                                        value={data.area_laboral_id}
                                        onChange={(e) =>
                                            setData(
                                                'area_laboral_id',
                                                e.target.value,
                                            )
                                        }
                                        aria-invalid={
                                            !!errors.area_laboral_id
                                        }
                                        aria-describedby={
                                            errors.area_laboral_id
                                                ? 'area-error'
                                                : 'area-ayuda'
                                        }
                                        className={`h-10 w-full rounded-lg border border-border bg-background pl-10 pr-3 text-sm text-foreground transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                                            errors.area_laboral_id
                                                ? claseInputError
                                                : ''
                                        }`}
                                    >
                                        {!areaActualIncluida &&
                                            data.area_laboral_id && (
                                                <option
                                                    value={
                                                        data.area_laboral_id
                                                    }
                                                >
                                                    {areaActual?.nombre ??
                                                        'Área laboral actual'}
                                                    {' (Inactiva)'}
                                                </option>
                                            )}

                                        <option value="">
                                            Seleccioná un área laboral
                                        </option>

                                        {areasLaborales.map((area) => (
                                            <option
                                                key={area.id}
                                                value={String(area.id)}
                                            >
                                                {area.nombre}
                                                {area.estado === false
                                                    ? ' (Inactiva)'
                                                    : ''}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {errors.area_laboral_id && (
                                    <p
                                        id="area-error"
                                        role="alert"
                                        className={claseError}
                                    >
                                        <AlertCircle className="mr-1 inline h-4 w-4" />
                                        {errors.area_laboral_id}
                                    </p>
                                )}

                                <p
                                    id="area-ayuda"
                                    className="text-xs text-muted-foreground"
                                >
                                    Seleccioná el área laboral a la que
                                    pertenece esta subárea.
                                </p>

                                {areaActual?.estado === false && (
                                    <p className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300">
                                        El área laboral actual está inactiva.
                                        Podés seleccionar otra área activa
                                        para reasignar esta subárea.
                                    </p>
                                )}
                            </div>

                            {/* NOMBRE */}
                            <div className="space-y-2">
                                <Label
                                    htmlFor="nombre"
                                    className="text-sm font-semibold text-foreground"
                                >
                                    Nombre de la sub área laboral{' '}
                                    <span className="text-rose-500">*</span>
                                </Label>

                                <Input
                                    id="nombre"
                                    type="text"
                                    value={data.nombre}
                                    onChange={(e) =>
                                        setData('nombre', e.target.value)
                                    }
                                    maxLength={150}
                                    autoComplete="off"
                                    placeholder="Ej.: Administración, Compras, Programación..."
                                    aria-invalid={!!errors.nombre}
                                    aria-describedby={
                                        errors.nombre
                                            ? 'nombre-error'
                                            : 'nombre-ayuda'
                                    }
                                    className={`${claseInput} ${
                                        errors.nombre ? claseInputError : ''
                                    }`}
                                />

                                {errors.nombre ? (
                                    <p
                                        id="nombre-error"
                                        role="alert"
                                        className={claseError}
                                    >
                                        <AlertCircle className="mr-1 inline h-4 w-4" />
                                        {errors.nombre}
                                    </p>
                                ) : (
                                    <p
                                        id="nombre-ayuda"
                                        className="text-xs text-muted-foreground"
                                    >
                                        Máximo 150 caracteres.
                                    </p>
                                )}

                                <p
                                    className={`text-right text-xs tabular-nums ${
                                        data.nombre.length > 140
                                            ? 'text-amber-600 dark:text-amber-400'
                                            : 'text-muted-foreground'
                                    }`}
                                >
                                    {data.nombre.length}/150
                                </p>
                            </div>

                            {/* ESTADO */}
                            <div className="rounded-xl border border-border bg-muted/50 p-4 transition-colors hover:bg-muted/70">
                                <div className="flex items-start gap-4">
                                    <div
                                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors ${
                                            data.estado
                                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300'
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
                                            Sub área laboral activa
                                        </Label>

                                        <p className="text-sm leading-5 text-muted-foreground">
                                            Indica si esta subárea está
                                            disponible en el sistema.
                                        </p>

                                        <p className="text-sm font-medium text-foreground">
                                            {data.estado
                                                ? 'Activa'
                                                : 'Inactiva'}
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
                                            setData(
                                                'estado',
                                                checked === true,
                                            )
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

                        {/* ACCIONES */}
                        <CardFooter className="flex flex-col-reverse gap-3 border-t border-border bg-muted/40 px-6 py-4 sm:flex-row sm:justify-end">
                            <Button
                                variant="outline"
                                type="button"
                                asChild
                                className="h-10 w-full rounded-lg border-border bg-background font-medium sm:w-auto"
                            >
                                <Link href="/sub-areas-laborales">
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
