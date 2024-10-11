const express = require("express");
const http = require("http");
const socket = require("socket.io");
const path = require("path");
const ejs = require("ejs");
const { Chess } = require("chess.js");
const { title } = require("process");

// Create Express.js instance
const app = express();

//Creates http server and passing express.js "app" instance
const server = http.createServer(app);

// Creates a Socket.io instance, attaching it to the HTTP server
const io = socket(server);

const chess = new Chess();
let players = {};
let currentPlayer = "W";

app.set("view engine", "ejs");

// Setting up Express.js to serve static files from the public directory
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  console.log(`rendering index view`);
  res.render("index", { title: "Welcome to Chess Dashboard" });
});

//starting server at specific port
server.listen("3000", (req, res) => {
  console.log(`Server running on port 3000`);
});
