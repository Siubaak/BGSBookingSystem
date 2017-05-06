var Mongolass = require('mongolass'),
    mongolass = new Mongolass(),
    moment = require('moment'),
    idToTs = require('objectid-to-timestamp'),
    Admins = mongolass.model('Admin', {
      account: { type: 'string' },
      password: { type: 'string' }
    }),
    Users = mongolass.model('User', {
      account: { type: 'string' },
      password: { type: 'string' },
      isAuth: { type: 'boolean' },
      info: {
        department: { type: 'string' },
        reName: { type: 'string' },  //部长姓名
        rePhone: { type: 'number' }  //部长电话
      }
    }),
    Materials = mongolass.model('Material', {
      name: { type: 'string' },
      quantity: { type: 'number' },
      totalBook: { type: 'number' }  //-1为消耗品，大于等于0为非消耗品
    }),
    MaterialBooks = mongolass.model('MaterialBook', {
      userId: { type: Mongolass.Types.ObjectId },
      name: { type: 'string' },
      phone: { type: 'string' },
      materialBook: [{
        materialId: { type: Mongolass.Types.ObjectId },
        book: { type: 'number' }
      }],
      takeTime: { type: 'date' },
      returnTime: { type: 'date' },
      condition: { type: 'string' },  //book为预约，lend为借出，return为归还，void为作废
      remark: { type: 'string' }
    }),
    MeetingBooks = mongolass.model('MeetingBook', {
      userId: { type: Mongolass.Types.ObjectId },
      name: { type: 'string' },
      phone: { type: 'string' },
      useTime: { type: 'date' },
      isPNeed: { type: 'boolean' }  //是否需要投影仪
    })
// 连接数据库
mongolass.connect('mongodb://localhost:27017/bookingsystem')
// 注册插件，转化objectId为timestamp，再转化为YYYY-MM-DD HH:mm:ss格式时间并储存在date中
var transferTime = (result) => {
  if (result) {
    result.forEach((item) => {
      item.date = moment(idToTs(item._id)).format('YYYY-MM-DD HH:mm:ss')
    })
  }
  return result
}
mongolass.plugin('addDate', {
  afterFind (result) {
    return transferTime (result)
  },
  afterFindOne (result) {
    return transferTime (result)
  }
})

module.exports = {
  Admins,
  Users,
  Materials,
  MaterialBooks,
  MeetingBooks
}