<?php

namespace App\Services;

use App\Models\EstadoOfertaLaboral;
use App\Models\HistorialEstadoOferta;
use App\Models\OfertaLaboral;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class OfertaLaboralEstadoService
{
    private const TRANSICIONES = [
        'Borrador' => ['Publicada'],
        'Publicada' => ['Pausada', 'Cerrada', 'Expirada'],
        'Pausada' => ['Publicada', 'Cerrada'],
        'Expirada' => ['Archivada'],
        'Cerrada' => ['Archivada'],
        'Archivada' => [],
    ];

    public function __construct(
        private readonly OfertaLaboralPublicacionValidator $validador
    ) {}

    public function cambiarEstado(
        OfertaLaboral $oferta,
        string $nuevoEstado,
        ?User $usuario = null,
        ?string $motivo = null
    ): OfertaLaboral {
        return DB::transaction(function () use (
            $oferta,
            $nuevoEstado,
            $usuario,
            $motivo
        ) {
            // Bloqueamos el registro para evitar cambios simultáneos.
            $oferta = OfertaLaboral::query()
                ->lockForUpdate()
                ->findOrFail($oferta->id);

            $estadoActual = EstadoOfertaLaboral::findOrFail(
                $oferta->estado_oferta_id
            );

            $estadoDestino = EstadoOfertaLaboral::query()
                ->where('nombre', $nuevoEstado)
                ->where('estado', true)
                ->firstOrFail();

            // Verificar que la transición esté permitida.
            $permitidos = self::TRANSICIONES[$estadoActual->nombre] ?? [];

            if (! in_array($nuevoEstado, $permitidos, true)) {
                throw ValidationException::withMessages([
                    'estado' => "No se permite cambiar de {$estadoActual->nombre} a {$nuevoEstado}.",
                ]);
            }

            // Validación obligatoria antes de publicar.
            if ($nuevoEstado === 'Publicada') {
                $this->validador->validar($oferta);

                // Registrar solo la primera publicación.
                if ($oferta->fecha_publicacion === null) {
                    $oferta->fecha_publicacion = now();
                }
            }

            // Actualizar el estado de la oferta.
            $oferta->estado_oferta_id = $estadoDestino->id;
            $oferta->save();

            // Registrar el historial del cambio.
            HistorialEstadoOferta::create([
                'oferta_laboral_id' => $oferta->id,
                'estado_anterior_id' => $estadoActual->id,
                'estado_nuevo_id' => $estadoDestino->id,
                'user_id' => $usuario?->id,
                'motivo' => $motivo,
            ]);

            return $oferta->refresh();
        });
    }
}
