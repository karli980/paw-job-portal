import { Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import {
    ArrowLeft,
    Check,
    Globe2,
    Hash,
    Loader2,
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

    const submit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        put(`/paises/${pais.id}`);
    };

    // Clases reutilizables de presentación.
    const claseInput =
        'h-10 rounded-lg border-border bg-background px-3 transition-shadow focus-visible:ring-indigo-500';
    const claseInputError =
        'border-rose-500 focus-visible:ring-rose-500 dark:border-rose-400 dark:focus-visible:ring-rose-400';
    const claseError =
        'text-sm font-medium text-rose-600 dark:text-rose-400';
    const claseAyuda = 'text-xs text-muted-foreground';

    return (
        <div className="min-h-full bg-muted/30">
            <div className="mx-auto w-full max-w-4xl space-y-6 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">

                {/* CABECERA (Mismo estilo que Index y Create) */}
                <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                    <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700 ring-1 ring-indigo-200/70 dark:bg-indigo-500/15 dark:text-indigo-300 dark:ring-indigo-400/20">
                            <Globe2 className="h-6 w-6" />
                        </div>

                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                                Editar país
                            </h1>
                            <p className="mt-1 max-w-xl text-sm leading-relaxed text-muted-foreground">
                                Modifica los datos de <span className="font-semibold text-foreground">{pais.nombre}</span>.
                            </p>
                        </div>
                    </div>

                    <Button
                        variant="outline"
                        asChild
                        className="h-10 w-full rounded-lg border-border bg-card font-medium shadow-sm transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-indigo-500 sm:w-auto"
                    >
                        <Link href="/paises" className="inline-flex items-center justify-center gap-2">
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
                                        Información del país
                                    </CardTitle>
                                    <CardDescription className="mt-1 text-muted-foreground">
                                        Actualizá los datos. Los campos con <span className="text-rose-500 dark:text-rose-400">*</span> son obligatorios.
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="space-y-7 px-6 py-6">

                            {/* Nombre */}
                            <div className="space-y-2">
                                <Label htmlFor="nombre" className="text-sm font-semibold text-foreground">
                                    Nombre del país <span className="text-rose-500 dark:text-rose-400">*</span>
                                </Label>
                                <Input
                                    id="nombre"
                                    type="text"
                                    value={data.nombre}
                                    onChange={(e) => setData('nombre', e.target.value)}
                                    placeholder="Ej.: Argentina"
                                    autoComplete="off"
                                    aria-invalid={!!errors.nombre}
                                    aria-describedby={errors.nombre ? 'nombre-error' : undefined}
                                    className={`${claseInput} ${
                                        errors.nombre ? claseInputError : ''
                                    }`}
                                />
                                {errors.nombre && (
                                    <p id="nombre-error" role="alert" className={claseError}>{errors.nombre}</p>
                                )}
                            </div>

                            {/* Códigos ISO */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 border-b border-border pb-2">
                                    <Hash className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                                    <h2 className="text-sm font-semibold text-foreground">Códigos internacionales</h2>
                                </div>

                                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                    {/* ISO 2 */}
                                    <div className="space-y-2">
                                        <Label htmlFor="codigo_iso" className="text-sm font-semibold text-foreground">
                                            Código ISO alfa-2 <span className="text-rose-500 dark:text-rose-400">*</span>
                                        </Label>
                                        <Input
                                            id="codigo_iso"
                                            type="text"
                                            value={data.codigo_iso}
                                            onChange={(e) => setData('codigo_iso', e.target.value.toUpperCase())}
                                            maxLength={2}
                                            placeholder="AR"
                                            autoComplete="off"
                                            aria-invalid={!!errors.codigo_iso}
                                            aria-describedby={errors.codigo_iso ? 'codigo_iso-error' : 'codigo_iso-ayuda'}
                                            className={`${claseInput} font-mono tracking-wider uppercase ${
                                                errors.codigo_iso ? claseInputError : ''
                                            }`}
                                        />
                                        {errors.codigo_iso && (
                                            <p id="codigo_iso-error" role="alert" className={claseError}>{errors.codigo_iso}</p>
                                        )}
                                        <p id="codigo_iso-ayuda" className={claseAyuda}>Dos letras. Ejemplo: AR.</p>
                                    </div>

                                    {/* ISO 3 */}
                                    <div className="space-y-2">
                                        <Label htmlFor="codigo_iso3" className="text-sm font-semibold text-foreground">
                                            Código ISO alfa-3 <span className="text-rose-500 dark:text-rose-400">*</span>
                                        </Label>
                                        <Input
                                            id="codigo_iso3"
                                            type="text"
                                            value={data.codigo_iso3}
                                            onChange={(e) => setData('codigo_iso3', e.target.value.toUpperCase())}
                                            maxLength={3}
                                            placeholder="ARG"
                                            autoComplete="off"
                                            aria-invalid={!!errors.codigo_iso3}
                                            aria-describedby={errors.codigo_iso3 ? 'codigo_iso3-error' : 'codigo_iso3-ayuda'}
                                            className={`${claseInput} font-mono tracking-wider uppercase ${
                                                errors.codigo_iso3 ? claseInputError : ''
                                            }`}
                                        />
                                        {errors.codigo_iso3 && (
                                            <p id="codigo_iso3-error" role="alert" className={claseError}>{errors.codigo_iso3}</p>
                                        )}
                                        <p id="codigo_iso3-ayuda" className={claseAyuda}>Tres letras. Ejemplo: ARG.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Estado */}
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
                                        <Label htmlFor="estado" className="cursor-pointer text-sm font-semibold text-foreground">
                                            País activo
                                        </Label>
                                        <p className="text-sm leading-5 text-muted-foreground">
                                            Si está desmarcado, el país no aparecerá en el listado principal.
                                        </p>
                                        {errors.estado && (
                                            <p id="estado-error" role="alert" className={claseError}>{errors.estado}</p>
                                        )}
                                    </div>

                                    <Checkbox
                                        id="estado"
                                        checked={data.estado}
                                        onCheckedChange={(checked) => setData('estado', checked === true)}
                                        aria-invalid={!!errors.estado}
                                        aria-describedby={errors.estado ? 'estado-error' : undefined}
                                        className="mt-1 h-5 w-5 border-slate-300 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background data-[state=checked]:border-indigo-600 data-[state=checked]:bg-indigo-600 data-[state=checked]:text-white dark:border-slate-600 dark:data-[state=checked]:border-indigo-500 dark:data-[state=checked]:bg-indigo-500"
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
                                className="h-10 w-full rounded-lg border-border bg-background font-medium focus-visible:ring-2 focus-visible:ring-indigo-500 sm:w-auto"
                            >
                                <Link href="/paises">Cancelar</Link>
                            </Button>

                            <Button
                                type="submit"
                                disabled={processing}
                                className="h-10 w-full rounded-lg bg-indigo-600 px-5 font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto dark:bg-indigo-500 dark:hover:bg-indigo-400"
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
                    Los cambios se reflejarán inmediatamente en el listado.
                </p>
            </div>
        </div>
    );
}
