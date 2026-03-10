import { NextRequest, NextResponse } from "next/server";
import { buildSystemPrompt, buildUserMessage } from "@/lib/prompt-builder";
import { FormData } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const formData: FormData = await req.json();

    // Step 1: Claude generates image prompt
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
    const imagePrompt = claudeData.content?.[0]?.text;
    if (!imagePrompt) return NextResponse.json({ error: "Failed to generate prompt" }, { status: 500 });

    // Step 2: Gemini generates image
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-native-image-generation:generateContent?key=${process.env.GOOGLE_AI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: imagePrompt }] }],
          generationConfig: {
            responseModalities: ["TEXT", "IMAGE"],
            imageConfig: { aspectRatio: "16:9", imageSize: "2K" },
          },
        }),
      }
    );
    const geminiData = await geminiRes.json();
    const imagePart = geminiData.candidates?.[0]?.content?.parts?.find(
      (p: any) => p.inlineData?.mimeType?.startsWith("image/")
    );
    if (!imagePart) return NextResponse.json({ error: "Failed to generate image" }, { status: 500 });

    const base64Image = imagePart.inlineData.data;
    const mimeType = imagePart.inlineData.mimeType;
    const shareSlug = Math.random().toString(36).substring(2, 10);

    return NextResponse.json({
      imageUrl: `data:${mimeType};base64,${base64Image}`,
      shareSlug,
      prompt: imagePrompt,
    });
  } catch (error) {
    console.error("Generation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
