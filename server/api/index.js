let { Admins, Users, Materials, MaterialBooks, MeetingBooks } = require('../lib/mongo')
let async = require('async')

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
    if (material.quantity === material.left) {
      return Materials.update({ _id: material._id }, { $set: material }).exec()
    } else {
      Promise.reject('The material remains book/lend condition(s).')
    }
  },
  removeMaterial(materialId) {
    return Promise.all([
      Materials.remove({ _id: materialId }).exec(),
      MaterialBooks.update({ "materialBook.materialId": materialId }, {
        $pull:
        { book: { materialId: materialId } }
      }, { multi: true }).exec()
    ])
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
    return Promise.all([
      materialBook.
      MaterialBooks.create(materialBook).exec()
    ])
  },
  removeMaterialBook(materialBookId) {
    return MaterialBooks.remove({ _id: materialBookId }).exec()
  },
  getMaterialBookList() {
    return MaterialBooks.find().exec()
  },
// 会议室预约相关API函数
  createMeetingBook(meetingBook) {
    return MeetingBooks.create(meetingBook).exec()
  },
  removeMeetingBook(meetingBookId) {
    return MeetingBooks.remove({ _id: meetingBookId }).exec()
  },
  getMeetingBookList(userId = null) {
    if (userId) {
      return MeetingBooks.find({ userId: userId }).exec()
    } else {
      return MeetingBooks.find().exec()
    }
  }
}
