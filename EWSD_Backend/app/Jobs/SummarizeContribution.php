<?php

namespace App\Jobs;

use App\Models\Contribution;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Smalot\PdfParser\Parser as PdfParser;
use PhpOffice\PhpWord\IOFactory as WordFactory;

class SummarizeContribution implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     */
    public function __construct(public Contribution $contribution) {}

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        // 1. Get the physical path of the file
        $path = Storage::disk('public')->path($this->contribution->file_path);
        
        if (!file_exists($path)) return;

        $extension = pathinfo($path, PATHINFO_EXTENSION);
        $text = "";

        // 2. Extract Text based on file type
        try {
            if ($extension === 'pdf') {
                if (!is_readable($path)) {
                    Log::error("Text extraction failed: File not readable", [
                        'path' => $path,
                        'contribution_id' => $this->contribution->id,
                        'file_size' => file_exists($path) ? filesize($path) : 0,
                    ]);
                    $this->contribution->update([
                        'summary' => 'Unable to generate summary: The file could not be read. Please try uploading again.'
                    ]);
                    return;
                }
                $text = (new PdfParser())->parseFile($path)->getText();
            } elseif ($extension === 'docx') {
                if (!is_readable($path)) {
                    Log::error("Text extraction failed: File not readable", [
                        'path' => $path,
                        'contribution_id' => $this->contribution->id,
                        'file_size' => file_exists($path) ? filesize($path) : 0,
                    ]);
                    $this->contribution->update([
                        'summary' => 'Unable to generate summary: The file could not be read. Please try uploading again.'
                    ]);
                    return;
                }
                
                try {
                    $reader = WordFactory::createReader('Word2007');
                    $phpWord = $reader->load($path);
                    
                    foreach ($phpWord->getSections() as $section) {
                        foreach ($section->getElements() as $element) {
                            try {
                                if ($element instanceof \PhpOffice\PhpWord\Element\Text) {
                                    $text .= $element->getText() . " ";
                                } elseif ($element instanceof \PhpOffice\PhpWord\Element\TextRun) {
                                    foreach ($element->getElements() as $textElement) {
                                        if ($textElement instanceof \PhpOffice\PhpWord\Element\Text) {
                                            $text .= $textElement->getText() . " ";
                                        }
                                    }
                                }
                            } catch (\Exception $e) {
                                continue;
                            }
                        }
                    }
                } catch (\Exception $e) {
                    Log::error("Failed to load .docx file", [
                        'error' => $e->getMessage(),
                        'contribution_id' => $this->contribution->id,
                        'file' => $path,
                    ]);
                    $this->contribution->update([
                        'summary' => 'Unable to generate summary: This document contains unsupported image formats (EMF/WMF). Please convert the document to PDF or remove embedded images and re-upload.'
                    ]);
                    return;
                }
            } elseif ($extension === 'doc') {
                if (!is_readable($path)) {
                    Log::error("Text extraction failed: File not readable", [
                        'path' => $path,
                        'contribution_id' => $this->contribution->id,
                        'file_size' => file_exists($path) ? filesize($path) : 0,
                    ]);
                    $this->contribution->update([
                        'summary' => 'Unable to generate summary: The file could not be read. Please try uploading again.'
                    ]);
                    return;
                }
                
                try {
                    $reader = WordFactory::createReader('ODText');
                    $phpWord = $reader->load($path);
                    
                    foreach ($phpWord->getSections() as $section) {
                        foreach ($section->getElements() as $element) {
                            if ($element instanceof \PhpOffice\PhpWord\Element\Text) {
                                $text .= $element->getText() . " ";
                            } elseif ($element instanceof \PhpOffice\PhpWord\Element\TextRun) {
                                foreach ($element->getElements() as $textElement) {
                                    if ($textElement instanceof \PhpOffice\PhpWord\Element\Text) {
                                        $text .= $textElement->getText() . " ";
                                    }
                                }
                            }
                        }
                    }
                } catch (\Exception $e) {
                    Log::warning("Text extraction: .doc format has limited support, recommend .docx", [
                        'contribution_id' => $this->contribution->id,
                        'error' => $e->getMessage(),
                        'file_size' => filesize($path),
                    ]);
                    $this->contribution->update([
                        'summary' => 'Unable to generate summary: This file format (.doc) is not supported. Please upload .docx or .pdf files for AI summarization.'
                    ]);
                    return;
                }
            }
        } catch (\Exception $e) {
            Log::error("Text extraction failed", [
                'error' => $e->getMessage(),
                'error_code' => $e->getCode(),
                'file' => $path,
                'extension' => $extension,
                'contribution_id' => $this->contribution->id,
                'file_size' => file_exists($path) ? filesize($path) : 0,
                'mime_type' => file_exists($path) ? mime_content_type($path) : 'unknown',
            ]);
            $this->contribution->update([
                'summary' => 'Unable to generate summary: The file could not be processed. Please ensure the file is not corrupted and try uploading again.'
            ]);
            return;
        }

        if (empty(trim($text))) {
            $this->contribution->update([
                'summary' => 'Unable to generate summary: No readable text content found in this file.'
            ]);
            return;
        }

        // 3. Send to Groq AI (Free Tier)
        $response = Http::withToken(env('GROQ_API_KEY'))
            ->timeout(30)
            ->post('https://api.groq.com/openai/v1/chat/completions', [
                'model' => 'llama-3.3-70b-versatile',
                'messages' => [
                    [
                        'role' => 'system', 
                        'content' => 'You are an academic assistant. Summarize the following university article in 3 clear, professional bullet points.'
                    ],
                    ['role' => 'user', 'content' => mb_strcut($text, 0, 30000)] // Limit text size for safety
                ],
            ]);

        // 4. Update the Database
        if ($response->successful()) {
            $summary = $response->json('choices.0.message.content');
            $this->contribution->update(['summary' => $summary]);
        }
    }
}