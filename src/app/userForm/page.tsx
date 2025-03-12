"use client";
import { SubmitHandler, useForm } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowRight, Loader2, MapPin } from "lucide-react";

interface IFormInput {
  location: string;
}

const Page = () => {
  const { register, handleSubmit } = useForm<IFormInput>();
  const params = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cityName, setCityName] = useState<string | null>(null);
  const [latitude, setLatitude] = useState<string | null>(null);
  const [longitude, setLongitude] = useState<string | null>(null);

  useEffect(() => {
    if (params.id) {
      const paramId = Array.isArray(params.id) ? params.id[0] : params.id;
      const coords = paramId.split(",");
      if (coords.length === 2) {
        setLatitude(coords[0]);
        setLongitude(coords[1]);
      } else {
        setError("Invalid coordinates in URL params.");
      }
    }
  }, [params.id]);

  useEffect(() => {
    const getCityName = async () => {
      if (!latitude || !longitude) return;

      try {
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=pk.eyJ1IjoibWl0Y2hlbGdpdGF1IiwiYSI6ImNtODM2a2Y1NjBmaTQyaHNhOHJyOGZ1YWkifQ._XFrnwCemgjRBnbJUZaM3A`
        );
        const data = await response.json();

        if (data.features && data.features.length > 0) {
          setCityName(data.features[0].place_name);
        }
      } catch (error) {
        setError("Error fetching city data.");
        console.error("Error fetching city data:", error);
      }
    };
    getCityName();
  }, [latitude, longitude]);

  const locator = () => {
    setLoading(true);
    setError(null);

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude.toString());
          setLongitude(position.coords.longitude.toString());
          setLoading(false);
        },
        () => {
          setError("Location access denied. Please allow location sharing.");
          setLoading(false);
        }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
      setLoading(false);
    }
  };

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    setError(null);
    if (data.location) {
      router.push(`/details/${data.location}`);
    } else {
      locator();
    }
  };

  useEffect(() => {
    if (cityName) {
      router.push(`/details/${cityName}`);
    }
  }, [cityName, router]);

  return (
    <div className="flex min-h-screen items-center justify-center text-white px-6">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md bg-gray-800 rounded-xl shadow-lg p-6 space-y-6"
      >
        <h2 className="text-2xl font-bold text-center text-amber-300">
          📍 Share Your Location
        </h2>

        <p className="text-center text-gray-400">
          Enter your location manually or detect it automatically.
        </p>

        <div className="relative">
          <input
            {...register("location")}
            className="w-full border border-gray-500 rounded-md p-3 pr-12 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-300"
            placeholder="Enter city name..."
          />
          <button
            type="submit"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-amber-300 text-gray-900 p-2 rounded-full hover:bg-amber-400 transition"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        <p className="text-center text-gray-400">OR</p>

        {cityName && (
          <p className="text-center text-green-400 font-semibold"></p>
        )}

        {error && <p className="text-center text-red-500">{error}</p>}

        <button
          type="button"
          onClick={locator}
          className={`flex items-center justify-center w-full gap-2 text-xl font-semibold
    rounded-lg px-4 py-3 border-2 border-gray-500
    transition-all duration-300 ${
      loading
        ? "bg-gray-400 text-gray-700 cursor-not-allowed"
        : "bg-amber-300 text-gray-900 hover:bg-amber-400"
    }`}
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin w-5 h-5" /> Fetching Location...
            </>
          ) : (
            <>
              <MapPin className="w-5 h-5" /> SHARE LOCATION
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default Page;
