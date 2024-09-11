import { getCity } from './api.js';


function dropdownFilter(id, values, placeholder) {
    const dropdown = document.getElementById(id);
    dropdown.innerHTML = `<option value="">${placeholder}</option>`;
    values.forEach(value => {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = value;
        dropdown.appendChild(option);
    });
}

async function loadAndApplyFilters() {
    const cities = await getCity();

    
    const countries = [...new Set(cities.map(city => city.countryName))];
    const timeZones = [...new Set(cities.map(city => city.timeZone))];

    dropdownFilter('countryFilter', countries, 'Country Filter');
    dropdownFilter('timeZoneFilter', timeZones, 'Time Zone Filter');

    
    const savedCountry = sessionStorage.getItem('countryFilter') || '';
    const savedTimeZone = sessionStorage.getItem('timeZoneFilter') || '';
    const savedDescription = sessionStorage.getItem('descriptionSearch') || '';

    document.getElementById('countryFilter').value = savedCountry;
    document.getElementById('timeZoneFilter').value = savedTimeZone;
    document.getElementById('descriptionSearch').value = savedDescription;

    
    displayCities(cities);
}

async function displayCities(cities) {
    const countryFilter = document.getElementById('countryFilter').value;
    const timeZoneFilter = document.getElementById('timeZoneFilter').value;
    const descriptionSearch = document.getElementById('descriptionSearch').value.toLowerCase();

    const filteredCities = cities.filter(city => {
        return (countryFilter ? city.countryName === countryFilter : true) &&
               (timeZoneFilter ? city.timeZone === timeZoneFilter : true) &&
               (descriptionSearch ? city.description.toLowerCase().includes(descriptionSearch) : true);
    });

    const cityList = document.getElementById('cityList');
    cityList.innerHTML = ''; 

    filteredCities.forEach(city => {
        cityList.innerHTML += `
            <div class="card col-md-3 offset-md-1 mb-3">
                <img src="${city.image}" class="card-img-top" alt="city-img">
                <div class="card-body">
                    <h5 class="card-title">${city.cityName}</h5>
                    <h6 class="card-title mb-2">${city.countryName}</h6>
                    <p class="card-text mb-1">Time zone: ${city.timeZone}</p>
                    <p class="card-text">Zip code: ${city.zipCode}</p>
                    <p class="card-text">${city.description}</p>
                    <button class="btn btn-info view-details" data-city-id="${city.id}" data-bs-toggle="modal" data-bs-target="#cityDetailsModal">View Details</button>
                </div>
            </div>`;
    });
}

// filters
document.getElementById('countryFilter').addEventListener('change', async (e) => {
    const value = e.target.value;
    sessionStorage.setItem('countryFilter', value);
    document.getElementById('timeZoneFilter').value = ''; 
    document.getElementById('descriptionSearch').value = ''; 
    await displayCities(await getCity());
});

document.getElementById('timeZoneFilter').addEventListener('change', async (e) => {
    const value = e.target.value;
    sessionStorage.setItem('timeZoneFilter', value);
    document.getElementById('countryFilter').value = '';
    document.getElementById('descriptionSearch').value = ''; 
    await displayCities(await getCity());
});

document.getElementById('descriptionSearch').addEventListener('input', async (e) => {
    const value = e.target.value;
    sessionStorage.setItem('descriptionSearch', value);
    document.getElementById('countryFilter').value = ''; 
    document.getElementById('timeZoneFilter').value = ''; 
    await displayCities(await getCity());
});

document.addEventListener('DOMContentLoaded', loadAndApplyFilters);

async function resetFilters() {
    
    document.getElementById('countryFilter').value = '';
    document.getElementById('timeZoneFilter').value = '';
    document.getElementById('descriptionSearch').value = '';

    
    const cities = await getCity(); 
    displayCities(cities); 
}
document.getElementById('resetFiltersButton').addEventListener('click', resetFilters);


