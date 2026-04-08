<?php
namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class NewGuestAccountNotification extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public $guest;

    public function __construct(User $guest)
    {
        $this->guest = $guest;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'New Guest Account Notification',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.new_guest_account', 
        );
    }

}