const API_URL_USERS = 'https://66c64ecc134eb8f4349754a0.mockapi.io/city/users';

export async function getUsers() {
    try {
        const response = await fetch(API_URL_USERS);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const users = await response.json();
        return users;
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}

const API_URL_CITIES = 'https://66c64ecc134eb8f4349754a0.mockapi.io/city/cities';
export async function getCity() {
    try {
        const response = await fetch(API_URL_CITIES);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const cities = await response.json();
        return cities;
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}


export async function editCity(cityId, updatedData) {
    try {
        const response = await fetch(`${API_URL_CITIES}/${cityId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedData)
        });

        if (!response.ok) {
            throw new Error('Failed to update city');
        }

        return await response.json();
    } catch (error) {
        console.error('Error editing city:', error);
    }
}

export async function deleteCity(cityId) {
    try {
        const response = await fetch(`${API_URL_CITIES}/${cityId}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error('Failed to delete city');
        }
    } catch (error) {
        console.error('Error deleting city:', error);
    }
}



