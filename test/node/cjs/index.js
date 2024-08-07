if ('Bun' in globalThis) {
  throw new Error('❌ Use Node.js to run this test!')
}

const { cqrs } = require('elysia-cqrs')

if (typeof cqrs !== 'function') {
  throw new TypeError('❌ CommonJS Node.js failed')
}

console.log('✅ CommonJS Node.js works!')
