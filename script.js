const KEY = 'e3a169d625db34eb4de9076f40944369';

// DOM elements
const searchSection = document.getElementById('search-section');
const searchForm = document.getElementById('search-form');
const cityInput = document.getElementById('city-input');
const resultSection = document.getElementById('result-section');
const backToSearchButton = document.getElementById('back-to-search-button');
const cityList = document.getElementById('result-list');
const weatherSection = document.getElementById('weather-section');
const backToResultButton = document.getElementById('back-to-result-button');
const showMetricButton = document.getElementById('show-metric-button');
const citySpan = document.getElementById('city');
const conditions = document.getElementById('conditions');
const temperature = document.getElementById('temperature');
const feelsLike = document.getElementById('feels-like');
const pressure = document.getElementById('pressure');
const humidity = document.getElementById('humidity');
const visibility = document.getElementById('visibility');
const wind = document.getElementById('wind');
const precipitation = document.getElementById('precipitation');

let metric = false; // For switching between imperial and metric units
let cities = [];
let weather = null;

// Get a list of cities from the user's query
const getCities = async (name) => {
  const url = `https://api.openweathermap.org/geo/1.0/direct?q=${name}&limit=5&appid=${KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    if (response.ok) return data;
    throw new Error('Error fetching coordinates.');
  } catch (error) {
    alert(error);
  }
};

// Get the current weather data at the specified coordinates
const getWeather = async (lat, lon) => {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${KEY}&units=imperial`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    if (response.ok) return data;
    throw new Error('Error fetching weather.');
  } catch (error) {
    alert(error);
  }
};

// Populate the table with weather data
const renderWeather = () => {
  citySpan.textContent = weather.city;
  conditions.textContent = weather.conditions;
  temperature.textContent = metric
    ? `${Math.round((5 * (weather.temperature - 32)) / 9)}\u2103`
    : `${Math.round(weather.temperature)}\u2109`;
  feelsLike.textContent = metric
    ? `${Math.round((5 * (weather.feelsLike - 32)) / 9)}\u2103`
    : `${Math.round(weather.feelsLike)}\u2109`;
  pressure.textContent = `${weather.pressure} hPa`;
  humidity.textContent = `${weather.humidity}%`;
  visibility.textContent = `${weather.visibility}${
    weather.visibility === 'Max' ? '' : ' m'
  }`;
  wind.textContent = metric
    ? `${Math.round(weather.wind / 2.237)} m/s`
    : `${Math.round(weather.wind)} mi/h`;
  precipitation.textContent = `${weather.precipitation}${
    weather.precipitation === 'None' ? '' : ' mm/h'
  }`;
};

// Display the list of city results after searching
const renderCities = () => {
  if (!cities.length) {
    cityList.innerHTML = '<i>No results</i>';
    return;
  }

  cityList.innerHTML = '';
  let listItems = '';
  cities.forEach((city) => {
    const citySpan = document.createElement('span');
    citySpan.textContent = city.city;
    const getWeatherButton = document.createElement('button');
    getWeatherButton.classList.add('end-button');
    getWeatherButton.addEventListener('click', async () => {
      const weatherData = await getWeather(city.lat, city.lon);
      weather = {
        city: weatherData.name,
        conditions: weatherData.weather[0].main,
        temperature: weatherData.main.temp,
        feelsLike: weatherData.main.feels_like,
        pressure: weatherData.main.pressure,
        humidity: weatherData.main.humidity,
        visibility:
          weatherData.visibility === 10000 ? 'Max' : weatherData.visibility,
        wind: weatherData.wind.speed,
        precipitation: weatherData.rain ? weatherData.rain['1h'] : 'None',
      };
      renderWeather();
      resultSection.classList.add('hidden');
      weatherSection.classList.remove('hidden');
    });
    getWeatherButton.textContent = 'Get Weather';
    const listItem = document.createElement('li');
    listItem.appendChild(citySpan);
    listItem.appendChild(getWeatherButton);
    cityList.appendChild(listItem);
  });
};

showMetricButton.addEventListener('click', () => {
  metric = !metric;
  showMetricButton.textContent = metric ? 'Show Imperial' : 'Show Metric';
  renderWeather();
});

searchForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const query = cityInput.value.trim();

  console.log('QUERY', query);

  if (!query) {
    alert('Query cannot be blank.');
    return;
  }

  const cityData = await getCities(query);
  console.log('CITY DATA', cityData);
  cities = cityData.map((c) => ({
    city: `${c.name}${c.state ? `, ${c.state}` : ''}`,
    lat: c.lat,
    lon: c.lon,
  }));

  cityInput.value = '';
  renderCities();
  searchSection.classList.add('hidden');
  resultSection.classList.remove('hidden');
});

// Go back to search page from results page
backToSearchButton.addEventListener('click', () => {
  resultSection.classList.add('hidden');
  searchSection.classList.remove('hidden');
});

// Go back to results page from weather page
backToResultButton.addEventListener('click', () => {
  weatherSection.classList.add('hidden');
  resultSection.classList.remove('hidden');
});
