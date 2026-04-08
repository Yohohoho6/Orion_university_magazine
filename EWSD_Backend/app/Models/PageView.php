<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PageView extends Model
{
    use HasFactory;

    protected $fillable = [
        'page_name',
        'views',
    ];

    /**
     * Increment page views by 1
     *
     * @param string $pageName
     * @return void
     */
    public static function increase($pageName)
    {
        // Find the page by name, or create it with 0 views if not exists
        $page = self::firstOrCreate(
            ['page_name' => $pageName],
            ['views' => 0]
        );

        // Increment the views count
        $page->increment('views');
    }
}