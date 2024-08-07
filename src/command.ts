import { Class, Mediator } from './mediator'

export abstract class ICommand {}

export interface ICommandHandler<
  TCommand extends ICommand = never,
  TResponse = never,
> {
  execute(command: TCommand): TResponse
}

export class CommandMediator extends Mediator {
  constructor() {
    super()
  }

  register<T>(
    command: Class<ICommand>,
    handler: ICommandHandler<ICommand, T>,
  ): void {
    this.handlers.set(command.name, handler.execute)
  }

  async send<T = never>(command: ICommand): Promise<T> {
    const handler = this.handlers.get(command.constructor.name)

    if (!handler) {
      throw new Error(`Cant found handler for command: ${command}`)
    }

    return handler(command)
  }
}
