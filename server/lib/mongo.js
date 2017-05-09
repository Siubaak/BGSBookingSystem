let Mongolass = require('mongolass')
let mongolass = new Mongolass()
let moment = require('moment')
let idToTs = require('objectid-to-timestamp')
let Admins = mongolass.model('Admin', {
      account: { type: 'string' },
      password: { type: 'string' }
    })
let Users = mongolass.model('User', {
      department: { type: 'string' },
      password: { type: 'string' },
      isAuth: { type: 'boolean' },
      reName: { type: 'string' },  //部长姓名
      rePhone: { type: 'number' },  //部长电话
    })
let Materials = mongolass.model('Material', {
      name: { type: 'string' },
      unit: { type: 'string' },
      quantity: { type: 'number' },  //-1为消耗品，大于等于0为非消耗品
    })
let MaterialBooks = mongolass.model('MaterialBook', {
      userId: { type: Mongolass.Types.ObjectId },
      name: { type: 'string' },
      phone: { type: 'string' },
      activity: { type: 'string' },
      materialId: { type: Mongolass.Types.ObjectId },
      quantity: { type: 'number' },
      takeDate: { type: 'string' },  //格式YYYY-MM-DD
      returnDate: { type: 'string' },  //格式YYYY-MM-DD
      condition: { type: 'string', enum: ['book', 'lend', 'return', 'fail'] }  //book为预约，lend为借出，return为归还，fail为作废
    })
let MeetingBooks = mongolass.model('MeetingBook', {
      userId: { type: Mongolass.Types.ObjectId },
      name: { type: 'string' },
      phone: { type: 'string' },
      date: { type: 'string' },  //格式YYYY-MM-DD
      time: { type: 'number' },  //1为中午12:30-14:00，2下午17:30-19:00
      isPNeed: { type: 'boolean' },  //是否需要投影仪
      condition: { type: 'string', enum: ['book', 'return'] }  //book为预约，return为归还
    })
// 连接数据库
mongolass.connect('mongodb://localhost:27017/bookingsystem')

module.exports = {
  Admins,
  Users,
  Materials,
  MaterialBooks,
  MeetingBooks
}