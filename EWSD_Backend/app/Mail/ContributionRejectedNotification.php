<?php

namespace App\Mail;

use App\Models\Contribution;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ContributionRejectedNotification extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public $contribution;

    public function __construct(Contribution $contribution)
    {
        $this->contribution = $contribution;
    }

    public function build()
    {
        return $this->subject('Update on your Contribution: ' . $this->contribution->title)
                    ->view('emails.contribution_rejected');
    }
}