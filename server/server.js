let express = require('express')
let path = require('path')
let app = express()
let routes = require('./routes')
let schedule = require('./schedule')
let bodyParser = require('body-parser')
let conf = require('./conf')
let cluster = require('cluster')
let nCPUs = require('os').cpus().length

if (cluster.isMaster) {

  for (let i = 0; i < nCPUs; i++) {
    cluster.fork()
  }

  cluster.on('online', (worker) => {
    console.log(`[Worker - ${worker.process.pid}] Started.`)
  })

  cluster.on('exit', (worker, code, signal) => {
    console.log(`[Worker - ${worker.process.pid}] Died cause by ${code || signal}.`)
    console.log('Restarting ...')
    cluster.fork()
  })

  schedule()

  setTimeout(console.log, 1500, `[Master] Server is listening at port ${conf.serverPort} ...`)
  
} else {

  app.use(bodyParser.json())

  app.use(async (req, res, next) => {
    let before = new Date()
    await next()
    let duration = new Date() - before
    console.log(`[Worker - ${process.pid}] Processing ${req.method} ${req.originalUrl} ... ${duration}ms`)
  })

  routes(app)

  app.listen(conf.serverPort, (err) => {
    if (err) {
      console.log(err)
    }
  })

}
