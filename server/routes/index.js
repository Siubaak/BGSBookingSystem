let express = require('express')
let path = require('path')

module.exports = (app) => {
  app.use('/static', express.static('assets/front_ma/dist/static'))
  app.use('/static', express.static('assets/front_me/dist/static'))
  app.use('/static', express.static('assets/back/dist/static'))
  app.use(express.static('assets/favicon'))
  app.use('/', require('./asset'))
  app.use('/api', require('./front'))
  app.use('/api', require('./back'))
}