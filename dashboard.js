// dashboard.js
window.onload = function () {
    const storedData = localStorage.getItem('userDataObj');
    const dataobj = storedData ? JSON.parse(storedData) : null;
     console.log(dataobj.fname);
    if (dataobj) {
        const fname = document.getElementById("firstname");
        const sname = document.getElementById("lastname");
        const email = document.getElementById("emailID");

        fname.innerHTML = dataobj.fname;
        sname.innerHTML = dataobj.sname;
        email.innerHTML = dataobj.email;
    } else {
        console.log("Error: No user data found");
        // Optionally, redirect to login page or show a message
        window.location = 'login.html';
    }
};
const logout=document.getElementById("logout");
logout.addEventListener("click",()=>{
    window.location='login.html';
})
