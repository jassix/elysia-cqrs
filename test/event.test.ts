import { describe, expect, it } from 'bun:test'
import { EventMediator, IEvent, IEventHandler } from '../src'

const messageBuffer: string[] = []

class UserRegisteredEvent extends IEvent {
  constructor(public name: string) {
    super()
  }
}

class UserRegisteredHandler implements IEventHandler<UserRegisteredEvent> {
  handle(event: UserRegisteredEvent) {
    messageBuffer.push(`A new user registered with name "${event.name}"`)
  }
}

describe('register `EventMediator` without Elysia', () => {
  const mediator = new EventMediator()

  mediator.register(UserRegisteredEvent, new UserRegisteredHandler())

  it('should send data to mediator', async () => {
    const event = new UserRegisteredEvent('Alex')

    new UserRegisteredHandler().handle(event)
    mediator.send(event)

    expect(messageBuffer.length).toBe(2)
  })
})
