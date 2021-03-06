let { Admins, Users, Notifications, Materials, MaterialBooks, MaterialBookItems, MeetingBooks } = require('../lib/mongo')
let conf = require('../conf')

module.exports = {
// 用户相关API函数
  getAdminByAccount(account) {
    return Admins.findOne({ account: account }).exec()
  },
  getAdminById(adminId) {
    return Admins.findOne({ _id: adminId }).exec()
  },
  updateAdmin(admin) {
    return Admins.update({ _id: admin._id }, { $set: admin }).exec()
  },
  createUser(user) {
    return Users.create(user).exec()
  },
  updateUser(user) {
    return Users.update({ _id: user._id }, { $set: user }).exec()
  },
  removeUser(userId) {
    return Promise.all([
      Users.remove({ _id: userId }).exec(),
      MaterialBooks.remove({ userId: userId }).exec(),
      MaterialBookItems.remove({ userId: userId }).exec(),
      MeetingBooks.remove({ userId: userId }).exec()
    ])
  },
  getUserByDepartment(department) {
    return Users.findOne({ department: department }).exec()
  },
  getUserById(userId) {
    return Users.findOne({ _id: userId }).exec()
  },
  getUserList() {
    return Users.find().sort({ department: 1 }).exec()
  },
// 通知公告相关API函数
  updateNotification(notification) {
    return Notifications.update({}, { $set: notification }).exec()
  },
  getNotification() {
    return Notifications.findOne().exec()
  },
// 物资录入相关API函数
  createMaterial(material) {
    return Materials.create(material).exec()
  },
  updateMaterial(material) {
    return Materials.update({ _id: material._id }, { $set: material }).exec()
  },
  removeMaterial(materialId) {
    return Promise.all([
      Materials.remove({ _id: materialId }).exec(),
      MaterialBookItems.remove({ materialId: materialId }).exec()
    ])
  },
  async getMaterialList(findAll) {
    let materialList = await Materials.find().sort({ type: 1 }).exec()
    for (let material of materialList) {
      let materialBookItems = await MaterialBookItems.find({ materialId: material._id, $or: [{ condition: '预约' }, { condition: '借出' }] }).exec()
      let book = 0
      switch (materialBookItems.length) {
        case 0:
          break
        case 1:
          book = materialBookItems[0].book
          break
        default:
          book = materialBookItems.reduce((a, b) => { return a.book + b.book })
      }
      material.left = material.quantity - book
    }
    if (!findAll) {
      materialList = materialList.filter((material) => {
        return material.left > 0
      })
    }
    return Promise.resolve(materialList)
  },
// 物资申请相关API函数
  async createMaterialBook(materialBook, materialBookItems) {
    let materialBooks = await MaterialBooks.find({ userId: materialBook.userId, $or: [{ condition: '预约' }, { condition: '借出' }] }).exec()
    if (materialBooks.length < conf.maxMaterialBook) {
      let materialBookId = (await MaterialBooks.create(materialBook).exec()).insertedIds[0]
      for (let materialBookItem of materialBookItems) {
        materialBookItem.materialBookId = materialBookId
      }
      await MaterialBookItems.create(materialBookItems).exec()
      return Promise.resolve('success')
    } else {
      return Promise.resolve('full')
    }
  },
  updateMaterialBook(materialBook) {
    return MaterialBooks.update({ _id: materialBook._id }, { $set: materialBook }).exec()
  },
  updateMaterialBookCondition(materialBookId, condition) {
    return Promise.all([
      MaterialBooks.update({ _id: materialBookId }, { $set : { condition: condition } }).exec(),
      MaterialBookItems.update({ materialBookId: materialBookId }, { $set : { condition: condition } }, { multi: true }).exec(),
    ])
  },
  removeMaterialBook(materialBookId) {
    return Promise.all([
      MaterialBooks.remove({ _id: materialBookId }).exec(),
      MaterialBookItems.remove({ materialBookId: materialBookId }).exec(),
    ])
  },
  getMaterialBookById (materialBookId) {
    return MaterialBooks.findOne({ _id: materialBookId }).exec()
  },
  async getMaterialBookList(userId) {
    let materialBooks = await (() => {
      switch (userId) {
        case undefined:
          return MaterialBooks.find().sort({ _id: -1 }).exec()
        case 'back':
          return MaterialBooks.find({ $or: [{ condition: '预约' }, { condition: '借出' }] }).sort({ _id: -1 }).exec()
        default:
          return MaterialBooks.find({ userId: userId, $or: [{ condition: '预约' }, { condition: '借出' }] }).sort({ _id: -1 }).exec()
      }
    })()
    for (let materialBook of materialBooks) {
      let user = await Users.findOne({ _id: materialBook.userId }).exec()
      materialBook.user = user.department
      let materialBookItems = await MaterialBookItems.find({ materialBookId: materialBook._id}).exec()
      for (let materialBookItem of materialBookItems) {
        let material = await Materials.findOne({ _id: materialBookItem.materialId }).exec()
        materialBookItem.name = material.name
        materialBookItem.unit = material.unit
      }
      materialBook.book = materialBookItems
    }
    return Promise.resolve(materialBooks)
  },
// 会议室预约相关API函数
  createMeetingBook(meetingBook) {
    return (async () => {
      let isBook = await MeetingBooks.findOne({ date: meetingBook.date, time: meetingBook.time, condition: '预约' }).exec()
      if (isBook) {
        return Promise.resolve('booked')
      } else {
        let meetingBooks = await MeetingBooks.find({ userId: meetingBook.userId, condition: '预约' }).exec()
        if (meetingBooks.length < conf.maxMeetingBook) {
          await MeetingBooks.create(meetingBook).exec()
          return Promise.resolve('success')
        } else {
          return Promise.resolve('full')
        }
      }
    })()
  },
  updateMeetingBookCondition(meetingBookId, condition) {
    return MeetingBooks.update({ _id: meetingBookId }, { $set: { condition: condition } }).exec()
  },
  updateMeetingScheduleReturn(today) {
    return MeetingBooks.update({ date: today, condition: '预约' }, { $set: { condition: '归还' } }, { multi: true }).exec()
  },
  removeMeetingBook(meetingBookId) {
    return MeetingBooks.remove({ _id: meetingBookId }).exec()
  },
  async getMeetingBookList(userId) {
    let meetingBooks = await (() => {
      switch (userId) {
        case undefined:
          return MeetingBooks.find().sort({ _id: -1 }).exec()
        case 'back':
          return MeetingBooks.find({ condition: '预约' }).sort({ _id: -1 }).exec()
        default:
          return MeetingBooks.find({ userId: userId, condition: '预约' }).sort({ _id: -1 }).exec()
      }
    })()
    for (let meetingBook of meetingBooks) {
      let user = await Users.findOne({ _id: meetingBook.userId }).exec()
      meetingBook.user = user.department
    }
    return Promise.resolve(meetingBooks)
  },
  async getMeetingOccupiedTime() {
    let meetingBooks = await MeetingBooks.find({ condition: '预约' }).sort({ _id: -1 }).exec()
    let occupiedTime = {}
    for (let meetingBook of meetingBooks) {
      occupiedTime[`${meetingBook.date}${meetingBook.time}`] = true
    }
    return Promise.resolve(occupiedTime)
  }
}
