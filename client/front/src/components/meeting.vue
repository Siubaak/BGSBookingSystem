<template>
  <div id="meeting">
    <div v-show="!isLogin">
      <logmsg></logmsg>
    </div>
    <div v-show="isLogin">
      <div class="weui-cells__title">预约人信息填写</div>
      <div class="weui-cells weui-cells_form">
        <div class="weui-cell">
          <div class="weui-cell__hd"><label class="weui-label">预约人</label></div>
          <div class="weui-cell__bd">
            <input class="weui-input" type="text" placeholder="请输入姓名" v-model="name">
          </div>
        </div>
        <div class="weui-cell">
          <div class="weui-cell__hd">
            <label class="weui-label">联系方式</label>
          </div>
          <div class="weui-cell__bd">
            <input class="weui-input" type="number" pattern="[0-9]*" placeholder="请输入手机号" v-model="phone">
          </div>
        </div>
      </div>
      <div class="weui-cells__title">借用时间预约选择</div>
      <div class="weui-cells">
        <a class="weui-cell weui-cell_access" @click="datePick">
          <div class="weui-cell__hd"><label class="weui-label">借用日期</label></div>
          <div class="weui-cell__bd">
            <p>{{ date }}</p>
          </div>
          <div class="weui-cell__ft"></div>
        </a>
        <a class="weui-cell weui-cell_access" @click="timePick">
          <div class="weui-cell__hd"><label class="weui-label">借用时间段</label></div>
          <div class="weui-cell__bd">
            <p>{{ time }}</p>
          </div>
          <div class="weui-cell__ft"></div>
        </a>
      </div>
      <div class="weui-cells__title">投影仪使用申请勾选</div>
      <div class="weui-cells weui-cells_checkbox">
        <label class="weui-cell weui-check__label" for="projection">
          <div class="weui-cell__hd">
            <input type="checkbox" class="weui-check" name="checkbox" id="projection">
            <i class="weui-icon-checked"></i>
          </div>
          <div class="weui-cell__bd">
            <p>需要使用投影仪</p>
          </div>
        </label>
      </div>
      <p class="weui-btn-area">
          <a href="javascript:history.back();" class="weui-btn weui-btn_primary">提交申请</a>
        </p>
      <div class="weui-cells__tips">说明：请准确填写预约人姓名、联系方式和借用时间，否则研会办公室将拒绝申请。只允许预约往后五天内（包括今天）的会议室，若某个借用时间无法选择，则表明该时间已被预约。</div>
    </div>
  </div>
</template>

<script>
import logmsg from './logmsg'
import store from '@/store'
import weui from 'weui.js'
export default {
  components: {
    logmsg
  },
  data () {
    return {
      isLogin: store.state.token === null,
      name: '',
      phone: '',
      date: '请选择日期',
      time: '请选择时间'
    }
  },
  methods: {
    datePick () {
      const self = this
      const now = new Date()
      let end = new Date()
      end.setTime(now.getTime() + 432000000)
      weui.datePicker({
        start: now,
        end: end,
        defaultValue: now,
        onConfirm: (result) => {
          self.date = result[0].label + result[1].label + result[2].label
        },
        id: 'date-picker'
      })
    },
    timePick () {
      const self = this
      weui.picker([
        {
          label: '中午 12:30-14:00',
          value: 0
        },
        {
          label: '下午 17:30-19:00',
          value: 1
        },
        {
          label: '晚上 19:00-20:30',
          value: 2
        },
        {
          label: '晚上 20:30-22:00',
          value: 3
        }
      ], {
        defaultValue: [0],
        onConfirm: (result) => {
          self.time = result[0].label
        },
        id: 'time-picker'
      })
    }
  }
}
</script>

<style scoped>
.weui-btn-area {
  margin: 15px !important;
}
</style>
