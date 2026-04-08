<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $userId = $this->route('user')?->id_utilisateur;

        return [
            'nom'        => 'sometimes|required|string|max:80',
            'prenom'     => 'sometimes|required|string|max:80',
            'email'      => "sometimes|required|email|max:150|unique:utilisateur,email,{$userId},id_utilisateur",
            'password'   => 'sometimes|nullable|string|min:8|confirmed',
            'id_role'    => 'sometimes|required|integer|exists:role,id_role',
            'id_service' => 'sometimes|required|integer|exists:service,id_service',
            'actif'      => 'sometimes|boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'email.unique'       => 'Cette adresse email est déjà utilisée par un autre utilisateur.',
            'password.min'       => 'Le mot de passe doit contenir au moins 8 caractères.',
            'password.confirmed' => 'La confirmation du mot de passe ne correspond pas.',
            'id_role.exists'     => 'Le rôle sélectionné n\'existe pas.',
            'id_service.exists'  => 'Le service sélectionné n\'existe pas.',
        ];
    }
}
