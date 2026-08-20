/**
 * Gemini API Integration Service
 * Communicates directly with Google Gemini API when an API Key is configured in settings.
 */

export async function callGeminiApi({ apiKey, prompt, systemInstruction = '', model = 'gemini-1.5-flash' }) {
  if (!apiKey) {
    throw new Error('Gemini API key is missing.');
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const contents = [
    {
      role: 'user',
      parts: [{ text: systemInstruction ? `${systemInstruction}\n\nUser Request: ${prompt}` : prompt }]
    }
  ];

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ contents })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Gemini API HTTP Error ${response.status}`);
  }

  const data = await response.json();
  const textOutput = data.candidates?.[0]?.content?.parts?.[0]?.text;
  
  if (!textOutput) {
    throw new Error('No text response returned from Gemini API.');
  }

  return textOutput;
}
