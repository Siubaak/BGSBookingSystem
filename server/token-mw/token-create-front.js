let jwt = require('jsonwebtoken')
let conf = require('../conf')

module.exports = (user) => {
  let expiry = new Date()
  expiry.setDate(expiry.getDate() + conf.userExpiry)
  return jwt.sign(
    {
      id: user._id,
      isAuth: user.isAuth,
      isMain: user.isMain,
      exp: parseInt(expiry.getTime()/1000)
    },
    conf.jwtSecret
  )
}