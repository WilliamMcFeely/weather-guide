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
