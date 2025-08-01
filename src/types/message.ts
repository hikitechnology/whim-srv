export type ClientMessage = {
  receiver: string;
  message: string;
  clientId?: string;
};

export type TypingEvent = {
  uid: string;
};

export type ReadEvent = {
  uid: string;
};
