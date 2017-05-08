<template>
  <div id="account">
    <div v-show="!isLogin">
      <logmsg></logmsg>
    </div>
    <div v-show="isLogin">
      <div class="weui-cells__title">我的信息</div>
      <div class="weui-cells weui-cells_form">
        <div class="weui-cell">
          <div class="weui-cell__hd">
            <label class="weui-label">部门</label>
          </div>
          <div class="weui-cell__bd">
            <label class="weui-label">部门</label>
          </div>
        </div>
        <div class="weui-cell">
          <div class="weui-cell__hd">
            <label class="weui-label">部长</label>
          </div>
          <div class="weui-cell__bd">
            <label class="weui-label">部门</label>
          </div>
        </div>
      </div>
      <div class="weui-cells__title">我的物资申请</div>
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
      <div class="weui-cells__title">我的会议室预约</div>
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
      <div class="weui-cells__title">设置</div>
      <div class="weui-cells">
        <a class="weui-cell weui-cell_access">
          <div class="weui-cell__hd"><label class="weui-label">信息更改</label></div>
          <div class="weui-cell__bd"></div>
          <div class="weui-cell__ft"></div>
        </a>
        <a class="weui-cell weui-cell_access">
          <div class="weui-cell__hd"><label class="weui-label">密码更改</label></div>
          <div class="weui-cell__bd"></div>
          <div class="weui-cell__ft"></div>
        </a>
        <a class="weui-cell weui-cell_access">
          <div class="weui-cell__hd"><label class="weui-label">注销账号</label></div>
          <div class="weui-cell__bd"></div>
          <div class="weui-cell__ft"></div>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import logmsg from './logmsg'
import store from '@/store'
export default {
  components: {
    logmsg
  },
  data () {
    return {
      isLogin: store.state.token !== null
    }
  }
}
</script>
