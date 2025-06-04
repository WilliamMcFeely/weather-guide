// app/dashboard/page.tsx
import React from 'react';

interface WeatherData {
  temperature: string;
  condition: string;
  humidity: string;
  windSpeed: string;
  forecast: { day: string; temp: string; condition: string }[];
}

const sampleData: WeatherData = {
  temperature: '21°C',
  condition: 'Partly Cloudy',
  humidity: '68%',
  windSpeed: '12 km/h',
  forecast: [
    { day: 'Mon', temp: '22°C', condition: 'Sunny' },
    { day: 'Tue', temp: '20°C', condition: 'Cloudy' },
    { day: 'Wed', temp: '19°C', condition: 'Rainy' },
    { day: 'Thu', temp: '21°C', condition: 'Sunny' },
    { day: 'Fri', temp: '23°C', condition: 'Sunny' },
    { day: 'Sat', temp: '24°C', condition: 'Partly Cloudy' },
    { day: 'Sun', temp: '22°C', condition: 'Thunderstorms' },
  ],
};

export default function DashboardPage() {
  return (
      <div className="p-6 max-w-4xl mx-auto text-white bg-black min-h-screen">
        <h1 className="text-3xl font-bold mb-6 text-white">Weather Dashboard</h1>

        <section className="bg-gray-800 rounded shadow p-4 mb-6">
          <h2 className="text-xl font-semibold mb-2 text-white">Current Weather</h2>
          <p className="text-gray-200">Temperature: {sampleData.temperature}</p>
          <p className="text-gray-200">Condition: {sampleData.condition}</p>
          <p className="text-gray-200">Humidity: {sampleData.humidity}</p>
          <p className="text-gray-200">Wind Speed: {sampleData.windSpeed}</p>
        </section>

        <section className="bg-gray-800 rounded shadow p-4">
          <h2 className="text-xl font-semibold mb-4 text-white">7-Day Forecast</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-4">
            {sampleData.forecast.map((day, idx) => (
                <div
                    key={idx}
                    className="border border-gray-600 bg-gray-900 text-white p-2 rounded text-center"
                >
                  <div className="font-medium">{day.day}</div>
                  <div className="text-gray-300">{day.temp}</div>
                  <div className="text-sm text-gray-400">{day.condition}</div>
                </div>
            ))}
          </div>
        </section>
      </div>
  );
}
