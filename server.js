// Require the framework and instantiate it
require('dotenv').config()
const fastify = require('fastify')({ logger: false, trustProxy: true })
const autoload = require('fastify-autoload')
const path = require('path')

fastify.register(require('fastify-formbody'))
fastify.register(require('fastify-mysql'), {
  connectionString: `mysql://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_DATABASE}`
})
fastify.register(require('fastify-rate-limit'))
fastify.register(autoload, {
  dir: path.join(__dirname, 'routes')
})
fastify.register(require('fastify-cors'), { 
  // put your options here
  origin: '*'
})
fastify.register(require('fastify-rate-limit'), {
  max: Number.parseInt(process.env.RATELIMIT_Global_Max),
  ban: Number.parseInt(process.env.RATELIMIT_Global_Ban),
  timeWindow: '1 minute'
})

//custom error handler for fastify-rate-limit
fastify.setErrorHandler(function (error, request, reply) {
  if (reply.statusCode === 429) {
    error.message = 'You hit the rate limit! Slow down please!'
  }
  reply.send(error)
})

// Run the server!
const app_usePORT = process.env.PORT || 3001;
const start = async () => {
  try {
    await fastify.listen(app_usePORT)
    var datetime = new Date();
    console.log("[" + datetime.toISOString().
    replace(/T/, ' ').replace(/\..+/, '') 
    + " ("+ Intl.DateTimeFormat().resolvedOptions().timeZone 
    + ")] — Hello, I'm online and ready to work! My port is " + app_usePORT)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()
