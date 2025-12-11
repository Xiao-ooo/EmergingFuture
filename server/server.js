//import needed modules websocket needed to have real time connection
const http = require("http");
const { WebSocketServer } = require("ws");

//creating a new websocket 
const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("WebSocket server running");
});

const wss = new WebSocketServer({ server });

wss.on("connection", (socket) => {
  console.log("Client connected");

  socket.on("message", (msg) => {
    //going through everyone and sendings updates to all other clients if socket is connected
    wss.clients.forEach((client) => {
      if (client !== socket && client.readyState === client.OPEN) {
        client.send(msg.toString());
      }
    });
  });

  //disconnect socket when no connection
  socket.on("close", () => console.log("Client disconnected"));
});

const PORT = 3000;
server.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);
