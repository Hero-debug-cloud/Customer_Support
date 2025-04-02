let ioInstance;

module.exports = {
  // Initialize the socket.io instance
  init: (io) => {
    ioInstance = io;
    io.on("connection", (socket) => {
      console.log("User connected:", socket.id);

      socket.on("join", ({ sessionId, role }) => {
        socket.join(sessionId);
        console.log(`User joined session: ${sessionId}`);
      });

      socket.on("message", async ({ sessionId, sender, message }) => {
        socket.broadcast.to(sessionId).emit("receive", { sender, message });
      });

      socket.on("typing", ({sessionId, role}) => {
        socket
          .to(sessionId)
          .emit("typing", { msg: "Agent is typing...", role });
      });

      socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
      });
    });
  },

  // Get the socket.io instance
  getIO: () => {
    if (!ioInstance) {
      throw new Error("Socket.io not initialized");
    }
    return ioInstance;
  },
};
