<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ForgotPasswordCodeMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public $code;

    public function __construct($code) { $this->code = $code; }

    public function envelope(): Envelope
    {
        return new Envelope(subject: 'Reset Your University Portal Password');
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.forgot_password',
            with: ['code' => $this->code],
        );
    }
}