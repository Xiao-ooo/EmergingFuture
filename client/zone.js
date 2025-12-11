const loading = document.getElementById("loading");
const result = document.getElementById("result");
const title = document.getElementById("zoneTitle");
const message = document.getElementById("zoneMessage");
const bgVideo = document.getElementById("bgVideo");

const ws = new WebSocket("wss://https://emergingfuture.onrender.com");

let revealTimer = null;

function showZone(zone) {
    //if zone equals certain number show it, or else show 1
    zone = Number(zone) || 1;

    //if zone equals the number then show the context below to each zone 
    if (zone === 1) {
        title.textContent = "Zone 1 ➟ Prime Compliance";
        message.textContent =
            "Your evaluation places you among the System’s most trusted citizens. You will reside in a pristine, high-technology enclave—clean air, seamless transit, and fully automated living. Every comfort is optimized, every surface immaculate. Life here is quiet, effortless, and insulated from the instability beyond its borders.";
        bgVideo.src = "video/Zone1.mp4";

    } else if (zone === 2) {
        title.textContent = "Zone 2 ➟ Standard Citizenry";
        message.textContent =
            "Your results reflect stability, reliability, and functional alignment with the System’s expectations. Your assigned environment provides steady routines, warm daylight, orderly neighborhoods, and dependable services. Life is predictable, structured, and safe—comfort without extravagance.";
        bgVideo.src = "video/Zone2.mp4";

    } else if (zone === 3) {
        title.textContent = "Zone 3 ➟ Conditional Classification";
        message.textContent =
            "Your responses show patterns of divergence. You are placed in a monitored industrial sector where efficiency outweighs comfort. Expect dense living quarters, constant activity, visible surveillance, and strict schedules. Life here is governed by labor, compliance checks, and limited personal autonomy.";
        bgVideo.src = "video/Zone3.mp4";

    } else {
        title.textContent = "Zone 4 ➟ Restricted Designation";
        message.textContent =
            "Your evaluation signals significant deviation from systemic norms. You are assigned to a deteriorated, high-risk zone defined by failing infrastructure, unstable security, and widespread unrest. Daily life is unpredictable—scarcity, collapse, and constant vigilance shape the environment.";
        bgVideo.src = "video/Zone4.mp4";

    }

    bgVideo.load();
}

function revealResult(zone) {
    if (revealTimer) clearTimeout(revealTimer);

    loading.classList.add("hidden");
    result.classList.remove("hidden");

    showZone(zone);

}

//remember the zone 
const storedZone = parseInt(localStorage.getItem("zone")) || 1;

revealTimer = setTimeout(() => revealResult(storedZone), 3000);

//now shared the data lively that got processed
ws.onmessage = (e) => {
    const msg = JSON.parse(e.data);

    if (typeof msg.zone === "number") {
        localStorage.setItem("zone", msg.zone);
        revealResult(msg.zone);
    }

    //this lets user to live update which page to go, and directly go there
    //if the message recieved shows the location is in index, go to index, if its quiz -> quiz. This shares it to the other tab. 
    if (msg.page) {
        if (msg.page === "index") window.location.href = "index.html";

        if (msg.page === "quiz") window.location.href = "quiz.html";

        if (msg.page === "zone") {
            const shareZone = parseInt(localStorage.getItem("zone")) || 1;
            window.location.href = `zone.html?zone=${zone}`;
        }
    }
}

//when click the button shared the data and all go to that page
document.getElementById("goHome").addEventListener("click", () => {
    window.location.href = "index.html";
    ws.send(JSON.stringify({ page: "index" }));
});
