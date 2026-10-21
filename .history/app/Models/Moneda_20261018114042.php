<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Moneda extends Model
{
    protected $table = 'monedas';

    protected $fillable = [
        'nombre',
        'simbolo',
        'codigo',
    ];
}
