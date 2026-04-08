<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ContributionUpdatedNotification extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public $contribution;

    public function __construct($contribution) {
        $this->contribution = $contribution;
    }

    public function envelope(): Envelope {
        return new Envelope(
            subject: 'Updated Submission: ' . $this->contribution->title,
        );
    }

    public function content(): Content {
        return new Content(
            view: 'emails.contribution_updated',
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
