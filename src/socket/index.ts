import type { Socket } from "socket.io";
import type { ClientMessage, TypingEvent } from "../types/message";
import { saveMessage } from "../db/queries/messages";
import { TYPING_TIMEOUT_MS } from "../constants";

const typingTimeouts: {
  sender: string;
  receiver: string;
  timeout: NodeJS.Timeout;
}[] = [];

const setTypingTimeout = (socket: Socket, sender: string, receiver: string) => {
  const existingTimeout = typingTimeouts.findIndex(
    (item) => item.sender === sender && item.receiver === receiver,
  );
  if (existingTimeout !== -1) {
    clearTimeout(typingTimeouts[existingTimeout]!.timeout);
    typingTimeouts.splice(existingTimeout, 1);
  }

  const timeout = setTimeout(() => {
    socket.to(receiver).emit("typing-stop", { uid: sender });
  }, TYPING_TIMEOUT_MS);

  typingTimeouts.push({
    sender,
    receiver,
    timeout,
  });
};

const connectionHandler = (socket: Socket) => {
  console.log(`user connected to socket with id ${socket.uid}`);

  socket.on("message", async (message: ClientMessage) => {
    const savedMessage = await saveMessage({
      ...message,
      sender: socket.uid,
    });
    socket.to(message.receiver).emit("message", savedMessage);
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
