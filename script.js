// STARFIELD — creates 300 white dots
const starContainer = document.getElementById("starfield");

for (let i = 0; i < 300; i++) {
    let star = document.createElement("div");
    star.classList.add("star");
    star.style.position = "absolute";
    star.style.width = "2px";
    star.style.height = "2px";
    star.style.background = "white";
    star.style.opacity = Math.random();
    star.style.top = Math.random() * 100 + "%";
    star.style.left = Math.random() * 100 + "%";
    starContainer.appendChild(star);
}

// FORM SUBMISSION (stores data locally)
if (document.getElementById("registerForm")) {
    document.getElementById("registerForm").addEventListener("submit", function(e) {
        e.preventDefault();

        let name = document.getElementById("fname").value;
        let stored = JSON.parse(localStorage.getItem("participants") || "[]");

        stored.push(name);
        localStorage.setItem("participants", JSON.stringify(stored));

        alert("Registration Successful!");
        window.location.href = "index.html";
    });
}
