export function dataclass<T extends object>() {
  return class {
    [x: string]: any;

    constructor(data: T) {
      Object.assign(this, data);
      Object.freeze(this);
    }

    copy(update: Partial<T>): this {
      return new (this.constructor as any)({ ...this, ...update });
    }

    toObject(): T {
      return { ...this } as T;
    }
  };
}
