<?php

use App\Http\Controllers\ContributionController;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;
use Illuminate\Http\Request;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// 1. Send deadline reminders to students
Schedule::command('app:send-deadline-reminders')->dailyAt('00:00');

// 2. Send comment reminders to coordinators
Schedule::command('app:send-comment-reminders')->dailyAt('00:00');

// 3. Auto-Reject stale contributions (Corrected Syntax)
Schedule::call(function () {
    (new ContributionController)->syncAutoReject(new Request());
})->daily();