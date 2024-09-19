const email = document.getElementById("email");
const pass = document.getElementById("password");
const loginError = document.getElementById("loginError");
const showPasswordCheckbox = document.getElementById("showPassword");
const emailError = document.getElementById("emailErrorMessage");

showPasswordCheckbox.addEventListener("change", () => {
    pass.type = showPasswordCheckbox.checked ? "text" : "password";
});

function validateEmailRegex(email) {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
}

email.addEventListener("change", (event) => {
    if (validateEmailRegex(event.target.value))
        emailError.style.display = "none";
    else
        emailError.style.display = "block";
});

document.getElementById("loginForm").addEventListener("submit", (event) => {
    event.preventDefault();

    fetch('http://127.0.0.1:3000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: email.value.toLowerCase(),
            password: pass.value
        }),
    })
    .then(response => response.json())
    .then(result => {
        if (result.error) {
            loginError.innerText = result.error;
            loginError.style.display = "block";
        } else {
            console.log(result);
            localStorage.setItem('userDataObj', JSON.stringify(result.user));
            localStorage.setItem('jwtToken', result.token);  // Store JWT token in localStorage
            window.location = 'dashboard.html';
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
});
