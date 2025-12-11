const loading = document.getElementById("loading");
const result = document.getElementById("result");
const title = document.getElementById("zoneTitle");
const message = document.getElementById("zoneMessage");
const bgVideo = document.getElementById("bgVideo");

const ws = new WebSocket("ws://localhost:3000");

let revealTimer = null;

function showZone (zone) {
    //if zone equals certain number show it, or else show 1
    zone = Number (zone) || 1;

    //if zone equals the number then show the context below to each zone 
    if (zone === 1) {
        title.textContent = "Zone 1: Compliance";
        message.textContent = "Your choices show trust, structure, and alignment with the System.";
        bgVideo.src = "video/Zone1.mp4";
    } else if (zone === 2) {
        title.textContent = "Zone 2: Ambiguity";
        message.textContent = "You balance obedience with curiosity. You remain unpredictable.";
        bgVideo.src = "video/Zone2.mp4";
      } else if (zone === 3) {
        title.textContent = "Zone 3: Divergence";
        message.textContent = "Your answers reflect independence and resistance to imposed order.";
        bgVideo.src = "video/Zone3.mp4";
      } else {
        title.textContent = "Zone 4: Restricted";
        message.textContent = "Your answers show extreme divergence. Surveillance recommended.";
        bgVideo.src = "video/Zone4.mp4";
      }
    
      bgVideo.load();
}

function revealResult (zone) {
    if (revealTimer) clearTimeout (revealTimer);

    loading.classList.add("hidden");
    result.classList.remove("hidden");

    showZone(zone);

}

//remember the zone 
const storedZone = parseInt(localStorage.getItem("zone")) || 1;

revealTimer = setTimeout (() => revealResult(storedZone), 3000);

//now shared the data lively that got processed
ws.onmessage = (e) => {
    const msg = JSON.parse(e.data);

    if(typeof msg.zone === "number") {
        localStorage.setItem ("zone", msg.zone);
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