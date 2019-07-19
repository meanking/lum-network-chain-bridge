<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::prefix('v1')->group(function(){
   Route::prefix('blocks')->group(function(){
       Route::get('/', 'BlockController@index');
       Route::get('/{height}', 'BlockController@show');
   });

   Route::prefix('transactions')->group(function(){
       Route::get('/', 'TransactionController@index');
       Route::get('/{hash}', 'TransactionController@show');
   });

   Route::prefix('accounts')->group(function(){
       Route::get('/{address}', 'AccountController@show');
   });
});
