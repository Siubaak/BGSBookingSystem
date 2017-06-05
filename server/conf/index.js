module.exports = {
  // 服务器监听端口
  serverPort: 3009,
  // JWT密钥
  jwtSecret: 'test',
  // 数据库服务器IP、端口、名称
  dbIP: '127.0.0.1',
  dbPort: '27017',
  dbName: 'bgs',
  // 用户默认密码
  userDefaultPassword: '123456',
  // 用户及管理员token过期天数
  userExpiry: 14,
  adminExpiry: 14,
  // 允许最大物资申请及会议室预约数量
  maxMaterialBook: 4,
  maxMeetingBook: 4,
  // 每天处理会议室归还时间，六个数字格式如下
  // 秒（0-59，可选） 分（0-59） 时（0-23） 日期（1-31） 月份（1-12） 星期（0-7，0或7均为星期天）
  // 其中*为任意或者所有
  scheduleTime: '0 0 23 * * *'
}