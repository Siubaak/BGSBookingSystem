let express = require('express')
let path = require('path')
let router = express.Router()
let api = require('../api')
let tokenCreate = require('../token-mw/token-create-front')
let tokenCheck = require('../token-mw/token-check-front')
let sha1 = require('sha1')
let dotenv = require('dotenv')

dotenv.load()

// 前台登录，返回token
router.post('/login', async (req, res) => {
  let { department, password } = req.body
  let user = await api.getUserByDepartment(department)
  if (user && (sha1(password) === user.password)) {
    res.send({ token: tokenCreate(user) })
  } else {
    res.send({ msg: '密码错误' })
  }
})

// 前台获取用户信息
router.post('/user', async (req, res) => {
  let { userId } = req.body
  let user = await api.getUserById(userId)
  user._id = undefined
  user.password = undefined
  res.send({ user })
})

// 前台获取用户部门名称
router.get('/user/list', async (req, res) => {
  let userList = await api.getUserList()
  for (let user of userList) {
    user._id = undefined
    user.password = undefined
    user.isAuth = undefined
    user.reName = undefined
    user.rePhone = undefined
    user.materialBook = undefined
    user.meetingBook = undefined
  }
  res.send({ userList })
})

// 前台更新用户信息
router.post('/user/update/info', tokenCheck, async (req, res) => {
  let { user } = req.body
  let userForUpdate = {
    _id: user._id,
    reName: user.reName,
    rePhone: user.rePhone
  }
  let userForCheck = await api.getUserById(user._id)
  if (userForCheck && (sha1(user.passwordForCheck) === userForCheck.password)) {
    await api.updateUser(userForUpdate)
    res.send({ msg: '更新成功' })
  } else {
    res.send({ msg: '原密码错误' })
  }
})

// 前台更新用户密码
router.post('/user/update/password', tokenCheck, async (req, res) => {
  let { user } = req.body
  let userForUpdate = {
    _id: user._id,
    password: sha1(user.password)
  }
  let userForCheck = await api.getUserById(user._id)
  if (userForCheck && (sha1(user.passwordForCheck) === userForCheck.password)) {
    await api.updateUser(userForUpdate)
    res.send({ msg: '更新成功' })
  } else {
    res.send({ msg: '密码错误或用户不存在' })
  }
})

// 前台获取物资列表
router.get('/material/list', tokenCheck, async (req, res) => {
  let materialList = await api.getMaterialList()
  res.send({ materialList })
})

// 前台创建物资申请表单
router.post('/material/book/create', tokenCheck, async (req, res) => {
  let { materialBook, materialBookItems } = req.body
  await api.createMaterialBook(materialBook, materialBookItems)
  res.send({ msg: '创建成功' })
})

// 前台获取用户所有物资申请表单
router.post('/material/book/list', tokenCheck, async (req, res) => {
  let { userId } = req.body
  let materialBookList = await api.getMaterialBookList(userId)
  res.send({ materialBookList })
})

// 前台创建会议室预约表单
router.post('/meeting/book/create', tokenCheck, async (req, res) => {
  let meetingBook = req.body
  await api.createMeetingBook(meetingBook)
  res.send({ msg: '创建成功' })
})

// 前台获取用户所有会议室预约表单
router.post('/meeting/book/list', tokenCheck, async (req, res) => {
  let { userId } = req.body
  let meetingBookList = await api.getMeetingBookList(userId)
  res.send({ meetingBookList })
})

module.exports = router