import { KEY } from './config.js';

const searchForm = document.getElementById('search-form');
const cityInput = document.getElementById('city-input');
const resultList = document.getElementById('result-list');

let cityResults = null;

const fetchCoordinates = async (name) => {
  const url = `http://api.openweathermap.org/geo/1.0/direct?q=${name}&limit=5&appid=${KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    if (response.ok) return data;
    throw new Error('Error fetching coordinates.');
  } catch (error) {
    alert(error);
  }
};

const renderCityResults = () => {
  let listItems = '';
  cityResults.forEach((result) => {
    listItems += `
      <li>
        <span>${result.city}</span>
        <button>Get Weather</button>
      </li>
    `;
  });
  resultList.innerHTML = listItems;
};

searchForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = cityInput.value.trim();

  if (!name) {
    alert('Query cannot be blank.');
    return;
  }

  const cities = await fetchCoordinates(name);
  cityResults = cities.map((c) => ({
    city: `${c.name}${c.state ? `, ${c.state}` : ''}`,
    lat: c.lat,
    lon: c.lon,
  }));

  cityInput.value = '';
  renderCityResults();
});
