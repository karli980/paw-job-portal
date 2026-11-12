<?php

namespace App\Exports;

use App\Models\AreaLaboral;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Events\AfterSheet;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class AreasLaboralesExport implements
    FromCollection,
    WithHeadings,
    WithStyles,
    ShouldAutoSize,
    WithEvents
{
    /**
     * Obtener las áreas laborales para exportar.
     */
    public function collection(): \Illuminate\Support\Enumerable
    {
        return AreaLaboral::query()
            ->select('id', 'nombre', 'estado')
            ->orderBy('nombre')
            ->get()
            ->map(function ($areaLaboral) {
                return [
                    'id' => $areaLaboral->id,
                    'nombre' => $areaLaboral->nombre,
                    'estado' => $areaLaboral->estado
                        ? 'Activa'
                        : 'Inactiva',
                ];
            });
    }

    /**
     * Encabezados de las columnas.
     */
    public function headings(): array
    {
        return [
            'ID',
            'Nombre del área laboral',
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
     * Bordes y colores según el estado de cada área laboral.
     */
    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function (AfterSheet $event) {
                $sheet = $event->sheet->getDelegate();

                $ultimaFila = $sheet->getHighestRow();

                // Aplicar bordes a toda la tabla.
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
                }

                // Colorear las filas según el estado.
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

                // Mejorar la altura del encabezado.
                $sheet->getRowDimension(1)->setRowHeight(24);
            },
        ];
    }
}
