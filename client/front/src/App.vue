<template>
  <div id="app" class="full-screen">
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<style>
html, body, .full-screen {
  width: 100%;
  height: 100%;
}
</style>
