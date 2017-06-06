let express = require('express')
let path = require('path')
let router = express.Router()
let api = require('../api')
let tokenCreate = require('../token-mw/token-create-front')
let tokenCheck = require('../token-mw/token-check-front')
let sha1 = require('sha1')

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
      res.status(299).send({ code: 'data:user_not_found', msg: '用户不存在，已被后台删除' })
    }
  } catch (err) {
    console.error(err)
    res.status(500).send({ code: 'internal:unknow_error', msg: err })
  }
})

// 前台获取用户信息
router.post('/user/info', async (req, res) => {
  let { userId } = req.body
  try {
    let user = await api.getUserById(userId)
    if (user) {
      user._id = undefined
      user.password = undefined
      res.status(200).send({ user })
    } else {
      res.status(299).send({ code: 'data:user_not_found', msg: '用户不存在，已被后台删除' })
    }
  } catch (err) {
    console.error(err)
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
      res.status(299).send({ code: 'data:no_user_exist', msg: '无用户数据，请等待后台添加' })
    }
  } catch (err) {
    console.error(err)
    res.status(500).send({ code: 'internal:unknow_error', msg: err })
  }
})

// 前台更新用户信息
router.post('/user/update/info', async (req, res) => {
  let { userId, reName, rePhone, passwordForCheck } = req.body
  let userForUpdate = {
    _id: userId,
    reName: reName,
    rePhone: rePhone
  }
  try {
    let userForCheck = await api.getUserById(userId)
    if (userForCheck) {
      if (sha1(passwordForCheck) === userForCheck.password) {
        await api.updateUser(userForUpdate)
        res.status(200).end()
      } else {
        res.status(299).send({ code: 'auth:bad_password', msg: '原密码错误' })
      }
    } else {
      res.status(299).send({ code: 'data:user_not_found', msg: '用户不存在，已被后台删除' })
    }
  } catch (err) {
    console.error(err)
    res.status(500).send({ code: 'internal:unknow_error', msg: err })
  }
})

// 前台更新用户密码
router.post('/user/update/password', async (req, res) => {
  let { userId, newPassword, passwordForCheck } = req.body
  let userForUpdate = {
    _id: userId,
    password: sha1(newPassword)
  }
  try {
    let userForCheck = await api.getUserById(userId)
    if (userForCheck) {
      if (sha1(passwordForCheck) === userForCheck.password) {
        await api.updateUser(userForUpdate)
        res.status(200).end()
      } else {
        res.status(299).send({ code: 'auth:bad_password', msg: '原密码错误' })
      }
    } else {
      res.status(299).send({ code: 'data:user_not_found', msg: '用户不存在，已被后台删除' })
    }
  } catch (err) {
    console.error(err)
    res.status(500).send({ code: 'internal:unknow_error', msg: err })
  }
})

// 前台获取通知
router.get('/notification', async (req, res) => {
  try {
    let notification = await api.getNotification()
    res.status(200).send({ notification })
  } catch (err) {
    console.error(err)
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
      res.status(299).send({ code: 'data:no_material', msg: '所有物资均被预约或借用' })
    }
  } catch (err) {
    console.error(err)
    res.status(500).send({ code: 'internal:unknow_error', msg: err })
  }
})

// 前台创建物资申请表单
router.post('/material/book/create', tokenCheck, async (req, res) => {
  let { materialBook, materialBookItems } = req.body
  try {
    let result = await api.createMaterialBook(materialBook, materialBookItems)
    if (result === 'success') {
      res.status(200).end()
    } else {
      res.status(299).send({ code: 'data:full_material_book', msg: '该用户可进行物资申请次数已满' })
    }
  } catch (err) {
    console.error(err)
    res.status(500).send({ code: 'internal:unknow_error', msg: err })
  }
})

// 前台更新物资申请状态，更改为作废状态，用于用户撤回
router.post('/material/book/update/fail', tokenCheck, async (req, res) => {
  let { materialBookId } = req.body
  try {
    let materialBook = await api.getMaterialBookById(materialBookId)
    if (materialBook.condition !== '借出') {
      await api.updateMaterialBookCondition(materialBookId, '作废')
      res.status(200).end()
    } else {
      res.status(299).send({ code: 'data:lend_material', msg: '该物资申请处于借用状态，无法撤销' })
    }
  } catch (err) {
    console.error(err)
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
      res.status(299).send({ code: 'data:no_active_material_book_list', msg: '该用户无未处理的有效物资申请' })
    }
  } catch (err) {
    console.error(err)
    res.status(500).send({ code: 'internal:unknow_error', msg: err })
  }
})

// 前台创建会议室预约表单
router.post('/meeting/book/create', tokenCheck, async (req, res) => {
  let { meetingBook } = req.body
  try {
    let result = await api.createMeetingBook(meetingBook)
    if (result === 'success') {
      res.status(200).end()
    } else if (result === 'full') {
      res.status(299).send({ code: 'data:full_meeting_book', msg: '该用户可进行会议室预约次数已满' })
    } else {
      res.status(299).send({ code: 'data:meeting_booked', msg: '该时间段已被预约' })
    }
  } catch (err) {
    console.error(err)
    res.status(500).send({ code: 'internal:unknow_error', msg: err })
  }
})

// 前台更新会议室预约状态，更改为作废状态，用于部门撤回预约
router.post('/meeting/book/update/fail', tokenCheck, async (req, res) => {
  let { meetingBookId } = req.body
  try {
    await api.updateMeetingBookCondition(meetingBookId, '作废')
    res.status(200).end()
  } catch (err) {
    console.error(err)
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
      res.status(299).send({ code: 'data:no_active_meeting_book_list', msg: '该用户无未处理的有效会议室预约' })
    }
  } catch (err) {
    console.error(err)
    res.status(500).send({ code: 'internal:unknow_error', msg: err })
  }
})

// 前台创建会议室占用时间
router.get('/meeting/book', tokenCheck, async (req, res) => {
  try {
    let occupiedTime = await api.getMeetingOccupiedTime()
    res.status(200).send({ occupiedTime })
  } catch (err) {
    console.error(err)
    res.status(500).send({ code: 'internal:unknow_error', msg: err })
  }
})

module.exports = router