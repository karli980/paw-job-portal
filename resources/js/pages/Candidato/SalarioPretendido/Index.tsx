import { useEffect, useState, type FormEvent } from 'react';
import { router, useForm } from '@inertiajs/react';
import {
    Wallet,
    Plus,
    Pencil,
    Trash2,
    Eye,
    EyeOff,
    CheckCircle2,
    Info,
    AlertTriangle,
    X,
    HandCoins,
    Power,
    CircleDollarSign,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

type Moneda = {
    id: number;
    nombre: string;
    simbolo: string;
    codigo: string;
};

type SalarioPretendido = {
    id: number;
    candidato_id: number;
    monto: string | number;
    moneda_id: number;
    visible: boolean;
    negociable: boolean;
    estado: boolean;
    moneda: Moneda;
};

type FlashSuccess = {
    type: 'created' | 'updated' | 'deleted';
    message: string;
};

type Props = {
    salarioPretendido: SalarioPretendido | null;
    monedas: Moneda[];
    flash?: {
        success?: FlashSuccess;
    };
};

type FormularioSalario = {
    monto: string;
    moneda_id: string;
    visible: boolean;
    negociable: boolean;
};

export default function Index({
    salarioPretendido,
    monedas,
    flash,
}: Props) {
    const [modalAbierto, setModalAbierto] = useState(false);
    const [notificacion, setNotificacion] =
        useState<FlashSuccess | null>(null);

    const form = useForm<FormularioSalario>({
        monto: '',
        moneda_id: '',
        visible: false,
        negociable: false,
    });

    const tieneSalario = salarioPretendido !== null;
    const salarioActivo = salarioPretendido?.estado === true;
    const salarioVisible =
        salarioActivo && salarioPretendido?.visible === true;

    useEffect(() => {
        if (flash?.success) {
            setNotificacion(flash.success);

            const timer = setTimeout(() => {
                setNotificacion(null);
            }, 4000);

            return () => clearTimeout(timer);
        }
    }, [flash?.success]);

    const abrirNuevo = () => {
        form.reset();
        form.clearErrors();

        form.setData({
            monto: '',
            moneda_id: '',
            visible: false,
            negociable: false,
        });

        setModalAbierto(true);
    };

    const abrirEditar = () => {
        if (!salarioPretendido) return;

        form.clearErrors();

        form.setData({
            monto: String(salarioPretendido.monto),
            moneda_id: String(salarioPretendido.moneda_id),
            visible: salarioPretendido.estado
                ? salarioPretendido.visible
                : false,
            negociable: salarioPretendido.negociable,
        });

        setModalAbierto(true);
    };

    const cerrarModal = () => {
        setModalAbierto(false);
        form.reset();
        form.clearErrors();
    };

    const guardarSalario = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (salarioPretendido) {
            form.put(
                `/candidato/salario-pretendido/${salarioPretendido.id}`,
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        cerrarModal();
                    },
                },
            );

            return;
        }

        form.post('/candidato/salario-pretendido', {
            preserveScroll: true,
            onSuccess: () => {
                cerrarModal();
            },
        });
    };

    const cambiarEstado = () => {
        if (!salarioPretendido) return;

        const accion = salarioActivo ? 'desactivar' : 'reactivar';

        if (
            !window.confirm(
                `¿Estás seguro de que querés ${accion} tu salario pretendido?`,
            )
        ) {
            return;
        }

        router.patch(
            `/candidato/salario-pretendido/${salarioPretendido.id}/estado`,
            {},
            {
                preserveScroll: true,
            },
        );
    };

    const eliminarSalario = () => {
        if (!salarioPretendido) return;

        if (
            !window.confirm(
                '¿Estás seguro de que querés eliminar definitivamente tu salario pretendido? Esta acción no se puede deshacer.',
            )
        ) {
            return;
        }

        router.delete(
            `/candidato/salario-pretendido/${salarioPretendido.id}`,
            {
                preserveScroll: true,
            },
        );
    };

    const formatearImporte = (
        monto: string | number,
        moneda: Moneda,
    ) => {
        const importe = Number(monto);

        return `${moneda.simbolo} ${new Intl.NumberFormat('es-AR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(importe)} ${moneda.codigo}`;
    };

    const tipoNotificacion = {
        created: {
            icono: CheckCircle2,
            clase: 'border-green-200 bg-green-50 text-green-800',
        },
        updated: {
            icono: CheckCircle2,
            clase: 'border-blue-200 bg-blue-50 text-blue-800',
        },
        deleted: {
            icono: AlertTriangle,
            clase: 'border-red-200 bg-red-50 text-red-800',
        },
    };

    const configuracionNotificacion = notificacion
        ? tipoNotificacion[notificacion.type]
        : null;

    return (
        <div className="min-h-full bg-muted/30">
            <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">

                {/* Notificación */}
                {notificacion && configuracionNotificacion && (
                    <div
                        className={`flex items-start gap-3 rounded-xl border p-4 shadow-sm ${
                            configuracionNotificacion.clase
                        }`}
                    >
                        <configuracionNotificacion.icono className="mt-0.5 h-5 w-5 shrink-0" />

                        <p className="flex-1 text-sm font-medium">
                            {notificacion.message}
                        </p>

                        <button
                            type="button"
                            onClick={() => setNotificacion(null)}
                            className="rounded-md p-1 opacity-70 transition hover:opacity-100"
                            aria-label="Cerrar notificación"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                )}

                {/* Encabezado */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700">
                            <Wallet className="h-6 w-6" />
                        </div>

                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                                Salario pretendido
                            </h1>

                            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                                Indicá tus expectativas salariales para que
                                las empresas puedan conocer tus pretensiones
                                económicas.
                            </p>
                        </div>
                    </div>

                    {!tieneSalario && (
                        <Button
                            onClick={abrirNuevo}
                            disabled={monedas.length === 0}
                            className="bg-indigo-600 text-white hover:bg-indigo-700"
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Registrar salario
                        </Button>
                    )}
                </div>

                {/* Información principal */}
                <div className="grid gap-4 md:grid-cols-3">

                    <div className="rounded-xl border bg-background p-5 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-700">
                                <CircleDollarSign className="h-5 w-5" />
                            </div>

                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Registro salarial
                                </p>

                                <p className="font-semibold">
                                    {tieneSalario ? 'Registrado' : 'Pendiente'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border bg-background p-5 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50 text-green-700">
                                <Eye className="h-5 w-5" />
                            </div>

                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Visibilidad
                                </p>

                                <p className="font-semibold">
                                    {!tieneSalario
                                        ? 'Sin configurar'
                                        : salarioVisible
                                          ? 'Visible para empresas'
                                          : 'Oculto'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border bg-background p-5 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-700">
                                <HandCoins className="h-5 w-5" />
                            </div>

                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Negociación
                                </p>

                                <p className="font-semibold">
                                    {!tieneSalario
                                        ? 'Sin configurar'
                                        : salarioPretendido.negociable
                                          ? 'Negociable'
                                          : 'No negociable'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Aviso sobre el funcionamiento */}
                <div className="flex gap-3 rounded-xl border border-blue-200 bg-blue-50/70 p-4 text-blue-900">
                    <Info className="mt-0.5 h-5 w-5 shrink-0 text-blue-700" />

                    <div className="space-y-1">
                        <p className="text-sm font-semibold">
                            ¿Cómo funciona tu salario pretendido?
                        </p>

                        <p className="text-sm leading-relaxed text-blue-800">
                            El importe que registres será tu expectativa
                            salarial mensual bruta. Podés mantenerlo oculto
                            o permitir que las empresas lo consulten en tu
                            perfil. La visibilidad es independiente de que
                            aceptes o no negociar el importe.
                        </p>
                    </div>
                </div>

                {/* Contenido */}
                <section className="overflow-hidden rounded-xl border bg-background shadow-sm">
                    <div className="flex flex-col gap-3 border-b p-5 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="text-lg font-semibold">
                                Mi expectativa salarial
                            </h2>

                            <p className="mt-1 text-sm text-muted-foreground">
                                Administrá el importe que esperás recibir
                                por tu trabajo.
                            </p>
                        </div>

                        {tieneSalario && (
                            <div className="flex flex-wrap gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={abrirEditar}
                                >
                                    <Pencil className="mr-2 h-4 w-4" />
                                    Modificar
                                </Button>

                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={cambiarEstado}
                                    className={
                                        salarioActivo
                                            ? 'text-amber-700 hover:bg-amber-50'
                                            : 'text-green-700 hover:bg-green-50'
                                    }
                                >
                                    <Power className="mr-2 h-4 w-4" />
                                    {salarioActivo
                                        ? 'Desactivar'
                                        : 'Reactivar'}
                                </Button>

                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={eliminarSalario}
                                    className="text-red-600 hover:bg-red-50 hover:text-red-700"
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Eliminar
                                </Button>
                            </div>
                        )}
                    </div>

                    <div className="p-5">
                        {!tieneSalario ? (
                            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-muted/20 px-5 py-12 text-center">
                                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-100 text-indigo-700">
                                    <Wallet className="h-7 w-7" />
                                </div>

                                <h3 className="text-base font-semibold">
                                    Todavía no registraste tu salario pretendido
                                </h3>

                                <p className="mt-2 max-w-md text-sm text-muted-foreground">
                                    Agregá el importe que esperás recibir
                                    para que las empresas puedan conocer
                                    tus expectativas salariales.
                                </p>

                                {monedas.length > 0 ? (
                                    <Button
                                        onClick={abrirNuevo}
                                        className="mt-5 bg-indigo-600 text-white hover:bg-indigo-700"
                                    >
                                        <Plus className="mr-2 h-4 w-4" />
                                        Registrar salario
                                    </Button>
                                ) : (
                                    <p className="mt-5 text-sm text-amber-700">
                                        No hay monedas activas disponibles.
                                        Contactá al administrador.
                                    </p>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-5">

                                {/* Importe */}
                                <div className="rounded-xl border bg-muted/20 p-5 sm:p-6">
                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">
                                                Mi salario pretendido mensual bruto
                                            </p>

                                            <p className="mt-2 text-3xl font-bold tracking-tight text-indigo-700 sm:text-4xl">
                                                {formatearImporte(
                                                    salarioPretendido.monto,
                                                    salarioPretendido.moneda,
                                                )}
                                            </p>

                                            <p className="mt-2 text-sm text-muted-foreground">
                                                {salarioPretendido.moneda.nombre}
                                            </p>
                                        </div>

                                        <div className="flex flex-wrap gap-2">
                                            <span
                                                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
                                                    salarioActivo
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-gray-100 text-gray-700'
                                                }`}
                                            >
                                                <span
                                                    className={`h-2 w-2 rounded-full ${
                                                        salarioActivo
                                                            ? 'bg-green-600'
                                                            : 'bg-gray-500'
                                                    }`}
                                                />
                                                {salarioActivo
                                                    ? 'Activo'
                                                    : 'Inactivo'}
                                            </span>

                                            <span
                                                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
                                                    salarioVisible
                                                        ? 'bg-blue-100 text-blue-800'
                                                        : 'bg-gray-100 text-gray-700'
                                                }`}
                                            >
                                                {salarioVisible ? (
                                                    <Eye className="h-3.5 w-3.5" />
                                                ) : (
                                                    <EyeOff className="h-3.5 w-3.5" />
                                                )}

                                                {salarioVisible
                                                    ? 'Visible'
                                                    : 'Oculto'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Características */}
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="rounded-lg border p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-700">
                                                <HandCoins className="h-5 w-5" />
                                            </div>

                                            <div>
                                                <p className="text-sm text-muted-foreground">
                                                    Condición de negociación
                                                </p>

                                                <p className="font-semibold">
                                                    {salarioPretendido.negociable
                                                        ? 'Negociable'
                                                        : 'No negociable'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="rounded-lg border p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-700">
                                                {salarioVisible ? (
                                                    <Eye className="h-5 w-5" />
                                                ) : (
                                                    <EyeOff className="h-5 w-5" />
                                                )}
                                            </div>

                                            <div>
                                                <p className="text-sm text-muted-foreground">
                                                    Visibilidad para empresas
                                                </p>

                                                <p className="font-semibold">
                                                    {salarioVisible
                                                        ? 'Las empresas pueden verlo'
                                                        : 'Las empresas no pueden verlo'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Aviso según estado */}
                                {!salarioActivo && (
                                    <div className="flex gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-900">
                                        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />

                                        <div>
                                            <p className="text-sm font-semibold">
                                                Tu salario está desactivado
                                            </p>

                                            <p className="mt-1 text-sm text-amber-800">
                                                No se mostrará a las empresas.
                                                Si lo reactivás, seguirá oculto
                                                hasta que habilites nuevamente
                                                su visibilidad.
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {salarioActivo && !salarioVisible && (
                                    <div className="flex gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4 text-blue-900">
                                        <Info className="mt-0.5 h-5 w-5 shrink-0" />

                                        <div>
                                            <p className="text-sm font-semibold">
                                                Tu salario está oculto
                                            </p>

                                            <p className="mt-1 text-sm text-blue-800">
                                                El registro está activo, pero
                                                las empresas no pueden consultar
                                                el importe porque elegiste
                                                mantenerlo privado.
                                            </p>
                                        </div>
                                    </div>
                                )}

                            </div>
                        )}
                    </div>
                </section>

                {/* Modal de registro / edición */}
                <Dialog
                    open={modalAbierto}
                    onOpenChange={(abierto) => {
                        if (!abierto) {
                            cerrarModal();
                        } else {
                            setModalAbierto(true);
                        }
                    }}
                >
                    <DialogContent className="max-h-[90vh] overflow-y-auto rounded-xl sm:max-w-lg">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 text-xl">
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700">
                                    <Wallet className="h-5 w-5" />
                                </div>

                                {salarioPretendido
                                    ? 'Modificar salario pretendido'
                                    : 'Registrar salario pretendido'}
                            </DialogTitle>

                            <DialogDescription>
                                Completá los datos de tu expectativa salarial.
                                Podés modificar esta información cuando lo
                                necesites.
                            </DialogDescription>
                        </DialogHeader>

                        <form
                            onSubmit={guardarSalario}
                            className="space-y-5"
                        >
                            {/* Importe */}
                            <div className="space-y-2">
                                <label
                                    htmlFor="monto"
                                    className="text-sm font-medium"
                                >
                                    Importe mensual bruto
                                    <span className="ml-1 text-red-500">*</span>
                                </label>

                                <Input
                                    id="monto"
                                    type="number"
                                    min="0.01"
                                    step="0.01"
                                    placeholder="Ej.: 1500000"
                                    value={form.data.monto}
                                    onChange={(e) =>
                                        form.setData('monto', e.target.value)
                                    }
                                    disabled={form.processing}
                                    className="h-11"
                                />

                                {form.errors.monto && (
                                    <p className="text-sm text-red-600">
                                        {form.errors.monto}
                                    </p>
                                )}

                                <p className="text-xs text-muted-foreground">
                                    Ingresá el importe bruto que pretendés
                                    percibir mensualmente.
                                </p>
                            </div>

                            {/* Moneda */}
                            <div className="space-y-2">
                                <label
                                    htmlFor="moneda_id"
                                    className="text-sm font-medium"
                                >
                                    Moneda
                                    <span className="ml-1 text-red-500">*</span>
                                </label>

                                <select
                                    id="moneda_id"
                                    value={form.data.moneda_id}
                                    onChange={(e) =>
                                        form.setData(
                                            'moneda_id',
                                            e.target.value,
                                        )
                                    }
                                    disabled={form.processing}
                                    className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none transition focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <option value="">
                                        Seleccioná una moneda
                                    </option>

                                    {monedas.map((moneda) => (
                                        <option
                                            key={moneda.id}
                                            value={moneda.id}
                                        >
                                            {moneda.nombre} ({moneda.codigo})
                                        </option>
                                    ))}
                                </select>

                                {form.errors.moneda_id && (
                                    <p className="text-sm text-red-600">
                                        {form.errors.moneda_id}
                                    </p>
                                )}
                            </div>

                            {/* Negociable */}
                            <div className="rounded-lg border p-4">
                                <label
                                    htmlFor="negociable"
                                    className="flex cursor-pointer items-start gap-3"
                                >
                                    <input
                                        id="negociable"
                                        type="checkbox"
                                        checked={form.data.negociable}
                                        onChange={(e) =>
                                            form.setData(
                                                'negociable',
                                                e.target.checked,
                                            )
                                        }
                                        disabled={form.processing}
                                        className="mt-1 h-4 w-4 rounded border-gray-300 accent-indigo-600"
                                    />

                                    <span>
                                        <span className="block text-sm font-medium">
                                            Salario negociable
                                        </span>

                                        <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">
                                            Indicá si estás dispuesto a
                                            conversar el importe con la empresa
                                            durante el proceso de selección.
                                        </span>
                                    </span>
                                </label>
                            </div>

                            {/* Visible */}
                            <div className="rounded-lg border p-4">
                                <label
                                    htmlFor="visible"
                                    className="flex cursor-pointer items-start gap-3"
                                >
                                    <input
                                        id="visible"
                                        type="checkbox"
                                        checked={form.data.visible}
                                        onChange={(e) =>
                                            form.setData(
                                                'visible',
                                                e.target.checked,
                                            )
                                        }
                                        disabled={
                                            form.processing ||
                                            (salarioPretendido !== null &&
                                                !salarioPretendido.estado)
                                        }
                                        className="mt-1 h-4 w-4 rounded border-gray-300 accent-indigo-600"
                                    />

                                    <span>
                                        <span className="block text-sm font-medium">
                                            Mostrar mi salario a las empresas
                                        </span>

                                        <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">
                                            Si activás esta opción, las
                                            empresas podrán consultar tu
                                            expectativa salarial cuando
                                            visualicen tu perfil.
                                        </span>
                                    </span>
                                </label>

                                {salarioPretendido &&
                                    !salarioPretendido.estado && (
                                        <p className="mt-3 text-xs text-amber-700">
                                            Primero debés reactivar el registro
                                            para poder habilitar su visibilidad.
                                        </p>
                                    )}
                            </div>

                            {/* Errores generales */}
                            {Object.keys(form.errors).length > 0 && (
                                <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                                    <p className="text-sm text-red-700">
                                        Revisá los campos indicados antes de
                                        continuar.
                                    </p>
                                </div>
                            )}

                            <DialogFooter className="gap-2 sm:gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={cerrarModal}
                                    disabled={form.processing}
                                >
                                    Cancelar
                                </Button>

                                <Button
                                    type="submit"
                                    disabled={form.processing}
                                    className="bg-indigo-600 text-white hover:bg-indigo-700"
                                >
                                    {form.processing
                                        ? 'Guardando...'
                                        : salarioPretendido
                                          ? 'Guardar cambios'
                                          : 'Registrar salario'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}
