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
  try {
    let admin = await api.getAdminByAccount(account)
    if (admin) {
      if (sha1(password) === admin.password) {
        res.status(200).send({ token: tokenCreate(admin) })
      } else {
        res.status(299).send({ code: 'auth:bad_password', msg: '密码错误' })
      }
    } else {
      res.status(299).send({ code: 'auth:admin_not_found', msg: '管理员不存在，已被删除' })
    }
  } catch (err) {
    console.error(err)
    res.status(500).send({ code: 'internal:unknow_error', msg: err })
  }
})

// 后台更新管理员密码
router.post('/admin/update/password', async (req, res) => {
  let { adminId, newPassword, passwordForCheck} = req.body
  let adminForUpdate = {
    _id: adminId,
    password: sha1(newPassword)
  }
  try {
    let adminForCheck = await api.getAdminById(adminId)
    if (adminForCheck) {
      if (sha1(passwordForCheck) === adminForCheck.password) {
        await api.updateAdmin(adminForUpdate)
        res.status(200).end()
      } else {
        res.status(299).send({ code: 'auth:bad_password', msg: '原密码错误' })
      }
    } else {
      res.status(299).send({ code: 'data:admin_not_found', msg: '管理员不存在，已被删除' })
    }
  } catch (err) {
    console.error(err)
    res.status(500).send({ code: 'internal:unknow_error', msg: err })
  }
})

// 后台创建部门用户
router.post('/admin/user/create', tokenCheck, async (req, res) => {
  let { department, isMain } = req.body
  let user = {
    department: department,
    password: sha1('123456'),
    isAuth: false,
    isMain: isMain,
    reName: '',
    rePhone: '',
    materialBook: 0,
    meetingBook: 0
  }
  try {
    await api.createUser(user)
    res.status(200).end()
  } catch (err) {
    console.error(err)
    res.status(500).send({ code: 'internal:unknow_error', msg: err })
  }
})

// 后台更新部门用户授权
router.post('/admin/user/update/auth', tokenCheck, async (req, res) => {
  let { user } = req.body
  user.isAuth = !user.isAuth
  try {
    await api.updateUser(user)
    res.status(200).end()
  } catch (err) {
    console.error(err)
    res.status(500).send({ code: 'internal:unknow_error', msg: err })
  }
})

// 后台重置部门用户
router.post('/admin/user/update/reset', tokenCheck, async (req, res) => {
  let { user } = req.body
  user.password = sha1('123456')
  user.isAuth = false
  user.reName = ''
  user.rePhone = ''
  try {
    await api.updateUser(user)
    res.status(200).end()
  } catch (err) {
    console.error(err)
    res.status(500).send({ code: 'internal:unknow_error', msg: err })
  }
})

// 后台移除部门用户
router.post('/admin/user/remove', tokenCheck, async (req, res) => {
  let { userId } = req.body
  try {
    await api.removeUser(userId)
    res.status(200).end()
  } catch (err) {
    console.error(err)
    res.status(500).send({ code: 'internal:unknow_error', msg: err })
  }
})

// 后台获取所有部门用户列表
router.get('/admin/user/list', tokenCheck, async (req, res) => {
  try {
    let userList = await api.getUserList()
    res.status(200).send({ userList })
  } catch (err) {
    console.error(err)
    res.status(500).send({ code: 'internal:unknow_error', msg: err })
  }
})

// 后台获取通知公告
router.get('/admin/notification', tokenCheck, async (req, res) => {
  try {
    let notification = await api.getNotification()
    res.status(200).send({ notification })
  } catch (err) {
    console.error(err)
    res.status(500).send({ code: 'internal:unknow_error', msg: err })
  }
})

// 后台编辑通知公告
router.post('/admin/notification/update', tokenCheck, async (req, res) => {
  let { notification } = req.body
  try {
    await api.updateNotification(notification)
    res.status(200).end()
  } catch (err) {
    console.error(err)
    res.status(500).send({ code: 'internal:unknow_error', msg: err })
  }
})

// 后台创建物资
router.post('/admin/material/create', tokenCheck, async (req, res) => {
  let { material } = req.body
  try {
    await api.createMaterial(material)
    res.status(200).end()
  } catch (err) {
    console.error(err)
    res.status(500).send({ code: 'internal:unknow_error', msg: err })
  }
})

// 后台更新物资
router.post('/admin/material/update/quantity', tokenCheck, async (req, res) => {
  let { materialId, quantity } = req.body
  let material = {
    _id: materialId,
    quantity: quantity
  }
  try {
    await api.updateMaterial(material)
    res.status(200).end()
  } catch (err) {
    console.error(err)
    res.status(500).send({ code: 'internal:unknow_error', msg: err })
  }
})

// 后台移除物资
router.post('/admin/material/remove', tokenCheck, async (req, res) => {
  let { materialId } = req.body
  try {
    await api.removeMaterial(materialId)
    res.status(200).end()
  } catch (err) {
    console.error(err)
    res.status(500).send({ code: 'internal:unknow_error', msg: err })
  }
})

// 后台获取物资列表
router.get('/admin/material/list', tokenCheck, async (req, res) => {
  try {
    let materialList = await api.getMaterialList(true)
    res.status(200).send({ materialList })
  } catch (err) {
    console.error(err)
    res.status(500).send({ code: 'internal:unknow_error', msg: err })
  }
})

// 后台更新物资申请状态，更改为借出状态
router.post('/admin/material/book/update/lend', tokenCheck, async (req, res) => {
  let { materialBookId } = req.body
  try {
    await api.updateMaterialBookCondition(materialBookId, 'lend')
    res.status(200).end()
  } catch (err) {
    console.error(err)
    res.status(500).send({ code: 'internal:unknow_error', msg: err })
  }
})

// 后台更新物资申请状态，更改为归还状态
router.post('/admin/material/book/update/return', tokenCheck, async (req, res) => {
  let { materialBookId } = req.body
  try {
    await api.updateMaterialBookCondition(materialBookId, 'return')
    res.status(200).end()
  } catch (err) {
    console.error(err)
    res.status(500).send({ code: 'internal:unknow_error', msg: err })
  }
})

// 后台更新物资申请状态，更改为作废状态
router.post('/admin/material/book/update/fail', tokenCheck, async (req, res) => {
  let { materialBookId } = req.body
  try {
    let materialBook = await api.getMaterialBookById(materialBookId)
    if (materialBook.condition !== 'lend') {
      await api.updateMaterialBookCondition(materialBookId, 'fail')
      res.status(200).end()
    } else {
      res.status(299).send({ code: 'data:lend_material', msg: '该物资申请处于借出状态，无法作废' })
    }
  } catch (err) {
    console.error(err)
    res.status(500).send({ code: 'internal:unknow_error', msg: err })
  }
})

// 后台更新物资备注
router.post('/admin/material/book/update/remark', tokenCheck, async (req, res) => {
  let { materialBookId, remark } = req.body
  let materialBook = {
    _id: materialBookId,
    remark: remark
  }
  try {
    await api.updateMaterialBook(materialBook)
    res.status(200).end()
  } catch (err) {
    console.error(err)
    res.status(500).send({ code: 'internal:unknow_error', msg: err })
  }
})

// 后台删除物资申请
router.post('/admin/material/book/remove', tokenCheck, async (req, res) => {
  let { materialBookId } = req.body
  try {
    let materialBook = await api.getMaterialBookById(materialBookId)
    if (materialBook.condition !== 'lend') {
      await api.removeMaterialBook(materialBookId)
      res.status(200).end()
    } else {
      res.status(299).send({ code: 'data:lend_material', msg: '该物资申请处于借出状态，无法删除' })
    }
  } catch (err) {
    console.error(err)
    res.status(500).send({ code: 'internal:unknow_error', msg: err })
  }
})

// 后台获取所有未处理物资申请列表
router.get('/admin/material/book/list', tokenCheck, async (req, res) => {
  try {
    let materialBookList = await api.getMaterialBookList('back')
    res.status(200).send({ materialBookList })
  } catch (err) {
    console.error(err)
    res.status(500).send({ code: 'internal:unknow_error', msg: err })
  }
})

// 后台获取所有物资申请列表
router.get('/admin/material/book/list/all', tokenCheck, async (req, res) => {
  try {
    let materialBookList = await api.getMaterialBookList()
    res.status(200).send({ materialBookList })
  } catch (err) {
    console.error(err)
    res.status(500).send({ code: 'internal:unknow_error', msg: err })
  }
})

// 后台更新会议室预约状态，更改为作废状态
router.post('/admin/meeting/book/update/fail', tokenCheck, async (req, res) => {
  let { meetingBookId } = req.body
  try {
    await api.updateMeetingBookCondition(meetingBookId, 'fail')
    res.status(200).end()
  } catch (err) {
    console.error(err)
    res.status(500).send({ code: 'internal:unknow_error', msg: err })
  }
})

// 后台删除会议室预约
router.post('/admin/meeting/book/remove', tokenCheck, async (req, res) => {
  let { meetingBookId } = req.body
  try {
    await api.removeMeetingBook(meetingBookId)
    res.status(200).end()
  } catch (err) {
    console.error(err)
    res.status(500).send({ code: 'internal:unknow_error', msg: err })
  }
})

// 后台获取所有未处理会议室预约列表
router.get('/admin/meeting/book/list', tokenCheck, async (req, res) => {
  try {
    let meetingBookList = await api.getMeetingBookList('back')
    res.status(200).send({ meetingBookList })
  } catch (err) {
    console.error(err)
    res.status(500).send({ code: 'internal:unknow_error', msg: err })
  }
})

// 后台获取所有会议室预约列表
router.get('/admin/meeting/book/list/all', tokenCheck, async (req, res) => {
  try {
    let meetingBookList = await api.getMeetingBookList()
    res.status(200).send({ meetingBookList })
  } catch (err) {
    console.error(err)
    res.status(500).send({ code: 'internal:unknow_error', msg: err })
  }
})

module.exports = router