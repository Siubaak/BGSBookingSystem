<template>
  <div id="material-book">
    <div class="panel panel-default">
      <div class="panel-heading">
        <h4 class="panel-title">
          <small><span class="glyphicon glyphicon-th-list" aria-hidden="true"></span></small>
          物资申请预约/借出列表
        </h4>
      </div>
      <ul class="list-group">
        <li class="list-group-item" v-for="(materialBookItem, index) in materialBooks">
          <small><span class="glyphicon glyphicon-modal-window" aria-hidden="true"></span></small> {{ materialBookItem.user }}
          <small><span class="glyphicon glyphicon-user" aria-hidden="true"></span></small> {{ materialBookItem.name }}
          <small><span class="glyphicon glyphicon-phone" aria-hidden="true"></span></small> {{ materialBookItem.phone }}<br>
          <small><span class="glyphicon glyphicon-flag" aria-hidden="true"></span></small> {{ materialBookItem.activity }}<br>
          <small><span class="glyphicon glyphicon-calendar" aria-hidden="true"></span></small> {{ materialBookItem.takeDate }}领取，预计{{ materialBookItem.returnDate }}归还<br>
          <div v-show="materialBookItem.remark"><small><span class="glyphicon glyphicon-comment" aria-hidden="true"></span></small> {{ materialBookItem.remark }}</div>
          <small><span class="glyphicon glyphicon-book" aria-hidden="true"></span></small>
          <label v-for="(bookItem, index) of materialBookItem.book">
            ({{ index + 1 }}){{ bookItem.name }}{{ bookItem.book === -1 ? '若干' : bookItem.book }}{{ bookItem.unit }}&nbsp
          </label><br>
          <div class="btn-group">
            <button type="button" class="btn btn-sm btn-primary dropdown-toggle"
                    :disabled="materialBookItem.condition === 'lend' ? 'disabled' : null"
                    data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              借出
            </button>
            <ul class="dropdown-menu">
              <li class="edit-button">
                <div class="input-group">
                  <input v-model="ok" type="text" class="form-control input-sm" placeholder="输入bgs并确认">
                  <span class="input-group-btn">
                    <button class="btn btn-sm btn-primary" type="button">确认</button>
                  </span>
                </div>
              </li>
            </ul>
          </div>
          <div class="btn-group">
            <button type="button" class="btn btn-sm btn-info dropdown-toggle"
                    :disabled="materialBookItem.condition !== 'lend' ? 'disabled' : null"
                    data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              归还
            </button>
            <ul class="dropdown-menu">
              <li class="edit-button">
                <div class="input-group">
                  <input v-model="ok" type="text" class="form-control input-sm" placeholder="输入bgs并确认">
                  <span class="input-group-btn">
                    <button class="btn btn-sm btn-info" type="button">确认</button>
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
                    <button class="btn btn-sm btn-danger" type="button">确认</button>
                  </span>
                </div>
              </li>
            </ul>
          </div>
          <div class="btn-group">
            <button type="button" class="btn btn-sm btn-default dropdown-toggle"
                    data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              备注
            </button>
            <ul class="dropdown-menu">
              <li class="edit-button">
                <div class="input-group">
                  <input v-model="materialBookItem.remark" type="text" class="form-control input-sm" placeholder="输入bgs并确认">
                  <span class="input-group-btn">
                    <button class="btn btn-sm btn-danger" type="button">确认</button>
                  </span>
                </div>
              </li>
            </ul>
          </div>
          <span class="label label-condition"
            :class="{ 'label-default': materialBookItem.condition === 'book',
                      'label-primary': materialBookItem.condition !== 'book'}">
            目前状态为：{{ materialBookItem.condition === 'book' ? '预约' : '借出' }}
          </span>
        </li>
        <li class="list-group-item" v-show="!materialBooks.length">当前没有部门申请物资借用</li>
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
    materialBookListGet () {
      api.materialBookListGet()
        .then((res) => {
          this.materialBooks = res.data.materialBookList
        })
        .catch((err) => {
          alert(err)
        })
    }
  },
  created () {
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
</style>
