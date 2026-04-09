<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateCourrierEntrantRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // true = tout utilisateur connecté peut accéder
        // La vérification du statut se fera dans le controller
        return true;
    }

    public function rules(): array
    {
        return [
            'objet'           => 'required|string|max:255',
            'expediteur_nom'  => 'required|string|max:255',
            'organisme'       => 'nullable|string|max:255',
            'date_reception'  => 'required|date|before_or_equal:today',
            'priorite'        => 'required|in:normale,urgente,tres_urgente',
            'id_service_dest' => 'nullable|exists:services,id',
        ];
    }

    public function messages(): array
    {
        return [
            'objet.required'                  => "L'objet est obligatoire.",
            'expediteur_nom.required'         => "Le nom de l'expéditeur est obligatoire.",
            'date_reception.required'         => "La date de réception est obligatoire.",
            'date_reception.before_or_equal'  => "La date ne peut pas être dans le futur.",
            'priorite.required'               => "La priorité est obligatoire.",
            'priorite.in'                     => "La priorité doit être : normale, urgente ou tres_urgente.",
            'id_service_dest.exists'          => "Le service sélectionné n'existe pas.",
        ];
    }
}
