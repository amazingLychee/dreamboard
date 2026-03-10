import { FormData } from "@/types";
import { DREAMS, TIMES } from "./constants";

export function buildSystemPrompt(): string {
  return `You are an expert AI image prompt engineer specializing in vision board design. Given structured user input about their dreams and goals, generate a single detailed English prompt for an AI image generator.

The prompt should describe a densely packed, overflowing vision board collage in warm watercolor illustration style, horizontal 16:9 landscape format, pinned on a cork board with overlapping Polaroids, torn magazine clippings, sticky notes, washi tape, dried flowers, and golden star stickers.

Style requirements:
- Warm hand-painted watercolor aesthetic throughout
- Soft golden lighting
- Muted rich palette: cream, amber, terracotta, sage green, dusty blue, dusty rose
- Visible watercolor paper texture
- Nostalgic, hopeful, abundant, deeply personal
- Everything packed tightly, almost no empty space
- Elements slightly crooked, edges curling — messy but beautiful

Make it personal, warm, abundant, and full of life. Include ALL the user's specific dreams as visual elements with specific details they provided. Add small decorative details like handwritten notes with motivational phrases, star stickers, pressed flowers, and washi tape between images.

Return ONLY the image generation prompt, nothing else.`;
}

export function buildUserMessage(data: FormData): string {
  const timePeriod = TIMES.find(t => t.id === data.time)?.label || data.time;
  let msg = `Create a vision board for: ${data.name || "someone"}\n`;
  msg += `Time frame: ${timePeriod}\n`;
  if (data.motto) msg += `Personal motto: "${data.motto}"\n`;
  msg += `Add handwritten labels: ${data.addLabels ? "yes" : "no"}\n\n`;
  msg += `Dreams and details:\n`;

  for (const dreamId of data.dreams) {
    const dream = DREAMS.find(d => d.id === dreamId);
    const detail = data.details[dreamId];
    msg += `\n- ${dream?.label}:`;
    if (!detail) { msg += " (no specific details provided)"; continue; }
    if (dreamId === "car" && detail.brand) msg += ` ${detail.color || ""} ${detail.brand}`;
    else if (dreamId === "pet" && detail.pets?.length) msg += ` ${detail.pets.join(", ")}`;
    else if (dreamId === "travel" && detail.destinations?.length) msg += ` ${detail.destinations.join(", ")}`;
    else if (dreamId === "health" && detail.activities?.length) msg += ` ${detail.activities.join(", ")}`;
    else if (dreamId === "hobby" && detail.hobbies?.length) msg += ` ${detail.hobbies.join(", ")}`;
    else if (detail.text) msg += ` ${detail.text}`;
  }
  return msg;
}
