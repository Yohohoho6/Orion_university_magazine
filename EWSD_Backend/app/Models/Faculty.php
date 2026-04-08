<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Faculty extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'faculty'; // Specify since Laravel expects 'faculties'

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'description',
        'is_public'
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */

    /**
     * Get all users in this faculty.
     */
    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    public function contributions(): HasMany
    {
        return $this->hasMany(\App\Models\Contribution::class);
    }

    public function isPublic(): bool
    {
        return $this->is_public === true;
    }
}
