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
    return Promise.all([
      Users.remove({ _id: userId }).exec(),
      MaterialBooks.remove({ userId: userId }).exec(),
      MeetingBooks.remove({ userId: userId }).exec()
    ])
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
    Materials.update({ _id: material._id }, { $set: material }).exec()
  },
  removeMaterial(material) {
    MaterialBooks.findOne({ materialId: material_id, $or:{}})
      .then((materialBook) => {
        return Promise.reject(`${materialBook.activity} has booked/borrowed.`)
      })
      .catch((err) => {

      })
    if (material.quantity === material.left) {
      return Promise.all([
        Materials.remove({ _id: material._id }).exec(),
        MaterialBooks.update({ 'materialBook.materialId': material_id }, {
          $pull:
          { book: { materialId: material._id } }
        }).exec()
      ])
    } else {
      return Promise.reject('The material remains book/lend.')
    }
  },
  getMaterialList(FindLeft = false) {
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
  changeMaterialBookCondition(materialBook, condition = 'return') {
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
    return Promise.all([
      Users.update({ _id: meetingBook.userId }, { $inc: { meetingBook: 1 } }).exec(),
      MeetingBooks.create(meetingBook).exec(),
      Meetings.update({ date: meetingBook.date }, { $set: { 'condition.time': meetingBook.time } }).exec()
    ])
  },
  removeMeetingBook(meetingBook) {
    return Promise.all([
      Users.update({ _id: meetingBook.userId }, { $inc: { meetingBook: -1 } }).exec(),
      MeetingBooks.remove({ _id: meetingBook._id }).exec(),
      Meetings.update({ date: meetingBook.date }, { $set: { 'condition.time': meetingBook.time } }).exec()
    ])
  },
  getMeetingBookList(userId = null) {
    if (userId) {
      return MeetingBooks.find({ userId: userId }).exec()
    } else {
      return MeetingBooks.find().exec()
    }
  }
}
