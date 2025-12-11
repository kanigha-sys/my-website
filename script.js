// CAPTCHA GENERATOR
function generateCaptcha() {
    let chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let result = "";
    for (let i = 0; i < 5; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    document.getElementById("captchaBox").innerText = result;
    return result;
}

let captchaValue = "";

// On register page load
if (window.location.pathname.includes("register.html")) {
    captchaValue = generateCaptcha();
}

// FORM SUBMISSION
const form = document.getElementById("regForm");

if (form) {
    form.addEventListener("submit", function (e) {
        e.preventDefault();

        // captcha check
        if (document.getElementById("captchaInput").value !== captchaValue) {
            alert("Captcha incorrect!");
            return;
        }

        // collect user data
        let user = {
            name: document.getElementById("fname").value + " " +
                  document.getElementById("lname").value,
            email: document.getElementById("email").value,
            mobile: document.getElementById("mobile").value,
            profession: document.getElementById("profession").value
        };

        // save to localStorage
        let users = JSON.parse(localStorage.getItem("ctfUsers") || "[]");
        users.push(user);
        localStorage.setItem("ctfUsers", JSON.stringify(users));

        alert("Registration successful!");
        window.location.href = "index.html";
    });
}

// ADMIN PAGE – DISPLAY USERS
if (window.location.pathname.includes("admin.html")) {
    let tableBody = document.querySelector("#userTable tbody");
    let users = JSON.parse(localStorage.getItem("ctfUsers") || "[]");

    users.forEach(u => {
        let row = `<tr>
            <td>${u.name}</td>
            <td>${u.email}</td>
            <td>${u.mobile}</td>
            <td>${u.profession}</td>
        </tr>`;
        tableBody.innerHTML += row;
    });
}
