<h2>Action Required: Submission Updated</h2>

<p>The student <strong>{{ $contribution->user->name }}</strong> has uploaded a new version of their contribution for the <strong>{{ $contribution->user->faculty->name }}</strong> faculty.</p>

<hr>
<p><strong>Submission Title:</strong> {{ $contribution->title }}</p>
<p><strong>Last Updated:</strong> {{ $contribution->updated_at->format('M d, Y \a\t H:i') }}</p>

<div style="background: #e7f3ff; color: #0c5460; padding: 15px; border: 1px solid #bee5eb; border-radius: 5px; margin: 20px 0;">
    <strong>System Note:</strong> The status has been reset to <strong>Pending</strong>. As per university policy, the 14-day review window has restarted for this submission. Please review the latest files and descriptions.
</div>

<p style="margin-top: 20px;">
    <a href="{{ env('FRONTEND_URL') }}/marketing-coordinator/contributions" 
       style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
       Review Latest Changes
    </a>
</p>

<p><em>Note: Ensure your feedback is provided before the final closure date of the {{ $contribution->academicYear->name }} period.</em></p>