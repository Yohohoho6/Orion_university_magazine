<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\ContactUs;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ContactController extends Controller
{
    /**
     * Store a new contact message (user submission)
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'full_name' => 'required|string|max:191',
            'email' => 'required|email|max:191',
            'subject' => 'required|string|max:191',
            'message' => 'required|string',
        ]);

        $contact = ContactUs::create([
            'full_name' => $validated['full_name'],
            'email' => $validated['email'],
            'subject' => $validated['subject'],
            'message' => $validated['message'],
            'is_read' => 0, // default unread
        ]);

        return response()->json([
            'message' => 'Message sent successfully',
            'data' => $contact
        ], 201);
    }

    /**
     * List all contact messages (admin only)
     */
    public function index(Request $request): JsonResponse
    {
        $user = Auth::user();

        if ($user->role->name !== 'admin') {
            return response()->json([
                'message' => 'Unauthorized. Admin access only.'
            ], 403);
        }

        $query = ContactUs::query();

        $search = $request->query('search');
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('full_name', 'LIKE', "%{$search}%")
                  ->orWhere('email', 'LIKE', "%{$search}%")
                  ->orWhere('subject', 'LIKE', "%{$search}%");
            });
        }

        $status = $request->query('status');
        if ($status === 'unread') {
            $query->where('is_read', false);
        } elseif ($status === 'read') {
            $query->where('is_read', true);
        }

        $contacts = $query->latest()->get();
        $total = ContactUs::count();
        $unread = ContactUs::where('is_read', false)->count();
        $read = ContactUs::where('is_read', true)->count();

        return response()->json([
            'data' => $contacts,
            'counts' => [
                'total' => $total,
                'unread' => $unread,
                'read' => $read,
            ]
        ], 200);
    }

    /**
     * Mark a contact message as read
     */
    public function markAsRead($id): JsonResponse
    {
        $contact = ContactUs::find($id);

        if (!$contact) {
            return response()->json(['message' => 'Contact not found'], 404);
        }

        $contact->update([
            'is_read' => 1,
            'read_at' => now(),
        ]);

        return response()->json([
            'message' => 'Marked as read',
            'data' => $contact
        ], 200);
    }
}