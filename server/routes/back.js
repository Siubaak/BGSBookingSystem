let express = require('express')
let path = require('path')
let router = express.Router()
let api = require('../api')
let tokenCreate = require('../token-mw/token-create')
let tokenCheck = require('../token-mw/token-check')
let sha1 = require('sha1')
let dotenv = require('dotenv')

dotenv.load()

// 后台登录路由，返回token
router.post('/admin/login', async (req, res) => {
  let { account, password } = req.body
  let admin = await api.getAdmin(account)
  if (admin && (sha1(password) === admin.password)) {
    res.send({ token: tokenCreate(admin) })
  } else {
    res.send({ msg: '用户名或密码错误' })
  }
})

// 后台更新管理员密码
router.post('/admin/update/password', tokenCheck, async (req, res) => {
  let admin = req.body
  admin.password = sha1(admin.password)
  admin.oldPassword = sha1(admin.oldPassword)
  let result = await api.updateAdmin(admin)
  if (result.result.n) {
    res.send({ msg: '修改密码成功' })
  } else {
    res.send({ msg: '原密码输入错误' })
  }
})

// 后台创建部门用户
router.post('/admin/user/create', tokenCheck, async (req, res) => {
  let { department } = req.body
  let user = {
    department: department,
    password: sha1('123456'),
    isAuth: false,
    reName: '',
    rePhone: '',
    materialBook: 0,
    meetingBook: 0
  }
  await api.createUser(user)
  res.send({ msg: '创建用户成功' })
})

// 后台更新部门用户授权
router.post('/admin/user/update/auth', tokenCheck, async (req, res) => {
  let user = req.body
  user.isAuth = !user.isAuth
  await api.updateUser(user)
  res.send({ msg: '更新授权成功' })
})

// 后台重置部门用户
router.post('/admin/user/update/reset', tokenCheck, async (req, res) => {
  let user = req.body
  user.password = sha1('123456')
  user.isAuth = false
  user.reName = ''
  user.rePhone = ''
  await api.updateUser(user)
  res.send({ msg: '重置用户成功' })
})

// 后台移除部门用户
router.post('/admin/user/remove', tokenCheck, async (req, res) => {
  let { userId } = req.body
  await api.removeUser(userId)
  res.send({ msg: '删除用户成功' })
})

// 后台获取所有部门用户列表
router.get('/admin/user/list', tokenCheck, async (req, res) => {
  let userList = await api.getUserList()
  res.send({ userList })
})

// 后台获取通知公告
router.get('/admin/notification', tokenCheck, async (req, res) => {
  let notification = await api.getNotification()
  res.send({ notification })
})

// 后台编辑通知公告
router.post('/admin/notification/update', tokenCheck, async (req, res) => {
  let notification = req.body
  await api.updateNotification(notification)
  res.send({ msg: '更新通知公告成功' })
})

// 后台创建物资
router.post('/admin/material/create', tokenCheck, async (req, res) => {
  let material = req.body
  await api.createMaterial(material)
  res.send({ msg: '创建物资成功' })
})

// 后台更新物资
router.post('/admin/material/update', tokenCheck, async (req, res) => {
  let material = req.body
  await api.updateMaterial(material)
  res.send({ msg: '更新物资成功' })
})

// 后台移除物资
router.post('/admin/material/remove', tokenCheck, async (req, res) => {
  let { materialId } = req.body
  await api.removeMaterial(materialId)
  res.send({ msg: '删除物资成功' })
})

// 后台获取物资列表
router.get('/admin/material/list', tokenCheck, async (req, res) => {
  let materialList = await api.getMaterialList(true)
  res.send({ materialList })
})

// 后台更新物资申请状态，更改为借出状态
router.post('/admin/material/book/update/lend', tokenCheck, async (req, res) => {
  let { materialBookId } = req.body
  await api.updateMaterialBookCondition(materialBookId, 'lend')
  res.send({ msg: '更新物资申请状态成功，更改为借出状态' })
})

// 后台更新物资申请状态，更改为归还状态
router.post('/admin/material/book/update/return', tokenCheck, async (req, res) => {
  let { materialBookId } = req.body
  await api.updateMaterialBookCondition(materialBookId, 'return')
  res.send({ msg: '更新物资申请状态成功，更改为归还状态' })
})

// 后台更新物资申请状态，更改为作废状态
router.post('/admin/material/book/update/fail', tokenCheck, async (req, res) => {
  let { materialBookId } = req.body
  await api.updateMaterialBookCondition(materialBookId, 'fail')
  res.send({ msg: '更新物资申请状态成功，更改为作废状态' })
})

// 后台删除物资申请
router.post('/admin/material/book/remove', tokenCheck, async (req, res) => {
  let { materialBookId } = req.body
  await api.removeMaterialBook(materialBookId)
  res.send({ msg: '删除物资申请成功' })
})

// 后台获取所有未处理物资申请列表
router.get('/admin/material/book/list', tokenCheck, async (req, res) => {
  let materialBookList = await api.getMaterialBookList('back')
  res.send({ materialBookList })
})

// 后台获取所有物资申请列表
router.get('/admin/material/book/list/all', tokenCheck, async (req, res) => {
  let materialBookList = await api.getMaterialBookList()
  res.send({ materialBookList })
})

module.exports = router