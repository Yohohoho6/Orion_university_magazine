<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ContributionSelectedNotification extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     */
    public $contribution;

    public function __construct($contribution)
    {
        $this->contribution = $contribution;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Congratulations! Your contribution has been selected',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.contribution_selected',
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
