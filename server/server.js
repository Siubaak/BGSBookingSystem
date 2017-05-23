let express = require('express')
let path = require('path')
let app = express()
let routes = require('./routes')
let schedule = require('./schedule')
let bodyParser = require('body-parser')

schedule.meetingReturnSchedule()

app.use(bodyParser.json())
app.use((req, res, next) => {
  console.log(`Processing ${req.method} ${req.originalUrl} ...`)
  next()
})
routes(app)

app.set('port', process.env.PORT || 3009);

app.listen(app.get('port'), (err) => {
  if (!err) {
    console.log(`Express server is listening on port ${app.get('port')} ...`)
  } else {
    console.log(err)
  }
});