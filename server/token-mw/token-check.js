let jwt = require('jsonwebtoken')
let { Admins } = require('../lib/mongo.js')
module.exports = async (req, res, next) => {
  if (req.headers['authorization']) {
    let token = req.headers['authorization'].split(' ')[1]
    let decoded = jwt.decode(token, process.env.JWT_SECRET)
    let admin = await Admins.findOne({ _id: decoded.id }).exec()
    if (token && admin && decoded.exp <= Date.now()/1000) {
      res.send({ msg: '授权已过期，请重新登陆' })
    }
  }
  next()
}