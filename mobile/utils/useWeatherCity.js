import { useState, useEffect } from "react";
import axios from "axios";
import { storeWeather, getWeather } from "./storeWeather";

const url = "https://api.openweathermap.org";

const callAPI = axios.create({
    baseURL: url,
    timeout: 1000,
});



export default function useWeatherCity(city) {

    const [weather, setWeather] = useState(null);

    /** Получение погоды  */
    const fetchAPI = async (city) => {
        try {
            const endpoint = `/data/2.5/weather?q=${city}&appid=ae4b4e0ee9db8f4040b03a514cf7a928`;
            const res = await callAPI.get(endpoint);
            console.log("HHH")
            const data = await storeWeather(filterData(res.data));

            setWeather(data);
        } catch (err) {
            console.log("API conection failed");
            const data = await getWeather();
            setWeather(data);
        }
    };

    fetchAPI(city);
    return weather;
}


/** Фильтр данных  */
const filterData = (rawData) => {
    return {
        name: rawData.name,
        temp: rawData.main.temp
    };
};
