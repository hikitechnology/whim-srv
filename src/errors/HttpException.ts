export default class HttpException extends Error {
  constructor(
    public readonly code: number,
    message?: string | Error,
  ) {
    super(typeof message === "string" ? message : message?.message);
    this.name = `HttpException${message instanceof Error ? `: ${message.name}` : ""}`;
    Error.captureStackTrace(this, HttpException);
  }
}
