import { CityOption } from "./WhereToGo";

const generateWorldCities = (): CityOption[] => {
  const cities: CityOption[] = [
    {
      value: "newyork",
      label: "New York",
      country: "United States",
      latitude: 40.7128,
      longitude: -74.006,
    },
    {
      value: "london",
      label: "London",
      country: "United Kingdom",
      latitude: 51.5074,
      longitude: -0.1278,
    },
    {
      value: "paris",
      label: "Paris",
      country: "France",
      latitude: 48.8566,
      longitude: 2.3522,
    },
    {
      value: "tokyo",
      label: "Tokyo",
      country: "Japan",
      latitude: 35.6762,
      longitude: 139.6503,
    },
    {
      value: "sydney",
      label: "Sydney",
      country: "Australia",
      latitude: -33.8688,
      longitude: 151.2093,
    },
    {
      value: "moscow",
      label: "Moscow",
      country: "Russia",
      latitude: 55.7558,
      longitude: 37.6173,
    },
    {
      value: "beijing",
      label: "Beijing",
      country: "China",
      latitude: 39.9042,
      longitude: 116.4074,
    },
    {
      value: "cairo",
      label: "Cairo",
      country: "Egypt",
      latitude: 30.0444,
      longitude: 31.2357,
    },
    {
      value: "rio",
      label: "Rio de Janeiro",
      country: "Brazil",
      latitude: -22.9068,
      longitude: -43.1729,
    },
    {
      value: "mumbai",
      label: "Mumbai",
      country: "India",
      latitude: 19.076,
      longitude: 72.8777,
    },
    {
      value: "lagos",
      label: "Lagos",
      country: "Nigeria",
      latitude: 6.5244,
      longitude: 3.3792,
    },
    {
      value: "istanbul",
      label: "Istanbul",
      country: "Turkey",
      latitude: 41.0082,
      longitude: 28.9784,
    },
    {
      value: "seoul",
      label: "Seoul",
      country: "South Korea",
      latitude: 37.5665,
      longitude: 126.978,
    },
    {
      value: "mexico_city",
      label: "Mexico City",
      country: "Mexico",
      latitude: 19.4326,
      longitude: -99.1332,
    },
    {
      value: "jakarta",
      label: "Jakarta",
      country: "Indonesia",
      latitude: -6.2088,
      longitude: 106.8456,
    },
    {
      value: "berlin",
      label: "Berlin",
      country: "Germany",
      latitude: 52.52,
      longitude: 13.405,
    },
    {
      value: "toronto",
      label: "Toronto",
      country: "Canada",
      latitude: 43.6532,
      longitude: -79.3832,
    },
    {
      value: "bangkok",
      label: "Bangkok",
      country: "Thailand",
      latitude: 13.7563,
      longitude: 100.5018,
    },
    {
      value: "dubai",
      label: "Dubai",
      country: "United Arab Emirates",
      latitude: 25.2048,
      longitude: 55.2708,
    },
    {
      value: "singapore",
      label: "Singapore",
      country: "Singapore",
      latitude: 1.3521,
      longitude: 103.8198,
    },
  ];

  // Generate more cities programmatically
  const generateCity = (
    name: string,
    country: string,
    lat: number,
    lon: number
  ): CityOption => ({
    value: name.toLowerCase().replace(/\s+/g, "_"),
    label: name,
    country: country,
    latitude: parseFloat(lat.toFixed(4)),
    longitude: parseFloat(lon.toFixed(4)),
  });

  // Add more European cities
  cities.push(
    generateCity("Rome", "Italy", 41.9028, 12.4964),
    generateCity("Amsterdam", "Netherlands", 52.3676, 4.9041),
    generateCity("Vienna", "Austria", 48.2082, 16.3738),
    generateCity("Madrid", "Spain", 40.4168, -3.7038),
    generateCity("Stockholm", "Sweden", 59.3293, 18.0686)
  );

  // Add more Asian cities
  cities.push(
    generateCity("Hong Kong", "China", 22.3193, 114.1694),
    generateCity("Shanghai", "China", 31.2304, 121.4737),
    generateCity("Taipei", "Taiwan", 25.033, 121.5654),
    generateCity("Ho Chi Minh City", "Vietnam", 10.8231, 106.6297),
    generateCity("Kuala Lumpur", "Malaysia", 3.139, 101.6869)
  );

  // Add more African cities
  cities.push(
    generateCity("Nairobi", "Kenya", -1.2921, 36.8219),
    generateCity("Cape Town", "South Africa", -33.9249, 18.4241),
    generateCity("Accra", "Ghana", 5.6037, -0.187),
    generateCity("Addis Ababa", "Ethiopia", 9.032, 38.7492),
    generateCity("Casablanca", "Morocco", 33.5731, -7.5898)
  );

  // Add more cities from other continents as needed...

  return cities;
};

export const worldCities = generateWorldCities();
