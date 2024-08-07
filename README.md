# elysia-cqrs
Plugin for [Elysia](https://github.com/elysiajs/elysia) for using [CQRS pattern](https://en.wikipedia.org/wiki/Command_Query_Responsibility_Segregation).

CQRS Plugin for Elysia is a lightweight extension that implements the Command Query Responsibility Segregation pattern into your Elysia-based application. This plugin allows you to effectively separate read and write operations, providing better scalability, maintainability, and testability of your code.

## Installation
```bash
bun add elysia-cqrs
```

## Example

```typescript
// commands/create-user/command.ts (example)
import { ICommand } from 'elysia-cqrs'

class CreateUserCommand extends ICommand {
  constructor(public name: string) {
    super()
  }
}

// commands/create-user/handler.ts (example)
import { ICommandHandler } from 'elysia-cqrs'
import { CreateUserCommand } from './command.ts'

class CreateUserHandler implements ICommandHandler<CreateUserCommand, string> {
  execute(command: CreateUserCommand) {
    return `New user with name ${command.name} was created!`
  }
}

// index.ts (example)
import { Elysia } from 'elysia'
import { cqrs } from 'elysia-cqrs'
import { CreateUserCommand, CreateUserHandler } from '@/commands/create-user'

const app = new Elysia()
  .use(cqrs({
    commands: [
      [CreateUserCommand, new CreateUserHandler()]
    ]
  }))
  .post('/user', ({ body: { name }, commandMediator }) => {
    return commandMediator.send(new CreateUserCommand(name))
  }, {
    body: t.Object({
      name: t.String(),
    })
  })
  .listen(5000)
```

## API
This plugin decorates `commandMediator`, `eventMediator`, `queryMediator` into `Context`.

### commandMediator
The `commandMediator` implements the `CommandMediator` class with these methods and properties:

```typescript
class CommandMediator extends Mediator {
  register<T>(
    command: Class<ICommand>,
    handler: ICommandHandler<ICommand, T>,
  ): void

  async send<T = never>(command: ICommand): Promise<T>
}
```
###### * this is just a sample, not real code.

***

### eventMediator
The `eventMediator` implements the `EventMediator` class with these methods and properties:

```typescript
class EventMediator extends Mediator {
  register(event: Class<IEvent>, handler: IEventHandler<IEvent>): void
  send(event: IEvent): void
}
```
###### * this is just a sample, not real code.

***

### queryMediator
The `queryMediator` implements the `QueryMediator` class with these methods and properties:

```typescript
class QueryMediator extends Mediator {
  register<T>(
    query: Class<IQuery>,
    handler: IQueryHandler<IQuery, T>
  ): void

  async send<T = never>(query: IQuery): Promise<T>
}
```
###### * this is just a sample, not real code.

***

### Base Classes
The library features foundational abstract classes like `ICommand`, `IEvent`, and `IQuery`. These are essential for ensuring standardization and polymorphism.

***

### Handler interfaces
The module additionally offers a range of handler interfaces, drawing inspiration from the @nestsjs/cqrs package.

```typescript
interface ICommandHandler<
  TCommand extends ICommand = never,
  TResponse = never,
> {
  execute(command: TCommand): TResponse
}

interface IEventHandler<TEvent extends IEvent = never> {
  handle(event: TEvent): void
}

interface IQueryHandler<
  TQuery extends IQuery = never,
  TResponse = never,
> {
  execute(query: TQuery): TResponse
}
```

## Config
Below is the configurable property for customizing the CQRS plugin.

```typescript
interface CqrsPluginParams {
  commands?: Array<[Class<ICommand>, ICommandHandler<ICommand, any>]>
  events?: Array<[Class<IEvent>, IEventHandler]>
  queries?: Array<[Class<IQuery>, IQueryHandler<IQuery, any>]>
}
```