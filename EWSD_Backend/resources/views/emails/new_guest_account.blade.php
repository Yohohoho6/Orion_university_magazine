<h2>New Guest Account: Faculty Access Granted</h2>

<p>A new <strong>Guest</strong> account has been registered for the <strong>{{ $guest->faculty->name }}</strong> faculty.</p>

<hr>
<p><strong>Name:</strong> {{ $guest->name }}</p>
<p><strong>Email:</strong> {{ $guest->email }}</p>

<div style="background: #e2e3e5; padding: 15px; border: 1px solid #d6d8db; color: #383d41;">
    <strong>Access Level:</strong> This user has been granted <strong>Read-Only</strong> access to view all contributions within your faculty. 
</div>

<p>
    <a href="{{ env('FRONTEND_URL') }}/marketing-coordinator/guests" 
       style="background: #28a745; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 10px;">
       View Faculty User List
    </a>
</p>

<p><em>Note: If you do not recognize this guest or believe this account was created in error, please contact the System Administrator immediately.</em></p>