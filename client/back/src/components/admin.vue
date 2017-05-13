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
  </div>
</template>

<script>
import navBar from './nav-bar'
export default {
  components: {
    navBar
  }
}
</script>

<style scoped>
body {
  padding: 70px 0px 20px 0px;
}
</style>
