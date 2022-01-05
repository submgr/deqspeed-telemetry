// Require the framework and instantiate it
const fastify = require('fastify')({ logger: false })
const autoload = require('fastify-autoload')
const path = require('path')
require('dotenv').config()

fastify.register(require('fastify-formbody'))
fastify.register(require('fastify-mysql'), {
  connectionString: `mysql://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_DATABASE}`
})
fastify.register(autoload, {
  dir: path.join(__dirname, 'routes')
})
fastify.register(require('fastify-cors'), { 
  // put your options here
  origin: '*'
})

// Run the server!
const start = async () => {
  try {
    await fastify.listen(3000)
    console.log("Hello, im online and ready to work!")
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()