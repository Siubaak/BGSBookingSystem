<template>
  <div id="material">
    <div v-show="!isLogin">
      <logmsg></logmsg>
    </div>
    <div v-show="isLogin">
      <div class="weui-cells__title">预约人及活动信息填写</div>
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
        <div class="weui-cell">
          <div class="weui-cell__hd"><label class="weui-label">活动名称</label></div>
          <div class="weui-cell__bd">
            <input class="weui-input" type="text" placeholder="请输入活动名称" v-model="activity">
          </div>
        </div>
      </div>
      <div class="weui-cells__title">领取时间及归还时间预约选择</div>
      <div class="weui-cells">
        <a class="weui-cell weui-cell_access" @click="takeDatePick">
          <div class="weui-cell__hd"><label class="weui-label">领取日期</label></div>
          <div class="weui-cell__bd">
            <p>{{ takeDate }}</p>
          </div>
          <div class="weui-cell__ft"></div>
        </a>
        <a class="weui-cell weui-cell_access" @click="returnDatePick">
          <div class="weui-cell__hd"><label class="weui-label">归还日期</label></div>
          <div class="weui-cell__bd">
            <p>{{ returnDate }}</p>
          </div>
          <div class="weui-cell__ft"></div>
        </a>
      </div>
      <p class="weui-btn-area">
          <a href="javascript:history.back();" class="weui-btn weui-btn_primary">提交申请</a>
        </p>
      <div class="weui-cells__tips">说明：请准确填写预约人姓名、联系方式、活动名称、领取时间、归还时间和物资借用列表，否则研会办公室将拒绝申请。只允许预约往后四天内（包括今天）的物资借用，并在领取后四天（包括领取当天）内归还，若某类物资无法预约借用，则表明该物资已被预约或借用。物资领取时间及归还时间为办公室值班时间，即每周一、三、五下午17:30-18:00。对于特殊情况，请联系办公室物资管理人员进行协商。</div>
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
      takeDate: '请选择日期',
      takeTime: [{}],
      returnDate: '请选择日期'
    }
  },
  methods: {
    takeDatePick () {
      const self = this
      const now = new Date()
      let end = new Date()
      end.setTime(now.getTime() + 345600000)
      weui.datePicker({
        start: now,
        end: end,
        defaultValue: now,
        cron: '* * 1,3,5',
        onConfirm: (result) => {
          self.takeDate = result[0].label + result[1].label + result[2].label
          self.takeTime = result
        },
        id: 'take-date-picker'
      })
    },
    returnDatePick () {
      const self = this
      let now = new Date()
      now.setFullYear(self.takeTime[0].value, self.takeTime[1].value - 1, self.takeTime[2].value)
      let end = new Date()
      end.setTime(now.getTime() + 345600000)
      weui.datePicker({
        start: now,
        end: end,
        defaultValue: now,
        cron: '* * 1,3,5',
        onConfirm: (result) => {
          self.returnDate = result[0].label + result[1].label + result[2].label
        },
        id: 'return-date-picker'
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
