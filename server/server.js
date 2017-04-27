var express = require('express'),
    path = require('path'),
    app = express(),
    routes = require('./routes'),
    bodyParser = require('body-parser')

app.use(bodyParser.json())

app.use(express.static('client/front/dist'))
app.use(express.static('client/back/dist'))

routes(app)

app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});