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
  try {
    let user = await api.getUserByDepartment(department)
    if (user) {
      if (sha1(password) === user.password) {
        res.status(200).send({ token: tokenCreate(user) })
      } else {
        res.status(299).send({ code: 'auth:bad_password', msg: '密码错误' })
      }
    } else {
      res.status(299).send({ code: 'auth:user_not_found', msg: '用户不存在，或被后台删除' })
    }
  } catch (err) {
    res.status(500).send({ code: 'internal:unknow_error', msg: err })
  }
})

// 前台获取用户信息
router.post('/user', async (req, res) => {
  let { userId } = req.body
  try {
    let user = await api.getUserById(userId)
    if (user) {
      user._id = undefined
      user.password = undefined
      res.status(200).send({ user })
    } else {
      res.status(299).send({ code: 'auth:user_not_found', msg: '用户不存在，或被后台删除' })
    }
  } catch (err) {
    res.status(500).send({ code: 'internal:unknow_error', msg: err })
  }
})

// 前台获取用户部门名称
router.get('/user/list', async (req, res) => {
  try {
    let userList = await api.getUserList()
    if (userList.length) {
      for (let user of userList) {
        user._id = undefined
        user.password = undefined
        user.isAuth = undefined
        user.reName = undefined
        user.rePhone = undefined
        user.materialBook = undefined
        user.meetingBook = undefined
      }
      res.status(200).send({ userList })
    } else {
      res.status(299).send({ code: 'auth:no_user_exist', msg: '无用户数据，请等待后台添加' })
    }
  } catch (err) {
    res.status(500).send({ code: 'internal:unknow_error', msg: err })
  }
})

// 前台更新用户信息
router.post('/user/update/info', tokenCheck, async (req, res) => {
  let { user } = req.body
  let userForUpdate = {
    _id: user._id,
    reName: user.reName,
    rePhone: user.rePhone
  }
  try {
    let userForCheck = await api.getUserById(user._id)
    if (userForCheck) {
      if (sha1(user.passwordForCheck) === userForCheck.password) {
        await api.updateUser(userForUpdate)
        res.status(200).end()
      } else {
        res.status(299).send({ code: 'auth:bad_password', msg: '原密码错误' })
      }
    } else {
      res.status(299).send({ code: 'auth:user_not_found', msg: '用户不存在，或被后台删除' })
    }
  } catch (err) {
    res.status(500).send({ code: 'internal:unknow_error', msg: err })
  }
})

// 前台更新用户密码
router.post('/user/update/password', tokenCheck, async (req, res) => {
  let { user } = req.body
  let userForUpdate = {
    _id: user._id,
    password: sha1(user.password)
  }
  try {
    let userForCheck = await api.getUserById(user._id)
    if (userForCheck) {
      if (sha1(user.passwordForCheck) === userForCheck.password) {
        await api.updateUser(userForUpdate)
        res.status(200).end()
      } else {
        res.status(299).send({ code: 'auth:bad_password', msg: '原密码错误' })
      }
    } else {
      res.status(299).send({ code: 'auth:user_not_found', msg: '用户不存在，或被后台删除' })
    }
  } catch (err) {
    res.status(500).send({ code: 'internal:unknow_error', msg: err })
  }
})

// 前台获取通知
router.get('/notification', tokenCheck, async (req, res) => {
  try {
    let notification = await api.getNotification()
    res.status(200).send({ notification })
  } catch (err) {
    res.status(500).send({ code: 'internal:unknow_error', msg: err })
  }
})

// 前台获取物资列表
router.get('/material/list', tokenCheck, async (req, res) => {
  try {
    let materialList = await api.getMaterialList()
    if (materialList.length) {
      res.status(200).send({ materialList })
    } else {
      res.status(299).send({ code: 'auth:no_material', msg: '无物资数据，请等待后台添加' })
    }
  } catch (err) {
    res.status(500).send({ code: 'internal:unknow_error', msg: err })
  }
})

// 前台创建物资申请表单
router.post('/material/book/create', tokenCheck, async (req, res) => {
  let { materialBook, materialBookItems } = req.body
  try {
    await api.createMaterialBook(materialBook, materialBookItems)
    res.status(200).end()
  } catch (err) {
    res.status(500).send({ code: 'internal:unknow_error', msg: err })
  }
})

// 前台获取用户所有物资申请表单
router.post('/material/book/list', tokenCheck, async (req, res) => {
  let { userId } = req.body
  try {
    let materialBookList = await api.getMaterialBookList(userId)
    if (materialBookList.length) {
      res.status(200).send({ materialBookList })
    } else {
      res.status(299).send({ code: 'auth:no_active_material_book_list', msg: '该用户无未处理的有效物资申请' })
    }
  } catch (err) {
    res.status(500).send({ code: 'internal:unknow_error', msg: err })
  }
})

// 前台创建会议室预约表单
router.post('/meeting/book/create', tokenCheck, async (req, res) => {
  let meetingBook = req.body
  try {
    await api.createMeetingBook(meetingBook)
    res.status(200).end()
  } catch (err) {
    res.status(500).send({ code: 'internal:unknow_error', msg: err })
  }
})

// 前台获取用户所有会议室预约表单
router.post('/meeting/book/list', tokenCheck, async (req, res) => {
  let { userId } = req.body
  try {
    let meetingBookList = await api.getMeetingBookList(userId)
    if (meetingBookList.length) {
      res.status(200).send({ meetingBookList })
    } else {
      res.status(299).send({ code: 'auth:no_active_meeting_book_list', msg: '该用户无未处理的有效会议室预约' })
    }
  } catch (err) {
    res.status(500).send({ code: 'internal:unknow_error', msg: err })
  }
})

// 前台创建会议室占用时间
router.get('/meeting/book', tokenCheck, async (req, res) => {
  try {
    let occupiedTime = await api.getMeetingOccupiedTime()
    res.status(200).send({ occupiedTime })
  } catch (err) {
    res.status(500).send({ code: 'internal:unknow_error', msg: err })
  }
})

module.exports = router