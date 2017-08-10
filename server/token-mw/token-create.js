let jwt = require('jsonwebtoken')
let conf = require('../conf')

module.exports = (admin) => {
  let expiry = new Date()
  expiry.setDate(expiry.getDate() + conf.adminExpiry)
  return jwt.sign(
    {
      id: admin._id,
      isGlobal: admin.isGlobal,
      exp: parseInt(expiry.getTime()/1000)
    },
    conf.jwtSecret
  )
}