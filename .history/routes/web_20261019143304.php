<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PaisController;


Route::resource('carreras', CarreraController::class);
Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});

require __DIR__.'/settings.php';
