let express = require('express')
let path = require('path')
let app = express()
let routes = require('./routes')
let schedule = require('./schedule')
let bodyParser = require('body-parser')
let conf = require('./conf')

schedule()

app.use(bodyParser.json())
app.use((req, res, next) => {
  console.log(`Processing ${req.method} ${req.originalUrl} ...`)
  next()
})

routes(app)

app.listen(conf.serverPort, (err) => {
  if (!err) {
    console.log(`Express server is listening on port ${conf.serverPort} ...`)
  } else {
    console.log(err)
  }
})