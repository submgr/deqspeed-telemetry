async function register(fastify, options){
  var DeviceDetector = require('device-detector-js')
    fastify.post('/register', {
      config: {
        rateLimit: {
          global: false, max: Number.parseInt(process.env.RATELIMIT_Register),
          timeWindow: '1 minute'
        }
      }
    }, async function(request, reply) {
      const deviceDetector = new DeviceDetector()
      const device = deviceDetector.parse(request.headers['user-agent'])
      if(request.body.dl > 0){
        better_than = 99;
      }else{
        better_than = 1;
      }

      //ping - betterThan
      better_than_ping = Math.round(120 - request.body.ping/2)
      if(better_than_ping < 1){
        better_than_ping = 1;
      }else if(better_than_ping > 99){
        better_than_ping = 99;
      }

      //jitter - betterThan
      better_than_jitter = Math.round(130 - request.body.jitter*2)
      if(better_than_jitter < 1){
        better_than_jitter = 1;
      }else if(better_than_jitter > 99){
        better_than_jitter = 99;
      }

      //DOWNlink - betterThan
      better_than_dl = Math.round(100 - (102 - request.body.dl))
      if(better_than_dl < 1){
        better_than_dl = 1;
      }else if(better_than_dl > 99){
        better_than_dl = 99;
      }

      //UPlink - betterThan
      better_than_ul = Math.round(100 - (82 - request.body.ul))
      if(better_than_ul < 1){
        better_than_ul = 1;
      }else if(better_than_ul > 99){
        better_than_ul = 99;
      }

      better_than = (better_than_ping + better_than_jitter + better_than_dl + better_than_ul)/4

      fastify.mysql.query(
          'INSERT INTO `app_deqspeed`.`telemetry` (`id`, `dl`, `ul`, `ping`, `jitter`, `better_than`, `provider`, `city`, `region`, `country`, `ip`, `hostname`, `os_name`, `os_version`, `device_type`, `device_model`, `device_brand`, `date`) VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, now())', 
          [request.body.dl, request.body.ul, request.body.ping, request.body.jitter, better_than, request.body.provider, request.body.city, request.body.region, request.body.country, request.body.ip, request.body.hostname, device.os.name, device.os.version, device.device.type, device.os.model, device.os.brand],
          function onResult (err, result) {
            reply.send(err || result)
          }
        )
    })
}

module.exports = register