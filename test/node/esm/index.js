import { cqrs } from 'elysia-cqrs'

if ('Bun' in globalThis) {
  throw new Error('❌ Use Node.js to run this test!')
}

if (typeof cqrs !== 'function') {
  throw new TypeError('❌ ESM Node.js failed')
}

console.log('✅ ESM Node.js works!')
