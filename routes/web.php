<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

//Route::get('/', function () {
//    return view('app');
//});


//
//Route::post('count', function (Request $request) {
//    return response()->json([
//        'message' => $request->message,
//    ]);
//});


Route::view('/{path?}', 'app');
