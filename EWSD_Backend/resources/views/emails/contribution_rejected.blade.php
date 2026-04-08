<h2 style="color: #d9534f;">Contribution Status Update</h2>

<p>Dear {{ $contribution->user->name }},</p>

<p>Thank you for submitting your work <strong>"{{ $contribution->title }}"</strong> to the University Magazine. Our editorial team has completed the review of your submission.</p>

<p>We regret to inform you that your contribution has not been selected for publication in the <strong>{{ $contribution->user->faculty->name }}</strong> section at this time.</p>

<hr style="border: 0; border-top: 1px solid #eee;">

<p><strong>Submission Title:</strong> {{ $contribution->title }}</p>
<p><strong>Academic Year:</strong> {{ $contribution->academicYear->name }}</p>

<div style="background: #f8d7da; color: #721c24; padding: 15px; border: 1px solid #f5c6cb; border-radius: 5px; margin: 20px 0;">
    <strong>Current Status:</strong> Not Selected
</div>

<div style="background: #fff3cd; color: #856404; padding: 15px; border: 1px solid #ffeeba; border-radius: 5px; margin: 20px 0;">
    <strong>Coordinator Feedback:</strong>
    <p style="margin: 5px 0 0 0;">{{ $contribution->comments()->latest()->first()->content ?? 'Please log in to view detailed feedback.' }}</p>
</div>

<p>If the final closure date has not yet passed, you may be able to revise your work based on the feedback provided and resubmit.</p>

<p style="margin-top: 20px;">
    <a href="{{ env('FRONTEND_URL') }}/student/my-contributions"
        style="background: #6c757d; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
        View Submission & Comments
    </a>
</p>

<p style="margin-top: 30px;"><em>We encourage you to continue writing and participate in future academic publications.</em></p>