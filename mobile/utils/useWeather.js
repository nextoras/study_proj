import { useState, useEffect } from "react";
import axios from "axios";
import { storeWeather, getWeather } from "./storeWeather";
import useGeoLocation from "./useGeoLocation";
import { Alert } from "react-native";

const url = "https://api.openweathermap.org";

const callAPI = axios.create({
  baseURL: url,
  timeout: 1000,
});

export default function useWeather(lat, lon) {
  const [weather, setWeather] = useState(null);

  const latLon = useGeoLocation();

  useEffect(() => {
    if (latLon) {
      fetchAPI(...latLon);
    }
  }, [latLon]);


  /** Получение погоды  */
  const fetchAPI = async (lat, lon) => {
    try {
      const endpoint = `/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=ae4b4e0ee9db8f4040b03a514cf7a928`;
      const res = await callAPI.get(endpoint);
      const data = await storeWeather(filterData(res.data));
      setWeather(data);
    } catch (err) {
      Alert.alert("Ошибка в определении местоположения. Обратитесь в поддрежку support@gmail.com")
      const data = await getWeather();
      setWeather(data);
    }
  };

  return weather;
}


/** Фильтр данных  */
const filterData = (rawData) => {
  return {
    id: rawData.city.id,
    name: rawData.city.name,
    country: rawData.city.country,
    timezone: rawData.city.timezone,
    coord: {
      lat: rawData.city.coord.lat,
      lon: rawData.city.coord.lon,
    },
    list: rawData.list,
  };
};
