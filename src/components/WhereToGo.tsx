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
  }, [selectedCities, useFiveYearAverage]);

  const handleCityChange = (selected: readonly CityOption[] | null) => {
    setSelectedCities(selected ? [...selected] : []);
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
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
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
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">
        Where to Go: Weather Comparison
      </h1>
      <div className="mb-6">
        <Select<CityOption, true>
          isMulti
          options={citiesList}
          onChange={handleCityChange}
          placeholder="Search and select cities to compare..."
          className="text-gray-800"
        />
      </div>
      <div className="mb-6">
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            className="form-checkbox"
            checked={useFiveYearAverage}
            onChange={(e) => setUseFiveYearAverage(e.target.checked)}
          />
          <span className="ml-2">
            Use 5-year average (instead of last year's data)
          </span>
        </label>
      </div>
      {isLoading ? (
        <div>Loading weather data...</div>
      ) : weatherData.length > 0 ? (
        <div>
          <h2 className="text-2xl font-semibold mb-4">
            Temperature Comparison (°C)
          </h2>
          {renderChart(weatherData, "avgTemperature")}
          <h2 className="text-2xl font-semibold my-4">
            Precipitation Comparison (mm)
          </h2>
          {renderChart(weatherData, "avgPrecipitation")}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300 mt-6">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 p-2">Month</th>
                  {weatherData.map((city) => (
                    <React.Fragment key={`${city.city}, ${city.country}`}>
                      <th className="border border-gray-300 p-2">
                        {city.city}, {city.country} Temp (°C)
                      </th>
                      <th className="border border-gray-300 p-2">
                        {city.city}, {city.country} Precip (mm)
                      </th>
                    </React.Fragment>
                  ))}
                </tr>
              </thead>
              <tbody>
                {weatherData[0].monthlyData.map((_, monthIndex) => (
                  <tr key={monthIndex}>
                    <td className="border border-gray-300 p-2">
                      {weatherData[0].monthlyData[monthIndex].month}
                    </td>
                    {weatherData.map((city) => (
                      <React.Fragment key={`${city.city}, ${city.country}`}>
                        <td className="border border-gray-300 p-2">
                          {city.monthlyData[monthIndex].avgTemperature.toFixed(
                            1
                          )}
                        </td>
                        <td className="border border-gray-300 p-2">
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
        </div>
      ) : (
        <div>Select cities to compare weather data.</div>
      )}
    </div>
  );
};

export default WhereToGo;
