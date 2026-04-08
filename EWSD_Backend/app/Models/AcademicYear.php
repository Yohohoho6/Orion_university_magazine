<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AcademicYear extends Model
{
    protected $fillable = [
        'name',
        'start_date',
        'end_date',
        'closure_date',
        'final_closure_date',
        'is_active',
    ];
    
    public function contributions()
    {
        return $this->hasMany(Contribution::class);
    }
}
