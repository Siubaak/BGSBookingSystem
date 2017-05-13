var express = require('express'),
    path = require('path'),
    app = express(),
    routes = require('./routes'),
    bodyParser = require('body-parser')

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