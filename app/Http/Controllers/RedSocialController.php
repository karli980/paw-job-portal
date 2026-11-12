<?php

namespace App\Http\Controllers;

use App\Models\RedSocial;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class RedSocialController extends Controller
{
    /**
     * Mostrar todas las redes sociales.
     */
    public function index()
    {
        $redesSociales = RedSocial::orderBy('id', 'desc')->get();

        return Inertia::render('RedSocial/Index', [
            'redesSociales' => $redesSociales,
        ]);
    }

    /**
     * Mostrar el formulario de creación.
     */
    public function create()
    {
        return Inertia::render('RedSocial/Create');
    }

    /**
     * Guardar una nueva red social.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => [
                'required',
                'string',
                'max:100',
                'unique:redes_sociales,nombre',
            ],
            'url' => [
                'required',
                'url',
                'max:255',
            ],
            'icono' => [
                'required',
                'string',
                'max:100',
            ],
            'estado' => [
                'required',
                'boolean',
            ],
        ]);

        RedSocial::create($validated);

        return redirect()
            ->route('redes-sociales.index')
            ->with('success', [
                'type' => 'created',
                'message' => 'Red social creada correctamente.',
            ]);
    }

    /**
     * Mostrar el detalle de una red social.
     */
    public function show(RedSocial $redSocial)
    {
        abort_unless($redSocial->estado, 404);

        return Inertia::render('RedSocial/Show', [
            'redSocial' => $redSocial,
        ]);
    }

    /**
     * Mostrar el formulario de edición.
     */
    public function edit(RedSocial $redSocial)
    {
        return Inertia::render('RedSocial/Edit', [
            'redSocial' => $redSocial,
        ]);
    }

    /**
     * Actualizar una red social existente.
     */
    public function update(Request $request, RedSocial $redSocial)
    {
        $validated = $request->validate([
            'nombre' => [
                'required',
                'string',
                'max:100',
                Rule::unique('redes_sociales', 'nombre')
                    ->ignore($redSocial->id),
            ],
            'url' => [
                'required',
                'url',
                'max:255',
            ],
            'icono' => [
                'required',
                'string',
                'max:100',
            ],
            'estado' => [
                'required',
                'boolean',
            ],
        ]);

        $redSocial->update($validated);

        return redirect()
            ->route('redes-sociales.index')
            ->with('success', [
                'type' => 'updated',
                'message' => 'Red social actualizada correctamente.',
            ]);
    }

    /**
     * Desactivar una red social.
     */
    public function destroy(RedSocial $redSocial)
    {
        $redSocial->update([
            'estado' => false,
        ]);

        return redirect()
            ->route('redes-sociales.index')
            ->with('success', [
                'type' => 'deleted',
                'message' => 'Red social desactivada correctamente.',
            ]);
    }

    /**
     * Activar o desactivar una red social.
     */
    public function toggleEstado(RedSocial $redSocial)
    {
        $redSocial->update([
            'estado' => ! $redSocial->estado,
        ]);

        $accion = $redSocial->estado
            ? 'activada'
            : 'desactivada';

        return redirect()
            ->route('redes-sociales.index')
            ->with('success', [
                'type' => $redSocial->estado ? 'updated' : 'deleted',
                'message' => "Red social {$accion} correctamente.",
            ]);
    }
}
