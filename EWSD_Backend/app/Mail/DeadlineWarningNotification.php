<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class DeadlineWarningNotification extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    // 1. YOUR PUBLIC VARIABLES GO HERE
    public $type; // 'initial' or 'final'
    public $date;

    // 2. YOUR CONSTRUCTOR GOES HERE
    public function __construct($type, $date)
    {
        $this->type = $type;
        $this->date = $date;
    }

    // 3. THE ENVELOPE (Subject Line)
    public function envelope(): Envelope
    {
        $subject = $this->type === 'initial' 
            ? 'Reminder: Submission Deadline Approaching' 
            : 'Urgent: Final Update Deadline Approaching';

        return new Envelope(
            subject: $subject,
        );
    }

    // 4. YOUR CONTENT METHOD GOES HERE
    public function content(): Content
    {
        return new Content(
            view: 'emails.deadline_warning',
        );
    }

    /**
     * Get the attachments for the message.
     */
    public function attachments(): array
    {
        return [];
    }
}