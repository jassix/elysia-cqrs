import { describe, expect, it } from 'bun:test'
import { Elysia, t } from 'elysia'
import {
  cqrs,
  ICommand,
  ICommandHandler,
  IEvent,
  IEventHandler,
  IQuery,
  IQueryHandler,
} from '../src'

// Command

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

// Query

class ReceiveUserQuery extends IQuery {
  constructor(public name: string) {
    super()
  }
}

class ReceiveUserHandler implements IQueryHandler<ReceiveUserQuery, string> {
  execute(query: ReceiveUserQuery): string {
    return `Found user with name "${query.name}"`
  }
}

// Event

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

// Elysia App

const app = new Elysia()
  .use(
    cqrs({
      commands: [[CreateUserCommand, new CreateUserHandler()]],
      events: [[UserRegisteredEvent, new UserRegisteredHandler()]],
      queries: [[ReceiveUserQuery, new ReceiveUserHandler()]],
    }),
  )
  .get(
    '/user/:name',
    ({ params: { name }, queryMediator }) => {
      return queryMediator.send(new ReceiveUserQuery(name))
    },
    {
      params: t.Object({
        name: t.String(),
      }),
    },
  )
  .post(
    '/user',
    ({ body: { name }, query, commandMediator, eventMediator }) => {
      if (query.event) {
        eventMediator.send(new UserRegisteredEvent(name))
      }

      return commandMediator.send(new CreateUserCommand(name))
    },
    {
      body: t.Object({
        name: t.String(),
      }),

      query: t.Object({
        event: t.Boolean({ default: false }),
      }),
    },
  )
  .listen(8080)

// Base request

const sendRequest = (url: string, method = 'get', body?: string) =>
  new Request('http://localhost:5000'.concat(url), {
    headers: { 'Content-Type': 'application/json' },
    method,
    body,
  })

// Tests

describe('elysia test with cqrs module', () => {
  it('should send GET /user/:name and receive identical result', async () => {
    const name = 'alex'

    const res = await app
      .handle(sendRequest(`/user/${name}`))
      .then((r) => r.text())

    expect(res).toBe(
      new ReceiveUserHandler().execute(new ReceiveUserQuery(name)),
    )
  })

  it('should send POST /user and receive identical result', async () => {
    const command = new CreateUserCommand('alex')

    const res = await app
      .handle(sendRequest(`/user`, 'post', JSON.stringify(command)))
      .then((r) => r.text())

    expect(res).toBe(new CreateUserHandler().execute(command))
  })

  it('should send POST /user?event=true and receive identical result', async () => {
    const command = new CreateUserCommand('alex')

    await app
      .handle(sendRequest(`/user?event=true`, 'post', JSON.stringify(command)))
      .then((r) => r.text())

    expect(messageBuffer.length).toBe(1)
  })
})
