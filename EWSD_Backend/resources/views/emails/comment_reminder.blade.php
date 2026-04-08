<h2>Action Required: 14-Day Review Deadline</h2>

<p>The contribution <strong>"{{ $contribution->title }}"</strong> in the <strong>{{ $contribution->user->faculty->name }}</strong> faculty requires your immediate attention.</p>

<hr>
<p><strong>Student:</strong> {{ $contribution->user->name }} ({{ $contribution->user->email }})</p>
<p><strong>Submitted On:</strong> {{ $contribution->created_at->format('M d, Y') }}</p>

<div style="background: #f8d7da; color: #721c24; padding: 15px; border: 1px solid #f5c6cb; border-radius: 5px;">
    <strong>Policy Violation:</strong> University regulations require a Marketing Coordinator to provide feedback within <strong>14 days</strong> of submission. This contribution has exceeded or is approaching that limit without a recorded comment.
</div>

<p style="margin-top: 20px;">
    <a href="{{ env('FRONTEND_URL') }}/marketing-coordinator/contributions" 
       style="background: #dc3545; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
       Review & Provide Feedback Now
    </a>
</p>

<p><em>Note: Automated exception reports are monitored by the Marketing Manager to ensure timely feedback for all students.</em></p>