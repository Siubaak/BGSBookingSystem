<template>
  <div id="notification">
    <article class="weui-article" v-for="notificationItem in notifications">
      <h1 class="title">{{ notificationItem.title }}</h1>
      <p>{{ notificationItem.body }}</p>
    </article>
  </div>
</template>

<script>
export default {
  data () {
    return {
      notifications: [
        {
          title: '测试',
          body: '测试'
        }
      ]
    }
  }
}
</script>
