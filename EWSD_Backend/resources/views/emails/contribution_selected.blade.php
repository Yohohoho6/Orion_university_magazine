<h2>Congratulations, {{ $contribution->user->name }}!</h2>

<p>We are pleased to inform you that your contribution <strong>"{{ $contribution->title }}"</strong> has been officially selected for publication in the <strong>{{ $contribution->user->faculty->name }}</strong> section of the University Magazine!</p>

<hr>
<p><strong>Submission Title:</strong> {{ $contribution->title }}</p>
<p><strong>Academic Year:</strong> {{ $contribution->academicYear->name }}</p>

<div style="background: #d4edda; color: #155724; padding: 15px; border: 1px solid #c3e6cb; border-radius: 5px; margin: 20px 0;">
    <strong>Current Status:</strong> Selected for Publication ✅
</div>

<p>The Marketing Coordinator has completed the review of your work. Your submission has met all editorial standards and is now queued for the final magazine layout. No further edits or actions are required from your side.</p>

<p style="margin-top: 20px;">
    <a href="{{ env('FRONTEND_URL') }}/student/my-contributions" 
       style="background: #28a745; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
       View My Submission Status
    </a>
</p>

<p><em>Thank you for your valuable contribution to our university's academic history.</em></p>