import { Class, Mediator } from './mediator'

export abstract class IEvent {}

export interface IEventHandler<TEvent extends IEvent = never> {
  handle(event: TEvent): void
}

export class EventMediator extends Mediator {
  constructor() {
    super()
  }

  register(event: Class<IEvent>, handler: IEventHandler<IEvent>): void {
    this.handlers.set(event.name, handler.handle)
  }

  send(event: IEvent): void {
    const handler = this.handlers.get(event.constructor.name)

    if (!handler) {
      throw new Error(`Cant found handler for event: ${event}`)
    }

    return handler(event)
  }
}
