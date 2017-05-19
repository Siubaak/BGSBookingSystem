<template>
  <div id="account">
    <div v-show="isInfoEdit">
      <div class="weui-msg">
        <div class="weui-msg__icon-area"><i class="weui-icon-info weui-icon_msg"></i></div>
        <h2 class="weui-msg__title">信息更改</h2>
        <p class="weui-msg__desc">请完善部长信息用以审核授权</p>
        <div class="weui-msg__opr-area">
          <div class="weui-cells weui-cells_form">
            <div class="weui-cell">
              <div class="weui-cell__hd">
                <label class="weui-label">姓名</label>
              </div>
              <div class="weui-cell__bd">
                <input class="weui-input" type="text" placeholder="请输入部长姓名" v-model="userForUpdate.reName">
              </div>
            </div>
            <div class="weui-cell">
              <div class="weui-cell__hd">
                <label class="weui-label">手机</label>
              </div>
              <div class="weui-cell__bd">
                <input class="weui-input" type="number" placeholder="请输入部长手机" v-model="userForUpdate.rePhone">
              </div>
            </div>
            <div class="weui-cell">
              <div class="weui-cell__hd">
                <label class="weui-label">密码</label>
              </div>
              <div class="weui-cell__bd">
                <input class="weui-input" type="password" placeholder="请输入密码" v-model="userForUpdate.passwordForCheck">
              </div>
            </div>
          </div>
        </div>
        <div class="weui-msg__opr-area">
          <p class="weui-btn-area">
            <a @click="userUpdateInfo" class="weui-btn weui-btn_primary">修改</a>
            <a @click="infoEditClick" class="weui-btn weui-btn_warn">取消</a>
          </p>
        </div>
      </div>
    </div>
    <div v-show="isPasswordEdit">
      <div class="weui-msg">
        <div class="weui-msg__icon-area"><i class="weui-icon-warn weui-icon_msg-primary"></i></div>
        <h2 class="weui-msg__title">密码更改</h2>
        <p class="weui-msg__desc">初始密码为123456，首次登录请自行更改密码</p>
        <div class="weui-msg__opr-area">
          <div class="weui-cells weui-cells_form">
            <div class="weui-cell">
              <div class="weui-cell__hd">
                <label class="weui-label">原密码</label>
              </div>
              <div class="weui-cell__bd">
                <input class="weui-input" type="password" placeholder="请输入原密码" v-model="userForUpdate.passwordForCheck">
              </div>
            </div>
            <div class="weui-cell">
              <div class="weui-cell__hd">
                <label class="weui-label">新密码</label>
              </div>
              <div class="weui-cell__bd">
                <input class="weui-input" type="password" placeholder="请输入新密码" v-model="userForUpdate.password">
              </div>
            </div>
            <div class="weui-cell">
              <div class="weui-cell__hd">
                <label class="weui-label"></label>
              </div>
              <div class="weui-cell__bd">
                <input class="weui-input" type="password" placeholder="请再次输入新密码" v-model="newPasswordForCheck">
              </div>
            </div>
          </div>
        </div>
        <div class="weui-msg__opr-area">
          <p class="weui-btn-area">
            <a @click="userUpdatePassword" class="weui-btn weui-btn_primary">修改</a>
            <a @click="passwordEditClick" class="weui-btn weui-btn_warn">取消</a>
          </p>
        </div>
      </div>
    </div>
    <div v-show="!isInfoEdit && !isPasswordEdit">
      <div class="weui-cells__title">部门信息</div>
      <div class="weui-cells weui-cells_form">
        <div class="weui-cell">
          <div class="weui-cell__hd">
            <label class="weui-label">部门</label>
          </div>
          <div class="weui-cell__bd">
            <label class="weui-label">{{ user.department }}</label>
          </div>
        </div>
        <div class="weui-cell">
          <div class="weui-cell__hd">
            <label class="weui-label">部长</label>
          </div>
          <div class="weui-cell__bd">
            <label class="weui-label">{{ user.reName ? user.reName : '请完善信息' }}</label>
          </div>
        </div>
        <div class="weui-cell">
          <div class="weui-cell__hd">
            <label class="weui-label">手机</label>
          </div>
          <div class="weui-cell__bd">
            <label class="weui-label">{{ user.rePhone ? user.rePhone : '请完善信息' }}</label>
          </div>
        </div>
      </div>
      <div class="weui-cells__title">我们的物资申请</div>
      <div class="weui-cells weui-cells_form">
        <div class="weui-cell">
          <div class="weui-cell__hd">
            <label class="weui-label">部门</label>
          </div>
          <div class="weui-cell__bd">
            <label class="weui-label">部门</label>
          </div>
        </div>
      </div>
      <div class="weui-cells__title">我们的会议室预约</div>
      <div class="weui-cells weui-cells_form">
        <div class="weui-cell">
          <div class="weui-cell__hd">
            <label class="weui-label">部门</label>
          </div>
          <div class="weui-cell__bd">
            <label class="weui-label">部门</label>
          </div>
        </div>
      </div>
      <div class="weui-cells__title">部门账号设置</div>
      <div class="weui-cells">
        <a class="weui-cell weui-cell_access" @click="infoEditClick">
          <div class="weui-cell__hd"><label class="weui-label">信息更改</label></div>
          <div class="weui-cell__bd"></div>
          <div class="weui-cell__ft"></div>
        </a>
        <a class="weui-cell weui-cell_access" @click="passwordEditClick">
          <div class="weui-cell__hd"><label class="weui-label">密码更改</label></div>
          <div class="weui-cell__bd"></div>
          <div class="weui-cell__ft"></div>
        </a>
      </div>
      <div class="weui-msg__opr-area">
        <p class="weui-btn-area">
          <a @click="logout" class="weui-btn weui-btn_warn">注销</a>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../api'
import logmsg from './logmsg'
import weui from 'weui.js'
export default {
  components: {
    logmsg
  },
  data () {
    return {
      userId: JSON.parse(window.atob(this.$store.state.token.split('.')[1])).id,
      user: {},
      userForUpdate: {
        _id: JSON.parse(window.atob(this.$store.state.token.split('.')[1])).id,
        password: '',
        reName: '',
        rePhone: '',
        passwordForCheck: ''
      },
      newPasswordForCheck: '',
      isInfoEdit: false,
      isPasswordEdit: false
    }
  },
  methods: {
    infoEditClick () {
      this.isInfoEdit = !this.isInfoEdit
      this.userForUpdate.password = ''
      this.userForUpdate.reName = ''
      this.userForUpdate.rePhone = ''
      this.userForUpdate.passwordForCheck = ''
      this.newPasswordForCheck = ''
    },
    passwordEditClick () {
      this.isPasswordEdit = !this.isPasswordEdit
      this.userForUpdate.password = ''
      this.userForUpdate.reName = ''
      this.userForUpdate.rePhone = ''
      this.userForUpdate.passwordForCheck = ''
      this.newPasswordForCheck = ''
    },
    logout () {
      this.$store.dispatch('logout')
    },
    userUpdatePassword () {
      if (this.userForUpdate.password && this.newPasswordForCheck && this.userForUpdate.passwordForCheck) {
        if (this.userForUpdate.password === this.newPasswordForCheck) {
          api.userUpdatePassword({ user: this.userForUpdate })
            .then((res) => {
              if (res.data.msg === '更新成功') {
                weui.toast(res.data.msg, 1500)
                this.userGet()
                this.passwordEditClick()
              } else {
                weui.alert(res.data.msg || res.data.err)
              }
            })
        } else {
          weui.alert('两次输入的新密码不一致')
        }
      } else {
        weui.alert('请正确输入密码')
      }
    },
    userUpdateInfo () {
      if (this.userForUpdate.reName && this.userForUpdate.rePhone && this.userForUpdate.passwordForCheck) {
        api.userUpdateInfo({ user: this.userForUpdate })
          .then((res) => {
            if (res.data.msg === '更新成功') {
              weui.toast(res.data.msg, 1500)
              this.userGet()
              this.infoEditClick()
            } else {
              weui.alert(res.data.msg || res.data.err)
            }
          })
      } else {
        weui.alert('请输入更改信息和密码')
      }
    },
    userGet () {
      api.userGet({ userId: this.userId })
        .then((res) => {
          this.user = res.data.user
        })
    }
  },
  beforeMount () {
    this.userGet()
  }
}
</script>
