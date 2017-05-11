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
          <small><span class="glyphicon glyphicon-star" aria-hidden="true"></span></small> {{ materialBookItem.user }}
          <small><span class="glyphicon glyphicon-user" aria-hidden="true"></span></small> {{ materialBookItem.name }}
          <small><span class="glyphicon glyphicon-phone" aria-hidden="true"></span></small> {{ materialBookItem.phone }}<br>
          <small><span class="glyphicon glyphicon-flag" aria-hidden="true"></span></small> {{ materialBookItem.activity }}<br>
          <small><span class="glyphicon glyphicon-calendar" aria-hidden="true"></span></small> {{ materialBookItem.takeDate }}领取，预计{{ materialBookItem.returnDate }}归还<br>
          <small><span class="glyphicon glyphicon-book" aria-hidden="true"></span></small>
          <label v-for="(bookItem, index) of materialBookItem.book">
            ({{ index + 1 }}){{ bookItem.material }}{{ bookItem.quantity === -1 ? '若干' : bookItem.quantity }}{{ bookItem.unit }}&nbsp
          </label>
          <div class="edit-group">
            <div class="btn-group">
              <button type="button" class="btn btn-sm btn-primary dropdown-toggle"
                      :disabled="materialBookItem.condition === 'lend' ? 'disabled' : null"
                      data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                借出
              </button>
              <ul class="dropdown-menu">
                <li class="delete">
                  <div class="input-group">
                    <input v-model="ok" type="text" class="form-control input-sm">
                    <span class="input-group-btn">
                      <button class="btn btn-sm btn-primary" type="button">确认</button>
                    </span>
                  </div>
                </li>
              </ul>
            </div>
            <div class="btn-group">
              <button type="button" class="btn btn-sm btn-info dropdown-toggle"
                      data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                归还
              </button>
              <ul class="dropdown-menu">
                <li class="delete">
                  <div class="input-group">
                    <input v-model="ok" type="text" class="form-control input-sm">
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
                <li class="delete">
                  <div class="input-group">
                    <input v-model="ok" type="text" class="form-control input-sm">
                    <span class="input-group-btn">
                      <button class="btn btn-sm btn-danger" type="button">确认</button>
                    </span>
                  </div>
                </li>
              </ul>
            </div>
            <span class="label label-default label-condition"
              :class="{ 'label-default': materialBookItem.condition === 'book',
                        'label-primary': materialBookItem.condition !== 'book'}">
              目前状态为：{{ materialBookItem.condition === 'book' ? '预约' : '借出' }}
            </span>
          </div>
        </li>
        <li class="list-group-item" v-show="!materialBooks.length">没有未处理</li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      ok: '',
      materialBooks: [{
        user: '[研会]文娱部',
        name: '傻逼',
        phone: '14382940375',
        activity: '西湖之声',
        book: [{
          material: '水',
          unit: '',
          quantity: -1
        },
        {
          material: '桌子',
          unit: '张',
          quantity: 1
        }],
        takeDate: '2017-05-04',
        returnDate: '2017-05-08',
        condition: 'book'
      },
      {
        user: '[研会]文娱部',
        name: '傻逼',
        phone: '14382940375',
        activity: '西湖之声',
        book: [{
          material: '水',
          unit: '',
          quantity: -1
        },
        {
          material: '桌子',
          unit: '张',
          quantity: 1
        }],
        takeDate: '2017-05-04',
        returnDate: '2017-05-08',
        condition: 'lend'
      }]
    }
  }
}
</script>

<style scoped>
.delete {
  padding: 0px 5px;
}
.edit {
  margin-top: 10px;
}
.label-condition {
  padding: 8px;
}
</style>
