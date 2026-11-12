<?php

namespace App\Http\Controllers\Empresa;

use App\Http\Controllers\Controller;
use App\Models\Empresa;
use App\Models\Pais;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HtmlSanitizer\HtmlSanitizer;
use Symfony\Component\HtmlSanitizer\HtmlSanitizerConfig;

class PerfilEmpresaController extends Controller
{
    /** Mostrar el perfil y los catálogos necesarios para editarlo. */
    public function edit(Request $request, Empresa $empresa): Response
    {
        $this->verificarAcceso($request, $empresa);

        $empresa->load(['pais', 'provincia', 'ciudad', 'contacto']);

        $paises = Pais::query()
            ->where('estado', true)
            ->orderBy('nombre')
            ->get(['id', 'nombre', 'codigo_iso']);

        $industrias = DB::table('industrias')
            ->where('estado', true)
            ->orderBy('nombre')
            ->get(['id', 'nombre']);

        $cantidadesEmpleados = DB::table('cantidad_de_empleados')
            ->where('estado', true)
            ->orderBy('minimo')
            ->get(['id', 'nombre']);

        $redesDisponibles = DB::table('redes_sociales')
            ->where('estado', true)
            ->orderBy('nombre')
            ->get(['id', 'nombre', 'icono']);

        // Se incluyen los vínculos inactivos para permitir reactivarlos.
        $redesEmpresa = DB::table('empresa_red_social as er')
            ->join('redes_sociales as rs', 'rs.id', '=', 'er.red_social_id')
            ->where('er.empresa_id', $empresa->id)
            ->orderBy('rs.nombre')
            ->get([
                'er.id',
                'er.red_social_id',
                'er.url_perfil',
                'er.estado',
                'rs.nombre',
                'rs.icono',
                'rs.estado as catalogo_activo',
            ]);

        return Inertia::render('Empresa/Perfil/Edit', [
            'empresa' => $empresa,
            'logoUrl' => $empresa->logo ? Storage::disk('public')->url($empresa->logo) : null,
            'paises' => $paises,
            'industrias' => $industrias,
            'cantidadesEmpleados' => $cantidadesEmpleados,
            'redesDisponibles' => $redesDisponibles,
            'redesEmpresa' => $redesEmpresa,
        ]);
    }

    /** Actualizar la información general de la empresa. */
    public function update(Request $request, Empresa $empresa): RedirectResponse
    {
        $this->verificarAcceso($request, $empresa);

        $validated = $request->validate([
            'nombre_comercial' => ['required', 'string', 'max:150'],
            'razon_social' => ['nullable', 'string', 'max:200'],
            'direccion' => ['nullable', 'string', 'max:255'],
            'cuit' => [
                'nullable',
                'digits:11',
                Rule::unique('empresas', 'cuit')->ignore($empresa->id),
            ],
            'descripcion' => ['nullable', 'string', 'max:20000'],
            'sitio_web' => ['nullable', 'url', 'max:255'],
            'industria_id' => [
                'nullable',
                'integer',
                Rule::exists('industrias', 'id')->where('estado', true),
            ],
            'cantidad_de_empleados_id' => [
                'nullable',
                'integer',
                Rule::exists('cantidad_de_empleados', 'id')->where('estado', true),
            ],
            'pais_id' => [
                'required',
                'integer',
                Rule::exists('paises', 'id')->where('estado', true),
            ],
            'provincia_id' => [
                'nullable',
                'integer',
                Rule::exists('provincias', 'id'),
            ],
            'ciudad_id' => [
                'nullable',
                'integer',
                Rule::exists('ciudades', 'id'),
            ],
        ]);

        // Admitimos solo las etiquetas que utiliza el editor; no HTML arbitrario.
        // Esto es indispensable aunque React ya limite el formato visualmente.
        $htmlRecibido = trim((string) ($validated['descripcion'] ?? ''));

        if ($htmlRecibido === '') {
            $validated['descripcion'] = null;
        } else {
            // Compatibilidad con las descripciones antiguas guardadas como texto plano.
            // Evita que signos como < o > se interpreten como etiquetas HTML.
            if (! preg_match('/^<(?:p|h2|h3|ul|ol|blockquote|pre|strong|em|br|a)\b/i', $htmlRecibido)) {
                $lineas = preg_split('/\r\n|\r|\n/', $htmlRecibido) ?: [];
                $htmlRecibido = implode('', array_map(
                    static fn (string $linea): string => '<p>'.($linea !== '' ? e($linea) : '<br>').'</p>',
                    $lineas
                ));
            }

            $sanitizer = new HtmlSanitizer(
                (new HtmlSanitizerConfig)
                    ->allowElement('p', [])
                    ->allowElement('br', [])
                    ->allowElement('h2', [])
                    ->allowElement('h3', [])
                    ->allowElement('strong', [])
                    ->allowElement('em', [])
                    ->allowElement('u', [])
                    ->allowElement('s', [])
                    ->allowElement('ul', [])
                    ->allowElement('ol', ['start'])
                    ->allowElement('li', [])
                    ->allowElement('blockquote', [])
                    ->allowElement('pre', [])
                    ->allowElement('code', [])
                    ->allowElement('a', ['href'])
                    ->allowLinkSchemes(['http', 'https'])
            );

            $htmlSaneado = $sanitizer->sanitize($htmlRecibido);
            $textoVisible = trim(html_entity_decode(
                strip_tags($htmlSaneado),
                ENT_QUOTES | ENT_HTML5,
                'UTF-8'
            ));

            // 5.000 caracteres visibles; el HTML puede ocupar más por sus etiquetas.
            if (mb_strlen($textoVisible, 'UTF-8') > 5000) {
                throw ValidationException::withMessages([
                    'descripcion' => 'La descripción no puede superar los 5.000 caracteres de texto.',
                ]);
            }

            $validated['descripcion'] = $textoVisible === '' ? null : $htmlSaneado;
        }

        $pais = Pais::findOrFail($validated['pais_id']);
        $esArgentina = strtoupper($pais->codigo_iso) === 'AR';

        if ($esArgentina) {
            if (empty($validated['provincia_id'])) {
                throw ValidationException::withMessages([
                    'provincia_id' => 'Seleccioná una provincia.',
                ]);
            }

            if (empty($validated['ciudad_id'])) {
                throw ValidationException::withMessages([
                    'ciudad_id' => 'Seleccioná una ciudad.',
                ]);
            }

            $provinciaValida = DB::table('provincias')
                ->where('id', $validated['provincia_id'])
                ->where('pais_id', $pais->id)
                ->where('estado', true)
                ->exists();

            if (! $provinciaValida) {
                throw ValidationException::withMessages([
                    'provincia_id' => 'La provincia seleccionada no es válida.',
                ]);
            }

            $ciudadValida = DB::table('ciudades')
                ->where('id', $validated['ciudad_id'])
                ->where('provincia_id', $validated['provincia_id'])
                ->where('estado', true)
                ->exists();

            if (! $ciudadValida) {
                throw ValidationException::withMessages([
                    'ciudad_id' => 'La ciudad seleccionada no pertenece a la provincia.',
                ]);
            }
        } else {
            // Las empresas extranjeras no utilizan provincias y ciudades argentinas.
            if (
                ! empty($validated['provincia_id']) ||
                ! empty($validated['ciudad_id'])
            ) {
                throw ValidationException::withMessages([
                    'provincia_id' => 'Para empresas ubicadas fuera de Argentina, podés ingresar la dirección física en el campo Dirección de la empresa. No es necesario seleccionar provincia ni ciudad.',
                ]);
            }

            $validated['provincia_id'] = null;
            $validated['ciudad_id'] = null;
        }
        $validated['direccion'] = filled($validated['direccion'] ?? null)
        ? trim($validated['direccion'])
        : null;

        $empresa->update($validated);

        return redirect()
            ->route('empresa.perfil.edit', $empresa)
            ->with('success', [
                'type' => 'updated',
                'message' => 'Perfil empresarial actualizado correctamente.',
            ]);
    }

    /** Impedir acceder a empresas que no administra el representante. */
    private function verificarAcceso(Request $request, Empresa $empresa): void
    {
        $autorizado = DB::table('empresa_usuario')
            ->where('empresa_id', $empresa->id)
            ->where('user_id', $request->user()->id)
            ->where('rol', 'admin')
            ->where('estado', true)
            ->exists();

        abort_unless(
            $empresa->estado && $autorizado,
            403,
            'No tenés autorización para administrar esta empresa.'
        );
    }
}
