<template>
  <div id="admin">
    <!-- 导航栏 -->
    <nav-bar></nav-bar>
    <!-- 内容栏 -->
    <div class="container-fluid">
      <div class="row">
        <div class="col-sm-offset-2 col-sm-8 col-xs-12">
          <router-view></router-view>
        </div>
      </div>
    </div>
    <button type="button" class="btn btn-info side-bottom" @click="scrollToTop">
      <span class="glyphicon glyphicon-triangle-top" aria-hidden="true"></span>
    </button>
  </div>
</template>

<script>
import navBar from './nav-bar'
export default {
  components: {
    navBar
  },
  methods: {
    scrollToTop () {
      let step = document.body.scrollTop / 50
      let smoothScroll = () => {
        if (document.body.scrollTop > 0) {
          document.body.scrollTop -= step
          setTimeout(smoothScroll, 1)
        } else {
          document.body.scrollTop = 0
        }
      }
      smoothScroll()
    }
  }
}
</script>

<style scoped>
body {
  padding: 70px 0px 20px 0px;
}
.side-bottom {
  position: fixed;
  bottom: 20px;
  right: 15px;
}
</style>
