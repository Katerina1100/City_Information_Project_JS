import { getCity, editCity, deleteCity } from './api.js';

document.addEventListener('DOMContentLoaded', () => {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (loggedInUser) {
        document.getElementById('welcomeMessage').textContent = `Welcome, ${loggedInUser.firstName}!`;
    } else {
        window.location.href = 'index.html';  
    }

    document.getElementById('logoutButton').addEventListener('click', () => {
        localStorage.removeItem('loggedInUser');
        sessionStorage.clear();
        window.location.href = 'index.html';  
    });

   
    loadCities();
});

document.getElementById('addCityButton').addEventListener('click', () => {
    const addCityModal = new bootstrap.Modal(document.getElementById('addCityModal'));
    addCityModal.show();
});

document.getElementById('addCityForm').addEventListener('submit', async (e) => {
    e.preventDefault(); 

    
    const cityName = document.getElementById('cityName').value;
    const countryName = document.getElementById('countryName').value;
    const timeZone = document.getElementById('timeZone').value;
    const description = document.getElementById('description').value;
    const zipCode = document.getElementById('zipCode').value;
    const image = document.getElementById('image').value;

    
    if (!cityName || !countryName || !timeZone || !description || !zipCode || !image) {
        alert('Please fill all the fields');
        return;
    }

  
    const newCity = {
        cityName,
        countryName,
        timeZone,
        description,
        zipCode,
        image
    };

    try {
       
        const response = await fetch('https://66c64ecc134eb8f4349754a0.mockapi.io/city/cities', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newCity)
        });

        if (!response.ok) {
            throw new Error('Failed to add city');
        }
     
        const successMessage = document.getElementById('addCitySuccessMessage');
        successMessage.style.display = 'block';

        setTimeout(() => {
            successMessage.style.display = 'none';
        }, 3000);

        const addCityModal = bootstrap.Modal.getInstance(document.getElementById('addCityModal'));
        addCityModal.hide();  
        document.getElementById('addCityForm').reset();  

        loadCities();

    } catch (error) {
        console.error('Error adding city:', error);
        alert('There was an error adding the city. Please try again.');
    }
});

async function loadCities() {
    const cityList = document.getElementById("cityList");
    cityList.innerHTML = '';  

    const cities = await getCity();  
    for (const city of cities) {
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
    }
}


document.addEventListener('click', async (e) => {
    if (e.target && e.target.matches('.view-details')) {
        const cityId = e.target.dataset.cityId;
        const cities = await getCity();
        const city = cities.find(city => city.id === cityId);
        showCityDetails(city);
    }
});

function showCityDetails(city) {
    document.getElementById('editCityId').value = city.id;
    document.getElementById('editCityName').value = city.cityName;
    document.getElementById('editCountryName').value = city.countryName;
    document.getElementById('editTimeZone').value = city.timeZone;
    document.getElementById('editDescription').value = city.description;
    document.getElementById('editZipCode').value = city.zipCode;
    document.getElementById('editImage').value = city.image;
}

document.getElementById('editCityForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const cityId = document.getElementById('editCityId').value;
    const updatedData = {
        cityName: document.getElementById('editCityName').value,
        countryName: document.getElementById('editCountryName').value,
        timeZone: document.getElementById('editTimeZone').value,
        description: document.getElementById('editDescription').value,
        zipCode: document.getElementById('editZipCode').value,
        image: document.getElementById('editImage').value
    };

    try {
        await editCity(cityId, updatedData);
        const editCityModal = bootstrap.Modal.getInstance(document.getElementById('cityDetailsModal'));
        editCityModal.hide();
        loadCities();  
    } catch (error) {
        console.error('Error editing city:', error);
    }
});


document.getElementById('deleteCityButton').addEventListener('click', async () => {
    const cityId = document.getElementById('editCityId').value;
    try {
        await deleteCity(cityId);
        const editCityModal = bootstrap.Modal.getInstance(document.getElementById('cityDetailsModal'));
        editCityModal.hide();
        loadCities();  
    } catch (error) {
        console.error('Error deleting city:', error);
    }
});


