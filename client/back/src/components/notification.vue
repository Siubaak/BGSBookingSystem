<template>
  <div id="notification">
    <div class="panel panel-default">
      <div class="panel-heading">
        <h4 class="panel-title">
          <small><span class="glyphicon glyphicon-comment" aria-hidden="true"></span></small>
          通知公告
        </h4>
      </div>
      <div class="panel-body">
        <div v-html="markedBody"></div>
        <button type="button" data-toggle="collapse"
          href="#edit" class="btn btn-sm btn-primary btn-group btn-group-justified">
          <small><span class="glyphicon glyphicon-edit"></span></small>
          修改公告
        </button>
        <div id="edit" class="collapse">
          <form role="form" @submit.prevent="notificationUpdate">
            <div class="form-group">
              <label for="notification">编辑器支持markdown语法，规则详见<a target="_blank" href="http://www.jianshu.com/p/q81RER">这里</a>。</label>
              <textarea type="text" class="form-control" id="notification"
                        rows="5" v-model="notification.body">
              </textarea>
            </div>
            <button type="submit" class="btn btn-sm btn-primary btn-group btn-group-justified">
              <small><span class="glyphicon glyphicon-floppy-disk"></span></small> 保存修改
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../api'
import marked from 'marked'
export default {
  data () {
    return {
      markedBody: '',
      notification: {
        body: ''
      }
    }
  },
  methods: {
    notificationGet () {
      api.notificationGet()
        .then((res) => {
          this.notification = res.data.notification
          this.markedBody = marked(this.notification.body)
        })
        .catch((err) => {
          alert(err)
        })
    },
    notificationUpdate () {
      api.notificationUpdate(this.notification)
        .then((res) => {
          alert(res.data.msg)
          this.markedBody = marked(this.notification.body)
        })
        .catch((err) => {
          alert(err)
        })
    }
  },
  created () {
    this.notificationGet()
  }
}
</script>

<style scoped>
#edit {
  margin-top: 15px;
}
</style>
