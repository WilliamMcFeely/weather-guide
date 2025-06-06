'use client';

// app/dashboard/page.tsx
import React, {useEffect, useState} from 'react';
import {getCoordinatesFromCity, getWeatherForecast, getWeatherSvgIcon} from "@/services/weather";
import {getChatGPTAdvice} from "@/services/chat-gpt-service";
import {Bot, MessageCircleMore} from 'lucide-react';

function getConditionFromCode(code: number): string {
  const map: Record<number, string> = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Fog',
    48: 'Depositing rime fog',
    51: 'Light drizzle',
    53: 'Moderate drizzle',
    55: 'Dense drizzle',
    61: 'Slight rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    71: 'Slight snow',
    73: 'Moderate snow',
    75: 'Heavy snow',
    95: 'Thunderstorm',
  };
  return map[code] ?? 'Unknown';
}

export default function DashboardPage() {
  const [city, setCity] = useState('Aarhus');
  const [weather, setWeather] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [botReply, setBotReply] = useState<string | null>(null);
  const [botLoading, setBotLoading] = useState(false);

  const hasApiKey = !!process.env.NEXT_PUBLIC_CHAT_GPT_API_KEY;

  const fetchWeather = async (cityName: string) => {
    try {
      const { lat, lon } = await getCoordinatesFromCity(cityName);
      const forecast = await getWeatherForecast(lat, lon);
      setWeather(forecast);
      setError(null);
      setBotReply(null);
    } catch (e: any) {
      setError(e.message);
      setWeather(null);
      setBotReply(null);
    }
  };

  useEffect(() => {
    fetchWeather(city);
  }, []);

  const handleAskBot = async () => {
    if (!weather || botLoading || botReply) return;
    try {
      setBotLoading(true);
      const reply = await getChatGPTAdvice(weather);
      setBotReply(reply);
    } catch (err) {
      setBotReply('Sorry, I’m a bit overwhelmed right now.');
    } finally {
      setBotLoading(false);
    }
  };

  return (
      <div className="p-6 max-w-4xl mx-auto text-white bg-black min-h-screen">
        <h1 className="text-3xl font-bold mb-6 text-white">Weather Dashboard</h1>

        <div className="mb-6">
          <div className="flex gap-2">
            <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter city name"
                className="flex-1 px-4 py-2 rounded bg-gray-900 text-white placeholder-gray-400 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
                onClick={() => fetchWeather(city)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Search
            </button>
          </div>
        </div>

        {error && <p className="text-red-400 mb-6">{error}</p>}

        {weather && (
            <>
              <section className="bg-gray-800 rounded shadow p-4 mb-6">
                <div className="flex gap-4">
                  <div className="flex justify-center">{getWeatherSvgIcon(weather.current_weather.weathercode, 'w-24 h-24')}</div>
                  <div className="flex flex-col flex-1 gap-3">
                    <div>
                      <h2 className="text-xl font-semibold mb-2 text-white">Current Weather</h2>
                      <p className="text-gray-200">Temperature: {weather.current_weather.temperature}°C</p>
                      <p className="text-gray-200">Condition: {getConditionFromCode(weather.current_weather.weathercode)}</p>
                      <p className="text-gray-200">Wind Speed: {weather.current_weather.windspeed} km/h</p>
                    </div>

                    {hasApiKey && (
                        <button
                            onClick={handleAskBot}
                            disabled={botLoading}
                            className="px-3 py-1 text-sm rounded bg-blue-500 hover:bg-blue-600 text-white self-start"
                        >
                          {botLoading ? 'Asking WeatherBot...' : 'Ask WeatherBot'}
                        </button>
                    )}
                    <div className="flex">
                      <div className="flex items-start gap-3 border border-gray-700 p-3 bg-gray-900 rounded text-sm text-gray-300 min-h-[48px]">
                        <div className="flex gap-1 items-center min-w-[40px]">
                          <Bot className="w-5 h-5" />
                          <MessageCircleMore className="w-5 h-5" />
                        </div>
                        <span className="whitespace-pre-wrap">
                    {botReply || 'Ask WeatherBot for clothing suggestions based on today’s weather.'}
                  </span>
                      </div>
                    </div>


                  </div>
                </div>
              </section>

              <section className="bg-gray-800 rounded shadow p-4">
                <h2 className="text-xl font-semibold mb-4 text-white">7-Day Forecast</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-4">
                  {weather.daily.time.map((date: string, idx: number) => (
                      <div
                          key={date}
                          className="border border-gray-600 bg-gray-900 text-white p-2 rounded text-center"
                      >
                        <div className="font-medium">{new Date(date).toLocaleDateString(undefined, { weekday: 'short' })}</div>
                        <div className="text-gray-300">
                          {weather.daily.temperature_2m_min[idx]}°C / {weather.daily.temperature_2m_max[idx]}°C
                        </div>
                        <div className="text-sm text-gray-400">
                          {getConditionFromCode(weather.daily.weathercode[idx])}
                        </div>
                      </div>
                  ))}
                </div>
              </section>
            </>
        )}
      </div>
  );
}
