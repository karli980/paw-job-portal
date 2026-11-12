<?php

namespace App\Exports;

use App\Models\CategoriaHabilidad;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Events\AfterSheet;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class CategoriasHabilidadesExport implements
    FromCollection,
    WithHeadings,
    WithStyles,
    ShouldAutoSize,
    WithEvents
{
    /**
     * Obtener las categorías de habilidades para exportar.
     */
    public function collection(): Collection
    {
        return CategoriaHabilidad::query()
            ->select('id', 'nombre', 'estado')
            ->orderBy('nombre')
            ->get()
            ->map(function ($categoria) {
                return [
                    'id' => $categoria->id,
                    'nombre' => $categoria->nombre,
                    'estado' => $categoria->estado
                        ? 'Activa'
                        : 'Inactiva',
                ];
            });
    }

    /**
     * Definir los encabezados de Excel.
     */
    public function headings(): array
    {
        return [
            'ID',
            'Nombre de la categoría',
            'Estado',
        ];
    }

    /**
     * Formato de los encabezados.
     */
    public function styles(Worksheet $sheet): array
    {
        return [
            1 => [
                'font' => [
                    'bold' => true,
                    'size' => 12,
                ],
                'alignment' => [
                    'horizontal' => 'center',
                    'vertical' => 'center',
                ],
                'fill' => [
                    'fillType' => Fill::FILL_SOLID,
                    'startColor' => [
                        'rgb' => 'D9EAF7',
                    ],
                ],
            ],
        ];
    }

    /**
     * Aplicar bordes y colores según el estado.
     */
    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function (AfterSheet $event) {
                $sheet = $event->sheet->getDelegate();

                $ultimaFila = $sheet->getHighestRow();

                // Aplicar bordes y alineación a toda la tabla.
                $sheet->getStyle("A1:C{$ultimaFila}")
                    ->applyFromArray([
                        'borders' => [
                            'allBorders' => [
                                'borderStyle' => Border::BORDER_THIN,
                                'color' => [
                                    'rgb' => 'B7C9D6',
                                ],
                            ],
                        ],
                        'alignment' => [
                            'vertical' => 'center',
                        ],
                    ]);

                // Centrar la columna ID.
                if ($ultimaFila >= 2) {
                    $sheet->getStyle("A2:A{$ultimaFila}")
                        ->getAlignment()
                        ->setHorizontal('center');

                    // Colorear cada fila según el estado.
                    for ($fila = 2; $fila <= $ultimaFila; $fila++) {
                        $estado = $sheet->getCell("C{$fila}")->getValue();

                        $color = $estado === 'Activa'
                            ? 'E2F0D9'
                            : 'FCE4D6';

                        $sheet->getStyle("A{$fila}:C{$fila}")
                            ->getFill()
                            ->setFillType(Fill::FILL_SOLID);

                        $sheet->getStyle("A{$fila}:C{$fila}")
                            ->getFill()
                            ->getStartColor()
                            ->setRGB($color);
                    }
                }

                // Mejorar la altura del encabezado.
                $sheet->getRowDimension(1)->setRowHeight(24);
            },
        ];
    }
}


