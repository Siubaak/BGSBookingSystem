let schedule = require("node-schedule")
let api = require('../api')
let conf = require('../conf')

module.exports = () => {
  schedule.scheduleJob(conf.scheduleTime, async () => {
    const now = new Date()
    const day = ['日', '一', '二', '三', '四', '五', '六']
    const today = `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日（周${day[now.getDay()]}）`
    await api.updateMeetingScheduleReturn(today)
  })
}
