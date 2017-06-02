<template>
  <div id="material-book-all">
    <div class="panel panel-default">
      <div class="panel-heading">
        <h4 class="panel-title">
          <small><span class="glyphicon glyphicon-th-large" aria-hidden="true"></span></small>
          物资申请所有记录
        </h4>
      </div>
      <ul class="list-group">
        <li class="list-group-item" v-for="(materialBook, index) of materialBooks">
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
            <button type="button" class="btn btn-sm btn-danger dropdown-toggle"
                    data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              删除
            </button>
            <ul class="dropdown-menu">
              <li class="edit-button">
                <div class="input-group">
                  <input v-model="ok" type="text" class="form-control input-sm" placeholder="输入bgs并确认">
                  <span class="input-group-btn">
                    <button class="btn btn-sm btn-danger" type="button" @click="materialBookRemove(materialBook._id)">确认</button>
                  </span>
                </div>
              </li>
            </ul>
          </div>
          <span class="label label-condition label-default" v-show="materialBook.condition === 'book'">
            状态：预约
          </span>
          <span class="label label-condition label-primary" v-show="materialBook.condition === 'lend'">
            状态：借出
          </span>
          <span class="label label-condition label-info" v-show="materialBook.condition === 'return'">
            状态：归还
          </span>
          <span class="label label-condition label-danger" v-show="materialBook.condition === 'fail'">
            状态：作废
          </span>
        </li>
        <li class="list-group-item" v-show="!materialBooks.length">无物资申请记录</li>
      </ul>
    </div>
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
    materialBookRemove (materialBookId) {
      if (this.ok === 'bgs') {
        api.materialBookRemove({ materialBookId })
          .then((res) => {
            if (res.status === 200) {
              this.materialListGet()
              this.materialBookListGetAll()
            } else {
              alert(res.data.msg)
            }
          }).catch((err) => {
            console.error(err)
            alert('物资申请删除出错，请稍后再试')
          })
        this.ok = ''
      } else {
        alert('请输入bgs并点击确认按钮以删除')
      }
    },
    materialBookListGetAll () {
      api.materialBookListGetAll()
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
    this.materialBookListGetAll()
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
#edit {
  margin-top: 15px;
}
</style>
