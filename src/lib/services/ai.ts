export async function verifyFssaiCertificate(file: File) {
  if (!file) return { status: "invalid" as const, trustScore: 0 };

  const key = import.meta.env.VITE_GEMINI_API_KEY;
  if (!key) {
    const looksRelevant = /fssai|food|license|certificate/i.test(file.name);
    return {
      status: looksRelevant ? ("needs_review" as const) : ("invalid" as const),
      trustScore: looksRelevant ? 75 : 30,
    };
  }

  const base64 = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(",")[1] ?? "");
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: "Verify whether this is an FSSAI-approved food license. Return only JSON with keys status(valid|invalid|needs_review), trustScore, reason.",
              },
              { inlineData: { mimeType: file.type || "image/jpeg", data: base64 } },
            ],
          },
        ],
        generationConfig: { responseMimeType: "application/json" },
      }),
    },
  );
  const data = await response.json();
  return JSON.parse(data.candidates?.[0]?.content?.parts?.[0]?.text ?? '{"status":"needs_review","trustScore":50}');
}
