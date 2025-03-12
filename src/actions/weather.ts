"use server";
export const fetchWeather = async (city: string) => {
  try {
    const response = await fetch(
      `http://api.weatherapi.com/v1/current.json?key=4b47cc3e68514b71a48190203252802&q=${city}&days=7&aqi=no&alerts=no`
    );
    const data = response.json;
    return data;
  } catch (error) {
    throw error;
  }
};
