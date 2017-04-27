var jwt = require('jsonwebtoken')
module.exports = (req, res, next) => {
  if (req.headers['authorization']) {
    var token = req.headers['authorization'].split(' ')[1],
        decoded = jwt.decode(token, process.env.JWT_SECRET)
    // 过期重新登录
    if (token && decoded.exp <= Date.now()/1000) {
      res.send({ msg: '授权已过期，请重新登陆' })
    }
  }
  next()
}