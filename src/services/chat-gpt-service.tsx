import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_CHAT_GPT_API_KEY,
    dangerouslyAllowBrowser: true,
    maxRetries: 0,
});

export async function getChatGPTAdvice(weather: any): Promise<string> {
    if (!process.env.NEXT_PUBLIC_CHAT_GPT_API_KEY) throw new Error('Missing ChatGPT API Key');

    const dailyWeather = weather.daily;
    const today = {
        minTemp: dailyWeather.temperature_2m_min[0],
        maxTemp: dailyWeather.temperature_2m_max[0],
        weatherCode: dailyWeather.weathercode[0],
    };

    const prompt = `
You are a weather assistant. Based on the following data, describe the day's weather and give suggestions for what type of clothing someone should wear:

- Minimum temperature: ${today.minTemp}°C
- Maximum temperature: ${today.maxTemp}°C
- Weather condition code: ${today.weatherCode} (use general terms like clear, rain, snow, fog, etc.)

Be helpful, concise, and a little playful.
  `;

    const response = await openai.responses.create({
        model: 'gpt-4o-mini',
        input: prompt,
        temperature: 0.7,
    });

    return response.output_text.trim() ?? 'No recommendation available.';
}
