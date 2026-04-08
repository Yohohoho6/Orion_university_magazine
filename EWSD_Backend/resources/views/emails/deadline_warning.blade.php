<h2 style="color: #333; font-family: sans-serif;">Upcoming University Magazine Deadline</h2>

<p style="font-family: sans-serif; color: #555;">
    This is an automated reminder regarding the upcoming deadline for the University Magazine.
</p>

<hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">

<p style="font-family: sans-serif; color: #555;">
    The <strong>{{ $type == 'initial' ? 'Initial Submission' : 'Final Update' }}</strong> period is coming to an end.
</p>

<div style="background: #fff3cd; color: #856404; padding: 20px; border: 1px solid #ffeeba; border-radius: 5px; margin: 20px 0; font-family: sans-serif;">
    <strong style="font-size: 18px;">Deadline Date: {{ \Carbon\Carbon::parse($date)->format('M d, Y') }}</strong>
    <br>
    <span style="font-size: 14px; opacity: 0.8;">Action required before 23:59 (Server Time)</span>
</div>

<p style="font-family: sans-serif; color: #555; line-height: 1.5;">
    Please ensure all your articles are <strong>{{ $type == 'initial' ? 'uploaded' : 'finalized' }}</strong> before this date. 
    After this time, the system will automatically disable {{ $type == 'initial' ? 'new submissions' : 'all further changes' }} for this period.
</p>

<p style="margin-top: 25px;">
    <a href="{{ env('FRONTEND_URL') }}/student/my-contributions" 
       style="background: #d39e00; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-family: sans-serif; font-weight: bold; display: inline-block;">
       Go to My Submissions
    </a>
</p>

<p style="font-family: sans-serif; color: #888; font-size: 12px; margin-top: 30px;">
    <em>Note: This is an automated notification. Please do not reply directly to this email.</em>
</p>