let jwt = require('jsonwebtoken')
let { Users } = require('../lib/mongo.js')
module.exports = async (req, res, next) => {
  if (req.headers['authorization']) {
    let token = req.headers['authorization'].split(' ')[1]
    let decoded = jwt.decode(token, process.env.JWT_SECRET)
    let user = await Users.findOne({ _id: decoded.id }).exec()
    if (token && user && decoded.exp <= Date.now()/1000) {
      res.status(299).send({ code: 'auth:auth_expire', msg: '授权已过期，请重新登陆' })
    }
  }
  next()
}