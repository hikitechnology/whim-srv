import { getAuth } from "firebase-admin/auth";
import type { Socket } from "socket.io";

const socketAuth = async (socket: Socket, next: (err?: Error) => void) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    const err = new Error("Not authorized");
    next(err);
  }

  const auth = getAuth();
  const { uid } = await auth.verifyIdToken(token);

  socket.uid = uid;
  socket.join(socket.uid);
  next();
};

export default socketAuth;
