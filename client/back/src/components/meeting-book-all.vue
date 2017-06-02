<template>
  <div id="meeting-book-all">
    <div class="panel panel-default">
      <div class="panel-heading">
        <h4 class="panel-title">
          <small><span class="glyphicon glyphicon-blackboard" aria-hidden="true"></span></small>
          会议室预约所有记录
        </h4>
      </div>
      <ul class="list-group">
        <li class="list-group-item" v-for="(meetingBook, index) in meetingBooks">
          <small><span class="glyphicon glyphicon-modal-window" aria-hidden="true"></span></small> {{ meetingBook.user }}
          <small><span class="glyphicon glyphicon-user" aria-hidden="true"></span></small> {{ meetingBook.name }}
          <small><span class="glyphicon glyphicon-phone" aria-hidden="true"></span></small> {{ meetingBook.phone }}<br>
          <small><span class="glyphicon glyphicon-flag" aria-hidden="true"></span></small> {{ meetingBook.activity }}<br>
          <small><span class="glyphicon glyphicon-calendar" aria-hidden="true"></span></small> {{ meetingBook.date }}<br>
          <small><span class="glyphicon glyphicon-time" aria-hidden="true"></span></small> {{ meetingBook.time }} 使用 <br>
          <div class="bottom-span"><small><span class="glyphicon glyphicon-book" aria-hidden="true"></span></small> {{ meetingBook.isPNeed ? '' : '不'}}需要使用投影仪</div>
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
                    <button class="btn btn-sm btn-danger" type="button" @click="meetingBookRemove(meetingBook._id)">确认</button>
                  </span>
                </div>
              </li>
            </ul>
          </div>
          <span class="label label-condition label-default" v-show="meetingBook.condition === 'book'">
            状态：预约
          </span>
          <span class="label label-condition label-info" v-show="meetingBook.condition === 'return'">
            状态：归还
          </span>
          <span class="label label-condition label-danger" v-show="meetingBook.condition === 'fail'">
            状态：作废
          </span>
        </li>
        <li class="list-group-item" v-show="!meetingBooks.length">无会议室预约记录</li>
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
      meetingBooks: []
    }
  },
  methods: {
    meetingBookRemove (meetingBookId) {
      if (this.ok === 'bgs') {
        api.meetingBookRemove({ meetingBookId })
          .then((res) => {
            if (res.status === 200) {
              this.meetingBookListGetAll()
            } else {
              alert(res.data.msg)
            }
          }).catch((err) => {
            console.error(err)
            alert('会议室预约删除出错，请稍后再试')
          })
        this.ok = ''
      } else {
        alert('请输入bgs并点击确认按钮以删除')
      }
    },
    meetingBookListGetAll () {
      api.meetingBookListGetAll()
        .then((res) => {
          if (res.status === 200) {
            this.meetingBooks = res.data.meetingBookList
          } else {
            alert(res.data.msg)
          }
        }).catch((err) => {
          console.error(err)
          alert('会议室预约列表获取出错，请稍后再试')
        })
    }
  },
  beforeMount () {
    this.meetingBookListGetAll()
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
.bottom-span {
  margin-bottom: 5px;
}
</style>
