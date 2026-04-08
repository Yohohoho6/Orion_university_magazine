<?php

namespace App\Http\Controllers;

use App\Models\Contribution;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;

class ChatbotController extends Controller
{
    private $ollamaUrl = 'http://localhost:11434';
    private $model = 'tinyllama';
    
    public function __construct()
    {
        // Check if Ollama is running
        $this->checkOllamaStatus();
    }
    
    private function checkOllamaStatus()
    {
        try {
            $response = Http::timeout(2)->get($this->ollamaUrl . '/api/tags');
            if (!$response->successful()) {
                Log::warning('Ollama is not running. Please start Ollama app.');
            }
        } catch (\Exception $e) {
            Log::error('Ollama connection failed: ' . $e->getMessage());
        }
    }
    
    public function chat(Request $request)
    {
        try {
            $request->validate([
                'message' => 'required|string',
            ]);

            $message = $request->message;
            $userId = Auth::id();
            
            // Check for user-specific queries (database queries)
            if ($this->isUserSpecificQuery($message)) {
                return $this->handleUserSpecificQuery($message, $userId);
            }
            
            // Use Ollama AI for intelligent responses
            return $this->getOllamaResponse($message, $userId);
            
        } catch (\Exception $e) {
            Log::error('Chatbot Error: ' . $e->getMessage());
            return response()->json([
                'reply' => "I'm here to help! You can ask me about submitting contributions, checking status, or any questions about our magazine system. (Note: AI service is initializing, please try again in a moment.)"
            ]);
        }
    }
    
    private function getOllamaResponse($message, $userId)
    {
        try {
            // Get user context for personalized responses
            $userContext = $this->getUserContext($userId);
            
            // System prompt that defines the AI's role
            $systemPrompt = "You are a friendly, helpful assistant for the Student Contribution Magazine System at OrioinUniversity. " .
                           "Your role is to help students with submitting articles, creative works, and managing their contributions.\n\n" .
                           "Key Information:\n" .
                           "- Mission: To empower student voices and foster academic excellence by providing a modern, accessible platform for scholarly and creative works.\n" .
                           "- Vision: To become the leading academic publishing platform for student engagement in institutional publications.\n" .
                           "- Core Values: Integrity, Excellence, Inclusivity, and Innovation.\n" .
                           "- Developers / System Creators: The system was developed by Thu Ta (Team Lead and Backend), Kaung Htut Paing (Database, Backend, and AI), Htoo Arkar Lin (Backend), Eain Hmue Pyae (Scrum Master), Aung Tayzar Phyo (Frontend), Htet Myat Lin (Frontend), Thaung Naing Soe (UI/UX and Frontend), Khune Htet Wai Yan Oo (Tester and Data Analysis), Zin New New Thein (Tester and Documentation).\n" .
                           "- Platform Objectives: Encourage Academic Excellence, Support Digital Publishing, Enable Collaboration, Promote Innovation.\n" .
                           "- Contribution Process: Step 1: Submit Your Work. Step 2: Review Process. Step 3: Revision & Publication.\n" .
                           "- Students can submit contributions (articles, artwork, research)\n" .
                           "- File formats: PDF, DOC, DOCX (max 10MB)\n" .
                           "- Cover photos: JPG, PNG (max 5MB)\n" .
                           "- Admin email admin@orioinuniversity.edu\n" .
                           "- The student data are safe on using ai because the system is using local model thus why you data cannot arrive to third party clould Ai server.\n".
                           "- Categories: Academic Papers, Creative Writing, Research, Art & Design, Photography, Student Life, Technical Projects\n" .
                           "- Faculties: Science, Engineering, Arts, Business, Medicine, Law\n" .
                           "- Status meanings: Pending (under review), Approved (accepted), Rejected (needs revision), Selected (special recognition)\n" .
                           "- Students get notifications for status updates\n\n" .
                           "Provide helpful, encouraging responses. Keep answers concise but informative. Use emojis occasionally to be friendly.\n\n" .
                           $userContext;
            
            // Send request to Ollama
            $response = Http::timeout(60)->post($this->ollamaUrl . '/api/generate', [
                'model' => $this->model,
                'prompt' => $systemPrompt . "\n\nStudent's question: " . $message . "\n\nYour helpful response:",
                'stream' => false,
                'options' => [
                    'temperature' => 0.7,
                    'top_p' => 0.9,
                    'max_tokens' => 500,
                ]
            ]);
            
            if ($response->successful()) {
                $data = $response->json();
                $aiReply = trim($data['response']);
                
                // Clean up any system prompt leftovers
                $aiReply = preg_replace('/^.*?Student\'s question:.*?\n\n/', '', $aiReply);
                
                return response()->json(['reply' => $aiReply]);
            }
            
            Log::error('Ollama API error: ' . $response->body());
            
        } catch (\Exception $e) {
            Log::error('Ollama Error: ' . $e->getMessage());
            
            // Check if Ollama is running
            if (str_contains($e->getMessage(), 'Connection refused')) {
                return response()->json([
                    'reply' => "🤖 The AI service is starting up. Please make sure Ollama is running:\n\n1. Open Terminal\n2. Run: ollama serve\n3. Or open Ollama app from Applications\n\nOnce running, try again! In the meantime, I can help with basic questions about submissions."
                ]);
            }
        }
        
        // Fallback to knowledge base if AI fails
        return $this->getFallbackResponse($message, $userId);
    }
    
    private function getUserContext($userId)
    {
        if (!$userId) {
            return "User is not logged in. Provide general information about how to use the contribution system.\n";
        }
        
        try {
            $contributions = Contribution::where('user_id', $userId)->get();
            $totalCount = $contributions->count();
            $pendingCount = $contributions->where('status', 'pending')->count();
            $approvedCount = $contributions->where('status', 'approved')->count();
            $selectedCount = $contributions->where('is_selected', true)->count();
            
            $context = "User Context:\n";
            $context .= "- User is logged in\n";
            $context .= "- Has submitted {$totalCount} total contributions\n";
            $context .= "- Has {$pendingCount} pending submissions\n";
            $context .= "- Has {$approvedCount} approved submissions\n";
            $context .= "- Has {$selectedCount} selected for recognition\n";
            
            if ($pendingCount > 0) {
                $context .= "- User has pending submissions waiting for review\n";
            }
            
            return $context;
            
        } catch (\Exception $e) {
            return "User is logged in but we couldn't fetch their data.\n";
        }
    }
    
    private function isUserSpecificQuery($message)
    {
        $lowerMessage = strtolower($message);
        $keywords = [
            'my contribution', 'my submissions', 'my status', 
            'how many', 'my articles', 'my work', 'my posts',
            'my uploads', 'check my', 'view my'
        ];
        
        foreach ($keywords as $keyword) {
            if (str_contains($lowerMessage, $keyword)) {
                return true;
            }
        }
        return false;
    }
    
    private function handleUserSpecificQuery($message, $userId)
    {
        if (!$userId) {
            return response()->json([
                'reply' => "🔐 Please log in to view your contributions and status. You can sign in using your account credentials in the top right corner."
            ]);
        }
        
        if (str_contains($message, 'my contribution') || 
            str_contains($message, 'my submissions') ||
            str_contains($message, 'my articles') ||
            str_contains($message, 'my work')) {
            return $this->getUserContributions($userId);
        }
        
        if (str_contains($message, 'status')) {
            return $this->getContributionStatus($userId, $message);
        }
        
        if (str_contains($message, 'how many')) {
            return $this->getUserContributions($userId);
        }
        
        return $this->getFallbackResponse($message, $userId);
    }
    
    private function getUserContributions($userId)
    {
        $contributions = Contribution::where('user_id', $userId)
            ->with(['category', 'faculty'])
            ->orderBy('created_at', 'desc')
            ->get();
        
        if ($contributions->isEmpty()) {
            return response()->json([
                'reply' => "📝 You haven't submitted any contributions yet! \n\n**Ready to share your work?**\n\n1. Click 'New Contribution' button\n2. Upload your file (PDF, DOC, DOCX)\n3. Add a cover photo\n4. Choose a category and faculty\n5. Submit for review!\n\nNeed help with what to submit? Just ask me! 🚀"
            ]);
        }
        
        $pendingCount = $contributions->where('status', 'pending')->count();
        $approvedCount = $contributions->where('status', 'approved')->count();
        $rejectedCount = $contributions->where('status', 'rejected')->count();
        $selectedCount = $contributions->where('is_selected', true)->count();
        
        $reply = "📊 **Your Contribution Summary**\n\n";
        $reply .= "• **Total:** {$contributions->count()} contributions\n";
        $reply .= "• **Pending Review:** {$pendingCount}\n";
        $reply .= "• **Approved:** {$approvedCount}\n";
        $reply .= "• **Rejected:** {$rejectedCount}\n";
        $reply .= "• **Selected for Recognition:** {$selectedCount}\n\n";
        
        if ($pendingCount > 0) {
            $reply .= "⏳ You have {$pendingCount} submission(s) waiting for review. You'll receive a notification once they're reviewed!\n\n";
        }
        
        if ($selectedCount > 0) {
            $reply .= "🏆 Congratulations! You have {$selectedCount} selected contribution(s) - these are featured works!\n\n";
        }
        
        $reply .= "**Your Recent Submissions:**\n";
        foreach ($contributions->take(3) as $contribution) {
            $statusIcon = match($contribution->status) {
                'pending' => '⏳',
                'approved' => '✅',
                'rejected' => '❌',
                default => '📝'
            };
            
            $reply .= "{$statusIcon} **{$contribution->title}**\n";
            $reply .= "   Status: " . ucfirst($contribution->status);
            if ($contribution->is_selected) $reply .= " ⭐ SELECTED";
            if ($contribution->category) $reply .= " | Category: {$contribution->category->name}";
            $reply .= "\n\n";
        }
        
        if ($contributions->count() > 3) {
            $reply .= "View all your contributions in the dashboard!";
        }
        
        return response()->json(['reply' => $reply]);
    }
    
    private function getContributionStatus($userId, $message)
    {
        $contributions = Contribution::where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();
        
        if ($contributions->isEmpty()) {
            return response()->json([
                'reply' => "You haven't submitted any contributions yet. Would you like help getting started with your first submission? I can guide you through the process! 📝"
            ]);
        }
        
        $reply = "📋 **Your Current Submission Status:**\n\n";
        
        foreach ($contributions as $contribution) {
            $statusIcon = match($contribution->status) {
                'pending' => '⏳',
                'under_review' => '🔍',
                'approved' => '✅',
                'rejected' => '❌',
                default => '📝'
            };
            
            $reply .= "{$statusIcon} **{$contribution->title}**\n";
            $reply .= "   Status: " . ucfirst($contribution->status);
            
            if ($contribution->is_selected) {
                $reply .= " 🏆 SELECTED FOR RECOGNITION!";
            }
            
            if ($contribution->status === 'rejected') {
                $reply .= "\n   💡 Check your email for feedback on how to improve";
            }
            
            $reply .= "\n\n";
        }
        
        $reply .= "Need more details about any specific submission? Just ask me by title!";
        
        return response()->json(['reply' => $reply]);
    }
    
    private function getFallbackResponse($message, $userId)
    {
        // Comprehensive knowledge base as fallback
        $knowledgeBase = [
            'about' => "🌟 **About OrioinUniversity's Platform:**\n\n**Mission:** To empower student voices and foster academic excellence.\n**Vision:** To be the leading academic publishing platform for student engagement.\n**Core Values:** Integrity, Excellence, Inclusivity, and Innovation.",
            
            'develop' => "👨‍💻 **Development Team:**\n\nThis system was proudly developed by:\n• **Thu Ta** - Team Lead & Backend\n• **Kaung Htut Paing** - Database, Backend & AI\n• **Htoo Arkar Lin** - Backend\n• **Eain Hmue Pyae** - Scrum Master\n• **Aung Tayzar Phyo** - Frontend\n• **Htet Myat Lin** - Frontend\n• **Thaung Naing Soe** - UI/UX & Frontend\n• **Khune Htet Wai Yan Oo** - Tester & Data Analysis\n• **Zin New New Thein** - Tester & Documentation",
            
            'creator' => "👨‍💻 **Development Team:**\n\nThis system was proudly developed by:\n• **Thu Ta** - Team Lead & Backend\n• **Kaung Htut Paing** - Database, Backend & AI\n• **Htoo Arkar Lin** - Backend\n• **Eain Hmue Pyae** - Scrum Master\n• **Aung Tayzar Phyo** - Frontend\n• **Htet Myat Lin** - Frontend\n• **Thaung Naing Soe** - UI/UX & Frontend\n• **Khune Htet Wai Yan Oo** - Tester & Data Analysis\n• **Zin New New Thein** - Tester & Documentation",
            
            'team' => "👨‍💻 **Development Team:**\n\nThis system was proudly developed by:\n• **Thu Ta** - Team Lead & Backend\n• **Kaung Htut Paing** - Database, Backend & AI\n• **Htoo Arkar Lin** - Backend\n• **Eain Hmue Pyae** - Scrum Master\n• **Aung Tayzar Phyo** - Frontend\n• **Htet Myat Lin** - Frontend\n• **Thaung Naing Soe** - UI/UX & Frontend\n• **Khune Htet Wai Yan Oo** - Tester & Data Analysis\n• **Zin New New Thein** - Tester & Documentation",
            
            'mission' => "🎯 **Our Mission:**\n\nTo empower student voices and foster academic excellence by providing a modern, accessible platform for submitting, reviewing, and publishing scholarly and creative works.",
            
            'vision' => "👁️ **Our Vision:**\n\nTo become the leading academic publishing platform that sets the standard for student engagement in institutional publications.",
            
            'process' => "🔄 **The Contribution Process:**\n\n**Step 1: Submit Your Work**\nUpload articles or creative content.\n\n**Step 2: Review Process**\nFaculty advisors and editorial staff review submissions.\n\n**Step 3: Revision & Publication**\nReceive feedback and get published in the official university magazine!",
            
            'value' => "💎 **Our Core Values:**\n\n• **Integrity:** Upholding academic honesty\n• **Excellence:** Commitment to quality\n• **Inclusivity:** Welcoming diverse voices\n• **Innovation:** Embracing new ideas",
            
            'objective' => "🎯 **Platform Objectives:**\n\n• **Encourage Academic Excellence**\n• **Support Digital Publishing**\n• **Enable Collaboration**\n• **Promote Innovation**",
            
            'submit' => "📝 **How to Submit a Contribution:**\n\n1. Click the 'New Contribution' button in your dashboard\n2. Enter a title and description of your work\n3. Upload your file (PDF, DOC, or DOCX)\n4. Add a cover photo (JPG or PNG)\n5. Select a category that matches your work\n6. Choose your faculty/department\n7. Select the current academic year\n8. Accept the terms and conditions\n9. Click 'Submit'\n\nYour work will be reviewed within 2-3 business days!",
            
            'file' => "📄 **Accepted File Formats:**\n\n**Documents:**\n• PDF (recommended) - up to 10MB\n• Microsoft Word (.doc, .docx) - up to 10MB\n\n**Cover Photos:**\n• JPG or JPEG\n• PNG\n• Minimum 800x600 pixels\n• Max 5MB\n\nMake sure your files are clearly named and free of viruses!",
            
            'category' => "📚 **Available Categories:**\n\n• Academic Papers - Research and scholarly work\n• Creative Writing - Stories, poetry, essays\n• Research Articles - Original research findings\n• Art & Design - Visual arts, illustrations\n• Photography - Photo essays, collections\n• Student Life - Campus experiences, opinions\n• Technical Projects - Coding, engineering projects\n\nChoose the category that best fits your work!",
            
            'faculty' => "🏛️ **Faculties:**\n\n• Faculty of Science\n• Faculty of Engineering\n• Faculty of Arts & Humanities\n• Faculty of Business & Economics\n• Faculty of Medicine\n• Faculty of Law\n\nSelect your faculty during submission.",
            
            'status' => "📊 **Status Meanings:**\n\n• **Pending** - Your submission is waiting for review\n• **Under Review** - Coordinator is evaluating your work\n• **Approved** - Accepted for publication! 🎉\n• **Rejected** - Needs revision (check email for feedback)\n• **Selected** - Special recognition for outstanding work ⭐\n\nYou'll get notifications when your status changes!",
            
            'deadline' => "⏰ **Submission Deadlines:**\n\nDeadlines vary by academic year and category. Check the current deadlines in your dashboard under 'Submission Periods'. Make sure to submit before the deadline to be considered for the current publication cycle!",
            
            'selected' => "⭐ **Selection Process:**\n\nContributions marked as 'Selected' are:\n• Top-rated submissions\n• Featured in special magazine editions\n• Eligible for awards and certificates\n• Highlighted on homepage\n• Shared on social media\n\nKeep creating amazing content to get selected!",
            
            'edit' => "✏️ **Editing Your Contribution:**\n\n• You can edit while status is 'Pending'\n• After review starts, editing is locked\n• To make changes later: contact your faculty coordinator\n\nAlways review your work before submitting!",
            
            'notification' => "🔔 **Getting Updates:**\n\n• In-app notifications (bell icon)\n• Email notifications\n• Comments on your contributions\n• Status change alerts\n\nCheck your notifications regularly to stay updated!",
            
            'guidelines' => "📋 **Guidelines:**\n\n✅ Original work only (no plagiarism)\n✅ 500-2000 words recommended\n✅ Include relevant images with credits\n✅ Cite sources for facts\n✅ Professional tone\n✅ No hate speech or inappropriate content\n\nFollowing guidelines increases chances of approval!"
        ];
        
        $lowerMessage = strtolower($message);
        
        foreach ($knowledgeBase as $key => $answer) {
            if (str_contains($lowerMessage, $key)) {
                return response()->json(['reply' => $answer]);
            }
        }
        
        return response()->json([
            'reply' => "🤖 I'm your AI assistant for the Student Contribution System! I can help you with:\n\n🌟 **About Us** - Our mission & vision\n👨‍💻 **Team** - The developers behind the system\n📜 **Terms & Privacy** - Our policies\n📝 **Submitting** - How to share your work\n📄 **Files** - Accepted formats & sizes\n📊 **Status** - Check submission progress\n🏆 **Selection** - How to get recognized\n📅 **Deadlines** - Important dates\n✏️ **Editing** - Update your work\n🔔 **Notifications** - Get updates\n\nWhat would you like to know? Just type your question! 🚀"
        ]);
    }
}