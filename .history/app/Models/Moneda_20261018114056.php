<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Moneda extends Model
{
    use HasFactory;
    
    protected $table = 'monedas';

    protected $fillable = [
        'nombre',
        'simbolo',
        'codigo',
    ];
}
