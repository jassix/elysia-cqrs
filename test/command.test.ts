import { describe, expect, it } from 'bun:test'
import { CommandMediator, ICommand, ICommandHandler } from '../src'

class CreateUserCommand extends ICommand {
  constructor(public name: string) {
    super()
  }
}

class CreateUserHandler implements ICommandHandler<CreateUserCommand, string> {
  execute(command: CreateUserCommand): string {
    return `User created "${command.name}"`
  }
}

describe('register `CommandMediator` without Elysia', () => {
  const mediator = new CommandMediator()

  mediator.register(CreateUserCommand, new CreateUserHandler())

  it('should send data to mediator', async () => {
    const command = new CreateUserCommand('Alex')
    const mediatorResponse = await mediator.send<string>(command)

    expect(mediatorResponse).toBe(new CreateUserHandler().execute(command))
  })
})
