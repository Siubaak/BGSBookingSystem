<template>
  <div id="nav-bar">
    <nav class="navbar navbar-default navbar-fixed-top" role="navigation">
      <div class="container-fluid">
        <div class="navbar-header">
          <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#collapse-narbar">
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
          <router-link class="navbar-brand" to="/admin" @click.native="clickArticleList">研会办公室服务平台-后台</router-link>
        </div>
        <div class="collapse navbar-collapse" id="collapse-narbar">
          <ul class="nav navbar-nav">
            <li :class="{ active: isItem1Selected }">
              <router-link to="/admin" @click.native="item1Click">
                <small><span class="glyphicon glyphicon-th-list" aria-hidden="true"></span></small> 物资申请
              </router-link>
            </li>
            <li :class="{ active: isItem2Selected }">
              <router-link to="/admin/meeting" @click.native="item2Click">
                <small><span class="glyphicon glyphicon-blackboard" aria-hidden="true"></span></small> 会议室预约
              </router-link>
            </li>
            <li :class="{ active: isItem3Selected }">
              <router-link to="/admin/notification" @click.native="item3Click">
                <small><span class="glyphicon glyphicon-comment" aria-hidden="true"></span></small> 通知公告
              </router-link>
            </li>
            <li :class="{ active: isItem4Selected }">
              <router-link to="/admin/user" @click.native="item4Click">
                <small><span class="glyphicon glyphicon-user" aria-hidden="true"></span></small> 用户管理
              </router-link>
            </li>
          </ul>
          <button type="button" class="btn btn-primary navbar-btn pull-right" @click="logout">
            <small><span class="glyphicon glyphicon-log-out" aria-hidden="true"></span></small> 登出
          </button>
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
export default {
  data () {
    return {
      isItem1Selected: true,
      isItem2Selected: false,
      isItem3Selected: false,
      isItem4Selected: false
    }
  },
  methods: {
    logout () {
      this.$store.dispatch('adminLogout')
    },
    item1Click () {
      this.isItem1Selected = true
      this.isItem2Selected = false
      this.isItem3Selected = false
      this.isItem4Selected = false
    },
    item2Click () {
      this.isItem1Selected = false
      this.isItem2Selected = true
      this.isItem3Selected = false
      this.isItem4Selected = false
    },
    item3Click () {
      this.isItem1Selected = false
      this.isItem2Selected = false
      this.isItem3Selected = true
      this.isItem4Selected = false
    },
    item4Click () {
      this.isItem1Selected = false
      this.isItem2Selected = false
      this.isItem3Selected = false
      this.isItem4Selected = true
    }
  }
}
</script>
