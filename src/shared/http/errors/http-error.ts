export class HttpError extends Error {
  constructor(
    public readonly status: number,
    public readonly message: string,
    public readonly path?: (string | number)[],
  ) {
    super(message);
    this.name = "HttpError";
  }
}
