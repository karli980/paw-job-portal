<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Talent Match | Reporte de Habilidades</title>

    <style>
        @page {
            size: A4;
            margin: 18mm 14mm 20mm 14mm;
        }

        * {
            box-sizing: border-box;
        }

        body {
            margin: 0;
            padding: 0;
            font-family: DejaVu Sans, sans-serif;
            font-size: 10px;
            line-height: 1.6;
            color: #172033;
            background: #ffffff;
        }

        .page {
            width: 100%;
        }

        /* ENCABEZADO */

        .report-header {
            width: 100%;
            border-bottom: 1px solid #e2e8f0;
            padding-bottom: 16px;
        }

        .header-table,
        .meta-table,
        .kpi-table,
        .data-table {
            width: 100%;
            border-collapse: collapse;
        }

        .brand-mark {
            width: 44px;
            height: 44px;
            text-align: center;
            vertical-align: middle;
            background: #4f46e5;
            color: #ffffff;
            font-size: 16px;
            font-weight: bold;
            border-radius: 8px;
        }

        .brand-name {
            font-size: 15px;
            font-weight: bold;
            color: #172033;
        }

        .brand-subtitle {
            font-size: 9px;
            color: #64748b;
        }

        .badge {
            display: inline-block;
            padding: 6px 10px;
            background: #eef2ff;
            color: #4338ca;
            border-radius: 12px;
            font-size: 8px;
            font-weight: bold;
            text-transform: uppercase;
        }

        /* TÍTULO */

        .report-title {
            margin-top: 24px;
        }

        .report-title h1 {
            margin: 0 0 5px;
            color: #172033;
            font-size: 23px;
            line-height: 1.3;
        }

        .report-title p {
            margin: 0;
            color: #64748b;
            font-size: 10px;
        }

        /* METADATOS */

        .meta-table {
            margin-top: 20px;
            border: 1px solid #e2e8f0;
        }

        .meta-table td {
            width: 25%;
            padding: 10px;
            border-right: 1px solid #e2e8f0;
            vertical-align: top;
        }

        .meta-table td:last-child {
            border-right: none;
        }

        .meta-label {
            display: block;
            margin-bottom: 3px;
            color: #64748b;
            font-size: 8px;
            font-weight: bold;
            text-transform: uppercase;
        }

        .meta-value {
            color: #172033;
            font-size: 9px;
            font-weight: bold;
        }

        /* INDICADORES */

        .kpi-table {
            margin-top: 18px;
        }

        .kpi-table td {
            width: 33.33%;
            padding: 0 5px;
            vertical-align: top;
        }

        .kpi-table td:first-child {
            padding-left: 0;
        }

        .kpi-table td:last-child {
            padding-right: 0;
        }

        .kpi-card {
            padding: 13px;
            border: 1px solid #e2e8f0;
            border-top: 3px solid #4f46e5;
            background: #ffffff;
        }

        .kpi-card.active {
            border-top-color: #059669;
        }

        .kpi-card.inactive {
            border-top-color: #e11d48;
        }

        .kpi-label {
            color: #64748b;
            font-size: 8px;
            font-weight: bold;
            text-transform: uppercase;
        }

        .kpi-value {
            margin: 6px 0 2px;
            color: #4f46e5;
            font-size: 23px;
            font-weight: bold;
            line-height: 1.2;
        }

        .kpi-card.active .kpi-value {
            color: #059669;
        }

        .kpi-card.inactive .kpi-value {
            color: #e11d48;
        }

        .kpi-description {
            color: #64748b;
            font-size: 8px;
        }

        /* SECCIÓN */

        .section {
            margin-top: 28px;
        }

        .section-title {
            margin: 0 0 12px;
            padding-left: 10px;
            border-left: 4px solid #4f46e5;
            color: #4338ca;
            font-size: 11px;
            font-weight: bold;
            text-transform: uppercase;
        }

        .section-description {
            margin: -5px 0 12px;
            color: #64748b;
            font-size: 9px;
        }

        /* TABLA DE HABILIDADES */

        .data-table {
            font-size: 9px;
        }

        .data-table thead {
            display: table-header-group;
        }

        .data-table thead th {
            padding: 10px 9px;
            background: #eef2ff;
            color: #3730a3;
            border-bottom: 1px solid #c7d2fe;
            font-size: 8px;
            font-weight: bold;
            text-align: left;
            text-transform: uppercase;
        }

        .data-table tbody td {
            padding: 10px 9px;
            border-bottom: 1px solid #e2e8f0;
            vertical-align: middle;
        }

        .data-table tbody tr:nth-child(even) {
            background: #f8fafc;
        }

        .id-cell {
            width: 10%;
            color: #64748b;
        }

        .name-cell {
            width: 35%;
            color: #172033;
            font-weight: bold;
        }

        .category-cell {
            width: 30%;
            color: #475569;
        }

        .status-cell {
            width: 25%;
            text-align: center;
        }

        .status {
            display: inline-block;
            padding: 4px 9px;
            border-radius: 10px;
            font-size: 8px;
            font-weight: bold;
        }

        .status.active {
            background: #d1fae5;
            color: #065f46;
        }

        .status.inactive {
            background: #ffe4e6;
            color: #9f1239;
        }

        .empty {
            padding: 22px !important;
            color: #64748b;
            text-align: center;
        }

        /* NOTA INFORMATIVA */

        .note {
            margin-top: 20px;
            padding: 13px 15px;
            background: #f1f5f9;
            border: 1px solid #e2e8f0;
            border-left: 3px solid #4f46e5;
            color: #475569;
            font-size: 9px;
        }

        .note strong {
            color: #4338ca;
        }

        /* PIE DEL REPORTE */

        .report-footer {
            margin-top: 28px;
            padding-top: 12px;
            border-top: 1px solid #e2e8f0;
            color: #64748b;
            font-size: 8px;
        }

        .footer-table {
            width: 100%;
            border-collapse: collapse;
        }

        .footer-table td {
            width: 50%;
            vertical-align: top;
        }

        .footer-right {
            text-align: right;
        }

        .text-muted {
            color: #64748b;
        }

        .text-center {
            text-align: center;
        }

        tr {
            page-break-inside: avoid;
        }
    </style>
</head>

<body>
    @php
        $totalHabilidades = $habilidades->count();

        $habilidadesActivas = $habilidades
            ->filter(fn ($habilidad) => (bool) $habilidad->estado)
            ->count();

        $habilidadesInactivas = $totalHabilidades - $habilidadesActivas;

        $fechaEmision = now()->format('d/m/Y');
    @endphp

    <main class="page">

        {{-- ENCABEZADO --}}
        <header class="report-header">
            <table class="header-table">
                <tr>
                    <td style="width: 55px; vertical-align: middle;">
                        <table>
                            <tr>
                                <td class="brand-mark">TM</td>
                            </tr>
                        </table>
                    </td>

                    <td style="vertical-align: middle; padding-left: 10px;">
                        <div class="brand-name">Talent Match</div>
                        <div class="brand-subtitle">
                            Búsqueda y Reclutamiento Laboral
                        </div>
                    </td>

                    <td style="text-align: right; vertical-align: middle;">
                        <span class="badge">Reporte administrativo</span>
                    </td>
                </tr>
            </table>
        </header>

        {{-- TÍTULO --}}
        <div class="report-title">
            <h1>Habilidades registradas</h1>
            <p>
                Reporte de las habilidades registradas en el sistema
                de gestión de Talent Match.
            </p>
        </div>

        {{-- METADATOS --}}
        <table class="meta-table">
            <tr>
                <td>
                    <span class="meta-label">Elaborado por</span>
                    <span class="meta-value">Administración</span>
                </td>

                <td>
                    <span class="meta-label">Fecha de emisión</span>
                    <span class="meta-value">{{ $fechaEmision }}</span>
                </td>

                <td>
                    <span class="meta-label">Área</span>
                    <span class="meta-value">Gestión de habilidades</span>
                </td>

                <td>
                    <span class="meta-label">Documento</span>
                    <span class="meta-value">REP-HAB-001</span>
                </td>
            </tr>
        </table>

        {{-- INDICADORES --}}
        <table class="kpi-table">
            <tr>
                <td>
                    <div class="kpi-card">
                        <div class="kpi-label">Total de habilidades</div>
                        <div class="kpi-value">{{ $totalHabilidades }}</div>
                        <div class="kpi-description">
                            Registros encontrados
                        </div>
                    </div>
                </td>

                <td>
                    <div class="kpi-card active">
                        <div class="kpi-label">Habilidades activas</div>
                        <div class="kpi-value">{{ $habilidadesActivas }}</div>
                        <div class="kpi-description">
                            Disponibles en el sistema
                        </div>
                    </div>
                </td>

                <td>
                    <div class="kpi-card inactive">
                        <div class="kpi-label">Habilidades inactivas</div>
                        <div class="kpi-value">{{ $habilidadesInactivas }}</div>
                        <div class="kpi-description">
                            Desactivadas en el sistema
                        </div>
                    </div>
                </td>
            </tr>
        </table>

        {{-- TABLA --}}
        <section class="section">
            <h2 class="section-title">Listado de habilidades</h2>

            <p class="section-description">
                Detalle de las habilidades registradas, sus categorías
                y su estado actual.
            </p>

            <table class="data-table">
                <thead>
                    <tr>
                        <th class="id-cell">ID</th>
                        <th class="name-cell">Nombre de la habilidad</th>
                        <th class="category-cell">Categoría</th>
                        <th class="status-cell">Estado</th>
                    </tr>
                </thead>

                <tbody>
                    @forelse ($habilidades as $habilidad)
                        <tr>
                            <td class="id-cell">
                                {{ $habilidad->id }}
                            </td>

                            <td class="name-cell">
                                {{ $habilidad->nombre }}
                            </td>

                            <td class="category-cell">
                                {{ $habilidad->categoria ?: 'Sin categoría' }}
                            </td>

                            <td class="status-cell">
                                @if ($habilidad->estado)
                                    <span class="status active">
                                        Activa
                                    </span>
                                @else
                                    <span class="status inactive">
                                        Inactiva
                                    </span>
                                @endif
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="4" class="empty">
                                No hay habilidades registradas en el sistema.
                            </td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </section>

        {{-- NOTA --}}
        <div class="note">
            <strong>Nota:</strong>
            Este reporte refleja las habilidades existentes en la base
            de datos al momento de su generación. Los indicadores muestran
            el total de registros, la cantidad de habilidades activas
            y la cantidad de habilidades inactivas.
        </div>

        {{-- PIE --}}
        <footer class="report-footer">
            <table class="footer-table">
                <tr>
                    <td>
                        Talent Match · Reporte administrativo
                        <br>
                        Documento generado automáticamente por el sistema.
                    </td>

                    <td class="footer-right">
                        REP-HAB-001
                        <br>
                        Emitido el {{ $fechaEmision }}
                    </td>
                </tr>
            </table>
        </footer>

    </main>
</body>
</html>

