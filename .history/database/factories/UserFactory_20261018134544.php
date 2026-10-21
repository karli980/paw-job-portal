
<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends Factory<User>
 */
class UserFactory extends Factory
{
    /**
     * La contraseña predeterminada para los usuarios de prueba.
     */
    protected static ?string $password = null;

    /**
     * Define los atributos predeterminados del usuario.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'nombre' => fake()->firstName(),
            'apellido' => fake()->lastName(),
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => static::$password ??= Hash::make('password'),
            'imagen' => null,
            'telefono' => fake()->optional()->numerify('+54 9 11 ####-####'),
            'estado' => true,
            'remember_token' => Str::random(10),
        ];
    }

    /**
     * Genera un usuario con el correo sin verificar.
     */
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }

    /**
     * Indica que el usuario tiene autenticación de dos factores.
     */
    public function withTwoFactor(): static
    {
        return $this->state(fn (array $attributes) => [
            'two_factor_secret' => encrypt('secret'),
            'two_factor_recovery_codes' => encrypt(json_encode([
                'recovery-code-1',
                'recovery-code-2',
            ])),
            'two_factor_confirmed_at' => now(),
        ]);
    }
}
