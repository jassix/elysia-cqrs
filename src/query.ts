import { Class, Mediator } from './mediator'

export abstract class IQuery {}

export interface IQueryHandler<
  TQuery extends IQuery = never,
  TResponse = never,
> {
  execute(query: TQuery): TResponse
}

export class QueryMediator extends Mediator {
  constructor() {
    super()
  }

  register<T>(query: Class<IQuery>, handler: IQueryHandler<IQuery, T>): void {
    this.handlers.set(query.name, handler.execute)
  }

  async send<T = never>(query: IQuery): Promise<T> {
    const handler = this.handlers.get(query.constructor.name)

    if (!handler) {
      throw new Error(`Cant found handler for query: ${query}`)
    }

    return handler(query)
  }
}
