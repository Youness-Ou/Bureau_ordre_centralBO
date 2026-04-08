<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ServiceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        // Récupérer l'id du service pour la règle unique (cas update)
        $serviceId = $this->route('service')?->id_service;

        return [
            'nom'          => "required|string|max:100|unique:service,nom,{$serviceId},id_service",
            'description'  => 'nullable|string',
            'chef_service' => 'nullable|string|max:100',
        ];
    }

    public function messages(): array
    {
        return [
            'nom.required' => 'Le nom du service est requis.',
            'nom.unique'   => 'Un service avec ce nom existe déjà.',
            'nom.max'      => 'Le nom du service ne peut pas dépasser 100 caractères.',
        ];
    }
}
