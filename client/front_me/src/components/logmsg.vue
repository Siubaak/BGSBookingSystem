<template>
  <div id="logmsg">
    <div class="weui-msg">
      <div class="weui-msg__icon-area"><i class="weui-icon-info weui-icon_msg"></i></div>
      <div class="weui-msg__text-area">
        <h2 class="weui-msg__title">未登录</h2>
        <p class="weui-msg__desc">请先登录方可进行相应操作</p>
        <p class="weui-msg__desc">未通过审核账号请等待审核</p>
      </div>
      <div class="weui-msg__opr-area">
        <p class="weui-btn-area">
          <router-link to="/log" class="weui-btn weui-btn_primary">登录</router-link>
        </p>
      </div>
    </div>
  </div>
</template>
