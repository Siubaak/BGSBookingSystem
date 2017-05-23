let { MeetingBooks } = require('../lib/mongo')
let schedule = require("node-schedule")

module.exports = {
  meetingReturnSchedule() {
    schedule.scheduleJob('0 0 23 * * *', async () => {
      const now = new Date()
      const day = ['日', '一', '二', '三', '四', '五', '六']
      const today = `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日（周${day[now.getDay()]}）`
      await MeetingBooks.update({ date: today, condition: 'book' }, { $set: { condition: 'return' } }, { multi: true }).exec()
    })
  }
}
