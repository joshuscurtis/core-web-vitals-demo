import React, { useState, useEffect } from "react";
import { fetchWeatherApi } from "openmeteo";
import Select from "react-select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";
import { Sun, Cloud, Droplets, MapPin, Share2 } from "lucide-react";

// Assuming worldCities is imported from a separate file
import { worldCities } from "./cities";

export interface CityWeather {
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  monthlyData: {
    month: string;
    avgTemperature: number;
    avgPrecipitation: number;
  }[];
}

export interface CityOption {
  value: string;
  label: string;
  country: string;
  latitude: number;
  longitude: number;
}

const citiesList: CityOption[] = worldCities;

const WhereToGo: React.FC = () => {
  const [selectedCities, setSelectedCities] = useState<CityOption[]>([]);
  const [weatherData, setWeatherData] = useState<CityWeather[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [useFiveYearAverage, setUseFiveYearAverage] = useState(false);
  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cityValues = params.get("cities")?.split(",") || [];
    const fiveYearAvg = params.get("fiveYearAvg") === "true";

    const initialCities = citiesList.filter((city) =>
      cityValues.includes(city.value)
    );
    setSelectedCities(initialCities);
    setUseFiveYearAverage(fiveYearAvg);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (selectedCities.length === 0) return;
      setIsLoading(true);
      const currentYear = new Date().getFullYear();
      const startDate = useFiveYearAverage
        ? `${currentYear - 5}-01-01`
        : `${currentYear - 1}-01-01`;
      const endDate = `${currentYear - 1}-12-31`;

      const updatedWeatherData = await Promise.all(
        selectedCities.map(async (city) => {
          const params = {
            latitude: city.latitude,
            longitude: city.longitude,
            start_date: startDate,
            end_date: endDate,
            daily: ["temperature_2m_mean", "precipitation_sum"],
          };
          const url = "https://archive-api.open-meteo.com/v1/archive";
          const responses = await fetchWeatherApi(url, params);
          const response = responses[0];
          const daily = response.daily()!;

          const monthlyData = Array.from({ length: 12 }, (_, i) => {
            const monthTemps: number[] = [];
            const monthPrecip: number[] = [];

            for (let year = 0; year < (useFiveYearAverage ? 5 : 1); year++) {
              const yearOffset = year * 365;
              const monthStart = yearOffset + i * 30;
              const monthEnd = yearOffset + (i + 1) * 30;
              monthTemps.push(
                ...daily
                  .variables(0)!
                  .valuesArray()!
                  .slice(monthStart, monthEnd)
              );
              monthPrecip.push(
                ...daily
                  .variables(1)!
                  .valuesArray()!
                  .slice(monthStart, monthEnd)
              );
            }

            return {
              month: new Date(2023, i, 1).toLocaleString("default", {
                month: "long",
              }),
              avgTemperature:
                monthTemps.reduce((a, b) => a + b, 0) / monthTemps.length,
              avgPrecipitation:
                monthPrecip.reduce((a, b) => a + b, 0) / monthPrecip.length,
            };
          });

          return {
            city: city.label,
            country: city.country,
            latitude: city.latitude,
            longitude: city.longitude,
            monthlyData,
          };
        })
      );

      setWeatherData(updatedWeatherData);
      setIsLoading(false);
    };

    fetchData();
    updateUrl();
  }, [selectedCities, useFiveYearAverage]);

  const handleCityChange = (selected: readonly CityOption[] | null) => {
    setSelectedCities(selected ? [...selected] : []);
  };

  const updateUrl = () => {
    const params = new URLSearchParams();
    if (selectedCities.length > 0) {
      params.set("cities", selectedCities.map((city) => city.value).join(","));
    }
    params.set("fiveYearAvg", useFiveYearAverage.toString());
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, "", newUrl);
    setShareUrl(window.location.href);
  };

  const handleShareClick = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      alert("URL copied to clipboard!");
    });
  };

  const prepareChartData = (
    data: CityWeather[],
    dataKey: "avgTemperature" | "avgPrecipitation"
  ) => {
    return data[0].monthlyData.map((monthData, index) => {
      const monthlyValues: { [key: string]: number | string } = {
        month: monthData.month,
      };
      data.forEach((city) => {
        monthlyValues[`${city.city}, ${city.country}`] = Number(
          city.monthlyData[index][dataKey].toFixed(1)
        );
      });
      return monthlyValues;
    });
  };

  const renderChart = (
    data: CityWeather[],
    dataKey: "avgTemperature" | "avgPrecipitation"
  ) => {
    const chartData = prepareChartData(data, dataKey);
    return (
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="month" stroke="#9CA3AF" />
          <YAxis stroke="#9CA3AF" />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1F2937",
              border: "none",
              borderRadius: "8px",
              color: "#F3F4F6",
            }}
          />
          <Legend />
          {data.map((city, index) => (
            <Bar
              key={`${city.city}, ${city.country}`}
              dataKey={`${city.city}, ${city.country}`}
              fill={`hsl(${(index * 137.5) % 360}, 70%, 50%)`}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100 p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        <h1 className="text-4xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
          Where to Go: Weather Comparison
        </h1>
        <div className="mb-8">
          <Select<CityOption, true>
            isMulti
            options={citiesList}
            onChange={handleCityChange}
            value={selectedCities}
            placeholder="Search and select cities to compare..."
            className="text-gray-800"
            styles={{
              control: (base) => ({
                ...base,
                backgroundColor: "#374151",
                borderColor: "#4B5563",
              }),
              menu: (base) => ({
                ...base,
                backgroundColor: "#374151",
              }),
              option: (base, state) => ({
                ...base,
                backgroundColor: state.isFocused ? "#4B5563" : "#374151",
                color: "#F3F4F6",
              }),
              multiValue: (base) => ({
                ...base,
                backgroundColor: "#4B5563",
              }),
              multiValueLabel: (base) => ({
                ...base,
                color: "#F3F4F6",
              }),
              multiValueRemove: (base) => ({
                ...base,
                color: "#F3F4F6",
                ":hover": {
                  backgroundColor: "#6B7280",
                },
              }),
            }}
          />
        </div>
        <div className="mb-8 flex justify-between items-center">
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="form-checkbox h-5 w-5 text-blue-500"
              checked={useFiveYearAverage}
              onChange={(e) => setUseFiveYearAverage(e.target.checked)}
            />
            <span className="ml-2 text-gray-300">
              Use 5-year average (instead of last year's data)
            </span>
          </label>
          <button
            onClick={handleShareClick}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded inline-flex items-center"
          >
            <Share2 className="mr-2" size={18} />
            Share
          </button>
        </div>
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : weatherData.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <Sun className="mr-2 text-yellow-400" />
                Temperature Comparison (°C)
              </h2>
              {renderChart(weatherData, "avgTemperature")}
            </div>
            <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <Cloud className="mr-2 text-blue-400" />
                Precipitation Comparison (mm)
              </h2>
              {renderChart(weatherData, "avgPrecipitation")}
            </div>
            <div className="bg-gray-800 rounded-lg shadow-lg p-6 overflow-x-auto">
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <MapPin className="mr-2 text-red-400" />
                Detailed Weather Data
              </h2>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-700">
                    <th className="border border-gray-600 p-2">Month</th>
                    {weatherData.map((city) => (
                      <React.Fragment key={`${city.city}, ${city.country}`}>
                        <th className="border border-gray-600 p-2">
                          {city.city}, {city.country} Temp (°C)
                        </th>
                        <th className="border border-gray-600 p-2">
                          {city.city}, {city.country} Precip (mm)
                        </th>
                      </React.Fragment>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {weatherData[0].monthlyData.map((_, monthIndex) => (
                    <tr key={monthIndex} className="hover:bg-gray-700">
                      <td className="border border-gray-600 p-2">
                        {weatherData[0].monthlyData[monthIndex].month}
                      </td>
                      {weatherData.map((city) => (
                        <React.Fragment key={`${city.city}, ${city.country}`}>
                          <td className="border border-gray-600 p-2">
                            {city.monthlyData[monthIndex].avgTemperature.toFixed(
                              1
                            )}
                          </td>
                          <td className="border border-gray-600 p-2">
                            {city.monthlyData[
                              monthIndex
                            ].avgPrecipitation.toFixed(1)}
                          </td>
                        </React.Fragment>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        ) : (
          <div className="text-center text-xl text-gray-400">
            <Droplets className="inline-block mb-2" size={48} />
            <p>Select cities to compare weather data.</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default WhereToGo;