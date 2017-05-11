let { Admins, Users, Materials, MaterialBooks, MeetingBooks } = require('../lib/mongo')

module.exports = {
// 用户相关API函数
  getAdmin(account) {
    return Admins.findOne({ account: account }).exec()
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
    return Users.find().exec()
  },
// 物资录入相关API函数
  createMaterial(material) {
    return Materials.create(material).exec()
  },
  updateMaterial(material) {
    if (material.quantity === material.left) {
      return Materials.update({ _id: material._id }, { $set: material }).exec()
    } else {
      return Promise.reject('The material is still under book/lend condition(s).')
    }
  },
  removeMaterial(materialId) {
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
  },
  getMaterialList(FindLeft = true) {
    if (FindLeft) {
      return Materials.find({ left: { $gt: 0 } }).exec()
    } else {
      return Materials.find().exec()
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
    if (userId) {
      return MaterialBooks.find({ userId: userId, $or: [{ condition: 'book' }, { condition: 'lend' }] }).exec()
    } else {
      return MaterialBooks.find().exec()
    }
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
      return MeetingBooks.find({ userId: userId, condition: 'book' }).exec()
    } else {
      return MeetingBooks.find().exec()
    }
  }
}
