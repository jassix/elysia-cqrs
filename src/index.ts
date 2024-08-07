import { Elysia } from 'elysia'
import { CommandMediator, ICommand, ICommandHandler } from './command'
import { EventMediator, IEvent, IEventHandler } from './event'
import { Class } from './mediator'
import { IQuery, IQueryHandler, QueryMediator } from './query'

export interface CqrsPluginParams {
  commands?: Array<[Class<ICommand>, ICommandHandler<ICommand, any>]>
  events?: Array<[Class<IEvent>, IEventHandler]>
  queries?: Array<[Class<IQuery>, IQueryHandler<IQuery, any>]>
}

export const cqrs = ({
  commands = [],
  events = [],
  queries = [],
}: CqrsPluginParams) => {
  const commandMediator = new CommandMediator()
  const eventMediator = new EventMediator()
  const queryMediator = new QueryMediator()

  for (const [command, handler] of commands) {
    commandMediator.register(command, handler)
  }

  for (const [event, handler] of events) {
    eventMediator.register(event, handler)
  }

  for (const [query, handler] of queries) {
    queryMediator.register(query, handler)
  }

  return new Elysia({ name: 'elysia-cqrs' }).derive({ as: 'global' }, () => ({
    commandMediator,
    eventMediator,
    queryMediator,
  }))
}

export * from './command'
export * from './event'
export * from './query'
