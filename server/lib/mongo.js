let Mongolass = require('mongolass')
let mongolass = new Mongolass('mongodb://localhost:27017/bgs')
let Admins = mongolass.model('Admin', {
      account: { type: 'string' },
      password: { type: 'string' },
      oldPassword: { type: 'string' }
    })
let Users = mongolass.model('User', {
      department: { type: 'string'},
      password: { type: 'string' },
      isAuth: { type: 'boolean' },
      reName: { type: 'string' },  //部长姓名
      rePhone: { type: 'string' },  //部长电话
      materialBook: { type: 'number', gte: 0, lte: 3 }, //物资申请处于预约、借出情况的数目，最大为3
      meetingBook: { type: 'number', gte: 0, lte: 3 }, //会议室处于预约情况的数目，最大为3
    })
let Notifications = mongolass.model('Notification', {
      body: { type: 'string' }
    })
let Materials = mongolass.model('Material', {
      name: { type: 'string' },
      unit: { type: 'string' },
      quantity: { type: 'number' },  //消耗品剩余数量定为-1，大于等于0为非消耗品
      left: { type: 'number', gte: 0, lte: 9999999 }
    })
let MaterialBooks = mongolass.model('MaterialBook', {
      userId: { type: Mongolass.Types.ObjectId },
      name: { type: 'string' },
      phone: { type: 'string' },
      activity: { type: 'string' },
      book: [{
        materialId: { type: Mongolass.Types.ObjectId },
        book: { type: 'number' }
      }],
      takeDate: { type: 'string' },  //格式YYYY-MM-DD
      returnDate: { type: 'string' },  //格式YYYY-MM-DD
      remark: { type: 'string' },
      condition: { type: 'string', enum: ['book', 'lend', 'return', 'fail'] }  //book为预约，lend为借出，return为归还，fail为作废
    })
let MeetingBooks = mongolass.model('MeetingBook', {
      userId: { type: Mongolass.Types.ObjectId },
      name: { type: 'string' },
      phone: { type: 'string' },
      activity: { type: 'string' },
      date: { type: 'string' },  //格式YYYY-MM-DD
      time: { type: 'string' },  //1为中午12:30-14:00，2为下午17:30-19:00
      isPNeed: { type: 'boolean' },  //是否需要投影仪
      condition: { type: 'string', enum: ['book', 'return', 'fail'] }  //book为预约，return为归还，fail为作废
    })

module.exports = {
  Admins,
  Users,
  Notifications,
  Materials,
  MaterialBooks,
  MeetingBooks
}