<template>
  <div id="material">
    <div class="weui-cells__title">预约人及活动信息填写</div>
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
      <div class="weui-cell">
        <div class="weui-cell__hd"><label class="weui-label">领取时间</label></div>
        <div class="weui-cell__bd">
          <input class="weui-input" type="text" value="下午 17:30-18:00" disabled>
        </div>
      </div>
      <a class="weui-cell weui-cell_access" @click="returnDatePick">
        <div class="weui-cell__hd"><label class="weui-label">归还日期</label></div>
        <div class="weui-cell__bd">
          <p>{{ returnDate }}</p>
        </div>
        <div class="weui-cell__ft"></div>
      </a>
      <div class="weui-cell">
        <div class="weui-cell__hd"><label class="weui-label">归还时间</label></div>
        <div class="weui-cell__bd">
          <input class="weui-input" type="text" value="下午 17:30-18:00" disabled>
        </div>
      </div>
    </div>
    <div class="weui-cells__title">物资列表填写</div>
    <div class="weui-cells">
      <a class="weui-cell weui-cell_access" @click="numberPick(index, materialBookItem, materials[materialBookItem.index].left)" v-for="(materialBookItem, index) in materialBookItems">
        <div class="weui-cell__hd"><label class="weui-label">{{ materials[materialBookItem.index].name }}</label></div>
        <div class="weui-cell__bd">
          <p v-show="!materialBookItem.book">请选择数量，剩余{{ materials[materialBookItem.index].left > 20 ? 20 : materials[materialBookItem.index].left }}{{ materials[materialBookItem.index].unit }}</p>
          <p v-show="materialBookItem.book">{{ materialBookItem.book}}{{ materials[materialBookItem.index].unit }}</p>
        </div>
        <div class="weui-cell__ft"></div>
      </a>
      <a class="weui-cell weui-cell_access" @click="materialPick">
        <div class="weui-cell__bd">
          <p>添加</p>
        </div>
        <div class="weui-cell__ft"></div>
      </a>
    </div>
    <div class="weui-cells__tips">说明：请准确填写预约人姓名、联系方式、活动名称、领取时间、归还时间和物资借用列表，否则研会办公室将拒绝申请。只允许预约往后四天内（包括今天）的物资借用，并在领取后四天（包括领取当天）内归还，若某类物资没有出现在添加列表中，则表明该物资已全部被预约或借用。物资领取时间及归还时间均为办公室值班时间，即每周一、三、五下午17:30-18:00。对于特殊情况，请联系办公室物资管理人员进行协商。</div>
    <p class="weui-btn-area">
      <a @click="materialBookCreate" class="weui-btn weui-btn_primary">提交申请</a>
    </p>
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
      name: '',
      phone: '',
      activity: '',
      takeDate: '请选择日期',
      returnDate: '请先选择领取日期',
      materialBookItems: [],
      materials: []
    }
  },
  methods: {
    materialListGet () {
      api.materialListGet()
        .then((res) => {
          if (res.data.materialList.length) {
            this.materials = res.data.materialList
          } else {
            this.materials = []
          }
        })
        .catch((err) => {
          alert(err)
        })
    },
    materialBookCreate () {
      if (this.name && this.phone && this.activity && this.takeDate !== '请选择日期' && this.returnDate !== '请先选择领取日期' && this.returnDate !== '请选择日期' && this.materialBookItems) {
        api.materialBookCreate({
          materialBook: {
            userId: this.userId,
            name: this.name,
            phone: this.phone,
            activity: this.activity,
            takeDate: this.takeDate,
            returnDate: this.returnDate,
            remark: '',
            condition: 'book'
          },
          materialBookItems: this.materialBookItems
        }).then((res) => {
          weui.toast(`${res.data.msg || res.data.err}`, 2000)
        }).catch((err) => {
          weui.toast(`${err}`, 2000)
        })
      } else {
        weui.alert('请正确填写信息！')
      }
    },
    takeDatePick () {
      const now = new Date()
      let end = new Date()
      end.setTime(now.getTime() + 345600000)
      weui.datePicker({
        start: now,
        end: end,
        cron: '* * 1,3,5',
        onConfirm: (result) => {
          this.takeDate = result[0].label + result[1].label + result[2].label
          this.takeTime = result
          this.returnDate = '请选择日期'
        },
        id: 'take-date-picker'
      })
    },
    returnDatePick () {
      if (this.returnDate !== '请先选择领取日期') {
        let takeDate = new Date()
        takeDate.setFullYear(this.takeTime[0].value, this.takeTime[1].value - 1, this.takeTime[2].value)
        let end = new Date()
        end.setTime(takeDate.getTime() + 345600000)
        weui.datePicker({
          start: takeDate,
          end: end,
          cron: '* * 1,3,5',
          onConfirm: (result) => {
            this.returnDate = result[0].label + result[1].label + result[2].label
          },
          id: 'return-date-picker'
        })
      }
    },
    numberPick (index, materialBookItem, n) {
      let options = []
      options.push({
        label: `删除`,
        value: 0
      })
      if (n === -1) {
        options.push({
          label: '若干',
          value: -1
        })
      } else {
        for (let i = 1; i <= n; ++i) {
          options.push({
            label: `${i}`,
            value: i
          })
        }
      }
      weui.picker(options, {
        defaultValue: [1],
        onConfirm: (result) => {
          if (result[0].value) {
            materialBookItem.book = result[0].value
          } else {
            this.materialBookItems.splice(index, 1)
          }
        },
        id: 'number-picker'
      })
    },
    materialPick () {
      let options = []
      if (this.materials.length === this.materialBookItems.length) {
        options.push({
          label: '无',
          value: -1
        })
      } else {
        for (let i = 0; i < this.materials.length; ++i) {
          let isSelected = false
          for (let selectedItem of this.materialBookItems) {
            if (selectedItem.value === i) {
              isSelected = true
              break
            }
          }
          if (!isSelected) {
            options.push({
              label: `${this.materials[i].name}`,
              value: i
            })
          }
        }
      }
      weui.picker(options, {
        onConfirm: (result) => {
          if (result[0].value !== -1) {
            this.materialBookItems.push({
              index: result[0].value,
              userId: this.userId,
              materialId: this.materials[result[0].value]._id,
              book: 0,
              condition: 'book'
            })
          }
        },
        id: 'material-picker'
      })
    }
  },
  beforeMount () {
    this.materialListGet()
  }
}
</script>
