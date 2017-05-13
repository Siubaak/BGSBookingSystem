let { Admins, Users, Notifications, Materials, MaterialBooks, MeetingBooks } = require('../lib/mongo')

module.exports = {
// 用户相关API函数
  getAdmin(account) {
    return Admins.findOne({ account: account }).exec()
  },
  updateAdmin(admin) {
    return Admins.update({ password: admin.oldPassword }, { $set: admin }).exec()
  },
  createUser(user) {
    return Users.create(user).exec()
  },
  updateUser(user) {
    return Users.update({ _id: user._id }, { $set: user }).exec()
  },
  removeUser(userId) {
    return MaterialBooks.find({ userId: userId, $or: [{ condition: 'book' }, { condition: 'lend' }] }).exec()
      .then((result) => {
        if (result.length) {
          return Promise.reject('The user still has book(s) of material.')
        } else {
          return MeetingBooks.find({ userId: userId, condition: 'book' }).exec()
        }
      })
      .then((result) => {
        if (result.length) {
          return Promise.reject('The user still has book(s) of meeting.')
        } else {
          return Promise.all([
            Users.remove({ _id: userId }).exec(),
            MaterialBooks.remove({ userId: userId }).exec(),
            MeetingBooks.remove({ userId: userId }).exec()
          ])
        }
      })
      .catch((err) => {
        return Promise.reject(err)
      })
  },
  getUser(department) {
    return Users.findOne({ department: department }).exec()
  },
  getUserList() {
    return Users.find().sort({ _id:-1 }).exec()
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
  updateMaterial(materialUpdate) {
    Materials.findOne({ _id: materialUpdate._id }).exec()
      .then((material) => {
        if (material.quantity === material.left) {
          return Materials.update({ _id: material._id }, { $set: materialUpdate }).exec()
        } else {
          return Promise.reject('The material is still under book/lend condition(s).')
        }
      })
      .catch((err) => {
        return Promise.reject(err)
      })
  },
  removeMaterial(materialId) {
    Materials.findOne({ _id: materialId }).exec()
      .then((material) => {
        if (material.quantity === material.left) {
          return Promise.all([
            Materials.remove({ _id: materialId }).exec(),
            MaterialBooks.update({ 'materialBook.materialId': materialId }, {
              $pull:
              { book: { materialId: materialId } }
            }).exec()
          ])
        } else {
          return Promise.reject('The material is still under book/lend condition(s).')
        }
      })
      .catch((err) => {
        return Promise.reject(err)
      })
  },
  getMaterialList(FindLeft = true) {
    if (FindLeft) {
      return Materials.find({ left: { $gt: 0 } }).sort({ _id:-1 }).exec()
    } else {
      return Materials.find().sort({ _id:-1 }).exec()
    }
  },
// 物资申请相关API函数
  createMaterialBook(materialBook) {
    let materialBookProccessingList = []
    materialBookProccessingList.push(Users.update({ _id: materialBook.userId }, { $inc: { materialBook: 1 } }).exec())
    materialBookProccessingList.push(MaterialBooks.create(materialBook).exec())
    for (let bookItem in materialBook.book) {
      materialBookProccessingList.push(Materials.update({ _id: bookItem.materialId }, { $inc: { left: -bookItem.quantity } }).exec())
    }
    return Promise.all(materialBookProccessingList)
  },
  updateMaterialBookCondition(materialBook, condition = 'return') {
    if (materialBook.condition !== 'return' && materialBook.condition !== 'fail' && condition !== 'book' && condition !== 'lend') {
      let materialBookProccessingList = []
      materialBookProccessingList.push(Users.update({ _id: materialBook.userId }, { $inc: { materialBook: -1 } }).exec())
      materialBookProccessingList.push(MaterialBooks.update({ _id: materialBook._id }, { $set: { conditon: conditon } }).exec())
      for (let bookItem in materialBook.book) {
        materialBookProccessingList.push(Materials.update({ _id: bookItem.materialid }, { $inc: { left: bookItem.quantity } }).exec())
      }
      return Promise.all(materialBookProccessingList)
    } else {
      return Promise.reject('Changing to the book/lend condition is not allowed or the book has returned/failed')
    }
  },
  removeMaterialBook(materialBook) {
    if (materialBook.condition !== 'return' && materialBook.condition !== 'fail') {
      let materialBookProccessingList = []
      materialBookProccessingList.push(Users.update({ _id: materialBook.userId }, { $inc: { materialBook: -1 } }).exec())
      materialBookProccessingList.push(MaterialBooks.remove({ _id: materialBook._id }).exec())
      for (let bookItem in materialBook.book) {
        materialBookProccessingList.push(Materials.update({ _id: bookItem.materialId }, { $inc: { left: bookItem.quantity } }).exec())
      }
      return Promise.all(materialBookProccessingList)
    } else {
      return MaterialBooks.remove({ _id: materialBook._id }).exec()
    }
  },
  getMaterialBookList(userId = null) {
    let addMaterialInfo = async (materialBooks) => {
      for (let materialBook of materialBooks) {
        for (let material of materialBook.book) {
          let materialInfo = await Materials.findOne({ _id: material.materialId}).exec()
          material.name = materialInfo.name
          material.unit = materialInfo.unit
        }
      }
      return materialBooks
    }
    return new Promise((resolve, reject) => {
      if (userId = 'back') {
        MaterialBooks.find({ $or: [{ condition: 'book' }, { condition: 'lend' }] }).sort({ _id:-1 }).exec()
          .then((materialBooks) => {
            return resolve(addMaterialInfo(materialBooks))
          })
          .catch((err) => {
            return reject(err)
          })
      } else if (userId) {
        MaterialBooks.find({ userId: userId, $or: [{ condition: 'book' }, { condition: 'lend' }] }).sort({ _id:-1 }).exec()
          .then((materialBooks) => {
            return resolve(addMaterialInfo(materialBooks))
          })
          .catch((err) => {
            return reject(err)
          })
      } else {
        MaterialBooks.find().sort({ _id:-1 }).exec()
          .then((materialBooks) => {
            return resolve(addMaterialInfo(materialBooks))
          })
          .catch((err) => {
            return reject(err)
          })
      }
    })
  },
// 会议室预约相关API函数
  createMeetingBook(meetingBook) {
    return MeetingBooks.find({ date: meetingBook.date, time: meetingBook.time, condition: 'book' }).exec()
      .then((result) => {
        if (result.length) {
          return Promise.reject('The meeting room has been booked at that time.')
        } else {
          return Promise.all([
            Users.update({ _id: meetingBook.userId }, { $inc: { meetingBook: 1 } }).exec(),
            MeetingBooks.create(meetingBook).exec()
          ])
        }
      })
      .catch((err) => {
        Promise.reject(err)
      })
  },
  updateMeetingBookCondition(meetingBook, condition = 'return') {
    if (meetingBook.condition !== 'return' && meetingBook.condition !== 'fail' && condition !== 'book') {
      return Promise.all([
        Users.update({ _id: meetingBook.userId }, { $inc: { meetingBook: -1 } }).exec(),
        MeetingBooks.update({ _id: meetingBook._id }, { $set: { conditon: conditon } }).exec()
      ])
    } else {
      return Promise.reject('Changing to the book condition is not allowed or the book has returned/failed')
    }
  },
  removeMeetingBook(meetingBook) {
    if (meetingBook.condition === 'book') {
      return Promise.all([
        Users.update({ _id: meetingBook.userId }, { $inc: { meetingBook: -1 } }).exec(),
        MeetingBooks.remove({ _id: meetingBook._id }).exec()
      ])
    } else {
      return MeetingBooks.remove({ _id: meetingBook._id }).exec()
    }
  },
  getMeetingBookList(userId = null) {
    if (userId) {
      return MeetingBooks.find({ userId: userId, condition: 'book' }).sort({ _id:-1 }).exec()
    } else {
      return MeetingBooks.find().sort({ _id:-1 }).exec()
    }
  }
}
