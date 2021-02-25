import { useState, useEffect } from "react";

/** Обработка долготы и широты  */
export default function useGeoLocation(lat, lon) {
  const [latLon, setLatLon] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatLon([position.coords.latitude, position.coords.longitude]);
      },
      (err) => {
        console.log(err);
      }
    );
  }, []);

  return latLon;
}
