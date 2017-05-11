<template>
  <div id="meeting-book">
    <div class="panel panel-default">
      <div class="panel-heading">
        <h4 class="panel-title">
          <small><span class="glyphicon glyphicon-blackboard" aria-hidden="true"></span></small>
          会议室预约列表
        </h4>
      </div>
      <ul class="list-group">
        <li class="list-group-item" v-for="(meetingBookItem, index) in meetingBooks">
          <small><span class="glyphicon glyphicon-star" aria-hidden="true"></span></small> {{ meetingBookItem.user }}
          <small><span class="glyphicon glyphicon-user" aria-hidden="true"></span></small> {{ meetingBookItem.name }}
          <small><span class="glyphicon glyphicon-phone" aria-hidden="true"></span></small> {{ meetingBookItem.phone }}<br>
          <small><span class="glyphicon glyphicon-flag" aria-hidden="true"></span></small> {{ meetingBookItem.activity }}<br>
          <small><span class="glyphicon glyphicon-time" aria-hidden="true"></span></small> {{ meetingBookItem.date }} {{ meetingBookItem.time }} 使用<br>
          <div class="bottom-span"><small><span class="glyphicon glyphicon-book" aria-hidden="true"></span></small> {{ meetingBookItem.isPNeed ? '' : '不'}}需要使用投影仪</div>
          <div class="edit-group">
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
              :class="{ 'label-default': meetingBookItem.condition === 'book',
                        'label-primary': meetingBookItem.condition !== 'book'}">
              目前状态为：{{ meetingBookItem.condition === 'book' ? '预约' : '归还' }}
            </span>
          </div>
        </li>
        <li class="list-group-item" v-show="!meetingBooks.length">没有未处理</li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      ok: '',
      meetingBooks: [{
        user: '[研会]文娱部',
        name: '傻逼',
        phone: '14382940375',
        activity: '活动申报',
        date: '2017-05-04',
        time: '中午12:30-14:00',
        isPNeed: true,
        condition: 'book'
      },
      {
        user: '[研会]文娱部',
        name: '傻逼',
        phone: '14382940375',
        activity: '活动申报',
        date: '2017-05-04',
        time: '下午17:30-19:00',
        isPNeed: false,
        condition: 'book'
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
.bottom-span {
  margin-bottom: 5px;
}
</style>
