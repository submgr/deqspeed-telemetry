async function getip(fastify, options){
    const https = require('https');
      fastify.post('/getip', {
        config: {
          rateLimit: {
            global: false, max: Number.parseInt(process.env.RATELIMIT_GetIp),
            timeWindow: '1 minute'
          }
        }
      }, async function(request, reply) {
        https.get('https://ipinfo.io/176.194.212.104/json', (resp) => {
        let data = '';

        // A chunk of data has been received.
        resp.on('data', (chunk) => {
            data += chunk;
        });

        // The whole response has been received. Print out the result.
        resp.on('end', () => {
            reply.send({"processedString": "NothingHere", "rawIspInfo": JSON.parse(data)});
        });

        }).on("error", (err) => {
        console.log("Error: " + err.message);
        });

      })
  }
  
  module.exports = getip