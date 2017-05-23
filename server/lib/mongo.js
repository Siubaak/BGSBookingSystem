let Mongolass = require('mongolass')
let mongolass = new Mongolass('mongodb://127.0.0.1:27017/bgs')
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
    })
let Notifications = mongolass.model('Notification', {
      body: { type: 'string' }
    })
let Materials = mongolass.model('Material', {
      name: { type: 'string' },
      unit: { type: 'string' },
      quantity: { type: 'number' }
    })
let MaterialBooks = mongolass.model('MaterialBook', {
      userId: { type: Mongolass.Types.ObjectId },
      name: { type: 'string' },
      phone: { type: 'string' },
      activity: { type: 'string' },
      takeDate: { type: 'string' },  //格式YYYY-MM-DD
      returnDate: { type: 'string' },  //格式YYYY-MM-DD
      remark: { type: 'string' },
      condition: { type: 'string', enum: ['book', 'lend', 'return', 'fail'] }  //book为预约，lend为借出，return为归还，fail为作废
    })
let MaterialBookItems = mongolass.model('MaterialBookItem', {
      userId: { type: Mongolass.Types.ObjectId },
      materialBookId: { type: Mongolass.Types.ObjectId },
      materialId: { type: Mongolass.Types.ObjectId },
      book: { type: 'number' },
      condition: { type: 'string', enum: ['book', 'lend', 'return', 'fail'] }  //book为预约，lend为借出，return为归还，fail为作废
    })
let MeetingBooks = mongolass.model('MeetingBook', {
      userId: { type: Mongolass.Types.ObjectId },
      name: { type: 'string' },
      phone: { type: 'string' },
      activity: { type: 'string' },
      date: { type: 'string' },  //格式YYYY年MM月DD日
      time: { type: 'string' },  //如中午12:30-14:00，下午17:30-19:00
      isPNeed: { type: 'boolean' },  //是否需要投影仪
      condition: { type: 'string', enum: ['book', 'return', 'fail'] }  //book为预约，return为归还，fail为作废
    })

module.exports = {
  Admins,
  Users,
  Notifications,
  Materials,
  MaterialBooks,
  MaterialBookItems,
  MeetingBooks
}