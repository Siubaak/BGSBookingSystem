<template>
  <div id="user">
    <div class="panel panel-default">
      <div class="panel-heading">
        <h4 class="panel-title">
          <small><span class="glyphicon glyphicon-user" aria-hidden="true"></span></small>
          管理员账号设置
        </h4>
      </div>
      <div class="panel-body">
        <button type="button" data-toggle="collapse"
          href="#edit" class="btn btn-sm btn-primary btn-group btn-group-justified">
          <small><span class="glyphicon glyphicon-edit"></span></small>
          修改密码
        </button>
        <div id="edit" class="collapse">
          <form role="form" @submit.prevent="adminUpdate">
            <div class="form-group">
              <label for="password">原密码</label>
              <input type="password" class="form-control" id="password" placeholder="请输入原密码" required v-model="passwordForCheck"></input>
            </div>
            <div class="form-group">
              <label for="password">新密码</label>
              <input type="password" class="form-control bottom-span" id="password" placeholder="请输入新密码" required v-model="newPassword"></input>
              <input type="password" class="form-control" id="password" placeholder="请再次输入新密码" required v-model="newPasswordForCheck"></input>
            </div>
            <button type="submit" class="btn btn-sm btn-primary btn-group btn-group-justified">
              <small><span class="glyphicon glyphicon-floppy-disk"></span></small> 保存修改
            </button>
          </form>
        </div>
      </div>
    </div>
    <div class="panel panel-default">
      <div class="panel-heading">
        <h4 class="panel-title">
          <small><span class="glyphicon glyphicon-modal-window" aria-hidden="true"></span></small>
          部门用户列表
        </h4>
      </div>
      <div class="panel-body">
        <button type="button" data-toggle="collapse"
          href="#new" class="btn btn-sm btn-primary btn-group btn-group-justified">
          <small><span class="glyphicon glyphicon-plus"></span></small>
          添加新部门用户
        </button>
        <div id="new" class="collapse">
          <form role="form" @submit.prevent="userCreate">
            <div class="form-group">
              <label for="class">部门归属</label>
              <select class="form-control" v-model.number="isMain">
                <option value="1">研究生会</option>
                <option value="2">研究生团委</option>
                <option value="3">研究生分会</option>
              </select>
            </div>
            <div class="form-group">
              <label for="department">部门名称</label>
              <input type="text" class="form-control" id="department" placeholder="请输入部门名称" required v-model="department"></input>
            </div>
            <button type="submit" class="btn btn-sm btn-primary btn-group btn-group-justified">
              <small><span class="glyphicon glyphicon-floppy-disk"></span></small> 保存添加
            </button>
          </form>
        </div>
      </div>
      <ul class="list-group">
        <li class="list-group-item" v-for="(userItem, index) in users">
          <div class="bottom-span">
            <small><span class="glyphicon glyphicon-modal-window" aria-hidden="true"></span></small> {{ userItem.department }}
            <small v-show="userItem.reName"><span class="glyphicon glyphicon-user" aria-hidden="true"></span></small> {{ userItem.reName }}
            <small v-show="userItem.rePhone"><span class="glyphicon glyphicon-phone" aria-hidden="true"></span></small> {{ userItem.rePhone }}
          </div>
          <div class="btn-group">
            <button type="button" class="btn btn-sm btn-primary dropdown-toggle"
                    :disabled="userItem.isAuth ? 'disabled' : null"
                    data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              授权
            </button>
            <ul class="dropdown-menu">
              <li class="edit-button">
                <div class="input-group">
                  <input v-model="ok" type="text" class="form-control input-sm" placeholder="输入bgs并确认">
                  <span class="input-group-btn">
                    <button class="btn btn-sm btn-primary" type="button" @click="userAuth(userItem)">确认</button>
                  </span>
                </div>
              </li>
            </ul>
          </div>
          <div class="btn-group">
            <button type="button" class="btn btn-sm btn-info dropdown-toggle"
                    :disabled="!userItem.isAuth ? 'disabled' : null"
                    data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              销权
            </button>
            <ul class="dropdown-menu">
              <li class="edit-button">
                <div class="input-group">
                  <input v-model="ok" type="text" class="form-control input-sm" placeholder="输入bgs并确认">
                  <span class="input-group-btn">
                    <button class="btn btn-sm btn-info" type="button" @click="userAuth(userItem)">确认</button>
                  </span>
                </div>
              </li>
            </ul>
          </div>
          <div class="btn-group">
            <button type="button" class="btn btn-sm btn-danger dropdown-toggle"
                    data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              删除
            </button>
            <ul class="dropdown-menu">
              <li class="edit-button">
                <div class="input-group">
                  <input v-model="ok" type="text" class="form-control input-sm" placeholder="输入bgs并确认">
                  <span class="input-group-btn">
                    <button class="btn btn-sm btn-danger" type="button" @click="userRemove(userItem._id)">确认</button>
                  </span>
                </div>
              </li>
            </ul>
          </div>
          <div class="btn-group">
            <button type="button" class="btn btn-sm btn-default dropdown-toggle"
                    data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              重置
            </button>
            <ul class="dropdown-menu">
              <li class="edit-button">
                <div class="input-group">
                  <input v-model="ok" type="text" class="form-control input-sm" placeholder="输入bgs并确认">
                  <span class="input-group-btn">
                    <button class="btn btn-sm btn-default" type="button" @click="userReset(userItem)">确认</button>
                  </span>
                </div>
              </li>
            </ul>
          </div>
          <span class="label label-condition"
            :class="{ 'label-primary': userItem.isAuth,
                      'label-info': !userItem.isAuth }">
            状态：{{ userItem.isAuth ? '授权' : '未授权' }}
          </span>
        </li>
        <li class="list-group-item" v-show="!users.length">没有部门账号</li>
      </ul>
    </div>
  </div>
</template>

<script>
import api from '../api'
export default {
  data () {
    return {
      ok: '',
      adminId: JSON.parse(window.atob(this.$store.state.token.split('.')[1])).id,
      passwordForCheck: '',
      newPassword: '',
      newPasswordForCheck: '',
      department: '',
      isMain: '',
      users: []
    }
  },
  methods: {
    adminUpdate () {
      if (this.newPassword && this.newPasswordForCheck && this.passwordForCheck) {
        if (this.newPassword === this.newPasswordForCheck) {
          api.adminUpdate({
            adminId: this.adminId,
            newPassword: this.newPassword,
            passwordForCheck: this.passwordForCheck
          }).then((res) => {
            if (res.status === 200) {
              alert('更新管理员密码成功，请重新登录。')
              this.$store.dispatch('adminLogout')
            } else {
              alert(res.data.msg)
            }
          }).catch((err) => {
            console.error(err)
            alert('更新出错，请稍后再试')
          })
        } else {
          alert('两次输入的新密码不一致')
        }
      } else {
        alert('请输入密码')
      }
    },
    userCreate () {
      if (this.department && this.isMain) {
        let isMainSend = (this.isMain !== 3)
        api.userCreate({ department: this.department, isMain: isMainSend })
          .then((res) => {
            if (res.status === 200) {
              this.department = ''
              this.userListGet()
            } else {
              alert(res.data.msg)
            }
          }).catch((err) => {
            console.error(err)
            alert('创建出错，请稍后再试')
          })
      } else {
        alert('请正确填写信息')
      }
    },
    userRemove (userId) {
      if (this.ok === 'bgs') {
        api.userRemove({ userId })
          .then((res) => {
            if (res.status === 200) {
              this.userListGet()
            } else {
              alert(res.data.msg)
            }
          }).catch((err) => {
            console.error(err)
            alert('删除出错，请稍后再试')
          })
        this.ok = ''
      } else {
        alert('请输入bgs并点击确认按钮以删除')
      }
    },
    userAuth (user) {
      if (this.ok === 'bgs') {
        api.userAuth({ user })
          .then((res) => {
            if (res.status === 200) {
              this.userListGet()
            } else {
              alert(res.data.msg)
            }
          }).catch((err) => {
            console.error(err)
            alert('授权出错，请稍后再试')
          })
        this.ok = ''
      } else {
        alert('请输入bgs并点击确认按钮以授权')
      }
    },
    userReset (user) {
      if (this.ok === 'bgs') {
        api.userReset({ user })
          .then((res) => {
            if (res.status === 200) {
              this.userListGet()
            } else {
              alert(res.data.msg)
            }
          }).catch((err) => {
            console.error(err)
            alert('重置出错，请稍后再试')
          })
        this.ok = ''
      } else {
        alert('请输入bgs并点击确认按钮以重置')
      }
    },
    userListGet () {
      api.userListGet()
        .then((res) => {
          if (res.status === 200) {
            this.users = res.data.userList
          } else {
            this.users = []
          }
        }).catch((err) => {
          console.error(err)
          alert('用户列表获取出错，请稍后再试')
        })
    }
  },
  beforeMount () {
    this.userListGet()
  }
}
</script>

<style scoped>
.edit-button {
  padding: 0px 5px;
}
.label-condition {
  padding: 8px;
}
.bottom-span {
  margin-bottom: 5px;
}
#edit, #new {
  margin-top: 15px;
}
</style>
