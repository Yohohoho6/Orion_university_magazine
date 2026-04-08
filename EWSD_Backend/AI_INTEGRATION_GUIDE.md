# AI Chatbot Integration & Training Guide

This document explains how the AI Chatbot is integrated into the Student Contribution Magazine System and how you can further "train" (provide context and knowledge to) the AI.

## 1. Overview and Architecture

The chatbot relies on a combination of **Laravel (PHP)** for backend logic, **Ollama** for running a local open-source Large Language Model (TinyLlama by default), and a **Fallback Knowledge Base** for high reliability.

### How it works:
1. **User Request:** The user types a message in the frontend UI, which makes an API call to the `/api/chat` endpoint handled by `ChatbotController.php`.
2. **Context Gathering:** The controller checks if the user is logged in. If they are, it fetches their recent contributions, statuses, and counts to build a *User Context*.
3. **Prompt Construction:** The controller builds a large text block called the *System Prompt*. This contains the company's mission, vision, platform objectives, process rules, and the User Context.
4. **AI Generation:** The backend sends the constructed prompt and the user's question to the local lightweight AI service (**Ollama**) running on `http://localhost:11434`.
5. **Response Delivery:** The AI generates a tailored response. The controller cleans up the output and sends it back to the frontend.
6. **Fallback Mechanism:** If the Ollama server is down, starting up, or fails to respond, the backend automatically detects keywords in the user's message and responds instantly using a hardcoded PHP Knowledge Base array.

---

## 2. How to "Train" the AI

In modern AI integrations like this one, we don't necessarily update the neural network weights (traditional training). Instead, we use **In-Context Learning**. We "train" the AI by giving it a highly detailed set of instructions, facts, and rules right before asking it to answer the user.

You can improve and update the AI's knowledge by modifying `app/Http/Controllers/ChatbotController.php` in the following two places:

### A. Updating the System Prompt (The AI's Brain)
Locate the `$systemPrompt` variable inside the `getOllamaResponse()` method. This block of text acts as the "rulebook" for the AI.

```php
$systemPrompt = "You are a friendly, helpful assistant... \n\n" .
                "Key Information:\n" .
                "- Mission: To empower student voices...\n" .
                "- Support hours: 9 AM to 5 PM...\n" . // <-- You can add new rules here!
                "- Rule: Always be encouraging and polite...\n";
```

**To add new data (Training):**
Simply add a new line to this string with the information you want the AI to memorize. For example, if you introduce a new rule about video submissions, you would add: `"- We now accept MP4 video submissions up to 50MB.\n"`. The AI will instantly factor this into its future answers.

### B. Updating the Fallback Knowledge Base (The Safety Net)
Locate the `$knowledgeBase` array inside the `getFallbackResponse()` method. This maps specific keywords to human-written answers. It acts as a safety net when the AI is offline or struggles to generate text.

```php
$knowledgeBase = [
    'mission' => "🎯 **Our Mission:** To empower student voices...",
    'video'   => "🎥 **Video Submissions:** We accept MP4 files up to 50MB!", // <-- Added new fallback
];
```

**To add new data (Training the fallback):**
1. Choose a keyword that users are likely to type (e.g., `'video'`). Use lowercase.
2. Write a helpful, formatted response using markdown and emojis.
3. Add it to the array. 
4. The system sweeps the user's message for that keyword and returns the exact string if found.

---

## 3. Best Practices for Modifying the AI
- **Keep the System Prompt Concise:** Giving the AI too much text can confuse it and slow down response times. Stick to bullet points and facts.
- **Instruct the AI's Personality:** You can tell the AI *how* to speak. (e.g., `"Respond in a very serious tone"` or `"Use a lot of emojis"`).
- **Test Afterwards:** After modifying the prompt, ask the chatbot a question related to your new data to see how well it absorbed the information.
- **Keep Fallbacks Synced:** Whenever you teach the AI a new concept in the `$systemPrompt`, make sure to add a corresponding keyword and answer in the `$knowledgeBase` array so the system remains consistent even when offline.
