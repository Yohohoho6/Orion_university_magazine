<?php

namespace App\Console\Commands;

use App\Mail\DeadlineWarningNotification;
use App\Models\AcademicYear;
use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

class SendDeadlineReminders extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:send-deadline-reminders';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $activeYear = AcademicYear::where('is_active', true)->first();
        if (!$activeYear) return;

        $students = User::whereHas('role', fn($q) => $q->where('name', 'student'))->get();

        // 1. Check Closure Date (3 days before)
        if (now()->addDays(3)->isSameDay($activeYear->closure_date)) {
            foreach ($students as $student) {
                Mail::to($student->email)->send(new DeadlineWarningNotification('initial', $activeYear->closure_date));
            }
        }

        // 2. Check Final Closure Date (3 days before)
        if (now()->addDays(3)->isSameDay($activeYear->final_closure_date)) {
            foreach ($students as $student) {
                Mail::to($student->email)->send(new DeadlineWarningNotification('final', $activeYear->final_closure_date));
            }
        }
    }
}
