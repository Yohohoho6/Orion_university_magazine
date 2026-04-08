<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ContributionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'file_path' => $this->file_path,
            'file_url' => $this->file_path
                ? asset('storage/' . $this->file_path)
                : null,

            'status' => $this->status,
            'is_selected' => $this->is_selected,
            'terms_accepted' => $this->terms_accepted,

            'academic_year_id' => $this->academic_year_id,
            'category_id' => $this->category_id,
            'faculty_id' => $this->faculty_id,
            'user_id' => $this->user_id,

            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,

            'user' => $this->whenLoaded('user', fn () => [
                'id' => $this->user->id,
                'name' => $this->user->name,
            ]),

            'category' => $this->whenLoaded('category', fn () => [
                'id' => $this->category->id,
                'name' => $this->category->name,
            ]),

            'academic_year' => $this->whenLoaded('academicYear', fn () => [
                'id' => $this->academicYear->id,
                'name' => $this->academicYear->name,
            ]),

            'faculty' => $this->whenLoaded('faculty', fn () => [
                'id' => $this->faculty->id,
                'name' => $this->faculty->name,
            ]),
        ];
    }
}