module.exports = (app) => {
  app.use('/', require('./page'))
  app.use('/api', require('./admin'))
  app.use('/api', require('./classification'))
  app.use('/api', require('./article'))
  app.use('/api', require('./comment'))
}