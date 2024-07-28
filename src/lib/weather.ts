// export const API_KEY = 'd9a01c220a122900a24c42836c2fcdf5';
import * as Location from 'expo-location';
import Ionicons from '@expo/vector-icons/Ionicons';
import config from '~/config';

const API_KEY = config.WEATHER_API_KEY;

export const getWeather = async () => {
  const { coords } = await Location.getCurrentPositionAsync();
  const lat = coords.latitude.toString();
  const lon = parseInt(coords.longitude.toString()) < 126 ? '126.988156' : coords.longitude.toString();
  return await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&lang=kr`)
    .then((res) => res.json())
    .then((json) => {
      const { list } = json;
      const today = list?.[0];
      return {
        temp: Math.floor(Number(parseFloat(today.main.temp) - 273.15)), // 온도 : 캘빈 -> 섭씨 단위로 변환
        humidity: today.main.humidity, // 습도
        tempMax: Math.floor(Number(parseFloat(today.main['temp_max']) - 273.15)), // 최고 온도
        tempMin: Math.floor(Number(parseFloat(today.main['temp_min']) - 273.15)), // 최저 온도
        weather: today.weather[0].main, // 오늘의 날씨
        weatherIcon: getWeatherStatus(today.weather[0].id),
      };
    });
};

/**
 * 날씨 id 로 날씨 아이콘 형태 반환
 */
const getWeatherStatus = (code: number): keyof typeof Ionicons.glyphMap => {
  let icon: keyof typeof Ionicons.glyphMap = 'sunny';
  // 2xx: Thunderstorm
  if (code >= 200) {
    icon = 'thunderstorm';
  }
  // 3xx: Drizzle
  // 5xx: Rain
  else if (code >= 300) {
    icon = 'rainy';
  }
  // 6xx: Snow
  else if (code >= 600) {
    icon = 'snow';
  }
  // 7xx: Atmosphere
  // 80x: Clouds
  else if (code >= 700) {
    icon = 'cloud';
  }
  // 800: Clear
  else if (code === 800) {
    icon = 'sunny';
  }
  return icon;
};
