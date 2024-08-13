import { NextResponse } from "next/server";
import OpenAI from "openai";

const systemPrompt = `
You are an AI flashcard generator designed to create concise and effective study flashcards. Follow these important instructions:
    ... (other instructions)
`;

export async function POST(request) {
  try {
    const openai = new OpenAI(process.env.NEXT_PUBLIC_OPENAI_API_KEY);
    const data = await request.text();

    const response = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: data },
      ],
    });

    const flashcards = JSON.parse(response.choices[0].message.content).flashcards;

    return NextResponse.json({ flashcards });
  } catch (error) {
    console.error("Error in API route:", error);
    return NextResponse.json({ flashcards: [] });  // Return an empty array or an error message
  }
}
