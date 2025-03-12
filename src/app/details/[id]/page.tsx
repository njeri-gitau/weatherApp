"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import {
  addDays,
  differenceInMilliseconds,
  format,
  formatRelative,
  intlFormatDistance,
} from "date-fns";
import { useEffect, useState } from "react";
import { motion } from "motion/react";

const WeatherDetails = () => {
  const [imgSrc, setImgSrc] = useState("");
  const [isDayTime, setIsDayTime] = useState(getIsDayTime);
  const [data, setData] = useState({
    location: { name: "", region: "", country: "", localtime: "" },
    current: {
      temp_c: 0,
      temp_f: 0,
      condition: { text: "", icon: "" },
      wind_kph: 0,
    },
    forecast: { forecastday: [] },
  });
  const params = useParams();
  const cityName = params.id ? decodeURIComponent(String(params.id)) : "";
  const tomorrowString = intlFormatDistance(addDays(new Date(), 1), new Date());
  console.log("Decoded cityName:", cityName);

  function getIsDayTime() {
    const hour = new Date().getHours();
    return hour > 6 && hour < 19;
  }
  // useEffect(() => {
  //   const now = new Date();
  //   const currentHour = new Date().getHours();

  //   const nextSwitchHour = currentHour < 7 ? 7 : currentHour < 19 ? 19 : 7;
  //   const timeUntilNextSwitch = differenceInMilliseconds(
  //     new Date(nextSwitchHour, 0, 0, 0),
  //     now
  //   );
  //   console.log(timeUntilNextSwitch, "tiiime");
  // }, [isDayTime]);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(
          `https://api.weatherapi.com/v1/forecast.json?key=4b47cc3e68514b71a48190203252802&q=${cityName}&days=7&aqi=no&alerts=no`
        );
        if (!response.ok) throw new Error("Failed to fetch weather data");
        const weatherData = await response.json();
        setData(weatherData);
      } catch (err) {
      } finally {
      }
    };
    fetchWeather();
  }, [cityName]);

  useEffect(() => {
    if (data?.current?.condition?.icon) {
      setImgSrc(`https:${data.current.condition.icon}`);
    }
  }, [data]);

  const transition = {
    duration: 0.8,
    delay: 0.5,
    ease: [0, 0.71, 0.2, 1.01],
  };

  const tomorrow = addDays(new Date(), 1);
  const formattedDate = formatRelative(tomorrow, new Date());
  return (
    <div className="relative min-h-screen w-full">
      {/* Background Image */}
      <Image
        src={isDayTime ? "/heart.jpg" : "/sky-clouds.jpg"}
        alt="Cloudy Sky"
        fill
        className="object-cover brightness-75"
      />

      <div className="absolute inset-0 bg-black/30"></div>

      <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-6 md:px-10">
        <h1 className="text-3xl md:text-2xl font-bold text-center">
          WEATHER IN:{" "}
          <motion.span
            animate={{ x: 0 }}
            transition={transition}
            className="text-yellow-300 block text-3xl md:text-4xl mt-2"
          >
            {params.id ? decodeURIComponent(String(params.id)) : ""}
          </motion.span>
        </h1>

        <div className="flex flex-col bg-white/20 rounded-2xl shadow-lg md:flex-row items-center  px-6 py-4 space-y-6 md:space-y-0 md:space-x-12 mt-8">
          <div className="flex flex-col items-center  ">
            <span className="text-gray-300 text-sm">
              {format(new Date(), "dd, MMMM")}
            </span>
            <h5 className="text-2xl font-semibold mt-1">Today</h5>
            <div className="flex items-center space-x-4 mt-3">
              <h2 className="text-4xl font-bold">{data?.current.temp_c}°C</h2>
              <h2 className="text-gray-300 text-2xl">
                {data?.current.temp_f}°F
              </h2>
            </div>
          </div>
          <div className="w-32 h-32 relative ">
            <Image
              src={imgSrc || "/moon.jpg"}
              alt="Weather Icon"
              className="object-contain"
              fill
              quality={100}
            />
          </div>
        </div>

        <div className="grid grid-cols-6 gap-7 space-x-12 pt-20 ">
          <h5>
            {tomorrowString
              .charAt(0)
              .toUpperCase()
              .concat(tomorrowString.slice(1))}
          </h5>
          {data.forecast.forecastday?.length > 0
            ? data.forecast.forecastday
                .slice(2)
                .map((day: { date: string }, index) => (
                  <p key={index}>{format(day.date, "eeee")}</p>
                ))
            : null}{" "}
          {data?.forecast?.forecastday?.length > 0 ? (
            data.forecast.forecastday.slice(1).map(
              (
                day: {
                  date: string;
                  day: {
                    avgtemp_c: string;
                    condition: { text: string; icon: string };
                  };
                },
                index: number
              ) => (
                <div key={day.date}>
                  <p className="text-slate-400 text-sm">
                    {format(day.date, "dd, MMMM")}
                  </p>
                  <Image
                    src={`https:${day.day.condition.icon}`}
                    alt={day.day.condition.text || "Weather Icon"}
                    width={50}
                    height={50}
                  />
                  <p>{day.day.avgtemp_c}°C</p>
                </div>
              )
            )
          ) : (
            <p>Loading forecast...</p>
          )}
        </div>
      </div>
    </div>
  );
};
export default WeatherDetails;
