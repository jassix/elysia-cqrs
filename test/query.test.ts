import { describe, expect, it } from 'bun:test'
import { IQuery, IQueryHandler, QueryMediator } from '../src'

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

describe('register `EventMediator` without Elysia', () => {
  const mediator = new QueryMediator()

  mediator.register(ReceiveUserQuery, new ReceiveUserHandler())

  it('should send data to mediator', async () => {
    const query = new ReceiveUserQuery('Alex')
    const mediatorResponse = await mediator.send<string>(query)

    expect(mediatorResponse).toBe(new ReceiveUserHandler().execute(query))
  })
})
