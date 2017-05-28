let jwt = require('jsonwebtoken')
module.exports = (user) => {
  let expiry = new Date()
  expiry.setDate(expiry.getDate() + 7)
  return jwt.sign(
    {
      id: user._id,
      isAuth: user.isAuth,
      isMain: user.isMain,
      exp: parseInt(expiry.getTime()/1000)
    },
    process.env.JWT_SECRET
  )
}