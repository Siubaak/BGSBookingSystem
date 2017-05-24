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
        <button type="button" data-toggle="collapse" @click="notificationGet"
          href="#edit" class="btn btn-sm btn-primary btn-group btn-group-justified">
          <small><span class="glyphicon glyphicon-edit"></span></small>
          修改公告
        </button>
        <div id="edit" class="collapse">
          <form role="form" @submit.prevent="notificationUpdate">
            <div class="form-group">
              <label for="notification">编辑器支持markdown语法，规则详见<a target="_blank" href="http://www.jianshu.com/p/q81RER">这里</a>。</label>
              <textarea type="text" class="form-control" id="notification"
                        rows="5" v-model="body"
                        @input="notificationPreview">
              </textarea>
            </div>
            <button type="submit" class="btn btn-sm btn-primary btn-group btn-group-justified">
              <small><span class="glyphicon glyphicon-floppy-disk"></span></small> 保存
            </button>
          </form>
        </div>
      </div>
      <ul class="list-group">
        <li class="list-group-item">
          <div v-html="markedBody"></div>
        </li>
      </ul>
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
      body: '',
      waitingPreview: false
    }
  },
  methods: {
    notificationPreview () {
      if (!this.waitingPreview) {
        this.waitingPreview = true
        setTimeout(() => {
          this.markedBody = marked(this.body)
          this.waitingPreview = false
        }, 1000)
      }
    },
    notificationGet () {
      api.notificationGet()
        .then((res) => {
          if (res.status === 200) {
            this.body = res.data.notification.body
            this.markedBody = marked(this.body)
          } else {
            alert(res.data.msg)
          }
        }).catch((err) => {
          console.error(err)
          alert('通知公告获取出错，请稍后再试')
        })
    },
    notificationUpdate () {
      api.notificationUpdate({
        notification: {
          body: this.body
        }
      }).then((res) => {
        if (res.status === 200) {
          this.markedBody = marked(this.body)
        } else {
          alert(res.data.msg)
        }
      }).catch((err) => {
        console.error(err)
        alert('通知公告更新出错，请稍后再试')
      })
    }
  },
  beforeMount () {
    this.notificationGet()
  }
}
</script>

<style scoped>
#edit {
  margin-top: 15px;
}
</style>
