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
