
<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <title>Talent Match | Reporte de Destrezas</title>

    <style>
        @page {
            size: A4;
            margin: 16mm 12mm 18mm 12mm;
        }

        * {
            box-sizing: border-box;
        }

        body {
            margin: 0;
            padding: 0;
            font-family: DejaVu Sans, sans-serif;
            font-size: 9px;
            line-height: 1.5;
            color: #172033;
            background: #ffffff;
        }

        .page {
            width: 100%;
        }

        .header-table,
        .meta-table,
        .kpi-table,
        .data-table,
        .footer-table {
            width: 100%;
            border-collapse: collapse;
        }

        .report-header {
            width: 100%;
            border-bottom: 1px solid #e2e8f0;
            padding-bottom: 14px;
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
            font-size: 8px;
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

        .report-title {
            margin-top: 22px;
        }

        .report-title h1 {
            margin: 0 0 5px;
            color: #172033;
            font-size: 22px;
            line-height: 1.3;
        }

        .report-title p {
            margin: 0;
            color: #64748b;
            font-size: 9px;
        }

        .meta-table {
            margin-top: 18px;
            border: 1px solid #e2e8f0;
        }

        .meta-table td {
            width: 25%;
            padding: 9px;
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
            font-size: 7px;
            font-weight: bold;
            text-transform: uppercase;
        }

        .meta-value {
            color: #172033;
            font-size: 8px;
            font-weight: bold;
        }

        .kpi-table {
            margin-top: 16px;
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
            padding: 11px;
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
            font-size: 7px;
            font-weight: bold;
            text-transform: uppercase;
        }

        .kpi-value {
            margin: 5px 0 2px;
            color: #4f46e5;
            font-size: 22px;
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
            font-size: 7px;
        }

        .section {
            margin-top: 24px;
        }

        .section-title {
            margin: 0 0 10px;
            padding-left: 9px;
            border-left: 4px solid #4f46e5;
            color: #4338ca;
            font-size: 10px;
            font-weight: bold;
            text-transform: uppercase;
        }

        .section-description {
            margin: -4px 0 10px;
            color: #64748b;
            font-size: 8px;
        }

        .data-table {
            table-layout: fixed;
            font-size: 8px;
        }

        .data-table thead {
            display: table-header-group;
        }

        .data-table thead th {
            padding: 8px 6px;
            background: #eef2ff;
            color: #3730a3;
            border-bottom: 1px solid #c7d2fe;
            font-size: 7px;
            font-weight: bold;
            text-align: left;
            text-transform: uppercase;
        }

        .data-table tbody td {
            padding: 8px 6px;
            border-bottom: 1px solid #e2e8f0;
            vertical-align: top;
            overflow-wrap: break-word;
            word-wrap: break-word;
        }

        .data-table tbody tr:nth-child(even) {
            background: #f8fafc;
        }

        .id-cell {
            width: 7%;
            color: #64748b;
            text-align: center;
        }

        .name-cell {
            width: 23%;
            color: #172033;
            font-weight: bold;
        }

        .category-cell {
            width: 22%;
            color: #4338ca;
        }

        .description-cell {
            width: 32%;
            color: #475569;
        }

        .status-cell {
            width: 16%;
            text-align: center;
        }

        .status {
            display: inline-block;
            padding: 4px 6px;
            border-radius: 10px;
            font-size: 7px;
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

        .note {
            margin-top: 18px;
            padding: 11px 13px;
            background: #f1f5f9;
            border: 1px solid #e2e8f0;
            border-left: 3px solid #4f46e5;
            color: #475569;
            font-size: 8px;
        }

        .note strong {
            color: #4338ca;
        }

        .report-footer {
            margin-top: 24px;
            padding-top: 10px;
            border-top: 1px solid #e2e8f0;
            color: #64748b;
            font-size: 7px;
        }

        .footer-table td {
            width: 50%;
            vertical-align: top;
        }

        .footer-right {
            text-align: right;
        }

        tr {
            page-break-inside: avoid;
        }
    </style>
</head>

<body>
    @php
        $totalDestrezas = $destrezas->count();

        $destrezasActivas = $destrezas
            ->filter(fn($destreza) => (bool) $destreza->estado)
            ->count();

        $destrezasInactivas = $totalDestrezas - $destrezasActivas;

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
            <h1>Destrezas registradas</h1>
            <p>
                Reporte de las destrezas y competencias organizadas por
                categoría en el portal de empleo Talent Match.
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
                    <span class="meta-value">REP-DES-001</span>
                </td>
            </tr>
        </table>

        {{-- INDICADORES --}}
        <table class="kpi-table">
            <tr>
                <td>
                    <div class="kpi-card">
                        <div class="kpi-label">Total de destrezas</div>
                        <div class="kpi-value">{{ $totalDestrezas }}</div>
                        <div class="kpi-description">
                            Registros encontrados
                        </div>
                    </div>
                </td>

                <td>
                    <div class="kpi-card active">
                        <div class="kpi-label">Destrezas activas</div>
                        <div class="kpi-value">{{ $destrezasActivas }}</div>
                        <div class="kpi-description">
                            Habilitadas en el sistema
                        </div>
                    </div>
                </td>

                <td>
                    <div class="kpi-card inactive">
                        <div class="kpi-label">Destrezas inactivas</div>
                        <div class="kpi-value">{{ $destrezasInactivas }}</div>
                        <div class="kpi-description">
                            Deshabilitadas en el sistema
                        </div>
                    </div>
                </td>
            </tr>
        </table>

        {{-- LISTADO --}}
        <section class="section">
            <h2 class="section-title">Listado de destrezas</h2>

            <p class="section-description">
                Detalle de las destrezas registradas, sus categorías,
                descripciones y estado actual.
            </p>

            <table class="data-table">
                <thead>
                    <tr>
                        <th class="id-cell">ID</th>
                        <th class="name-cell">Destreza</th>
                        <th class="category-cell">Categoría</th>
                        <th class="description-cell">Descripción</th>
                        <th class="status-cell">Estado</th>
                    </tr>
                </thead>

                <tbody>
                    @forelse ($destrezas as $destreza)
                        @php
                            $categoria = $destreza->categoriaHabilidad
                                ?? $destreza->categoria_habilidad
                                ?? null;
                        @endphp

                        <tr>
                            <td class="id-cell">
                                {{ $destreza->id }}
                            </td>

                            <td class="name-cell">
                                {{ $destreza->nombre }}
                            </td>

                            <td class="category-cell">
                                {{ $categoria?->nombre ?? 'Sin categoría' }}
                            </td>

                            <td class="description-cell">
                                {{ filled($destreza->descripcion)
                                    ? $destreza->descripcion
                                    : 'Sin descripción' }}
                            </td>

                            <td class="status-cell">
                                @if ($destreza->estado)
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
                            <td colspan="5" class="empty">
                                No hay destrezas registradas.
                            </td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </section>

        {{-- NOTA --}}
        <div class="note">
            <strong>Nota:</strong>
            Este reporte refleja las destrezas registradas en la base de
            datos al momento de su generación. Los indicadores incluyen
            tanto las destrezas activas como las inactivas.
        </div>

        {{-- PIE DE PÁGINA --}}
        <footer class="report-footer">
            <table class="footer-table">
                <tr>
                    <td>
                        Talent Match · Reporte administrativo
                        <br>
                        Documento generado automáticamente por el sistema.
                    </td>

                    <td class="footer-right">
                        REP-DES-001
                        <br>
                        Emitido el {{ $fechaEmision }}
                    </td>
                </tr>
            </table>
        </footer>

    </main>
</body>

</html>


