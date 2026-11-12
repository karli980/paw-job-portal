<?php

namespace App\Services;

use App\Models\OfertaLaboral;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;
use Illuminate\Validation\Rule;

class OfertaLaboralPublicacionValidator
{
    public function validar(OfertaLaboral $oferta): void
    {
        $modalidad = DB::table('modalidades_trabajos')
            ->where('id', $oferta->modalidad_trabajo_id)
            ->where('estado', true)
            ->first();

        $pais = DB::table('paises')
            ->where('id', $oferta->pais_id)
            ->where('estado', true)
            ->first();

        $esArgentina = $pais?->codigo_iso === 'AR';

        $requiereUbicacionLocal = $modalidad
            && in_array($modalidad->nombre, [
                'Presencial',
                'Híbrido',
            ], true)
            && $esArgentina;

        $datos = $oferta->getAttributes();

        $validator = Validator::make($datos, [
            'titulo' => ['required', 'string', 'max:180'],
            'resumen' => ['required', 'string', 'max:300'],
            'descripcion' => ['required', 'string'],

            'area_laboral_id' => [
                'required',
                Rule::exists('areas_laborales', 'id')
                    ->where('estado', true),
            ],

            'sub_area_laboral_id' => [
                'required',
                Rule::exists('sub_areas_laborales', 'id')
                    ->where('estado', true)
                    ->where('area_laboral_id', $oferta->area_laboral_id),
            ],

            'modalidad_trabajo_id' => [
                'required',
                Rule::exists('modalidades_trabajos', 'id')
                    ->where('estado', true),
            ],

            'vacantes' => [
                'required',
                'integer',
                'min:1',
            ],

            'pais_id' => [
                'required',
                Rule::exists('paises', 'id')
                    ->where('estado', true),
            ],

            'provincia_id' => [
                Rule::requiredIf($requiereUbicacionLocal),
                'nullable',
                Rule::exists('provincias', 'id')
                    ->where('estado', true)
                    ->where('pais_id', $oferta->pais_id),
            ],

            'ciudad_id' => [
                Rule::requiredIf($requiereUbicacionLocal),
                'nullable',
                Rule::exists('ciudades', 'id')
                    ->where('estado', true)
                    ->where('provincia_id', $oferta->provincia_id),
            ],

            'fecha_vencimiento' => [
                'required',
                'date',
                'after:now',
            ],

            'salario_minimo' => [
                'nullable',
                'numeric',
                'min:0',
            ],

            'salario_maximo' => [
                'nullable',
                'numeric',
                'min:0',
                'gte:salario_minimo',
            ],

            'moneda_id' => [
                Rule::requiredIf(
                    $oferta->salario_minimo !== null
                    || $oferta->salario_maximo !== null
                ),
                'nullable',
                Rule::exists('monedas', 'id')
                    ->where('estado', true),
            ],

            'periodicidad_salarial' => [
                Rule::requiredIf(
                    $oferta->salario_minimo !== null
                    || $oferta->salario_maximo !== null
                ),
                'nullable',
                Rule::in(['hora', 'mensual', 'anual']),
            ],
        ]);

        $validator->after(function ($validator) use ($oferta) {
            $empresaActiva = DB::table('empresas')
                ->where('id', $oferta->empresa_id)
                ->where('estado', true)
                ->exists();

            if (! $empresaActiva) {
                $validator->errors()->add(
                    'empresa_id',
                    'La empresa debe estar activa para publicar ofertas.'
                );
            }
        });

        if ($validator->fails()) {
            throw new ValidationException($validator);
        }
    }
}
