export const getLocation = async (latitude: any, longitude: any) => {
  try {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json`
    );
    const data = response.json;
    return data;
  } catch (error) {
    throw error;
  }
};
