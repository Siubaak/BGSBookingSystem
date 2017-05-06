<template>
  <div id="app" class="full-screen">
    <router-view></router-view>
  </div>
</template>

<style>
html, body, .full-screen {
  width: 100%;
  height: 100%;
}
.weui-navbar__item {
  padding: 13px 0 !important;
  background-color: #304758 !important;
  color: #FFFFFF !important;
}
.weui-tab__panel {
  padding-bottom: 60px !important;
}
</style>
