import { Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import {
    ArrowLeft,
    Check,
    Loader2,
    Save,
    ShieldCheck,
    Building2,
    MapPin,
    MapPinned,
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

interface Provincia {
    id: number;
    nombre: string;
    estado?: boolean;
}

interface Ciudad {
    id: number;
    nombre: string;
    codigo_postal: string | null;
    provincia_id: number;
    estado: boolean;
    provincia?: Provincia;
}

interface Props {
    ciudad?: Ciudad | null;
    provincias?: Provincia[] | null;
}

export default function Edit({ ciudad, provincias }: Props) {
    // Verificar que el controlador haya enviado la ciudad.
    if (!ciudad || typeof ciudad.nombre !== 'string') {
        return (
            <div className="min-h-full bg-muted/30 p-6">
                <div className="mx-auto max-w-4xl rounded-xl border border-border bg-card p-6 shadow-sm">
                    <h1 className="text-xl font-bold text-foreground">
                        No se pudo cargar la ciudad
                    </h1>
                    <p className="mt-2 text-sm text-muted-foreground">
                        No se recibieron los datos necesarios para editar este
                        registro. Verifica el método edit() del controlador
                        CiudadController.
                    </p>
                    <Button asChild variant="outline" className="mt-4">
                        <Link href="/ciudades">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Volver al listado
                        </Link>
                    </Button>
                </div>
            </div>
        );
    }

    const listaProvincias = Array.isArray(provincias) ? provincias : [];

    const {
        data,
        setData,
        put,
        processing,
        errors,
    } = useForm({
        nombre: ciudad.nombre,
        codigo_postal: ciudad.codigo_postal ?? '',
        provincia_id: String(ciudad.provincia_id ?? ''),
        estado: Boolean(ciudad.estado),
    });

    const submit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        put(`/ciudades/${ciudad.id}`);
    };

    const claseInput =
        'h-10 rounded-lg border-border bg-background px-3 transition-shadow focus-visible:ring-indigo-500';

    const claseInputError =
        'border-rose-500 focus-visible:ring-rose-500';

    const claseError =
        'text-sm font-medium text-rose-600 dark:text-rose-400';

    const nombreActual = data.nombre ?? '';

    return (
        <div className="min-h-full bg-muted/30">
            <div className="mx-auto w-full max-w-4xl space-y-6 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
                {/* CABECERA */}
                <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                    <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700 ring-1 ring-indigo-200/70 dark:bg-indigo-500/15 dark:text-indigo-300 dark:ring-indigo-400/20">
                            <Building2 className="h-6 w-6" />
                        </div>

                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                                Editar ciudad
                            </h1>

                            <p className="mt-1 max-w-xl text-sm leading-relaxed text-muted-foreground">
                                Modificá los datos de{' '}
                                <span className="font-semibold text-foreground">
                                    {ciudad.nombre}
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
                            href="/ciudades"
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
                                        Información de la ciudad
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
                            {/* PROVINCIA */}
                            <div className="space-y-2">
                                <Label
                                    htmlFor="provincia_id"
                                    className="flex items-center gap-2 text-sm font-semibold text-foreground"
                                >
                                    <MapPinned className="h-4 w-4 text-muted-foreground" />
                                    Provincia{' '}
                                    <span className="text-rose-500">*</span>
                                </Label>

                                <select
                                    id="provincia_id"
                                    value={data.provincia_id}
                                    onChange={(e) =>
                                        setData(
                                            'provincia_id',
                                            e.target.value,
                                        )
                                    }
                                    required
                                    aria-invalid={!!errors.provincia_id}
                                    aria-describedby={
                                        errors.provincia_id
                                            ? 'provincia-error'
                                            : 'provincia-ayuda'
                                    }
                                    className={`${claseInput} w-full ${
                                        errors.provincia_id
                                            ? claseInputError
                                            : ''
                                    }`}
                                >
                                    <option value="">
                                        Seleccioná una provincia
                                    </option>

                                    {listaProvincias.map((provincia) => (
                                        <option
                                            key={provincia.id}
                                            value={provincia.id}
                                        >
                                            {provincia.nombre}
                                            {provincia.estado === false
                                                ? ' (Inactiva)'
                                                : ''}
                                        </option>
                                    ))}
                                </select>

                                {errors.provincia_id ? (
                                    <p
                                        id="provincia-error"
                                        role="alert"
                                        className={claseError}
                                    >
                                        {errors.provincia_id}
                                    </p>
                                ) : (
                                    <p
                                        id="provincia-ayuda"
                                        className="text-xs text-muted-foreground"
                                    >
                                        Seleccioná la provincia a la que
                                        pertenece esta ciudad.
                                    </p>
                                )}
                            </div>

                            {/* NOMBRE */}
                            <div className="space-y-2">
                                <Label
                                    htmlFor="nombre"
                                    className="text-sm font-semibold text-foreground"
                                >
                                    Nombre de la ciudad{' '}
                                    <span className="text-rose-500">*</span>
                                </Label>

                                <Input
                                    id="nombre"
                                    type="text"
                                    value={nombreActual}
                                    onChange={(e) =>
                                        setData('nombre', e.target.value)
                                    }
                                    maxLength={255}
                                    autoComplete="off"
                                    placeholder="Ej.: Salta"
                                    required
                                    aria-invalid={!!errors.nombre}
                                    aria-describedby={
                                        errors.nombre
                                            ? 'nombre-error'
                                            : 'nombre-ayuda'
                                    }
                                    className={`${claseInput} ${
                                        errors.nombre
                                            ? claseInputError
                                            : ''
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

                                <div className="flex items-center justify-between gap-3">
                                    <p
                                        id="nombre-ayuda"
                                        className="text-xs text-muted-foreground"
                                    >
                                        El nombre debe ser único dentro de su
                                        provincia.
                                    </p>

                                    <span
                                        className={`shrink-0 text-xs tabular-nums ${
                                            nombreActual.length > 230
                                                ? 'text-amber-600 dark:text-amber-400'
                                                : 'text-muted-foreground'
                                        }`}
                                    >
                                        {nombreActual.length}/255
                                    </span>
                                </div>
                            </div>

                            {/* CÓDIGO POSTAL */}
                            <div className="space-y-2">
                                <Label
                                    htmlFor="codigo_postal"
                                    className="flex items-center gap-2 text-sm font-semibold text-foreground"
                                >
                                    <MapPin className="h-4 w-4 text-muted-foreground" />
                                    Código postal
                                    <span className="text-xs font-normal text-muted-foreground">
                                        (opcional)
                                    </span>
                                </Label>

                                <Input
                                    id="codigo_postal"
                                    type="text"
                                    value={data.codigo_postal}
                                    onChange={(e) =>
                                        setData(
                                            'codigo_postal',
                                            e.target.value,
                                        )
                                    }
                                    maxLength={20}
                                    autoComplete="off"
                                    placeholder="Ej.: 4400"
                                    aria-invalid={!!errors.codigo_postal}
                                    aria-describedby={
                                        errors.codigo_postal
                                            ? 'codigo-postal-error'
                                            : 'codigo-postal-ayuda'
                                    }
                                    className={`${claseInput} ${
                                        errors.codigo_postal
                                            ? claseInputError
                                            : ''
                                    }`}
                                />

                                {errors.codigo_postal ? (
                                    <p
                                        id="codigo-postal-error"
                                        role="alert"
                                        className={claseError}
                                    >
                                        {errors.codigo_postal}
                                    </p>
                                ) : (
                                    <p
                                        id="codigo-postal-ayuda"
                                        className="text-xs text-muted-foreground"
                                    >
                                        Podés dejarlo vacío si no corresponde.
                                    </p>
                                )}
                            </div>

                            {/* ESTADO */}
                            <div className="rounded-xl border border-border bg-muted/50 p-4 transition-colors hover:bg-muted/70">
                                <div className="flex items-start gap-4">
                                    <div
                                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors ${
                                            data.estado
                                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400'
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
                                            Ciudad activa
                                        </Label>

                                        <p className="text-sm leading-5 text-muted-foreground">
                                            Indica si esta ciudad está
                                            disponible para utilizarse en el
                                            sistema.
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
                                <Link
                                    href="/ciudades"
                                    className="inline-flex items-center justify-center"
                                >
                                    Cancelar
                                </Link>
                            </Button>

                            <Button
                                type="submit"
                                disabled={processing}
                                className="h-10 w-full rounded-lg bg-indigo-600 px-5 font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-60 dark:bg-indigo-500 dark:hover:bg-indigo-400 sm:w-auto"
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

