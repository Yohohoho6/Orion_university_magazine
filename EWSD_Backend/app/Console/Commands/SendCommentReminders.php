<?php

namespace App\Console\Commands;

use App\Mail\CommentReminderNotification;
use App\Models\Contribution;
use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

class SendCommentReminders extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:send-comment-reminders';

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
        // Find contributions that are still 'pending' and were created 13+ days ago
        $overdueContributions = Contribution::where('status', 'pending')
            ->where('created_at', '<=', now()->subDays(13))
            ->get();

        foreach ($overdueContributions as $contribution) {
            // Find the specific Coordinator for this faculty
            $coordinator = User::where('faculty_id', $contribution->user->faculty_id)
                ->where('role_id', 5) // Coordinator Role
                ->first();

            if ($coordinator) {
                Mail::to($coordinator->email)->send(new CommentReminderNotification($contribution));
            }
        }
    }
}
