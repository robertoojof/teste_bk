export class ApiError extends Error {
  readonly status: number;
  readonly messages: string[];

  constructor(status: number, messages: string[]) {
    super(messages.join('\n'));
    this.name = 'ApiError';
    this.status = status;
    this.messages = messages;
  }
}
