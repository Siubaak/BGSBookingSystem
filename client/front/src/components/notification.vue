<template>
  <div id="notification">
    <article class="weui-article" v-html="markedBody">
    </article>
  </div>
</template>

<script>
import api from '../api'
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
          this.markedBody = marked(res.data.notification.body)
        })
    }
  },
  created () {
    this.notificationGet()
  }
}
</script>
