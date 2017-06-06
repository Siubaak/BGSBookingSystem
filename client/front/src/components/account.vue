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
                <input class="weui-input" type="text" placeholder="请输入部长姓名" v-model="reName">
              </div>
            </div>
            <div class="weui-cell">
              <div class="weui-cell__hd">
                <label class="weui-label">手机</label>
              </div>
              <div class="weui-cell__bd">
                <input class="weui-input" type="number" placeholder="请输入部长手机" v-model="rePhone">
              </div>
            </div>
            <div class="weui-cell">
              <div class="weui-cell__hd">
                <label class="weui-label">密码</label>
              </div>
              <div class="weui-cell__bd">
                <input class="weui-input" type="password" placeholder="请输入密码" v-model="passwordForCheck">
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
                <input class="weui-input" type="password" placeholder="请输入原密码" v-model="passwordForCheck">
              </div>
            </div>
            <div class="weui-cell">
              <div class="weui-cell__hd">
                <label class="weui-label">新密码</label>
              </div>
              <div class="weui-cell__bd">
                <input class="weui-input" type="password" placeholder="请输入新密码" v-model="newPassword">
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
          <div class="weui-cell__bd">{{ user.department }}</div>
        </div>
        <div class="weui-cell">
          <div class="weui-cell__hd">
            <label class="weui-label">部长</label>
          </div>
          <div class="weui-cell__bd">{{ user.reName ? user.reName : '请完善信息' }}</div>
        </div>
        <div class="weui-cell">
          <div class="weui-cell__hd">
            <label class="weui-label">手机</label>
          </div>
          <div class="weui-cell__bd">{{ user.rePhone ? user.rePhone : '请完善信息' }}</div>
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
      <div class="weui-cells__title">我们的物资申请</div>
      <div class="weui-cells">
        <a class="weui-cell weui-cell_access" v-for="materialBook in materialBookList" @click="materialBookUpdateFail(materialBook._id)">
          <div class="weui-cell__bd">
            活动：{{ materialBook.activity }}<br>
            预约人：{{ materialBook.name }} ({{ materialBook.phone }})<br>
            领取时间：{{ materialBook.takeDate }}<br>
            归还时间：{{ materialBook.returnDate }}<br>
            借用物资：<label v-for="(book, index) of materialBook.book"><b>({{ index + 1 }})&nbsp{{ book.name }}{{ book.book }}{{ book.unit }}&nbsp&nbsp</b></label><br>
            目前状态：{{ materialBook.condition }}
          </div>
          <div class="weui-cell__ft"></div>
        </a>
        <div class="weui-cell" v-show="!materialBookList.length">
          <div class="weui-cell__bd">暂无物资申请记录</div>
        </div>
      </div>
      <div class="weui-cells__title">我们的会议室预约</div>
      <div class="weui-cells">
        <a class="weui-cell weui-cell_access" v-for="meetingBook in meetingBookList" @click="meetingBookUpdateFail(meetingBook._id)">
          <div class="weui-cell__bd">
            会议：{{ meetingBook.activity }}<br>
            预约人：{{ meetingBook.name }} ({{ meetingBook.phone }})<br>
            预约日期：{{ meetingBook.date }}<br>
            预约时间：{{ meetingBook.time }}
          </div>
          <div class="weui-cell__ft"></div>
        </a>
        <div class="weui-cell" v-show="!meetingBookList.length">
          <div class="weui-cell__bd">暂无会议室预约记录</div>
        </div>
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
      reName: '',
      rePhone: '',
      passwordForCheck: '',
      newPassword: '',
      newPasswordForCheck: '',
      isInfoEdit: false,
      isPasswordEdit: false,
      materialBookList: [],
      meetingBookList: []
    }
  },
  methods: {
    infoEditClick () {
      this.isInfoEdit = !this.isInfoEdit
      this.newPassword = ''
      this.reName = ''
      this.rePhone = ''
      this.passwordForCheck = ''
      this.newPasswordForCheck = ''
    },
    passwordEditClick () {
      this.isPasswordEdit = !this.isPasswordEdit
      this.newPassword = ''
      this.reName = ''
      this.rePhone = ''
      this.passwordForCheck = ''
      this.newPasswordForCheck = ''
    },
    logout () {
      this.$store.dispatch('logout')
    },
    userUpdatePassword () {
      if (this.newPassword && this.newPasswordForCheck && this.passwordForCheck) {
        if (this.newPassword === this.newPasswordForCheck) {
          let loading = weui.loading('正在更新密码')
          api.userUpdatePassword({
            userId: this.userId,
            newPassword: this.newPassword,
            passwordForCheck: this.passwordForCheck
          }).then((res) => {
            loading.hide()
            if (res.status === 200) {
              weui.alert('更新密码成功，请重新登录', () => {
                this.passwordEditClick()
                this.$store.dispatch('logout')
              })
            } else {
              weui.alert(res.data.msg)
            }
          }).catch((err) => {
            loading.hide()
            console.error(err)
            weui.alert('更新出错，请稍后再试')
          })
        } else {
          weui.alert('两次输入的新密码不一致')
        }
      } else {
        weui.alert('请输入密码')
      }
    },
    userUpdateInfo () {
      if (this.reName && this.rePhone && this.passwordForCheck) {
        let loading = weui.loading('正在更新信息')
        api.userUpdateInfo({
          userId: this.userId,
          reName: this.reName,
          rePhone: this.rePhone,
          passwordForCheck: this.passwordForCheck
        }).then((res) => {
          loading.hide()
          if (res.status === 200) {
            weui.toast('更新信息成功', 1500)
            this.userInfoGet()
            this.infoEditClick()
          } else {
            weui.alert(res.data.msg)
          }
        }).catch((err) => {
          loading.hide()
          console.error(err)
          weui.alert('更新出错，请稍后再试')
        })
      } else {
        weui.alert('请输入更改信息和密码')
      }
    },
    userInfoGet () {
      api.userInfoGet({ userId: this.userId })
        .then((res) => {
          if (res.status === 200) {
            this.user = res.data.user
          } else {
            weui.alert(res.data.msg)
          }
        }).catch((err) => {
          console.error(err)
          weui.alert('用户信息加载出错，请尝试刷新页面')
        })
    },
    materialBookUpdateFail (materialBookId) {
      weui.actionSheet([{
        label: '撤销申请',
        onClick: () => {
          let loading = weui.loading('正在撤销')
          api.materialBookUpdateFail({ materialBookId })
            .then((res) => {
              loading.hide()
              if (res.status === 200) {
                weui.toast('撤销成功', 1500)
                this.materialBookListGet()
              } else {
                weui.alert(res.data.msg)
              }
            }).catch((err) => {
              loading.hide()
              console.error(err)
              weui.alert('物资申请撤销出错，请稍后再试')
            })
        }
      }], [{
        label: '取消',
        onClick: () => {}
      }])
    },
    materialBookListGet () {
      api.materialBookListGet({ userId: this.userId })
        .then((res) => {
          if (res.status === 200) {
            this.materialBookList = res.data.materialBookList
          } else {
            this.materialBookList = []
          }
        }).catch((err) => {
          console.error(err)
          weui.alert('用户物资申请列表加载出错，请尝试刷新页面')
        })
    },
    meetingBookUpdateFail (meetingBookId) {
      weui.actionSheet([{
        label: '撤销预约',
        onClick: () => {
          let loading = weui.loading('正在撤销')
          api.meetingBookUpdateFail({ meetingBookId })
            .then((res) => {
              loading.hide()
              if (res.status === 200) {
                weui.toast('撤销成功', 1500)
                this.meetingBookListGet()
              } else {
                weui.alert(res.data.msg)
              }
            }).catch((err) => {
              loading.hide()
              console.error(err)
              weui.alert('会议室预约撤销出错，请稍后再试')
            })
        }
      }], [{
        label: '取消',
        onClick: () => {}
      }])
    },
    meetingBookListGet () {
      api.meetingBookListGet({ userId: this.userId })
        .then((res) => {
          if (res.status === 200) {
            this.meetingBookList = res.data.meetingBookList
          } else {
            this.meetingBookList = []
          }
        }).catch((err) => {
          console.error(err)
          weui.alert('用户会议室预约列表加载出错，请尝试刷新页面')
        })
    }
  },
  beforeRouteEnter: (to, from, next) => {
    next((vm) => {
      vm.materialBookListGet()
      vm.meetingBookListGet()
    })
  },
  created () {
    this.userInfoGet()
  }
}
</script>
