
HomePgVideo.src = "video/HomePageBG.mp4";

const ws = new WebSocket("wss://https://emergingfuture.onrender.com");

// When clicking Start, go to quiz page and tell server
document.getElementById("startBtn").onclick = () => {
  ws.send(JSON.stringify({ page: "quiz" }));
  window.location.href = "quiz.html";
};

// Listen for updates from other tabs and sends real time data 
ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
  
    if (msg.page === "quiz") {
      window.location.href = "quiz.html";
    }
    
    if (msg.page === "zone") {
      //the || 1 is basically like an finding if zone is not "get" then go get the last saved  which is saved as 1 to the zone html in the website, it adds the number that i put on the top "let zone" and you put it in the bottom. 
      let zone = localStorage.getItem("zone") || 1;
      window.location.href = "zone.html?zone=" + zone;
    }
    
  };
  