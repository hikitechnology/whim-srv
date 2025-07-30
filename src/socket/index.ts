import type { Socket } from "socket.io";
import type { ClientMessage } from "../types/message";
import { saveMessage } from "../db/queries/messages";

const connectionHandler = (socket: Socket) => {
  console.log(`user connected to socket with id ${socket.uid}`);

  socket.on("message", async (message: ClientMessage) => {
    console.log("received message:", message);
    const savedMessage = await saveMessage({
      ...message,
      sender: socket.uid,
    });
    console.log("saved message:", savedMessage);
    socket.to(message.receiver).emit("message", savedMessage);
  });
};

export default connectionHandler;
