<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Contribution;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CommentController extends Controller
{
    public function index($contributionId): JsonResponse
    {
        $contribution = Contribution::find($contributionId);

        if (!$contribution) {
            return response()->json(['status' => 'error', 'message' => 'Contribution not found'], 404);
        }

        $comments = $contribution->comments()
            ->with('user:id,name,profile_path')
            ->whereNull('parent_id')
            ->with('replies.user:id,name')
            ->oldest()
            ->get();

        return response()->json($comments, 200);
    }

    public function store(Request $request, $contributionId): JsonResponse
    {
        $contribution = Contribution::find($contributionId);

        if (!$contribution) {
            return response()->json([
                'status' => 'error',
                'message' => 'Contribution not found'
            ], 404);
        }

            // Allow ONLY student & marketing coordinator
        $allowedRoles = ['student', 'marketing_coordinator'];

        if (!in_array($request->user()->role->name, $allowedRoles)) {
            return response()->json([
                'message' => 'Only Students and Marketing Coordinators can comment'
            ], 403);
        }

        // 14 days rule (for both roles)
        if (now()->greaterThan($contribution->created_at->addDays(14))) {
            return response()->json([
                'message' => 'Comment period expired. You can no longer comment on this contribution.'
            ], 403);
        }

        $validated = $request->validate([
            'content' => 'required|string|min:1',
            'parent_id' => 'nullable|exists:comments,id',
        ]);

        // Make sure reply belongs to same contribution
        if (!empty($validated['parent_id'])) {
            $parentComment = Comment::find($validated['parent_id']);

            if ($parentComment->contribution_id !== $contribution->id) {
                return response()->json([
                    'message' => 'Invalid parent comment'
                ], 400);
            }
        }

        $comment = DB::transaction(function () use ($validated, $contribution, $request) {
            $newComment = Comment::create([
                'content' => $validated['content'],
                'parent_id' => $validated['parent_id'] ?? null,
                'contribution_id' => $contribution->id,
                'user_id' => $request->user()->id,
            ]);

           // Only when marketing coordinator comments → change status
            if (
                $request->user()->role->name === 'marketing_coordinator' &&
                $contribution->status === 'pending'
            ) {
                $contribution->update(['status' => 'commented']);
            }

            return $newComment;
        });

        return response()->json($comment->load('user:id,name'), 201);
    }

    public function update(Request $request, $commentId): JsonResponse
    {
        $comment = Comment::find($commentId);

        if (!$comment) {
            return response()->json(['status' => 'error', 'message' => 'Comment not found'], 404);
        }

        if ($comment->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'content' => 'required|string|min:1',
        ]);

        $comment->update($validated);

        return response()->json($comment, 200);
    }

    public function destroy(Request $request, $commentId): JsonResponse
    {
        $comment = Comment::find($commentId);

        if (!$comment) {
            return response()->json(['status' => 'error', 'message' => 'Comment not found'], 404);
        }

        if ($comment->user_id !== $request->user()->id && $request->user()->role->name !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        DB::transaction(function () use ($comment) {
            $contribution = $comment->contribution;
            $comment->delete();

            $remainingCommentsCount = Comment::where('contribution_id', $contribution->id)->count();

            if ($remainingCommentsCount === 0 && $contribution->status === 'commented') {
                $contribution->update(['status' => 'pending']);
            }
        });

        return response()->json(['message' => 'Comment removed'], 200);
    }
}
