import { Head, Link, useForm } from '@inertiajs/react';
import { useMemo, type FormEvent } from 'react';
import {
    ArrowLeft,
    BriefcaseBusiness,
    CircleDollarSign,
    FileText,
    MapPin,
    Save,
    ShieldCheck,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export interface Empresa {
    id: number;
    nombre_comercial: string;
}

export interface Catalogo {
    id: number;
    nombre: string;
}

export interface SubArea extends Catalogo {
    area_laboral_id: number;
}

export interface Pais extends Catalogo {
    codigo_iso: string | null;
}

export interface Provincia extends Catalogo {
    pais_id: number;
}

export interface Ciudad extends Catalogo {
    provincia_id: number;
}

export interface Moneda extends Catalogo {
    simbolo: string;
    codigo: string;
}

export interface OfertaExistente {
    id: number;
    titulo: string | null;
    resumen: string | null;
    descripcion: string | null;
    area_laboral_id: number | null;
    sub_area_laboral_id: number | null;
    modalidad_trabajo_id: number | null;
    vacantes: number | null;
    pais_id: number | null;
    provincia_id: number | null;
    ciudad_id: number | null;
    salario_minimo: number | string | null;
    salario_maximo: number | string | null;
    moneda_id: number | null;
}

export interface Props {
    modo: 'crear' | 'editar';
    oferta?: OfertaExistente;
    empresa: Empresa;
    modalidades: Catalogo[];
    areasLaborales: Catalogo[];
    subAreasLaborales: SubArea[];
    paises: Pais[];
    provincias: Provincia[];
    ciudades: Ciudad[];
    monedas: Moneda[];
}

const selectClass =
    'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50';

const textareaClass =
    'flex min-h-28 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50';

export default function OfertaLaboralForm({
    modo,
    oferta,
    empresa,
    modalidades,
    areasLaborales,
    subAreasLaborales,
    paises,
    provincias,
    ciudades,
    monedas,
}: Props) {
    const esEdicion = modo === 'editar';
    const { data, setData, post, put, processing, errors } = useForm({
        titulo: oferta?.titulo != null ? String(oferta.titulo) : '',
        resumen: oferta?.resumen != null ? String(oferta.resumen) : '',
        descripcion: oferta?.descripcion != null ? String(oferta.descripcion) : '',
        area_laboral_id: oferta?.area_laboral_id != null ? String(oferta.area_laboral_id) : '',
        sub_area_laboral_id: oferta?.sub_area_laboral_id != null ? String(oferta.sub_area_laboral_id) : '',
        modalidad_trabajo_id: oferta?.modalidad_trabajo_id != null ? String(oferta.modalidad_trabajo_id) : '',
        vacantes: oferta?.vacantes != null ? String(oferta.vacantes) : '1',
        pais_id: oferta?.pais_id != null ? String(oferta.pais_id) : '',
        provincia_id: oferta?.provincia_id != null ? String(oferta.provincia_id) : '',
        ciudad_id: oferta?.ciudad_id != null ? String(oferta.ciudad_id) : '',
        salario_minimo: oferta?.salario_minimo != null ? String(oferta.salario_minimo) : '',
        salario_maximo: oferta?.salario_maximo != null ? String(oferta.salario_maximo) : '',
        moneda_id: oferta?.moneda_id != null ? String(oferta.moneda_id) : '',
    });

    const urlListado = `/empresa/${empresa.id}/ofertas`;

    const subAreasFiltradas = useMemo(
        () =>
            subAreasLaborales.filter(
                (item) => String(item.area_laboral_id) === data.area_laboral_id,
            ),
        [subAreasLaborales, data.area_laboral_id],
    );

    const paisSeleccionado = paises.find(
        (item) => String(item.id) === data.pais_id,
    );
    const esArgentina = paisSeleccionado?.codigo_iso?.toUpperCase() === 'AR';

    const provinciasFiltradas = useMemo(
        () =>
            provincias.filter(
                (item) => String(item.pais_id) === data.pais_id,
            ),
        [provincias, data.pais_id],
    );

    const ciudadesFiltradas = useMemo(
        () =>
            ciudades.filter(
                (item) => String(item.provincia_id) === data.provincia_id,
            ),
        [ciudades, data.provincia_id],
    );

    function guardarBorrador(evento: FormEvent<HTMLFormElement>) {
        evento.preventDefault();
        if (processing) return;

        const opciones = { preserveScroll: true };
        if (esEdicion && oferta) {
            put(`${urlListado}/${oferta.id}`, opciones);
        } else {
            post(urlListado, opciones);
        }
    }

    const mostrarError = (mensaje?: string) =>
        mensaje ? (
            <p role="alert" className="text-sm text-red-600 dark:text-red-400">
                {mensaje}
            </p>
        ) : null;

    return (
        <>
            <Head title={esEdicion ? "Editar oferta laboral" : "Nueva oferta laboral"} />
            {/* El layout global se aplica desde app.tsx. */}
            <main className="min-h-screen bg-slate-50/60 p-4 text-slate-900 dark:bg-background dark:text-foreground sm:p-6 lg:p-8">
                <div className="mx-auto max-w-5xl space-y-7">
                    <header className="space-y-5">
                        <Link
                            href={urlListado}
                            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
                        >
                            <ArrowLeft className="size-4" />
                            Volver a ofertas laborales
                        </Link>
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                            <div className="space-y-2">
                                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-600 dark:text-indigo-400">
                                    Talent Match / Empresas
                                </p>
                                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                                    {esEdicion ? "Editar oferta laboral" : "Nueva oferta laboral"}
                                </h1>
                                <p className="text-sm text-muted-foreground">
                                    Completá los datos de la oferta para{' '}
                                    <span className="font-semibold text-foreground">
                                        {empresa.nombre_comercial}
                                    </span>
                                    .
                                </p>
                            </div>
                            <Badge variant="outline" className="w-fit rounded-full px-4 py-1.5">
                                {esEdicion ? "Editando borrador" : "Borrador sin guardar"}
                            </Badge>
                        </div>
                    </header>

                    <form onSubmit={guardarBorrador} noValidate className="space-y-6">
                        <section className="overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm">
                            <div className="flex items-center gap-3 border-b p-5 sm:p-6">
                                <div className="rounded-lg bg-indigo-50 p-3 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                                    <FileText className="size-5" />
                                </div>
                                <div>
                                    <h2 className="font-semibold">Información principal</h2>
                                    <p className="text-sm text-muted-foreground">Datos que identificarán la oferta.</p>
                                </div>
                            </div>
                            <div className="grid gap-5 p-5 sm:p-6">
                                <div className="space-y-2">
                                    <Label htmlFor="titulo">Título de la oferta</Label>
                                    <Input
                                        id="titulo"
                                        value={data.titulo}
                                        onChange={(e) => setData('titulo', e.target.value)}
                                        placeholder="Ej.: Desarrollador Full Stack"
                                        maxLength={180}
                                        aria-invalid={Boolean(errors.titulo)}
                                    />
                                    {mostrarError(errors.titulo)}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="resumen">Resumen de la oferta</Label>
                                    <textarea
                                        id="resumen"
                                        value={data.resumen}
                                        onChange={(e) => setData('resumen', e.target.value)}
                                        placeholder="Escribí una breve presentación del puesto..."
                                        maxLength={300}
                                        className={textareaClass}
                                        aria-invalid={Boolean(errors.resumen)}
                                    />
                                    <p className="text-xs text-muted-foreground">{data.resumen.length}/300 caracteres</p>
                                    {mostrarError(errors.resumen)}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="descripcion">Descripción del puesto</Label>
                                    <textarea
                                        id="descripcion"
                                        value={data.descripcion}
                                        onChange={(e) => setData('descripcion', e.target.value)}
                                        placeholder="Describí las principales responsabilidades..."
                                        className={`${textareaClass} min-h-40`}
                                        aria-invalid={Boolean(errors.descripcion)}
                                    />
                                    {mostrarError(errors.descripcion)}
                                </div>
                            </div>
                        </section>

                        <section className="overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm">
                            <div className="flex items-center gap-3 border-b p-5 sm:p-6">
                                <div className="rounded-lg bg-blue-50 p-3 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                                    <BriefcaseBusiness className="size-5" />
                                </div>
                                <div>
                                    <h2 className="font-semibold">Clasificación laboral</h2>
                                    <p className="text-sm text-muted-foreground">Área, modalidad y cantidad de vacantes.</p>
                                </div>
                            </div>
                            <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
                                <div className="space-y-2">
                                    <Label htmlFor="area">Área laboral</Label>
                                    <select
                                        id="area"
                                        className={selectClass}
                                        value={data.area_laboral_id}
                                        onChange={(e) => {
                                            setData((anterior) => ({
                                                ...anterior,
                                                area_laboral_id: e.target.value,
                                                sub_area_laboral_id: '',
                                            }));
                                        }}
                                    >
                                        <option value="">Seleccionar área</option>
                                        {areasLaborales.map((area) => (
                                            <option key={area.id} value={area.id}>{area.nombre}</option>
                                        ))}
                                    </select>
                                    {mostrarError(errors.area_laboral_id)}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="subarea">Subárea laboral</Label>
                                    <select
                                        id="subarea"
                                        className={selectClass}
                                        value={data.sub_area_laboral_id}
                                        disabled={!data.area_laboral_id}
                                        onChange={(e) => setData('sub_area_laboral_id', e.target.value)}
                                    >
                                        <option value="">Seleccionar subárea</option>
                                        {subAreasFiltradas.map((subArea) => (
                                            <option key={subArea.id} value={subArea.id}>{subArea.nombre}</option>
                                        ))}
                                    </select>
                                    {mostrarError(errors.sub_area_laboral_id)}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="modalidad">Modalidad de trabajo</Label>
                                    <select
                                        id="modalidad"
                                        className={selectClass}
                                        value={data.modalidad_trabajo_id}
                                        onChange={(e) => setData('modalidad_trabajo_id', e.target.value)}
                                    >
                                        <option value="">Seleccionar modalidad</option>
                                        {modalidades.map((modalidad) => (
                                            <option key={modalidad.id} value={modalidad.id}>{modalidad.nombre}</option>
                                        ))}
                                    </select>
                                    {mostrarError(errors.modalidad_trabajo_id)}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="vacantes">Cantidad de vacantes</Label>
                                    <Input
                                        id="vacantes"
                                        type="number"
                                        min="1"
                                        max="100000"
                                        step="1"
                                        value={data.vacantes}
                                        onChange={(e) => setData('vacantes', e.target.value)}
                                        aria-invalid={Boolean(errors.vacantes)}
                                    />
                                    {mostrarError(errors.vacantes)}
                                </div>
                            </div>
                        </section>

                        <section className="overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm">
                            <div className="flex items-center gap-3 border-b p-5 sm:p-6">
                                <div className="rounded-lg bg-emerald-50 p-3 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                                    <MapPin className="size-5" />
                                </div>
                                <div>
                                    <h2 className="font-semibold">Ubicación laboral</h2>
                                    <p className="text-sm text-muted-foreground">Localización donde se desarrollará el trabajo.</p>
                                </div>
                            </div>
                            <div className="grid gap-5 p-5 sm:grid-cols-3 sm:p-6">
                                <div className="space-y-2">
                                    <Label htmlFor="pais">País</Label>
                                    <select
                                        id="pais"
                                        className={selectClass}
                                        value={data.pais_id}
                                        onChange={(e) => {
                                            setData((anterior) => ({
                                                ...anterior,
                                                pais_id: e.target.value,
                                                provincia_id: '',
                                                ciudad_id: '',
                                            }));
                                        }}
                                    >
                                        <option value="">Seleccionar país</option>
                                        {paises.map((pais) => (
                                            <option key={pais.id} value={pais.id}>{pais.nombre}</option>
                                        ))}
                                    </select>
                                    {mostrarError(errors.pais_id)}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="provincia">Provincia</Label>
                                    <select
                                        id="provincia"
                                        className={selectClass}
                                        value={data.provincia_id}
                                        disabled={!esArgentina}
                                        onChange={(e) => {
                                            setData((anterior) => ({
                                                ...anterior,
                                                provincia_id: e.target.value,
                                                ciudad_id: '',
                                            }));
                                        }}
                                    >
                                        <option value="">Seleccionar provincia</option>
                                        {provinciasFiltradas.map((provincia) => (
                                            <option key={provincia.id} value={provincia.id}>{provincia.nombre}</option>
                                        ))}
                                    </select>
                                    {mostrarError(errors.provincia_id)}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="ciudad">Ciudad</Label>
                                    <select
                                        id="ciudad"
                                        className={selectClass}
                                        value={data.ciudad_id}
                                        disabled={!esArgentina || !data.provincia_id}
                                        onChange={(e) => setData('ciudad_id', e.target.value)}
                                    >
                                        <option value="">Seleccionar ciudad</option>
                                        {ciudadesFiltradas.map((ciudad) => (
                                            <option key={ciudad.id} value={ciudad.id}>{ciudad.nombre}</option>
                                        ))}
                                    </select>
                                    {mostrarError(errors.ciudad_id)}
                                </div>
                            </div>
                        </section>

                        <section className="overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm">
                            <div className="flex items-center gap-3 border-b p-5 sm:p-6">
                                <div className="rounded-lg bg-amber-50 p-3 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">
                                    <CircleDollarSign className="size-5" />
                                </div>
                                <div>
                                    <h2 className="font-semibold">Remuneración</h2>
                                    <p className="text-sm text-muted-foreground">Rango salarial de referencia. Puede completarse más adelante.</p>
                                </div>
                            </div>
                            <div className="grid gap-5 p-5 sm:grid-cols-3 sm:p-6">
                                <div className="space-y-2">
                                    <Label htmlFor="moneda">Moneda</Label>
                                    <select
                                        id="moneda"
                                        className={selectClass}
                                        value={data.moneda_id}
                                        onChange={(e) => setData('moneda_id', e.target.value)}
                                    >
                                        <option value="">Seleccionar moneda</option>
                                        {monedas.map((moneda) => (
                                            <option key={moneda.id} value={moneda.id}>
                                                {moneda.nombre} ({moneda.codigo})
                                            </option>
                                        ))}
                                    </select>
                                    {mostrarError(errors.moneda_id)}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="salario_minimo">Salario mínimo</Label>
                                    <Input
                                        id="salario_minimo"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={data.salario_minimo}
                                        onChange={(e) => setData('salario_minimo', e.target.value)}
                                        placeholder="Ej.: 1000000"
                                        aria-invalid={Boolean(errors.salario_minimo)}
                                    />
                                    {mostrarError(errors.salario_minimo)}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="salario_maximo">Salario máximo</Label>
                                    <Input
                                        id="salario_maximo"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={data.salario_maximo}
                                        onChange={(e) => setData('salario_maximo', e.target.value)}
                                        placeholder="Ej.: 1500000"
                                        aria-invalid={Boolean(errors.salario_maximo)}
                                    />
                                    {mostrarError(errors.salario_maximo)}
                                </div>
                            </div>
                        </section>

                        <div className="flex flex-col gap-4 rounded-xl border bg-card p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                            <div className="flex items-start gap-3">
                                <ShieldCheck className="mt-0.5 size-5 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-semibold">{esEdicion ? "Guardar cambios del borrador" : "Guardar como borrador"}</p>
                                    <p className="text-xs text-muted-foreground">
                                        Podrás completar o revisar la oferta antes de publicarla.
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                <Button asChild variant="outline">
                                    <Link href={urlListado}>Cancelar</Link>
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-indigo-600 hover:bg-indigo-700"
                                >
                                    <Save className="mr-2 size-4" />
                                    {processing ? 'Guardando...' : (esEdicion ? 'Guardar cambios' : 'Guardar borrador')}
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>
            </main>
        </>
    );
}
