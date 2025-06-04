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
