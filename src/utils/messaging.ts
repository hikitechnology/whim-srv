import type { Socket } from "socket.io";
import { TYPING_TIMEOUT_MS } from "../constants";

const typingTimeouts: {
  sender: string;
  receiver: string;
  timeout: NodeJS.Timeout;
}[] = [];

export const setTypingTimeout = (
  socket: Socket,
  sender: string,
  receiver: string,
) => {
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
