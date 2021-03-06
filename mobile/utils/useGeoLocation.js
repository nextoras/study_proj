import { useState, useEffect } from "react";
import { Alert } from "react-native";

/** Обработка долготы и широты  */
export default function useGeoLocation(lat, lon) {
  const [latLon, setLatLon] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatLon([position.coords.latitude, position.coords.longitude]);
      },
      (err) => {
        Alert.alert("Для использования приложения разрешите использовать геопозицию в настройках")
      }
    );
  }, []);

  return latLon;
}
