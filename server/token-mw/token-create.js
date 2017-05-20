let jwt = require('jsonwebtoken')
module.exports = (admin) => {
  let expiry = new Date()
  expiry.setDate(expiry.getDate() + 7)
  return jwt.sign(
    {
      id: admin._id,
      exp: parseInt(expiry.getTime()/1000)
    },
    process.env.JWT_SECRET
  )
}