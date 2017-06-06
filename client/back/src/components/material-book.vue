<template>
  <div id="material-book">
    <div class="panel panel-default">
      <div class="panel-heading">
        <h4 class="panel-title">
          <small><span class="glyphicon glyphicon-th-large" aria-hidden="true"></span></small>
          物资申请预约/借出列表
        </h4>
      </div>
      <ul class="list-group">
        <li class="list-group-item" v-for="(materialBook, index) in materialBooks">
          <small><span class="glyphicon glyphicon-modal-window" aria-hidden="true"></span></small> {{ materialBook.user }}
          <small><span class="glyphicon glyphicon-user" aria-hidden="true"></span></small> {{ materialBook.name }}
          <small><span class="glyphicon glyphicon-phone" aria-hidden="true"></span></small> {{ materialBook.phone }}<br>
          <small><span class="glyphicon glyphicon-flag" aria-hidden="true"></span></small> {{ materialBook.activity }}<br>
          <small><span class="glyphicon glyphicon-calendar" aria-hidden="true"></span></small> 预约{{ materialBook.takeDate }}领取<br>
          <small><span class="glyphicon glyphicon-calendar" aria-hidden="true"></span></small> 计划{{ materialBook.returnDate }}归还<br>
          <div v-show="materialBook.remark"><small><span class="glyphicon glyphicon-comment" aria-hidden="true"></span></small> {{ materialBook.remark }}</div>
          <small><span class="glyphicon glyphicon-book" aria-hidden="true"></span></small>
          <label v-for="(book, index) of materialBook.book">
            ({{ index + 1 }})&nbsp{{ book.name }}{{ book.book }}{{ book.unit }}&nbsp&nbsp
          </label><br>
          <div class="btn-group">
            <button type="button" class="btn btn-sm btn-primary dropdown-toggle"
                    :disabled="materialBook.condition === '借出' ? 'disabled' : null"
                    data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              借出
            </button>
            <ul class="dropdown-menu">
              <li class="edit-button">
                <div class="input-group">
                  <input v-model="ok" type="text" class="form-control input-sm" placeholder="输入bgs并确认">
                  <span class="input-group-btn">
                    <button class="btn btn-sm btn-primary" type="button" @click="materialBookUpdateCondition(materialBook._id, '借出')">确认</button>
                  </span>
                </div>
              </li>
            </ul>
          </div>
          <div class="btn-group">
            <button type="button" class="btn btn-sm btn-info dropdown-toggle"
                    :disabled="materialBook.condition !== '借出' ? 'disabled' : null"
                    data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              归还
            </button>
            <ul class="dropdown-menu">
              <li class="edit-button">
                <div class="input-group">
                  <input v-model="ok" type="text" class="form-control input-sm" placeholder="输入bgs并确认">
                  <span class="input-group-btn">
                    <button class="btn btn-sm btn-info" type="button" @click="materialBookUpdateCondition(materialBook._id, '归还')">确认</button>
                  </span>
                </div>
              </li>
            </ul>
          </div>
          <div class="btn-group">
            <button type="button" class="btn btn-sm btn-danger dropdown-toggle"
                    data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              作废
            </button>
            <ul class="dropdown-menu">
              <li class="edit-button">
                <div class="input-group">
                  <input v-model="ok" type="text" class="form-control input-sm" placeholder="输入bgs并确认">
                  <span class="input-group-btn">
                    <button class="btn btn-sm btn-danger" type="button" @click="materialBookUpdateCondition(materialBook._id, '作废')">确认</button>
                  </span>
                </div>
              </li>
            </ul>
          </div>
          <div class="btn-group">
            <button type="button" class="btn btn-sm btn-default dropdown-toggle" @click="materialBookListGet"
                    data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              备注
            </button>
            <ul class="dropdown-menu">
              <li class="edit-button">
                <div class="input-group">
                  <input v-model="materialBook.remark" type="text" class="form-control input-sm">
                  <span class="input-group-btn">
                    <button class="btn btn-sm btn-default" type="button" @click="materialBookUpdateRemark(materialBook)">确认</button>
                  </span>
                </div>
              </li>
            </ul>
          </div>
          <span class="label label-condition"
                :class="{ 'label-default': (materialBook.condition === '预约'),
                          'label-primary': (materialBook.condition === '借出') }">
            状态：{{ materialBook.condition }}
          </span>
        </li>
        <li class="list-group-item" v-show="!materialBooks.length">当前没有部门申请物资借用</li>
      </ul>
    </div>
    <button type="button" class="btn btn-info side-top" @click="materialBookListGet">
      <span class="glyphicon glyphicon-refresh" aria-hidden="true"></span>
    </button>
  </div>
</template>

<script>
import api from '../api'
export default {
  data () {
    return {
      ok: '',
      materialBooks: []
    }
  },
  methods: {
    materialBookUpdateRemark (materialBook) {
      api.materialBookUpdateRemark({ materialBookId: materialBook._id, remark: materialBook.remark })
        .then((res) => {
          if (res.status === 200) {
            this.materialBookListGet()
          } else {
            alert(res.data.msg)
          }
        }).catch((err) => {
          console.error(err)
          alert('物资申请备注修改出错，请稍后再试')
        })
    },
    materialBookUpdateCondition (materialBookId, condition) {
      if (this.ok === 'bgs') {
        api.materialBookUpdateCondition({ materialBookId }, condition)
          .then((res) => {
            if (res.status === 200) {
              this.materialBookListGet()
            } else {
              alert(res.data.msg)
            }
          }).catch((err) => {
            console.error(err)
            alert('物资申请状态更新出错，请稍后再试')
          })
        this.ok = ''
      } else {
        alert('请输入bgs并点击确认按钮以更新')
      }
    },
    materialBookListGet () {
      api.materialBookListGet()
        .then((res) => {
          if (res.status === 200) {
            this.materialBooks = res.data.materialBookList
          } else {
            alert(res.data.msg)
          }
        }).catch((err) => {
          console.error(err)
          alert('物资申请列表获取出错，请稍后再试')
        })
    }
  },
  beforeMount () {
    this.materialBookListGet()
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
.side-top {
  position: fixed;
  bottom: 60px;
  right: 15px;
}
</style>
