<template>
  <div id="login">
    <div class="login center-block">
      <div class="panel panel-default">
        <div class="panel-heading">
          <h4 class="panel-title">
            后台管理
          </h4>
        </div>
        <div class="panel-body">
          <form class="form-horizontal" role="form" @submit.prevent="login">
            <div class="form-group">
              <div class="col-xs-12">
                <input v-model="admin.account" type="text" class="form-control" placeholder="账号" required>
              </div>
            </div>
            <div class="form-group">
              <div class="col-xs-12">
                <input v-model="admin.password" type="password" class="form-control" placeholder="密码" required>
              </div>
            </div>
            <div class="form-group">
              <div class="col-xs-12">
                <button type="submit" class="btn btn-primary btn-block">
                  <small><span class="glyphicon glyphicon-log-in" aria-hidden="true"></span></small> 登录
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      admin: {
        account: '',
        password: ''
      }
    }
  },
  methods: {
    login () {
      if (this.admin.account && this.admin.password) {
        this.$store.dispatch('adminLogin', this.admin)
      }
    }
  }
}
</script>

<style scoped>
.login {
  margin-top: 150px;
  width: 300px;
}
</style>
