const express = require("express");
const http = require("http");
const socket = require("socket.io");
const path = require("path");
const ejs = require("ejs");
const { Chess } = require("chess.js");

// Create Express.js instance
const app = express();

//Creates http server and passing express.js "app" instance
const server = http.createServer(app);

// Creates a Socket.io instance, attaching it to the HTTP server
const io = socket(server);

const chess = new Chess();
let player = {};

app.set("view engine", "ejs");

// Setting up Express.js to serve static files from the public directory
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("index", { title: "Welcome to Chess Dashboard" });
});

//whenever any user connected
io.on("connection", (socket) => {
  console.log(`New connection establish`);

  if (!player.white) {
    player.white = socket.id;
    socket.emit("PlayerRole", "w");
  } else if (!player.black) {
    player.black = socket.id;
    socket.emit("PlayerRole", "b");
  } else {
    socket.emit("SpectatorRole");
  }

  socket.on("disconnect", () => {
    if (socket.id === player.white) {
      console.log(`white player disconnected`);
      delete player.white;
    } else if (socket.id === player.black) {
      console.log(`Black player disconnected`);
      delete player.black;
    }
  });

  socket.on("move", (move) => {
    try {
      if (chess.turn() === "w" && socket.id !== player.white) return;
      if (chess.turn() === "b" && socket.id !== player.black) return;

      const result = chess.move(move);

      if (result) {
        currentPlayer = chess.turn();
        io.emit("move", move);
        console.log("move", move);
        io.emit("boardState", chess.fen());
      } else {
        console.log(`Invalid move : ${move}`);
        // socket.emit("InvalidMove", move);
      }
    } catch (error) {
      console.log(error);
    }
  });
});

//starting server at specific port
server.listen("3002", (req, res) => {
  console.log(`Server running on port 3002`);
});
