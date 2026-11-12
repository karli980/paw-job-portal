<?php

namespace App\Exports;

use App\Models\AreaLaboral;
use App\Models\SubAreaLaboral;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class SubAreasLaboralesExport implements
    FromCollection,
    WithHeadings,
    WithMapping,
    ShouldAutoSize,
    WithStyles
{
    /**
     * Obtener las subáreas laborales con su área correspondiente.
     */
    public function collection(): Collection
    {
        return SubAreaLaboral::with('areaLaboral')
            ->orderBy(
                AreaLaboral::select('nombre')
                    ->whereColumn(
                        'areas_laborales.id',
                        'sub_areas_laborales.area_laboral_id'
                    )
            )
            ->orderBy('nombre')
            ->get();
    }

    /**
     * Encabezados del reporte.
     */
    public function headings(): array
    {
        return [
            'ID',
            'Nombre de la subárea laboral',
            'Área laboral',
            'Estado',
        ];
    }

    /**
     * Mapear los datos de cada subárea.
     */
    public function map($subAreaLaboral): array
    {
        return [
            $subAreaLaboral->id,
            $subAreaLaboral->nombre,
            $subAreaLaboral->areaLaboral?->nombre ?? 'Sin área asignada',
            $subAreaLaboral->estado ? 'Activa' : 'Inactiva',
        ];
    }

    /**
     * Aplicar estilos al reporte Excel.
     */
    public function styles(Worksheet $sheet): array
    {
        $ultimaFila = $sheet->getHighestRow();

        // Encabezados centrados, en negrita y con fondo índigo.
        $sheet->getStyle('A1:D1')->applyFromArray([
            'font' => [
                'bold' => true,
                'color' => [
                    'rgb' => 'FFFFFF',
                ],
            ],
            'fill' => [
                'fillType' => Fill::FILL_SOLID,
                'startColor' => [
                    'rgb' => '4F46E5',
                ],
            ],
            'alignment' => [
                'horizontal' => Alignment::HORIZONTAL_CENTER,
                'vertical' => Alignment::VERTICAL_CENTER,
                'wrapText' => true,
            ],
        ]);

        $sheet->getRowDimension(1)->setRowHeight(25);

        // Bordes para toda la tabla.
        if ($ultimaFila >= 1) {
            $rango = "A1:D{$ultimaFila}";

            $bordes = $sheet->getStyle($rango)
                ->getBorders();

            $bordes->getAllBorders()
                ->setBorderStyle(Border::BORDER_THIN);

            $bordes->getAllBorders()
                ->getColor()
                ->setRGB('D1D5DB');

            // Alineación vertical de las celdas.
            $sheet->getStyle($rango)
                ->getAlignment()
                ->setVertical(Alignment::VERTICAL_CENTER);
        }

        // Colorear las filas según el estado.
        for ($fila = 2; $fila <= $ultimaFila; $fila++) {
            $estado = $sheet->getCell("D{$fila}")->getValue();

            if ($estado === 'Activa') {
                $colorFondo = 'DCFCE7';
                $colorTexto = '166534';
            } else {
                $colorFondo = 'FFE4E6';
                $colorTexto = '9F1239';
            }

            $sheet->getStyle("A{$fila}:D{$fila}")
                ->applyFromArray([
                    'fill' => [
                        'fillType' => Fill::FILL_SOLID,
                        'startColor' => [
                            'rgb' => $colorFondo,
                        ],
                    ],
                    'font' => [
                        'color' => [
                            'rgb' => $colorTexto,
                        ],
                    ],
                ]);
        }

        // Centrar las columnas ID y Estado.
        if ($ultimaFila >= 2) {
            $sheet->getStyle("A2:A{$ultimaFila}")
                ->getAlignment()
                ->setHorizontal(Alignment::HORIZONTAL_CENTER);

            $sheet->getStyle("D2:D{$ultimaFila}")
                ->getAlignment()
                ->setHorizontal(Alignment::HORIZONTAL_CENTER);
        }

        // Fijar encabezado y habilitar filtros.
        $sheet->freezePane('A2');
        $sheet->setAutoFilter("A1:D{$ultimaFila}");

        return [];
    }
}
