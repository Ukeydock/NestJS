export class CommonResponseDto {
  constructor(
    private message: string,
    private data?: object | object[],
    private isAlert?: boolean,
  ) {
    this.message = message;
    this.data = data ?? {};
    this.isAlert = isAlert ?? false;
  }
}
