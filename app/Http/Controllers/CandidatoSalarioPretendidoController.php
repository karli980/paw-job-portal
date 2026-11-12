<?php

namespace App\Http\Controllers;

use App\Models\Candidato;
use App\Models\Moneda;
use App\Models\SalarioPretendido;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class CandidatoSalarioPretendidoController extends Controller
{
    /**
     * Obtener el candidato autenticado.
     */
    private function obtenerCandidato(): Candidato
    {
        return Candidato::where('user_id', Auth::id())
            ->firstOrFail();
    }

    /**
     * Mostrar el salario pretendido del candidato.
     */
    public function index()
    {
        $candidato = $this->obtenerCandidato();

        $salarioPretendido = $candidato
            ->salarioPretendido()
            ->with('moneda')
            ->first();

        $monedas = Moneda::where('estado', true)
            ->orderBy('nombre')
            ->get([
                'id',
                'nombre',
                'simbolo',
                'codigo',
            ]);

        return Inertia::render(
            'Candidato/SalarioPretendido/Index',
            [
                'salarioPretendido' => $salarioPretendido,
                'monedas' => $monedas,
            ]
        );
    }

    /**
     * Registrar el salario pretendido del candidato.
     */
    public function store(Request $request)
    {
        $candidato = $this->obtenerCandidato();

        $validated = $request->validate([
            'monto' => [
                'required',
                'numeric',
                'gt:0',
                'decimal:0,2',
                'max:9999999999999.99',
            ],

            'moneda_id' => [
                'required',
                'integer',
                Rule::exists('monedas', 'id')
                    ->where('estado', true),
            ],

            'visible' => [
                'required',
                'boolean',
            ],

            'negociable' => [
                'required',
                'boolean',
            ],
        ], [
            'monto.required' => 'El monto del salario es obligatorio.',
            'monto.numeric' => 'El monto debe ser un número válido.',
            'monto.gt' => 'El salario debe ser mayor que cero.',
            'monto.decimal' => 'El monto puede tener hasta dos decimales.',
            'monto.max' => 'El monto supera el máximo permitido.',

            'moneda_id.required' => 'Debés seleccionar una moneda.',
            'moneda_id.exists' => 'La moneda seleccionada no existe o está desactivada.',

            'visible.required' => 'Debés indicar si querés publicar tu salario.',
            'visible.boolean' => 'La opción de visibilidad no es válida.',

            'negociable.required' => 'Debés indicar si el salario es negociable.',
            'negociable.boolean' => 'La opción de negociabilidad no es válida.',
        ]);

        $existente = $candidato->salarioPretendido()->first();

        if ($existente) {
            return back()->withErrors([
                'monto' => 'Ya tenés un salario pretendido registrado. Podés modificarlo desde esta sección.',
            ]);
        }

        $candidato->salarioPretendido()->create([
            'monto' => $validated['monto'],
            'moneda_id' => $validated['moneda_id'],
            'visible' => $validated['visible'],
            'negociable' => $validated['negociable'],
            'estado' => true,
        ]);

        return back()->with('success', [
            'type' => 'updated',
            'message' => 'Tu salario pretendido se guardó correctamente.',
        ]);
    }

    /**
     * Actualizar el salario pretendido.
     */
    public function update(
        Request $request,
        SalarioPretendido $salarioPretendido
    ) {
        $candidato = $this->obtenerCandidato();

        // Verificar que el salario pertenezca al candidato autenticado.
        abort_unless(
            (int) $salarioPretendido->candidato_id === (int) $candidato->id,
            403,
            'No tenés autorización para realizar esta acción.'
        );

        $validated = $request->validate([
            'monto' => [
                'required',
                'numeric',
                'gt:0',
                'decimal:0,2',
                'max:9999999999999.99',
            ],

            'moneda_id' => [
                'required',
                'integer',
                Rule::exists('monedas', 'id')
                    ->where('estado', true),
            ],

            'visible' => [
                'required',
                'boolean',
            ],

            'negociable' => [
                'required',
                'boolean',
            ],
        ], [
            'monto.required' => 'El monto del salario es obligatorio.',
            'monto.numeric' => 'El monto debe ser un número válido.',
            'monto.gt' => 'El salario debe ser mayor que cero.',
            'monto.decimal' => 'El monto puede tener hasta dos decimales.',
            'monto.max' => 'El monto supera el máximo permitido.',

            'moneda_id.required' => 'Debés seleccionar una moneda.',
            'moneda_id.exists' => 'La moneda seleccionada no existe o está desactivada.',

            'visible.required' => 'Debés indicar si querés publicar tu salario.',
            'visible.boolean' => 'La opción de visibilidad no es válida.',

            'negociable.required' => 'Debés indicar si el salario es negociable.',
            'negociable.boolean' => 'La opción de negociabilidad no es válida.',
        ]);

        // Si el salario está desactivado, no puede volver a hacerse visible.
        if (! $salarioPretendido->estado) {
            $validated['visible'] = false;
        }

        $salarioPretendido->update($validated);

        return back()->with('success', [
            'type' => 'updated',
            'message' => 'Tu salario pretendido se actualizó correctamente.',
        ]);
    }

    /**
     * Eliminar el salario pretendido.
     */
    public function destroy(SalarioPretendido $salarioPretendido)
    {
        $candidato = $this->obtenerCandidato();

        abort_unless(
            (int) $salarioPretendido->candidato_id === (int) $candidato->id,
            403,
            'No tenés autorización para realizar esta acción.'
        );

        $salarioPretendido->delete();

        return back()->with('success', [
            'type' => 'deleted',
            'message' => 'Tu salario pretendido se eliminó correctamente.',
        ]);
    }

    /**
     * Activar o desactivar el salario pretendido.
     */
    public function toggleEstado(
        SalarioPretendido $salarioPretendido
    ) {
        $candidato = $this->obtenerCandidato();

        abort_unless(
            (int) $salarioPretendido->candidato_id === (int) $candidato->id,
            403,
            'No tenés autorización para realizar esta acción.'
        );

        $salarioPretendido->estado = ! $salarioPretendido->estado;

        // Un salario desactivado nunca puede permanecer visible.
        if (! $salarioPretendido->estado) {
            $salarioPretendido->visible = false;
        }

        $salarioPretendido->save();

        return back()->with('success', [
            'type' => 'updated',
            'message' => $salarioPretendido->estado
                ? 'Salario pretendido activado correctamente.'
                : 'Salario pretendido desactivado correctamente.',
        ]);
    }
}
