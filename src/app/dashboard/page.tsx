import React from 'react';
import { getWeatherForecast} from "@/services/weather";

const LAT = 56.1518 // Aarhus
const LON = 10.2064

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

export default async function DashboardPage() {
  const weather = await getWeatherForecast(LAT, LON);

  const current = weather.current_weather;
  const forecast = weather.daily;

  return (
      <div className="p-6 max-w-4xl mx-auto text-white bg-black min-h-screen">
        <h1 className="text-3xl font-bold mb-6 text-white">Weather Dashboard</h1>

        <section className="bg-gray-800 rounded shadow p-4 mb-6">
          <h2 className="text-xl font-semibold mb-2 text-white">Current Weather</h2>
          <p className="text-gray-200">Temperature: {current.temperature}°C</p>
          <p className="text-gray-200">Condition: {getConditionFromCode(current.weathercode)}</p>
          <p className="text-gray-200">Wind Speed: {current.windspeed} km/h</p>
        </section>

        <section className="bg-gray-800 rounded shadow p-4">
          <h2 className="text-xl font-semibold mb-4 text-white">7-Day Forecast</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-4">
            {forecast.time.map((date: string, idx: number) => (
                <div
                    key={date}
                    className="border border-gray-600 bg-gray-900 text-white p-2 rounded text-center"
                >
                  <div className="font-medium">{new Date(date).toLocaleDateString(undefined, { weekday: 'short' })}</div>
                  <div className="text-gray-300">
                    {forecast.temperature_2m_min[idx]}°C / {forecast.temperature_2m_max[idx]}°C
                  </div>
                  <div className="text-sm text-gray-400">
                    {getConditionFromCode(forecast.weathercode[idx])}
                  </div>
                </div>
            ))}
          </div>
        </section>
      </div>
  );
}
