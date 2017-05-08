let { Admins, Users, Materials, MaterialBooks, MeetingBooks } = require('../lib/mongo')
let async = require('async')

module.exports = {
// 用户相关API函数
  getAdmin(account) {
    return Admins.findOne({ account: account }).exec()
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
    return Materials.update({ _id: material._id }, { $set: material }).exec()
  },
  removeMaterial(materialId) {
    return Promise.all([
      Materials.remove({ _id: materialId }).exec(),
      MaterialBooks.update({ "materialBook.materialId": materialId }, { $pull: { materialBook: { materialId: materialId } } }).exec()
    ])
  },
  getMaterialList(FindLeft = false) {
    if (FindLeft) {
      MaterialBooks.find()
      return Materials.find({ }).exec()
    } else {
      return Materials.find().exec()
    }
  },
// 物资申请相关API函数
  createMaterialBook(materialBook) {
    return MaterialBooks.create(materialBook).exec()
  },
  updateMaterialBook(materialBook) {
    return MaterialBooks.update({ _id: materialBook._id }, { $set: materialBook }).exec()
  },
  removeMaterialBook(materialBookId) {
    return MaterialBooks.remove({ _id: materialBookId }).exec()
  },
  getMaterialBookList() {
    return MaterialBooks.find().exec()
  },
// 物资申请相关API函数
  createMeetingBook(meetingBook) {
    return MeetingBooks.create(meetingBook).exec()
  },
  updateMeetingBook(meetingBook) {
    return MeetingBooks.update({ _id: meetingBook._id }, { $set: meetingBook }).exec()
  },
  removeMeetingBook(meetingBookId) {
    return MeetingBooks.remove({ _id: meetingBookId }).exec()
  },
  getMeetingBookList() {
    return MeetingBooks.find().exec()
  }
}
