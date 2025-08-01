import type { Server, Socket } from "socket.io";
import type { ClientMessage, TypingEvent } from "../types/message";
import { saveMessage } from "../db/queries/messages";
import { setTypingTimeout } from "../utils/messaging";

export const connectionHandler = (io: Server) => (socket: Socket) => {
  console.log(`user connected to socket with id ${socket.uid}`);

  socket.on("message", async (sentMessage: ClientMessage) => {
    const { message, receiver, clientId } = sentMessage;
    const savedMessage = await saveMessage({
      message,
      receiver,
      sender: socket.uid,
    });

    io.to(receiver).emit("message", savedMessage);
    io.to(socket.uid).emit("delivered", {
      clientId,
      id: savedMessage.id,
      timestamp: savedMessage.timestamp,
    });
  });

  socket.on("typing-start", async ({ uid }: TypingEvent) => {
    socket.to(uid).emit("typing-start", { uid: socket.uid });
    setTypingTimeout(socket, socket.uid, uid);
  });

  socket.on("typing-stop", async ({ uid }: TypingEvent) => {
    socket.to(uid).emit("typing-stop", { uid: socket.uid });
  });
};

export default connectionHandler;
