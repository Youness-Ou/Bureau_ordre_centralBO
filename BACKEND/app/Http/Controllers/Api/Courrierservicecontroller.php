<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Service;

class CourrierServiceController extends Controller
{
    public function index()
    {
        $services = Service::orderBy('nom')->get(['id_service', 'nom', 'description']);
        return response()->json($services);
    }
}
