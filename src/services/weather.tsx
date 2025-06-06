import {JSX} from "react";
import {
    Cloud,
    CloudDrizzle,
    CloudFog,
    CloudLightning,
    CloudRain,
    CloudSnow,
    CloudSun,
    HelpCircle,
    Sun,
} from 'lucide-react';

const BASE_URL = 'https://api.open-meteo.com/v1/forecast';

export async function getWeatherForecast(lat: number, lon: number) {
    const params = new URLSearchParams({
        latitude: lat.toString(),
        longitude: lon.toString(),
        daily: [
            'temperature_2m_max',
            'temperature_2m_min',
            'weathercode'
        ].join(','),
        current_weather: 'true',
        timezone: 'auto'
    });

    const res = await fetch(`${BASE_URL}?${params}`);
    if (!res.ok) throw new Error('Failed to fetch weather data');
    return res.json();
}

export async function getCoordinatesFromCity(city: string) {
    const res = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`
    );
    if (!res.ok) throw new Error('Failed to fetch location');
    const data = await res.json();
    if (!data.results || data.results.length === 0) throw new Error('City not found');
    return {
        lat: data.results[0].latitude,
        lon: data.results[0].longitude,
        name: data.results[0].name,
        country: data.results[0].country,
    };
}

export function getWeatherSvgIcon(code: number, size: string = 'w-6 h-6') {
    const sizeProps = { className: size };

    const iconMap: Record<number, JSX.Element> = {
        0: <Sun {...sizeProps} />, // Clear sky
        1: <CloudSun {...sizeProps} />, // Mainly clear
        2: <CloudSun {...sizeProps} />, // Partly cloudy
        3: <Cloud {...sizeProps} />, // Overcast
        45: <CloudFog {...sizeProps} />, // Fog
        48: <CloudFog {...sizeProps} />, // Depositing rime fog
        51: <CloudDrizzle {...sizeProps} />, // Light drizzle
        53: <CloudRain {...sizeProps} />, // Moderate drizzle
        55: <CloudRain {...sizeProps} />, // Dense drizzle
        61: <CloudRain {...sizeProps} />, // Slight rain
        63: <CloudRain {...sizeProps} />, // Moderate rain
        65: <CloudRain {...sizeProps} />, // Heavy rain
        71: <CloudSnow {...sizeProps} />, // Slight snow
        73: <CloudSnow {...sizeProps} />, // Moderate snow
        75: <CloudSnow {...sizeProps} />, // Heavy snow
        95: <CloudLightning {...sizeProps} />, // Thunderstorm
    };

    return iconMap[code] ?? <HelpCircle {...sizeProps} />;
}

