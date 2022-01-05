async function register(fastify, options){
  var DeviceDetector = require('device-detector-js')
    fastify.post('/', async function(request, reply) {
      const deviceDetector = new DeviceDetector()
      const device = deviceDetector.parse(request.headers['user-agent'])
      if(request.body.dl > 0){
        better_than = 99;
      }else{
        better_than = 1;
      }
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