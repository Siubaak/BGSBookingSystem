let jwt = require('jsonwebtoken')
let { Admins } = require('../lib/mongo.js')
module.exports = async (req, res, next) => {
  if (req.headers['authorization']) {
    let token = req.headers['authorization'].split(' ')[1]
    let decoded = jwt.decode(token, process.env.JWT_SECRET)
    let admin = await Admins.findOne({ _id: decoded.id }).exec()
    if (!admin) {
      res.status(299).send({ code: 'auth:admin_not_found', msg: '管理员不存在，已被删除' })
    } else if (decoded.exp <= Date.now()/1000) {
      res.status(299).send({ code: 'auth:auth_expire', msg: '授权已过期，请重新登录' })
    } else {
      next()
    }
  } else {
    res.status(299).send({ code: 'auth:no_auth', msg: '请登录' })
  }
}