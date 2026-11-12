<?php

namespace App\Http\Controllers\Empresa;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $empresas = DB::table('empresa_usuario as eu')
            ->join(
                'empresas as e',
                'e.id',
                '=',
                'eu.empresa_id'
            )
            ->where('eu.user_id', $request->user()->id)
            ->where('eu.estado', true)
            ->where('e.estado', true)
            ->orderBy('e.nombre_comercial')
            ->select(
                'e.id',
                'e.nombre_comercial'
            )
            ->get();

        return Inertia::render('Empresa/Dashboard', [
            'empresas' => $empresas,
        ]);
    }
}
