let jwt = require('jsonwebtoken')
let { Users } = require('../lib/mongo.js')
module.exports = async (req, res, next) => {
  if (req.headers['authorization']) {
    let token = req.headers['authorization'].split(' ')[1]
    let decoded = jwt.decode(token, process.env.JWT_SECRET)
    let user = await Users.findOne({ _id: decoded.id }).exec()
    if (!user) {
      res.status(299).send({ code: 'data:user_not_found', msg: '用户不存在，已被后台删除' })
    } else if (!user.isAuth) {
      res.status(299).send({ code: 'auth:no_auth', msg: '未授权，若已完善部门信息，请等待后台审核授权' })
    } else if (decoded.exp <= Date.now()/1000) {
      res.status(299).send({ code: 'auth:auth_expire', msg: '授权已过期，请重新登录' })
    } else {
      next()
    }
  } else {
    res.status(299).send({ code: 'auth:no_auth', msg: '请登录' })
  }
}