import { randomUUID } from 'node:crypto';

export abstract class Entity<T> {
  public readonly _id: string;

  public readonly props: T;

  constructor(props: T, id?: string) {
    this._id = id ?? randomUUID();
    this.props = props;
  }

  get id(): string {
    return this._id;
  }

  // convert to object
  toJSON(): Required<T> & { id: string } {
    return {
      ...this.props,
      id: this._id,
    } as Required<T> & { id: string };
  }
}
