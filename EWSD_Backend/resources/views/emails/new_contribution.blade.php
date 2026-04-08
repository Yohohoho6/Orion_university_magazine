<h2>New Magazine Submission: Action Required</h2>

<p>A new student article has been submitted for the <strong>{{ $contribution->user->faculty->name }}</strong> faculty for the <strong>{{ $contribution->academicYear->name }}</strong> period.</p>

<hr>
<p><strong>Student:</strong> {{ $contribution->user->name }} ({{ $contribution->user->email }})</p>
<p><strong>Title:</strong> {{ $contribution->title }}</p>
<p><strong>Category:</strong> {{ $contribution->category->name }}</p>

<div style="background: #fff3cd; color: #856404; padding: 15px; border: 1px solid #ffeeba; border-radius: 5px; margin: 20px 0;">
    <strong>Review Deadline:</strong> According to university policy, you are required to review this submission and provide a recorded comment within <strong>14 days</strong> of today (by {{ now()->addDays(14)->format('M d, Y') }}).
</div>

<p style="margin-top: 20px;">
    <a href="{{ env('FRONTEND_URL') }}/marketing-coordinator/contributions" 
       style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
       View & Comment on Contribution
    </a>
</p>

<p><em>Note: All contributions must be either "Selected" for publication or "Rejected" before the final closure date.</em></p>