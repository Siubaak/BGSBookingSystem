let jwt = require('jsonwebtoken')
let api = require('../api')
let conf = require('../conf')

module.exports = async (req, res, next) => {
  try {
    if (req.headers['authorization']) {
      let token = req.headers['authorization'].split(' ')[1]
      let decoded = jwt.decode(token, conf.jwtSecret)
      let user = await api.getUserById(decoded.id)
      if (!user) {
        res.status(299).send({ code: 'data:user_not_found', msg: '用户不存在，已被后台删除' })
      } else if (!user.isAuth) {
        res.status(299).send({ code: 'auth:no_auth', msg: '用户未授权，已被后台销权' })
      } else if (decoded.exp <= Date.now()/1000) {
        res.status(299).send({ code: 'auth:auth_expire', msg: '授权已过期，请重新登录' })
      } else {
        next()
      }
    } else {
      res.status(299).send({ code: 'auth:no_auth', msg: '请登录' })
    }
  } catch (err) {
    console.error(err)
    res.status(500).send({ code: 'internal:unknow_error', msg: err })
  }
}