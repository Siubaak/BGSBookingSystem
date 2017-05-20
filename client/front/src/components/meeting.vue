<template>
  <div id="meeting">
    <div class="weui-cells__title">预约人信息填写</div>
    <div class="weui-cells weui-cells_form">
      <div class="weui-cell">
        <div class="weui-cell__hd">
          <label class="weui-label">预约人</label>
        </div>
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
    <div class="weui-cells__tips">说明：请准确填写预约人姓名、联系方式和借用时间，否则研会办公室将拒绝申请。只允许预约往后五天内（包括今天）的会议室，若某个借用时间没有出现在选择列表中，则表明该时间已被预约。对于特殊情况，请联系办公室物资管理人员进行协商。</div>
    <p class="weui-btn-area">
      <a href="javascript:history.back();" class="weui-btn weui-btn_primary">提交申请</a>
    </p>
  </div>
</template>

<script>
import logmsg from './logmsg'
import weui from 'weui.js'
export default {
  components: {
    logmsg
  },
  data () {
    return {
      userId: JSON.parse(window.atob(this.$store.state.token.split('.')[1])).id,
      name: '',
      phone: '',
      date: '请选择日期',
      dateIndex: 0,
      time: '请先选择借用日期',
      freeTime: [
        [false, true, true, false],
        [false, true, true, false],
        [false, true, true, false],
        [false, true, true, false],
        [false, false, false, false]
      ]
    }
  },
  methods: {
    datePick () {
      const now = new Date()
      let end = new Date()
      let day = ['日', '一', '二', '三', '四', '五', '六']
      let dateList = []
      for (let i = 0; i !== 5; ++i) {
        end.setTime(now.getTime() + 86400000 * i)
        dateList.push({
          label: `${end.getFullYear()}年${end.getMonth() + 1}月${end.getDate()}日 周${day[end.getDay()]}`,
          value: i
        })
      }
      weui.picker(dateList, {
        onConfirm: (result) => {
          this.date = result[0].label
          this.dateIndex = result[0].value
          console.log(this.dateIndex)
          this.time = '请选择时间'
        },
        id: 'date-picker'
      })
    },
    timePick () {
      if (this.time !== '请先选择借用日期') {
        let timeList = []
        if (this.freeTime[this.dateIndex][0]) {
          timeList.push({
            label: '中午 12:30-14:00',
            value: 0
          })
        }
        if (this.freeTime[this.dateIndex][1]) {
          timeList.push({
            label: '下午 17:30-19:00',
            value: 1
          })
        }
        if (this.freeTime[this.dateIndex][2]) {
          timeList.push({
            label: '晚上 19:00-20:30',
            value: 2
          })
        }
        if (this.freeTime[this.dateIndex][3]) {
          timeList.push({
            label: '晚上 20:30-22:00',
            value: 3
          })
        }
        if (timeList.length === 0) {
          timeList.push({
            label: '该日所有时间段均被预约',
            value: -1
          })
        }
        weui.picker(timeList, {
          onConfirm: (result) => {
            if (result[0].value !== -1) {
              this.time = result[0].label
            }
          },
          id: 'time-picker'
        })
      }
    }
  }
}
</script>
