<template>
  <div id="log" class="full-screen">
    <div class="weui-msg">
      <div class="weui-msg__icon-area"><i class="weui-icon-waiting weui-icon_msg"></i></div>
      <h2 class="weui-msg__title">登录</h2>
      <p class="weui-msg__desc">【初始密码为123456】</p>
      <p class="weui-msg__desc">首次登录请更改密码完善资料</p>
      <p class="weui-msg__desc">审核通过后方能获得操作权限</p>
      <div class="weui-msg__opr-area">
        <div class="weui-cells weui-cells_form">
          <a class="weui-cell weui-cell_access" @click="departmentPick">
            <div class="weui-cell__hd"><label class="weui-label">部门</label></div>
            <div class="weui-cell__bd">
              <p class="department-text">{{ department }}</p>
            </div>
            <div class="weui-cell__ft"></div>
          </a>
          <div class="weui-cell">
            <div class="weui-cell__hd">
              <label class="weui-label">密码</label>
            </div>
            <div class="weui-cell__bd">
              <input class="weui-input" type="password" placeholder="请输入密码" v-model="password">
            </div>
          </div>
        </div>
      </div>
      <div class="weui-msg__opr-area">
        <p class="weui-btn-area">
          <router-link to="/" class="weui-btn weui-btn_primary">登录</router-link>
          <a href="javascript:history.back();" class="weui-btn weui-btn_warn">取消</a>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import weui from 'weui.js'
export default {
  data () {
    return {
      department: '请选择部门',
      password: ''
    }
  },
  methods: {
    departmentPick () {
      weui.picker([
        {
          label: '[研会]学术部',
          value: 1
        },
        {
          label: '[研会]学术部',
          value: 2
        }
      ], {
        onConfirm: (result) => {
          this.department = result[0].label
        },
        id: 'material-picker'
      })
    }
  }
}
</script>

<style scoped>
.department-text {
  text-align: left !important;
}
</style>
