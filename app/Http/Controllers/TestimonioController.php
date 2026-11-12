<?php

namespace App\Http\Controllers;

use App\Models\Testimonio;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TestimonioController extends Controller
{
    /**
     * Mostrar el listado de testimonios.
     */
    public function index(Request $request)
    {
        $filtros = $request->validate([
            'buscar' => ['nullable', 'string', 'max:100'],
            'tipo' => ['nullable', 'in:candidato,empresa'],
            'consentimiento' => ['nullable', 'in:autorizados,no_autorizados'],
            'estado' => ['nullable', 'in:activo,inactivo'],
            'destacado' => ['nullable', 'in:si,no'],
            'per_page' => ['nullable', 'integer', 'in:5,10,20,50'],
        ]);

        $query = Testimonio::query()
            ->with([
                'user:id,nombre,apellido,imagen,estado',
                'candidato.user:id,nombre,apellido,imagen,estado',
                'empresa:id,nombre_comercial,estado',
            ]);

        // Búsqueda por nombre del autor o empresa.
        $query->when($filtros['buscar'] ?? null, function ($q, $buscar) {
            $q->where(function ($subquery) use ($buscar) {
                $subquery
                    ->whereHas('user', function ($userQuery) use ($buscar) {
                        $userQuery->where(function ($nameQuery) use ($buscar) {
                            $nameQuery
                                ->where('nombre', 'like', "%{$buscar}%")
                                ->orWhere('apellido', 'like', "%{$buscar}%");
                        });
                    })
                    ->orWhereHas('empresa', function ($empresaQuery) use ($buscar) {
                        $empresaQuery->where(
                            'nombre_comercial',
                            'like',
                            "%{$buscar}%"
                        );
                    })
                    ->orWhere('mensaje', 'like', "%{$buscar}%");
            });
        });

        // Filtrar por tipo de testimonio.
        $query->when($filtros['tipo'] ?? null, function ($q, $tipo) {
            if ($tipo === 'candidato') {
                $q->whereNotNull('candidato_id');
            }

            if ($tipo === 'empresa') {
                $q->whereNotNull('empresa_id');
            }
        });

        // Filtrar por consentimiento.
        $query->when(
            $filtros['consentimiento'] ?? null,
            function ($q, $consentimiento) {
                if ($consentimiento === 'autorizados') {
                    $q->where('consentimiento', true)
                        ->whereNull('consentimiento_revocado_at');
                }

                if ($consentimiento === 'no_autorizados') {
                    $q->where(function ($subquery) {
                        $subquery
                            ->where('consentimiento', false)
                            ->orWhereNotNull('consentimiento_revocado_at');
                    });
                }
            }
        );

        // Filtrar por estado.
        $query->when($filtros['estado'] ?? null, function ($q, $estado) {
            $q->where('estado', $estado === 'activo');
        });

        // Filtrar por destacado.
        $query->when($filtros['destacado'] ?? null, function ($q, $destacado) {
            $q->where('destacado', $destacado === 'si');
        });

        $testimonios = $query
            ->latest()
            ->paginate($filtros['per_page'] ?? 10)
            ->withQueryString();

        return Inertia::render('Admin/Testimonios/Index', [
            'testimonios' => $testimonios,
            'filtros' => [
                'buscar' => $filtros['buscar'] ?? '',
                'tipo' => $filtros['tipo'] ?? '',
                'consentimiento' => $filtros['consentimiento'] ?? '',
                'estado' => $filtros['estado'] ?? '',
                'destacado' => $filtros['destacado'] ?? '',
                'per_page' => (int) ($filtros['per_page'] ?? 10),
            ],
        ]);
    }

    /**
     * Activar o desactivar un testimonio.
     */
    public function toggleEstado(Testimonio $testimonio)
    {
        $nuevoEstado = ! $testimonio->estado;

        $testimonio->update([
            'estado' => $nuevoEstado,

            // Al desactivar, también quitamos el destacado.
            'destacado' => $nuevoEstado
                ? $testimonio->destacado
                : false,
        ]);

        return back()->with(
            'success',
            $nuevoEstado
                ? 'Testimonio activado correctamente.'
                : 'Testimonio desactivado correctamente.'
        );
    }

    /**
     * Destacar o quitar el destacado de un testimonio.
     */
    public function toggleDestacado(Testimonio $testimonio)
    {
        if (! $testimonio->destacado) {
            $testimonio->load([
                'user',
                'candidato',
                'empresa',
            ]);

            // Debe existir exactamente un perfil asociado.
            $tieneUnSoloPerfil = (
                $testimonio->candidato_id !== null
                && $testimonio->empresa_id === null
            ) || (
                $testimonio->candidato_id === null
                && $testimonio->empresa_id !== null
            );

            if (! $tieneUnSoloPerfil) {
                return back()->with(
                    'error',
                    'El testimonio debe pertenecer a un único perfil.'
                );
            }

            // Debe estar activo y tener consentimiento vigente.
            if (
                ! $testimonio->estado
                || ! $testimonio->consentimiento
                || $testimonio->consentimiento_revocado_at !== null
            ) {
                return back()->with(
                    'error',
                    'No se puede destacar: el testimonio no está activo o no tiene consentimiento vigente.'
                );
            }

            // El autor debe existir y estar activo.
            if (! $testimonio->user || ! $testimonio->user->estado) {
                return back()->with(
                    'error',
                    'No se puede destacar porque el usuario autor está inactivo.'
                );
            }

            // Validaciones para testimonios de candidatos.
            if ($testimonio->candidato_id !== null) {
                if (
                    ! $testimonio->candidato
                    || $testimonio->candidato->user_id !== $testimonio->user_id
                ) {
                    return back()->with(
                        'error',
                        'El testimonio no tiene una relación válida con el candidato.'
                    );
                }
            }

            // Validaciones para testimonios de empresas.
            if ($testimonio->empresa_id !== null) {
                if (! $testimonio->empresa || ! $testimonio->empresa->estado) {
                    return back()->with(
                        'error',
                        'No se puede destacar porque la empresa está inactiva.'
                    );
                }

                $representanteActivo = $testimonio->empresa
                    ->usuarios()
                    ->where('users.id', $testimonio->user_id)
                    ->wherePivot('estado', true)
                    ->exists();

                if (! $representanteActivo) {
                    return back()->with(
                        'error',
                        'El autor ya no es un representante activo de esta empresa.'
                    );
                }
            }
        }

        $nuevoEstado = ! $testimonio->destacado;

        $testimonio->update([
            'destacado' => $nuevoEstado,
        ]);

        return back()->with(
            'success',
            $nuevoEstado
                ? 'Testimonio destacado correctamente.'
                : 'Se quitó el destacado del testimonio.'
        );
    }

    /**
     * Eliminar un testimonio.
     */
    public function destroy(Testimonio $testimonio)
    {
        $testimonio->delete();

        return back()->with(
            'success',
            'Testimonio eliminado correctamente.'
        );
    }
}

