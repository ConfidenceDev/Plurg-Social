function main(io, socket) {
  const { getProfile, writeProfile, removeProfile } = require("../models/main");

  const naira = process.env.NAIRA;
  const loop = 1000;
  const time = 60;
  let duration = time;
  let counter;
  clearBuffer();

  //============= ONLINE ====================
  let count = io.sockets.server.engine.clientsCount;
  io.emit("online", count);
  io.emit("naira", {
    naira: naira,
  });

  getProfile().then(async (result) => {
    if (result) {
      socket.emit("profile", result);
    }
  });

  //============= ADD =====================
  socket.on("add", async (data) => {
    clearBuffer();
    writeProfile(data)
      .then(() => {
        socket.emit("add", true);
      })
      .catch(() => {
        socket.emit("add", false);
      });
  });

  //============= TIMER ====================

  function startLive() {
    counter = setInterval(async () => {
      if (duration > 0) {
        clearBuffer();
        await io.volatile.emit("timer", --duration);

        if (duration <= 0) {
          getProfile().then(async (result) => {
            const profile = result;
            await removeProfile();
            duration = time;
            clearInterval(counter);
            io.emit("profile", profile);
          });
        }
      }
    }, loop);
  }

  function clearBuffer() {
    socket.sendBuffer = [];
  }

  //============= DISCONNECT =================
  socket.on("disconnect", () => {
    let count = io.sockets.server.engine.clientsCount;
    io.emit("online", count);
  });
}

module.exports = main;
