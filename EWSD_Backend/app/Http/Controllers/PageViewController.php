<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\PageView;

class PageViewController extends Controller
{
    public function track(Request $request)
    {
        $pageName = $request->input('page_name');

        // Simply increment views
        PageView::increase($pageName);

        return response()->json([
            'message' => 'Page view counted'
        ]);
    }
}