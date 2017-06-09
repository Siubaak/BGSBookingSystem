let nodemailer = require('nodemailer')
let conf = require('../conf')
let transporter = nodemailer.createTransport({
  host: conf.mailHost,
  port: conf.mailPort,
  secureConnection: true,
  auth: {
    user: conf.mailUser,
    pass: conf.mailPass
  }
})

module.exports = (subject, content) => {
  let options = {
    from: conf.mailUser,
    to: conf.mailTo,
    subject: subject,
    html: content
  }
  transporter.sendMail(options, function (err, info) {
    if (!err) {
      console.log(info.response)
    } else {
      console.error(err)
    }
  })
}
