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
      <a class="weui-cell weui-cell_access" @click="returnDatePick">
        <div class="weui-cell__hd"><label class="weui-label">归还日期</label></div>
        <div class="weui-cell__bd">
          <p>{{ returnDate }}</p>
        </div>
        <div class="weui-cell__ft"></div>
      </a>
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
    <div class="weui-cells__tips">说明：请准确填写预约人姓名、联系方式、活动名称、领取时间、归还时间和物资借用列表，否则研会办公室将拒绝申请。只允许预约往后五天内（包括今天）的物资借用，并在领取后五天（包括领取当天）内归还，若某类物资没有出现在添加列表中，则表明该物资已全部被预约或借用。物资领取时间及归还时间均为办公室值班时间，即每周一、三、五下午17:30-18:00。对于特殊情况，请联系办公室物资管理人员进行协商。</div>
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
      if (this.name && this.phone && this.activity && this.takeDate !== '请选择日期' && this.returnDate !== '请先选择领取日期' && this.returnDate !== '请选择日期' && this.materialBookItems.length) {
        let loading = weui.loading('正在提交')
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
          loading.hide()
          weui.toast(`${res.data.msg || res.data.err}`, 1500)
          this.name = ''
          this.phone = ''
          this.activity = ''
          this.takeDate = '请选择日期'
          this.returnDate = '请先选择领取日期'
          this.materialBookItems = []
          this.materials = []
          this.materialListGet()
        }).catch((err) => {
          loading.hide()
          weui.alert(`${err}`)
        })
      } else {
        weui.alert('请正确填写信息！')
      }
    },
    takeDatePick () {
      const now = new Date()
      const day = ['日', '一', '二', '三', '四', '五', '六']
      let end = new Date()
      let dateList = []
      for (let i = 0; i !== 5; ++i) {
        end.setTime(now.getTime() + 86400000 * i)
        if (end.getDay() === 1 || end.getDay() === 3 || end.getDay() === 5) {
          dateList.push({
            label: `${end.getFullYear()}年${end.getMonth() + 1}月${end.getDate()}日（周${day[end.getDay()]}）`,
            value: i
          })
        }
      }
      weui.picker(dateList, {
        onConfirm: (result) => {
          this.takeDate = result[0].label
          this.returnDate = '请选择日期'
        },
        id: 'take-date-picker'
      })
    },
    returnDatePick () {
      if (this.returnDate !== '请先选择领取日期') {
        const day = ['日', '一', '二', '三', '四', '五', '六']
        const yearIndex = this.takeDate.indexOf('年')
        const monthIndex = this.takeDate.indexOf('月')
        const dateIndex = this.takeDate.indexOf('日')
        let startDate = new Date()
        startDate.setFullYear(parseInt(this.takeDate.slice(0, yearIndex)), parseInt(this.takeDate.slice(yearIndex + 1, monthIndex) - 1), parseInt(this.takeDate.slice(monthIndex + 1, dateIndex)))
        let end = new Date()
        let dateList = []
        for (let i = 0; i !== 5; ++i) {
          end.setTime(startDate.getTime() + 86400000 * i)
          if (end.getDay() === 1 || end.getDay() === 3 || end.getDay() === 5) {
            dateList.push({
              label: `${end.getFullYear()}年${end.getMonth() + 1}月${end.getDate()}日（周${day[end.getDay()]}）`,
              value: i
            })
          }
        }
        weui.picker(dateList, {
          onConfirm: (result) => {
            this.returnDate = result[0].label
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
      this.materialListGet()
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
            if (selectedItem.index === i) {
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
  }
}
</script>
