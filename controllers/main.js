function main(io, socket) {
  const {
    getRun,
    setRun,
    defaultProfile,
    getProfile,
    writeProfile,
    removeProfile,
  } = require("../models/main");

  const naira = process.env.NAIRA;
  const loop = 1000;
  const time = parseInt(process.env.TIMER);
  let duration = time;
  let counter;
  let currentProfile = null;
  clearBuffer();

  //============= ONLINE ====================
  let count = io.sockets.server.engine.clientsCount;
  io.emit("online", { count: parseInt(count), naira });
  if (currentProfile !== null) socket.emit("profile", currentProfile);
  else {
    defaultProfile().then((data) => {
      socket.emit("profile", data);
    });
  }

  getRun().then(async (result) => {
    if (!result) {
      await setRun();
      startLive();
    }
  });

  //============= ADD =====================
  socket.on("add", async (data) => {
    clearBuffer();
    writeProfile(data).then((result) => {
      if (result === null) {
        socket.emit("add", "Congrats, your profile is added, you are up next!");
      } else if (result > -1) {
        socket.emit(
          "add",
          `Success, profile is added to queue: position ${result + 1}`
        );
      } else {
        socket.emit("add", "Profile added successfully!");
      }
    });
  });

  function clearBuffer() {
    socket.sendBuffer = [];
  }

  //============= DISCONNECT =================
  socket.on("disconnect", () => {
    let count = io.sockets.server.engine.clientsCount;
    io.emit("online", { count: parseInt(count), naira });
  });

  //============= TIMER ====================

  function startLive() {
    counter = setInterval(async () => {
      if (duration > 0) {
        clearBuffer();
        await io.volatile.emit("timer", --duration);

        if (duration <= 0) {
          await getProfile().then(async (profile) => {
            duration = time;
            clearInterval(counter);

            currentProfile = profile;
            await removeProfile(profile);
            io.emit("profile", currentProfile);
            startLive();
          });
        }
      }
    }, loop);
  }
}

module.exports = main;
