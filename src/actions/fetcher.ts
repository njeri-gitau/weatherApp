"use server";
export const fetcher = async (url: string) => {
  try {
    const response = await fetch(`http://api.weatherapi.com/v1/${url}`);
    if (response) {
      return response;
    }
    return [];
  } catch (error) {
    console.log(error);
  }
};
