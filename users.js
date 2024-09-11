import { getUsers } from './api.js';


const fieldNames = {
    loginEmail: 'Email',
    loginPassword: 'Password',
    firstName: 'First name',
    lastName: 'Last name',
    registerEmail: 'Email',
    registerPassword: 'Password',
    phoneNumber: 'Phone number'
};

document.addEventListener('DOMContentLoaded', () => {
    //  login form 
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;

            
            clearErrors(['loginEmailError', 'loginPasswordError']);  

            try {
                const users = await getUsers(); 

                
                if (!users || users.length === 0) {
                    showError('loginEmailError', 'No users found. Please register first.');
                    clearForm('loginForm');
                    return;
                }

                
                const existingUser = users.find(user => user.email === email);

                if (!existingUser) {
                    showError('loginEmailError', 'Invalid email. Please try again.');
                    clearForm('loginForm');
                    return;
                }

                
                if (existingUser.password !== password) {
                    showError('loginPasswordError', 'Incorrect password. Please try again.');
                    clearForm('loginForm');
                    return;
                }

                
                localStorage.setItem('loggedInUser', JSON.stringify(existingUser));
                window.location.href = 'cities.html';  

            } catch (error) {
                console.error('Error during login:', error);
                showError('loginEmailError', 'An error occurred. Please try again.');  
                clearForm('loginForm');
            }
        });
    }

    // register form
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const firstName = document.getElementById('firstName').value;
            const lastName = document.getElementById('lastName').value;
            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;
            const phone = document.getElementById('phoneNumber').value;

            clearErrors(); 
            clearSuccess(); 

            if (!validateRequiredFields(firstName, lastName, email, password, phone)) {
                showError('firstNameError', 'All fields are required.');
                return;
            }

            if (!validateEmail(email)) {
                showError('registerEmailError', 'Invalid email format.');
                return;
            }

            if (!validatePassword(password)) {
                showError('registerPasswordError', 'Password must be at least 8 characters long and include both letters and numbers.');
                return;
            }

            if (!validatePhoneNumber(phone)) {
                showError('phoneNumberError', 'Invalid phone number format.');
                return;
            }

            try {
                const response = await fetch('https://66c64ecc134eb8f4349754a0.mockapi.io/city/users', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ firstName, lastName, email, password, phone })
                });

                if (response.ok) {
                    showSuccess('Registration successful! You can now log in.');
                    clearForm('registerForm'); 
                } else {
                    showError('registerEmailError', 'Registration failed. Please try again.');
                }
            } catch (error) {
                console.error('Error during registration:', error);
                showError('registerEmailError', 'An error occurred. Please try again.');
            }
        });
    } 

    
    addBlurEventListeners([
        'loginEmail', 'loginPassword',
        'firstName', 'lastName', 'registerEmail', 'registerPassword', 'phoneNumber'
    ]);
});


function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePassword(password) {
    return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password);
}

function validateRequiredFields(...fields) {
    return fields.every(field => field.trim() !== '');
}

function validatePhoneNumber(phoneNumber) {
    return /^\d{9,15}$/.test(phoneNumber);
}

function showSuccess(message) {
    const successElement = document.getElementById('registrationSuccessMessage');
    if (successElement) {
        successElement.textContent = message;
    }
}

function clearSuccess() {
    const successElement = document.getElementById('registrationSuccessMessage');
    if (successElement) {
        successElement.textContent = '';
    }
}

function showError(elementId, message) {
    if (elementId) {
        const errorElement = document.getElementById(elementId);
        if (errorElement) {
            errorElement.textContent = message;
        }
    }
}

function clearErrors(errorElementIds = []) {
    const allErrorElementIds = [
        'firstNameError', 'lastNameError', 
        'registerEmailError', 'registerPasswordError', 
        'phoneNumberError', 'loginEmailError', 
        'loginPasswordError'
    ];
    const idsToClear = errorElementIds.length > 0 ? errorElementIds : allErrorElementIds;
    idsToClear.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = '';
        } 
    });
}

function clearForm(formId) {
    const form = document.getElementById(formId);
    if (form) {
        form.reset();
    } else {
        console.error(`Form with ID '${formId}' not found`);
    }
}
function addBlurEventListeners(fieldIds) {
    fieldIds.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('blur', () => {
                const value = element.value;
                const fieldName = fieldNames[id] || 'Field';
                if (!value) {
                    showError(`${id}Error`, `${fieldName} is required.`);
                } else if (id === 'registerEmail' && !validateEmail(value)) {
                    showError('registerEmailError', 'Invalid email format.');
                } else if (id === 'registerPassword' && !validatePassword(value)) {
                    showError('registerPasswordError', 'Password must be at least 8 characters long and include both letters and numbers.');
                } else if (id === 'phoneNumber' && !validatePhoneNumber(value)) {
                    showError('phoneNumberError', 'Invalid phone number format.');
                } else {
                    clearErrors([`${id}Error`]);
                }
            });
        }
    });
}
