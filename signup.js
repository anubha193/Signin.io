const fname = document.getElementById("fname");
const sname = document.getElementById("sname");
const email = document.getElementById("email");
const pass = document.getElementById("password");
const pass2 = document.getElementById("cpass");
const emailError = document.getElementById("emailErrorMessage");
const passError = document.getElementById("passError");
const pass2Error = document.getElementById("pass2Error");
const showPasswordCheckbox = document.getElementById("showPassword");
const submitCheckBox = document.getElementById("checkOrNot");
const signupError = document.getElementById("signupError");

showPasswordCheckbox.addEventListener("change", () => {
    pass.type = showPasswordCheckbox.checked ? "text" : "password";
    pass2.type = showPasswordCheckbox.checked ? "text" : "password";
});

function validateEmailRegex(email) {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
}

function validatePasswordRegex(password) {
    const regex = /^(?=.*\d)(?=.*[!@#$%^&])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    return regex.test(password);
}

email.addEventListener("change", (event) => {
    if (validateEmailRegex(event.target.value))
        emailError.style.display = "none";
    else
        emailError.style.display = "block";
});

pass.addEventListener("change", (event) => {
    if (validatePasswordRegex(event.target.value))
        passError.style.display = "none";
    else
        passError.style.display = "block";
});

pass2.addEventListener("change", (event) => {
    if (pass.value === "") {
        pass2Error.innerHTML = "Please Enter your Password First!";
        pass2Error.style.display = "block";
    } else if (pass.value !== event.target.value) {
        pass2Error.innerHTML = "Passwords do not match!";
        pass2Error.style.display = "block";
    } else {
        pass2Error.style.display = "none";
    }
});

document.getElementById("signupForm").addEventListener("submit", (event) => {
    event.preventDefault();

    if (submitCheckBox.checked && validateEmailRegex(email.value) && validatePasswordRegex(pass.value) && pass.value === pass2.value) {
        fetch('http://127.0.0.1:3000/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                fname: fname.value,
                sname: sname.value,
                email: email.value.toLowerCase(),
                password: pass.value
            }),
        })
        .then(response => response.json())
        .then(result => {
            if (result.error) {
                signupError.innerText = result.error;
                signupError.style.display = "block";
            } else {
                window.location = 'login.html';
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
});
