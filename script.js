async function fetchData() {
    try {
        const res = await fetch("http://127.0.0.1:5000/data");
        const data = await res.json();

        document.getElementById("zoneA").innerText =
            data.zoneA === 1 ? "Occupied" : "Vacant";

        document.getElementById("zoneB").innerText =
            data.zoneB === 1 ? "Occupied" : "Vacant";

        document.getElementById("occupancy").innerText =
            "Occupancy: " + data.occupancy + "%";

    } catch (err) {
        console.log("Waiting for Arduino...");
    }
}

setInterval(fetchData, 1000);
