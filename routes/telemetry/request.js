async function request(fastify, options){
    require('dotenv').config()
    fastify.get('/requestimage', {
        config: {
          rateLimit: {
            global: false, max: Number.parseInt(process.env.RATELIMIT_RequestImage),
            timeWindow: '1 minute'
          }
        }
      }, async function(request, reply) {
        var sharp = require('sharp')
        fastify.mysql.query(
            'SELECT * FROM `telemetry` WHERE id = ?', 
            [request.query.id],
            async function onResult (err, result) {
                if(result[0] != undefined){
                
                    const image_textsvg_id = `
                    <svg width="1050" height="783">
                        <style>
                        .title { fill: #FFFFFF; font-size: 40px; font-weight: regular;}
                        </style>
                        <text x="-10" y="50" font-family="Arial, sans-serif" text-anchor="end" class="title" transform="rotate(-90 50 50)">
                        Test ID: unique ${result[0].id}
                        </text>
                    </svg>
                    `
                    const image_textsvg_date = `
                    <svg width="1050" height="783">
                        <style>
                        .title { fill: #FFFFFF; font-size: 40px; font-weight: regular;}
                        </style>
                        <text x="-10" y="50" font-family="Arial" text-anchor="end" class="title" transform="rotate(-90 50 50)">
                        ${result[0].date.toISOString().
                            replace(/T/, ' ').      // replace T with a space
                            replace(/\..+/, '')}
                        </text>
                    </svg>
                    `
                    const image_textsvg_jitterValue = `
                    <svg width="930" height="130">
                        <style>
                        .title { fill: #FFFFFF; font-size: 40px; font-weight: regular;}
                        </style>
                        <text x="50%" y="50%" font-family="Arial, sans-serif" text-anchor="end" class="title">
                        ${result[0].jitter}
                        </text>
                    </svg>
                    `
                    const image_textsvg_betterthanValue = `
                    <svg width="930" height="130">
                        <style>
                        .title { fill: #FFFFFF; font-size: 40px; font-weight: regular;}
                        </style>
                        <text x="50%" y="50%" font-family="Arial, sans-serif" text-anchor="end" class="title">
                        ${result[0].better_than}
                        </text>
                    </svg>
                    `
                    const image_textsvg_pingValue = `
                    <svg width="900" height="130">
                        <style>
                        .title { fill: #000000; font-size: 90px; font-weight: bold;}
                        </style>
                        <text x="50%" y="50%" font-family="Arial" text-anchor="end" class="title">
                        ${result[0].ping}
                        </text>
                    </svg>
                    `
                    const image_textsvg_dlValue = `
                    <svg width="900" height="130">
                        <style>
                        .title { fill: #000000; font-size: 90px; font-weight: bold;}
                        </style>
                        <text x="50%" y="50%" font-family="Arial" text-anchor="end" class="title">
                        ${result[0].dl}
                        </text>
                    </svg>
                    `
                    const image_textsvg_ulValue = `
                    <svg width="900" height="130">
                        <style>
                        .title { fill: #000000; font-size: 90px; font-weight: bold;}
                        </style>
                        <text x="50%" y="50%" font-family="Arial" text-anchor="end" class="title">
                        ${result[0].ul}
                        </text>
                    </svg>
                    `
                    const image_textsvg_providerValue = `
                    <svg width="1045" height="60">
                        <style>
                        .title { fill: #FFFFFF; font-size: 32px; font-weight: bold;}
                        </style>
                        <text x="50%" y="50%" font-family="Arial" text-anchor="end" class="title">
                        ${result[0].provider}
                        </text>
                    </svg>
                    `
                    const image_textsvg_cityValue = `
                    <svg width="790" height="60">
                        <style>
                        .title { fill: #FFFFFF; font-size: 42px; font-weight: bold;}
                        </style>
                        <text x="50%" y="50%" font-family="Arial" text-anchor="start" class="title">
                        ${result[0].city}
                        </text>
                    </svg>
                    `
                    const image_textsvg_id__Buffer = Buffer.from(image_textsvg_id)
                    const image_textsvg_date__Buffer = Buffer.from(image_textsvg_date)
                    const image_textsvg_jitterValue__Buffer = Buffer.from(image_textsvg_jitterValue)
                    const image_textsvg_betterthanValue__Buffer = Buffer.from(image_textsvg_betterthanValue)
                    const image_textsvg_pingValue__Buffer = Buffer.from(image_textsvg_pingValue)
                    const image_textsvg_dlValue__Buffer = Buffer.from(image_textsvg_dlValue)
                    const image_textsvg_ulValue__Buffer = Buffer.from(image_textsvg_ulValue)
                    const image_textsvg_providerValue__Buffer = Buffer.from(image_textsvg_providerValue)
                    const image_textsvg_cityValue__Buffer = Buffer.from(image_textsvg_cityValue)

                    const image = await sharp("./resources/social_story_result.jpg")
                    .composite([
                        {
                            input: image_textsvg_id__Buffer,
                            top: 40,
                            left: 970,
                        },
                        {
                            input: image_textsvg_date__Buffer,
                            top: 40,
                            left: 1010,
                        },
                        {
                            input: image_textsvg_jitterValue__Buffer,
                            top: 329,
                            left: 293,
                        },
                        {
                            input: image_textsvg_betterthanValue__Buffer,
                            top: 249,
                            left: 44,
                        },
                        {
                            input: image_textsvg_pingValue__Buffer,
                            top: 505,
                            left: 90,
                        },
                        {
                            input: image_textsvg_dlValue__Buffer,
                            top: 731,
                            left: -12,
                        },
                        {
                            input: image_textsvg_ulValue__Buffer,
                            top: 953,
                            left: 70,
                        },
                        {
                            input: image_textsvg_providerValue__Buffer,
                            top: 1322,
                            left: 525,
                        },
                        {
                            input: image_textsvg_cityValue__Buffer,
                            top: 1429,
                            left: -220,
                        },
                    ])
                    reply.type('image/jpeg').send(image)
                }else{
                    reply.send("wrong_id")
                }
            }
          )
    })
    fastify.get('/request', {
        config: {
          rateLimit: {
            global: false, max: Number.parseInt(process.env.RATELIMIT_Request),
            timeWindow: '1 minute'
          }
        }
      }, async function(request, reply) {
        fastify.mysql.query(
            'SELECT * FROM `telemetry` WHERE id = ?', 
            [request.query.id],
            async function onResult (err, result) {
                if(result[0] != undefined){
                    reply.send({id: result[0].id, ping: result[0].ping, jitter: result[0].jitter, dl: result[0].dl, ul: result[0].ul, provider: result[0].provider, ul: result[0].city})
                }else{
                    reply.send("wrong_id")
                }
            }
          )
    })
}

module.exports = request