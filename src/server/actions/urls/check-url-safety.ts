"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { ApiResponse, checkSchema } from "@/lib/types";
import { ensureHttps } from "@/lib/utils";
import { revalidatePath } from "next/cache";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!);

export type UrlSafetyCheck = {
  isSafe: boolean;
  flagged: boolean;
  reason: string | null;
  category: "safe" | "suspicious" | "malicious" | "inappropriate" | "unknown";
  confidence: number;
  response: string | null;
};

export async function checkUrlSafety(url: string): Promise<ApiResponse<UrlSafetyCheck>> {
  try {
    // validate URL
    try {
      new URL(url);
    } catch (error) {
      return {
        success: false,
        error: "Invalid URL format",
      };
    }

    if (!process.env.GOOGLE_GEMINI_API_KEY) {
      console.log("Missing Google Gemini API Key");
      return {
        success: true,
        data: {
          isSafe: true,
          flagged: false,
          reason: null,
          category: "unknown",
          confidence: 0,
          response: "Tidak tersambung ke Gemini",
        },
      };
    }

    // const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    //   const prompt = `
    //   Analyze this URL for safety concerns: "${url}"

    //   Consider the following aspects:
    //   1. Is it a known phishing site?
    //   2. Does it contain malware or suspicious redirects?
    //   3. Is it associated with scams or fraud?
    //   4. Does it contain inappropriate content (adult, violence, etc.)?
    //   5. Is the domain suspicious or newly registered?

    //   Respond in JSON format with the following structure:
    //   {
    //     "isSafe": boolean,
    //     "flagged": boolean,
    //     "reason": string or null,
    //     "category": "safe" | "suspicious" | "malicious" | "inappropriate" | "unknown",
    //     "confidence": number between 0 and 1
    //   }

    //   Only respond with the JSON object, no additional text.
    // `;
    const prompt = `
    Analisis URL ini untuk masalah keamanan: "${url}"

    Pertimbangkan aspek-aspek berikut:
    1. Apakah situs ini dikenal sebagai situs phishing?
    2. Apakah situs ini berisi malware atau pengalihan yang mencurigakan?
    3. Apakah situs ini terkait dengan penipuan?
    4. Apakah situs ini berisi konten yang tidak pantas (dewasa, kekerasan, dll.)?
    5. Apakah domain ini mencurigakan atau baru didaftarkan?

    Tanggapi dalam format JSON dengan struktur berikut:
    {
      "isSafe": boolean,
      "flagged": boolean,
      "reason": string atau null,
      "category": "safe" | "suspicious" | "malicious" | "inappropriate" | "unknown",
      "confidence": angka antara 0 dan 1,
      "response": berikan jawaban dalam bahasa indonesia mengenai analisis url ini
    }

    Tanggapi hanya dengan objek JSON, tanpa teks tambahan.
  `;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    const jsonMatch = text.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      throw new Error("Failed to parse JSON response");
    }

    const jsonResponse = JSON.parse(jsonMatch[0]) as UrlSafetyCheck;
    return {
      success: true,
      data: jsonResponse,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: "Failed to check URL safety",
    };
  }
}

export async function checkUrl(formData: FormData): Promise<
  ApiResponse<{
    flagged: boolean;
    flagReason?: string | null;
    message?: string | null;
  }>
> {
  try {
    const url = formData.get("url") as string;

    const validatedFields = checkSchema.safeParse({
      url,
    });

    if (!validatedFields.success) {
      return {
        success: false,
        error: validatedFields.error.flatten().fieldErrors.url?.[0] || "Invalid URL",
      };
    }

    const originalUrl = ensureHttps(validatedFields.data.url);

    const safetyCheck = await checkUrlSafety(originalUrl);
    let flagged = false;
    let flagReason = null;
    let message = null;

    if (safetyCheck.success && safetyCheck.data) {
      flagged = safetyCheck.data.flagged;
      flagReason = safetyCheck.data.reason;
      message = safetyCheck.data.response;

      if (safetyCheck.data.category === "malicious" && safetyCheck.data.confidence > 0.7) {
        return {
          success: false,
          error: "This URL is flagged as malicious",
        };
      }
    }

    revalidatePath("/");

    return {
      success: true,
      data: {
        flagged,
        flagReason,
        message,
      },
    };
  } catch (error) {
    console.error("Failed to check URL", error);
    return {
      success: false,
      error: "Failed to check URL",
    };
  }
}
