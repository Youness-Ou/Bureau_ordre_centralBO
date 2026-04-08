<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nom'        => 'required|string|max:80',
            'prenom'     => 'required|string|max:80',
            'email'      => 'required|email|max:150|unique:utilisateur,email',
            'password'   => 'required|string|min:8|confirmed',   // Ajout de confirmed
            'id_role'    => 'required|integer|exists:role,id_role',
            'id_service' => 'required|integer|exists:service,id_service',
            'actif'      => 'sometimes|boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'nom.required'        => 'Le nom est requis.',
            'prenom.required'     => 'Le prénom est requis.',
            'email.required'      => 'L\'adresse email est requise.',
            'email.unique'        => 'Cette adresse email est déjà utilisée.',
            'email.email'         => 'Le format de l\'email est invalide.',
            'password.required'   => 'Le mot de passe est requis.',
            'password.min'        => 'Le mot de passe doit contenir au moins 8 caractères.',
            'password.confirmed'  => 'La confirmation du mot de passe ne correspond pas.',
            'id_role.required'    => 'Le rôle est requis.',
            'id_role.exists'      => 'Le rôle sélectionné n\'existe pas.',
            'id_service.required' => 'Le service est requis.',
            'id_service.exists'   => 'Le service sélectionné n\'existe pas.',
        ];
    }
}
