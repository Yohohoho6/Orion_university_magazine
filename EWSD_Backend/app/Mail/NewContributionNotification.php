<?php

namespace App\Mail;

use App\Models\Contribution;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class NewContributionNotification extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public $contribution;

    public function __construct(Contribution $contribution)
    {
        $this->contribution = $contribution;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'New Article: ' . $this->contribution->title,
            // This is where you put the replyTo logic now
            replyTo: [
                new \Illuminate\Mail\Mailables\Address(
                    $this->contribution->user->email, 
                    $this->contribution->user->name
                ),
            ],
        );
    }

    public function content(): Content
    {
        return new Content(
            // FIX: Changed from 'view.name' to your actual file
            view: 'emails.new_contribution', 
        );
    }

    public function attachments(): array
    {
        return [];
    }
}