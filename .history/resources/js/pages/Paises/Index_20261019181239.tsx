import { Link, router } from '@inertiajs/react';
import { useState, type FormEvent } from 'react';
import {
    Search,
    Plus,
    Edit,
    Trash2,
    ArrowUp,
    ArrowDown,
    CheckCircle2,
    Info,
    AlertTriangle,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

// --- INTERFACES ---

interface Pais {
    id: number;
    nombre: string;
    codigo_iso: string;
    codigo_iso3: string;
    estado: boolean;
}

// Interfaz para el enlace de paginación (para los botones numerados)
interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

// Interfaz para la paginación de Laravel
interface PaisesPaginados {
    data: Pais[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
    prev_page_url: string | null;
    next_page_url: string | null;
    links: PaginationLink[]; // Propiedad nativa de Laravel para botones numerados
}

interface Filtros {
    buscar: string;
    orden: string;
    direccion: string;
    por_pagina: number;
}

interface Props {
    paises: PaisesPaginados;
    filtros: Filtros;
    flash?: {
        success?: {
            type: 'created' | 'updated' | 'deleted';
            message: string;
        };
    };
}

// --- COMPONENTE PRINCIPAL ---

export default function Index({ paises, filtros, flash }: Props) {
    // Estados locales para los filtros
    const [buscar, setBuscar] = useState(filtros.buscar ?? '');
    const [porPagina, setPorPagina] = useState(filtros.por_pagina ?? 5);
    const [orden, setOrden] = useState(filtros.orden ?? 'nombre');
    const [direccion, setDireccion] = useState(filtros.direccion ?? 'asc');

    // Aplicar búsqueda y filtros
    const aplicarFiltros = (e: FormEvent) => {
        e.preventDefault();
        router.get('/paises', {
            buscar,
            orden,
            direccion,
            por_pagina: porPagina,
        }, { preserveState: true, preserveScroll: true });
    };

    // Ordenar por columna
    const ordenarPor = (campo: string) => {
        let nuevaDireccion = 'asc';
        if (orden === campo && direccion === 'asc') {
            nuevaDireccion = 'desc';
        }
        setOrden(campo);
        setDireccion(nuevaDireccion);

        router.get('/paises', {
            buscar,
            orden: campo,
            direccion: nuevaDireccion,
            por_pagina: porPagina,
        }, { preserveState: true, preserveScroll: true });
    };

    // Indicador visual de ordenamiento (flecha)
    const indicadorOrden = (campo: string) => {
        if (orden !== campo) return null;
        return direccion === 'asc'
            ? <ArrowUp className="ml-1 inline h-3 w-3" />
            : <ArrowDown className="ml-1 inline h-3 w-3" />;
    };

    // Eliminar (Soft delete)
    const eliminar = (id: number) => {
        if (confirm('¿Está seguro de eliminar este país?')) {
            router.delete(`/paises/${id}`);
        }
    };

    // Colores dinámicos para el mensaje Flash
    const getAlertStyles = (type: string) => {
        switch (type) {
            case 'created':
                return { container: 'border-green-200 bg-green-50 text-green-800', icon: <CheckCircle2 className="h-5 w-5 text-green-600" /> };
            case 'updated':
                return { container: 'border-blue-200 bg-blue-50 text-blue-800', icon: <Info className="h-5 w-5 text-blue-600" /> };
            case 'deleted':
                return { container: 'border-red-200 bg-red-50 text-red-800', icon: <AlertTriangle className="h-5 w-5 text-red-600" /> };
            default:
                return { container: 'border-gray-200 bg-gray-50 text-gray-800', icon: <Info className="h-5 w-5 text-gray-600" /> };
        }
    };

    return (
        <div className="mx-auto w-full max-w-7xl space-y-6 p-6 md:p-8">

            {/* 1. CABECERA */}
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Países</h1>
                    <p className="mt-1 text-sm text-gray-500">Administra el listado de países y sus códigos ISO.</p>
                </div>
                <Button asChild className="w-fit bg-gray-900 hover:bg-gray-800">
                    <Link href="/paises/create" className="flex items-center gap-2">
                        <Plus className="h-4 w-4" /> Nuevo país
                    </Link>
                </Button>
            </div>

            {/* 2. MENSAJE FLASH */}
            {flash?.success && (() => {
                const styles = getAlertStyles(flash.success.type);
                return (
                    <div className={`flex items-center gap-3 rounded-lg border p-4 shadow-sm ${styles.container}`}>
                        {styles.icon}
                        <div className="text-sm font-medium">{flash.success.message}</div>
                    </div>
                );
            })()}

            {/* 3. FORMULARIO DE BÚSQUEDA Y FILTROS */}
            <form onSubmit={aplicarFiltros} className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm md:flex-row md:items-end">
                <div className="flex-1 space-y-2">
                    <label className="text-sm font-medium text-gray-700">Buscar</label>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <Input
                            type="text"
                            value={buscar}
                            onChange={(e) => setBuscar(e.target.value)}
                            placeholder="Buscar país por nombre..."
                            className="pl-9"
                        />
                    </div>
                </div>

                <div className="w-full space-y-2 md:w-48">
                    <label className="text-sm font-medium text-gray-700">Mostrar</label>
                    <select
                        value={porPagina}
                        onChange={(e) => setPorPagina(Number(e.target.value))}
                        className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                    >
                        <option value={5}>5 filas</option>
                        <option value={10}>10 filas</option>
                        <option value={20}>20 filas</option>
                    </select>
                </div>

                <Button type="submit" className="bg-gray-900 hover:bg-gray-800">
                    Buscar
                </Button>
            </form>

            {/* 4. TABLA DE DATOS */}
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                <Table>
                    <TableHeader className="bg-gray-50/50">
                        <TableRow>
                            <TableHead
                                className="cursor-pointer font-semibold text-gray-900 hover:bg-gray-100 select-none transition-colors"
                                onClick={() => ordenarPor('nombre')}
                            >
                                <div className="flex items-center">
                                    Nombre {indicadorOrden('nombre')}
                                </div>
                            </TableHead>
                            <TableHead
                                className="cursor-pointer font-semibold text-gray-900 hover:bg-gray-100 select-none transition-colors"
                                onClick={() => ordenarPor('codigo_iso')}
                            >
                                <div className="flex items-center">
                                    Código ISO (2) {indicadorOrden('codigo_iso')}
                                </div>
                            </TableHead>
                            <TableHead
                                className="cursor-pointer font-semibold text-gray-900 hover:bg-gray-100 select-none transition-colors"
                                onClick={() => ordenarPor('codigo_iso3')}
                            >
                                <div className="flex items-center">
                                    Código ISO (3) {indicadorOrden('codigo_iso3')}
                                </div>
                            </TableHead>
                            <TableHead className="text-right font-semibold text-gray-900">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paises.data.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-32 text-center text-gray-500">
                                    No se encontraron países.
                                </TableCell>
                            </TableRow>
                        ) : (
                            paises.data.map((pais) => (
                                <TableRow key={pais.id} className="transition-colors hover:bg-gray-50/50">
                                    <TableCell className="font-medium text-gray-900">{pais.nombre}</TableCell>
                                    <TableCell>
                                        <span className="inline-flex rounded-md bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                                            {pais.codigo_iso}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <span className="inline-flex rounded-md bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                                            {pais.codigo_iso3}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button variant="ghost" size="sm" asChild className="h-8 text-gray-600 hover:text-gray-900">
                                                <Link href={`/paises/${pais.id}/edit`}>
                                                    <Edit className="mr-2 h-4 w-4" /> Editar
                                                </Link>
                                            </Button>
                                            <Button variant="ghost" size="sm" onClick={() => eliminar(pais.id)} className="h-8 text-red-600 hover:bg-red-50 hover:text-red-700">
                                                <Trash2 className="mr-2 h-4 w-4" /> Eliminar
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>

                {/* 5. PAGINACIÓN Y BOTONES NUMERADOS */}
                <div className="flex flex-col items-center justify-between border-t border-gray-100 bg-gray-50/50 px-6 py-4 md:flex-row gap-4">
                    <p className="text-sm text-gray-500">
                        Mostrando <span className="font-medium text-gray-900">{paises.from ?? 0}</span> a <span className="font-medium text-gray-900">{paises.to ?? 0}</span> de <span className="font-medium text-gray-900">{paises.total}</span> países
                    </p>

                    <div className="flex items-center gap-2">
                        {/* Botón Anterior */}
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={!paises.prev_page_url}
                            onClick={() => paises.prev_page_url && router.get(paises.prev_page_url, {}, { preserveState: true, preserveScroll: true })}
                            className="h-8 px-3"
                        >
                            <ChevronLeft className="h-4 w-4" />
                            <span className="sr-only">Anterior</span>
                        </Button>

                        {/* Botones Numerados (Investigación de la guía) */}
                        {paises.links && paises.links.map((link, index) => {
                            // Laravel inserta "..." en los extremos cuando hay muchas páginas.
                            // Si el link no tiene url o el label es "...", lo mostramos como texto estático.
                            if (!link.url || link.label === '&laquo; Previous' || link.label === 'Next &raquo;') {
                                if (link.label === '...') {
                                    return <span key={index} className="px-2 text-gray-500">...</span>;
                                }
                                return null;
                            }

                            return (
                                <Button
                                    key={index}
                                    variant={link.active ? "default" : "outline"}
                                    size="sm"
                                    className={link.active ? "h-8 w-8 p-0 bg-gray-900 text-white hover:bg-gray-800" : "h-8 w-8 p-0"}
                                    onClick={() => router.get(link.url!, {}, { preserveState: true, preserveScroll: true })}
                                >
                                    {link.label}
                                </Button>
                            );
                        })}

                        {/* Botón Siguiente */}
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={!paises.next_page_url}
                            onClick={() => paises.next_page_url && router.get(paises.next_page_url, {}, { preserveState: true, preserveScroll: true })}
                            className="h-8 px-3"
                        >
                            <ChevronRight className="h-4 w-4" />
                            <span className="sr-only">Siguiente</span>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
