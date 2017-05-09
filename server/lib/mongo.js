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
      materialBook: { type: 'number' }, //物资申请处于预约、借出情况的数目，最大为3
      meetingBook: { type: 'number' }, //会议室处于预约情况的数目，最大为3
    })
let Materials = mongolass.model('Material', {
      name: { type: 'string' },
      unit: { type: 'string' },
      quantity: { type: 'number' },  //-1为消耗品，大于等于0为非消耗品
      left: { type: 'number' }  //消耗品剩余数量定为1000000，若消耗完毕请手动更新为0
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
      takeTime: { type: 'date' },
      returnTime: { type: 'date' },
      condition: { type: 'string' }  //book为预约，lend为借出，return为归还，fail为作废
    })
let MeetingBooks = mongolass.model('MeetingBook', {
      userId: { type: Mongolass.Types.ObjectId },
      name: { type: 'string' },
      phone: { type: 'string' },
      useTime: { type: 'date' },
      isPNeed: { type: 'boolean' }  //是否需要投影仪
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