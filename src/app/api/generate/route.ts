
// src/app/api/generate/route.ts
import { NextRequest, NextResponse } from "next/server";
import { buildSystemPrompt, buildUserMessage } from "@/lib/prompt-builder";
import { FormData } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const formData: FormData = await req.json();

    // ── Step 1: Claude generates image prompt ──
    console.log("Step 1: Calling Claude API...");

    const claudeRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY!,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1024,
        system: buildSystemPrompt(),
        messages: [{ role: "user", content: buildUserMessage(formData) }],
      }),
    });

    const claudeData = await claudeRes.json();

    if (!claudeRes.ok) {
      console.error("Claude API error:", JSON.stringify(claudeData));
      return NextResponse.json(
        { error: "Claude API error: " + (claudeData.error?.message || "Unknown") },
        { status: 500 }
      );
    }

    const imagePrompt = claudeData.content?.[0]?.text;
    console.log("Step 1 done. Prompt:", imagePrompt?.substring(0, 100) + "...");

    if (!imagePrompt) {
      return NextResponse.json({ error: "Failed to generate prompt" }, { status: 500 });
    }

    // ── Step 2: Gemini generates image ──
    // 正确的模型名称: gemini-2.5-flash-image
    const geminiModel = "gemini-2.5-flash-image";
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${process.env.GOOGLE_AI_API_KEY}`;

    console.log("Step 2: Calling Gemini API...", geminiModel);

    const geminiRes = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: imagePrompt }],
          },
        ],
        generationConfig: {
          responseModalities: ["TEXT", "IMAGE"],
        },
      }),
    });

    const geminiData = await geminiRes.json();

    if (!geminiRes.ok) {
      console.error("Gemini API error:", JSON.stringify(geminiData));
      return NextResponse.json(
        { error: "Gemini API error: " + (geminiData.error?.message || JSON.stringify(geminiData.error)) },
        { status: 500 }
      );
    }

    console.log("Gemini response candidates:", geminiData.candidates?.length);

    // Extract image from response
    const parts = geminiData.candidates?.[0]?.content?.parts || [];
    const imagePart = parts.find(
      (p: any) => p.inlineData?.mimeType?.startsWith("image/")
    );

    if (!imagePart) {
      // Log what we DID get back for debugging
      console.error("No image in Gemini response. Parts received:", 
        parts.map((p: any) => ({ 
          hasText: !!p.text, 
          mimeType: p.inlineData?.mimeType,
          hasData: !!p.inlineData?.data 
        }))
      );
      return NextResponse.json({ error: "Failed to generate image - no image in response" }, { status: 500 });
    }

    const base64Image = imagePart.inlineData.data;
    const mimeType = imagePart.inlineData.mimeType;
    const shareSlug = Math.random().toString(36).substring(2, 10);

    console.log("Success! Image generated, mimeType:", mimeType, "size:", base64Image.length);

    return NextResponse.json({
      imageUrl: `data:${mimeType};base64,${base64Image}`,
      shareSlug,
      prompt: imagePrompt,
    });
  } catch (error) {
    console.error("Generation error:", error);
    return NextResponse.json(
      { error: "Internal server error: " + (error as Error).message },
      { status: 500 }
    );
  }
}