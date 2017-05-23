let express = require('express')
let path = require('path')
let router = express.Router()
let api = require('../api')
let tokenCreate = require('../token-mw/token-create-front')
let tokenCheck = require('../token-mw/token-check-front')
let sha1 = require('sha1')
let dotenv = require('dotenv')

dotenv.load()

let tryProcess = (process) => {
  try {
    process()
  } catch (err) {
    res.status(400).send({ code: 'internal:unknow_error', msg: err })
  }
}

// 前台登录，返回token
router.post('/login', async (req, res) => {
  let { department, password } = req.body
  tryProcess(() => {
    let user = await api.getUserByDepartment(department)
    if (user) {
      if (sha1(password) === user.password) {
        res.status(200).send({ token: tokenCreate(user) })
      } else {
        res.status(400).send({ code: 'auth:bad_password', msg: '密码错误' })
      }
    } else {
      res.status(400).send({ code: 'auth:user_not_found', msg: '用户名不存在' })
    }
  })
})

// 前台获取用户信息
router.post('/user', async (req, res) => {
  let { userId } = req.body
  tryProcess(() => {
    let user = await api.getUserById(userId)
    user._id = undefined
    user.password = undefined
    res.status(200).send({ user })
  })
})

// 前台获取用户部门名称
router.get('/user/list', async (req, res) => {
  tryProcess(() => {
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
    res.status(200).send({ userList })
  })
})

// 前台更新用户信息
router.post('/user/update/info', tokenCheck, async (req, res) => {
  let { user } = req.body
  let userForUpdate = {
    _id: user._id,
    reName: user.reName,
    rePhone: user.rePhone
  }
  tryProcess(() => {
    let userForCheck = await api.getUserById(user._id)
    if (userForCheck) {
      if (sha1(user.passwordForCheck) === userForCheck.password) {
        await api.updateUser(userForUpdate)
        res.status(200).end()
      } else {
        res.status(400).send({ code: 'auth:bad_password', msg: '原密码错误' })
      }
    } else {
      res.status(400).send({ code: 'auth:user_not_found', msg: '用户名不存在' })
    }
  })
})

// 前台更新用户密码
router.post('/user/update/password', tokenCheck, async (req, res) => {
  let { user } = req.body
  let userForUpdate = {
    _id: user._id,
    password: sha1(user.password)
  }
  tryProcess(() => {
    let userForCheck = await api.getUserById(user._id)
    if (userForCheck) {
      if (sha1(user.passwordForCheck) === userForCheck.password) {
        await api.updateUser(userForUpdate)
        res.status(200).end()
      } else {
        res.status(400).send({ code: 'auth:bad_password', msg: '原密码错误' })
      }
    } else {
      res.status(400).send({ code: 'auth:user_not_found', msg: '用户名不存在' })
    }
  })
})

// 前台获取通知
router.get('/notification', tokenCheck, async (req, res) => {
  tryProcess(() => {
    let notification = await api.getNotification()
    res.status(200).send({ notification })
  })
})

// 前台获取物资列表
router.get('/material/list', tokenCheck, async (req, res) => {
  tryProcess(() => {
    let materialList = await api.getMaterialList()
    res.status(200).send({ materialList })
  })
})

// 前台创建物资申请表单
router.post('/material/book/create', tokenCheck, async (req, res) => {
  let { materialBook, materialBookItems } = req.body
  tryProcess(() => {
    await api.createMaterialBook(materialBook, materialBookItems)
    res.status(200).end()
  })
})

// 前台获取用户所有物资申请表单
router.post('/material/book/list', tokenCheck, async (req, res) => {
  let { userId } = req.body
  tryProcess(() => {
    let materialBookList = await api.getMaterialBookList(userId)
    res.status(200).send({ materialBookList })
  })
})

// 前台创建会议室预约表单
router.post('/meeting/book/create', tokenCheck, async (req, res) => {
  let meetingBook = req.body
  tryProcess(() => {
    await api.createMeetingBook(meetingBook)
    res.status(200).end()
  })
})

// 前台获取用户所有会议室预约表单
router.post('/meeting/book/list', tokenCheck, async (req, res) => {
  let { userId } = req.body
  tryProcess(() => {
    let meetingBookList = await api.getMeetingBookList(userId)
    res.status(200).send({ meetingBookList })
  })
})

// 前台创建会议室占用时间
router.get('/meeting/book', tokenCheck, async (req, res) => {
  tryProcess(() => {
    let occupiedTime = await api.getMeetingOccupiedTime()
    res.status(200).send({ occupiedTime })
  })
})

module.exports = router