<template>
  <div id="notification">
    <article class="weui-article" v-html="markedBody">
    </article>
  </div>
</template>

<script>
import api from '../api'
import weui from 'weui.js'
import marked from 'marked'
export default {
  data () {
    return {
      markedBody: ''
    }
  },
  methods: {
    notificationGet () {
      api.notificationGet()
        .then((res) => {
          if (res.status === 200) {
            this.markedBody = marked(res.data.notification.body)
          } else {
            weui.alert(res.data.msg)
          }
        }).catch((err) => {
          console.error(err)
          weui.alert('通知公告加载出错，请尝试刷新页面')
        })
    }
  },
  created () {
    this.notificationGet()
  }
}
</script>
