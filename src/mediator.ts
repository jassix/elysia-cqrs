export type IMediatorHandler = (...args: any[]) => any

// eslint-disable-next-line @typescript-eslint/ban-types
export interface Class<T> extends Function {
  new (...args: never[]): T
}

export abstract class Mediator {
  protected handlers: Map<string, IMediatorHandler> = new Map()
}
