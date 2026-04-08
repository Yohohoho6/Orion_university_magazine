<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\Faculty;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'status',
        'profile_path',
        'role_id',
        'faculty_id',
        'last_login_at',
        'previous_login_at',
        'is_new_user',
        'browser',
        'is_2fa_on',
        'verification_code',
        'verification_expires_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'last_login_at' => 'datetime',
        'previous_login_at' => 'datetime',
        'is_new_user' => 'boolean',
    ];

    protected $appends = [
        'last_login_formatted',
    ];

    public function getProfileUrlAttribute(): ?string
    {
        return $this->profile_path ? asset('storage/' . $this->profile_path) : null;
    }

    /**
     * Get formatted last login time (previous login for display)
     */
    public function getLastLoginFormattedAttribute(): ?string
    {
        // Return previous_login_at if set (after trackLogin has run)
        // Otherwise return last_login_at (before trackLogin, or for first login)
        $loginTime = $this->previous_login_at ?? $this->last_login_at;
        return $loginTime?->diffForHumans();
    }

    /**
     * Update last login information
     */
    public function trackLogin(): void
    {
        // Save current login time as previous before updating
        $this->previous_login_at = $this->last_login_at;
        
        // Update current login time
        $this->last_login_at = now();

        // Mark as not new user after first login
        if ($this->is_new_user) {
            $this->is_new_user = false;
        }

        $this->save();
    }

    /**
     * Check if user is new (has never logged in)
     */
    public function isNew(): bool
    {
        return $this->is_new_user;
    }

    public function role(): BelongsTo
    {
        return $this->belongsTo(Role::class);
    }

    public function contributions()
    {
        return $this->hasMany(Contribution::class);
    }

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    /**
     * Get the faculty that owns the user.
     */
    public function faculty(): BelongsTo
    {
        return $this->belongsTo(Faculty::class);
    }

    public function isAdmin(): bool
    {
        return $this->hasRole('admin');
    }

    public function activate(): void
    {
        $this->update(['status' => 'active']);
    }

    public function deactivate(): void
    {
        $this->update(['status' => 'inactive']);
    }

    /**
     * Get the notifications for the user.
     */
    public function notifications()
    {
        return $this->hasMany(Notification::class);
    }

    /**
     * Get unread notifications for the user.
     */
    public function unreadNotifications()
    {
        return $this->hasMany(Notification::class)->where('remind', false);
    }
}
