<template>
  <div id="main" class="full-screen">
    <div class="weui-tab">
      <div class="weui-navbar">
        <div class="weui-navbar__item weui-bar__item_on">
          {{ title }}
        </div>
      </div>
      <div class="weui-tab__panel">
        <keep-alive>
          <router-view></router-view>
        </keep-alive>
      </div>
      <div class="weui-tabbar">
        <router-link to='/notification'
          :class="{ 'weui-tabbar__item': true, 'weui-bar__item_on': item1Selected }"
          @click.native="item1Click">
          <img src="../assets/img/notification.png" alt="" class="weui-tabbar__icon">
          <p class="weui-tabbar__label">通知公告</p>
        </router-link>
        <router-link to='/ma'
          :class="{ 'weui-tabbar__item': true, 'weui-bar__item_on': item2Selected }"
          @click.native="item2Click">
          <img src="../assets/img/material.png" alt="" class="weui-tabbar__icon">
          <p class="weui-tabbar__label">物资申请</p>
        </router-link>
        <router-link to='/account'
          :class="{ 'weui-tabbar__item': true, 'weui-bar__item_on': item4Selected }"
          @click.native="item4Click">
          <img src="../assets/img/account.png" alt="" class="weui-tabbar__icon">
          <p class="weui-tabbar__label">部门账号</p>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      title: '物资申请',
      item1Selected: false,
      item2Selected: true,
      item4Selected: false
    }
  },
  methods: {
    item1Click () {
      this.title = '通知公告'
      this.item1Selected = true
      this.item2Selected = false
      this.item4Selected = false
    },
    item2Click () {
      this.title = '物资申请'
      this.item1Selected = false
      this.item2Selected = true
      this.item4Selected = false
    },
    item4Click () {
      this.title = '部门账号'
      this.item1Selected = false
      this.item2Selected = false
      this.item4Selected = true
    }
  }
}
</script>

<style scoped>
.weui-navbar__item {
  padding: 13px 0 !important;
  background-color: #304758 !important;
  color: #FFFFFF !important;
}
.weui-tab__panel {
  padding-bottom: 60px !important;
}
</style>
