require("dotenv/config");
const path = require("path");
const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const main = require("./controllers/main");
const cors = require("./cors/cors");

const PORT = process.env.PORT || 5000;
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "views")));
app.use(cors);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

io.on("connection", (socket) => {
  main(io, socket);
});

server.listen(PORT, () => console.log(`Running on port: ${PORT}`));
