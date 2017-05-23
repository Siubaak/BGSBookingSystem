let express = require('express')
let path = require('path')
let router = express.Router()
let api = require('../api')
let tokenCreate = require('../token-mw/token-create')
let tokenCheck = require('../token-mw/token-check')
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

// 后台登录路由，返回token
router.post('/admin/login', async (req, res) => {
  let { account, password } = req.body
  tryProcess(() => {
    let admin = await api.getAdmin(account)
    if (admin) {
      if (sha1(password) === admin.password) {
        res.status(200).send({ token: tokenCreate(admin) })
      } else {
        res.status(400).send({ code: 'auth:bad_password', msg: '密码错误' })
      }
    } else {
      res.status(400).send({ code: 'auth:user_not_found', msg: '用户名不存在' })
    }
  })
})

// 后台更新管理员密码
router.post('/admin/update/password', tokenCheck, async (req, res) => {
  let admin = req.body
  admin.password = sha1(admin.password)
  admin.oldPassword = sha1(admin.oldPassword)
  tryProcess(() => {
    let result = await api.updateAdmin(admin)
    if (result.result.n) {
      res.status(200).end()
    } else {
      res.status(400).send({ code: 'auth:bad_password', msg: '原密码错误' })
    }
  })
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
  tryProcess(() => {
    await api.createUser(user)
    res.status(200).end()
  })
})

// 后台更新部门用户授权
router.post('/admin/user/update/auth', tokenCheck, async (req, res) => {
  let user = req.body
  user.isAuth = !user.isAuth
  tryProcess(() => {
    await api.updateUser(user)
    res.status(200).end()
  })
})

// 后台重置部门用户
router.post('/admin/user/update/reset', tokenCheck, async (req, res) => {
  let user = req.body
  user.password = sha1('123456')
  user.isAuth = false
  user.reName = ''
  user.rePhone = ''
  tryProcess(() => {
    await api.updateUser(user)
    res.status(200).end()
  })
})

// 后台移除部门用户
router.post('/admin/user/remove', tokenCheck, async (req, res) => {
  let { userId } = req.body
  tryProcess(() => {
    await api.removeUser(userId)
    res.status(200).end()
  })
})

// 后台获取所有部门用户列表
router.get('/admin/user/list', tokenCheck, async (req, res) => {
  tryProcess(() => {
    let userList = await api.getUserList()
    res.status(200).send({ userList })
  })
})

// 后台获取通知公告
router.get('/admin/notification', tokenCheck, async (req, res) => {
  tryProcess(() => {
    let notification = await api.getNotification()
    res.status(200).send({ notification })
  })
})

// 后台编辑通知公告
router.post('/admin/notification/update', tokenCheck, async (req, res) => {
  let notification = req.body
  tryProcess(() => {
    await api.updateNotification(notification)
    res.status(200).end()
  })
})

// 后台创建物资
router.post('/admin/material/create', tokenCheck, async (req, res) => {
  let material = req.body
  tryProcess(() => {
    await api.createMaterial(material)
    res.status(200).end()
  })
})

// 后台更新物资
router.post('/admin/material/update', tokenCheck, async (req, res) => {
  let material = req.body
  tryProcess(() => {
    await api.updateMaterial(material)
    res.status(200).end()
  })
})

// 后台移除物资
router.post('/admin/material/remove', tokenCheck, async (req, res) => {
  let { materialId } = req.body
  tryProcess(() => {
    await api.removeMaterial(materialId)
    res.status(200).end()
  })
})

// 后台获取物资列表
router.get('/admin/material/list', tokenCheck, async (req, res) => {
  tryProcess(() => {
    let materialList = await api.getMaterialList(true)
    res.status(200).send({ materialList })
  })
})

// 后台更新物资申请状态，更改为借出状态
router.post('/admin/material/book/update/lend', tokenCheck, async (req, res) => {
  let { materialBookId } = req.body
  tryProcess(() => {
    await api.updateMaterialBookCondition(materialBookId, 'lend')
    res.status(200).end()
  })
})

// 后台更新物资申请状态，更改为归还状态
router.post('/admin/material/book/update/return', tokenCheck, async (req, res) => {
  let { materialBookId } = req.body
  tryProcess(() => {
    await api.updateMaterialBookCondition(materialBookId, 'return')
    res.status(200).end()
  })
})

// 后台更新物资申请状态，更改为作废状态
router.post('/admin/material/book/update/fail', tokenCheck, async (req, res) => {
  let { materialBookId } = req.body
  tryProcess(() => {
    await api.updateMaterialBookCondition(materialBookId, 'fail')
    res.status(200).end()
  })
})

// 后台删除物资申请
router.post('/admin/material/book/remove', tokenCheck, async (req, res) => {
  let { materialBookId } = req.body
  tryProcess(() => {
    await api.removeMaterialBook(materialBookId)
    res.status(200).end()
  })
})

// 后台获取所有未处理物资申请列表
router.get('/admin/material/book/list', tokenCheck, async (req, res) => {
  tryProcess(() => {
    let materialBookList = await api.getMaterialBookList('back')
    res.status(200).send({ materialBookList })
  })
})

// 后台获取所有物资申请列表
router.get('/admin/material/book/list/all', tokenCheck, async (req, res) => {
  tryProcess(() => {
    let materialBookList = await api.getMaterialBookList()
    res.status(200).send({ materialBookList })
  })
})

module.exports = router