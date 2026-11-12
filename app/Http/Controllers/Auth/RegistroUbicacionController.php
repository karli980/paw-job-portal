<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class RegistroUbicacionController extends Controller
{
    /**
     * Provincias argentinas activas.
     */
    public function provincias(): JsonResponse
    {
        $provincias = DB::table('provincias as p')
            ->join('paises as pa', 'pa.id', '=', 'p.pais_id')
            ->where('pa.codigo_iso', 'AR')
            ->where('pa.estado', true)
            ->where('p.estado', true)
            ->orderBy('p.nombre')
            ->select('p.id', 'p.nombre')
            ->get();

        return response()->json($provincias);
    }

    /**
     * Ciudades activas de una provincia.
     */
    public function ciudades(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'provincia_id' => ['required', 'integer', 'min:1'],
        ]);

        $ciudades = DB::table('ciudades as c')
            ->join(
                'provincias as p',
                'p.id',
                '=',
                'c.provincia_id'
            )
            ->join(
                'paises as pa',
                'pa.id',
                '=',
                'p.pais_id'
            )
            ->where('c.provincia_id', $validated['provincia_id'])
            ->where('c.estado', true)
            ->where('p.estado', true)
            ->where('pa.estado', true)
            ->where('pa.codigo_iso', 'AR')
            ->orderBy('c.nombre')
            ->select('c.id', 'c.nombre')
            ->get();

        return response()->json($ciudades);
    }
}
