import { Link, router } from '@inertiajs/react';
import { CheckCircle2, Edit, Plus, Trash2, Info, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

interface Pais {
    id: number;
    nombre: string;
    codigo_iso: string;
    codigo_iso3: string;
    estado: boolean;
}

interface Props {
    paises: Pais[];
    flash?: {
        success?: {
            type: 'created' | 'updated' | 'deleted';
            message: string;
        };
    };
}

export default function Index({ paises, flash }: Props) {
    const eliminar = (id: number) => {
        if (confirm('¿Está seguro de eliminar este país?')) {
            router.delete(`/paises/${id}`);
        }
    };

    // Función para obtener los estilos y el icono según el tipo
    const getAlertStyles = (type: string) => {
        switch (type) {
            case 'created':
                return {
                    container: 'border-green-200 bg-green-50 text-green-800',
                    icon: <CheckCircle2 className="h-5 w-5 text-green-600" />,
                };
            case 'updated':
                return {
                    container: 'border-blue-200 bg-blue-50 text-blue-800',
                    icon: <Info className="h-5 w-5 text-blue-600" />,
                };
            case 'deleted':
                return {
                    container: 'border-red-200 bg-red-50 text-red-800',
                    icon: <AlertTriangle className="h-5 w-5 text-red-600" />,
                };
            default:
                return {
                    container: 'border-gray-200 bg-gray-50 text-gray-800',
                    icon: <Info className="h-5 w-5 text-gray-600" />,
                };
        }
    };

    return (
        <div className="mx-auto w-full max-w-7xl space-y-6 p-6 md:p-8">
            {/* Cabecera de la página */}
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                        Países
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Administra el listado de países y sus códigos ISO.
                    </p>
                </div>
                <Button asChild className="bg-gray-900 hover:bg-gray-800">
                    <Link href="/paises/create" className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        Nuevo país
                    </Link>
                </Button>
            </div>

            {/* Mensaje Flash Dinámico */}
            {flash?.success && (() => {
                const styles = getAlertStyles(flash.success.type);
                return (
                    <div className={`flex items-center gap-3 rounded-lg border p-4 shadow-sm ${styles.container}`}>
                        {styles.icon}
                        <div className="text-sm font-medium">{flash.success.message}</div>
                    </div>
                );
            })()}

            {/* Contenedor de la Tabla */}
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                <Table>
                    <TableHeader className="bg-gray-50/50">
                        <TableRow>
                            <TableHead className="font-semibold text-gray-900">
                                Nombre
                            </TableHead>
                            <TableHead className="font-semibold text-gray-900">
                                Código ISO (2)
                            </TableHead>
                            <TableHead className="font-semibold text-gray-900">
                                Código ISO (3)
                            </TableHead>
                            <TableHead className="text-right font-semibold text-gray-900">
                                Acciones
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paises.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={4}
                                    className="h-24 text-center text-gray-500"
                                >
                                    No hay países registrados.
                                </TableCell>
                            </TableRow>
                        ) : (
                            paises.map((pais) => (
                                <TableRow
                                    key={pais.id}
                                    className="transition-colors hover:bg-gray-50/50"
                                >
                                    <TableCell className="font-medium text-gray-900">
                                        {pais.nombre}
                                    </TableCell>
                                    <TableCell>
                                        <span className="inline-flex items-center rounded-md bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                                            {pais.codigo_iso}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <span className="inline-flex items-center rounded-md bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                                            {pais.codigo_iso3}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                asChild
                                                className="h-8 text-gray-600 hover:text-gray-900"
                                            >
                                                <Link href={`/paises/${pais.id}/edit`}>
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    Editar
                                                </Link>
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => eliminar(pais.id)}
                                                className="h-8 text-red-600 hover:bg-red-50 hover:text-red-700"
                                            >
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                Eliminar
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
