<template>
  <div id="nav-bar">
    <nav class="navbar navbar-default" role="navigation">
      <div class="container-fluid">
        <div class="navbar-header">
          <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#collapse-narbar">
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
          <router-link class="navbar-brand" to="/admin" @click.native="clickArticleList"><small>研会办公室服务平台-后台</small></router-link>
        </div>
        <div class="collapse navbar-collapse" id="collapse-narbar">
          <ul class="nav navbar-nav">
            <li :class="{ active: isItem1Selected }">
              <router-link to="/admin" @click.native="item1Click">
                <small><span class="glyphicon glyphicon-th-large" aria-hidden="true"></span></small> 物资申请
              </router-link>
            </li>
            <li :class="{ active: isItem2Selected }">
              <router-link to="/admin/meeting-book" @click.native="item2Click">
                <small><span class="glyphicon glyphicon-blackboard" aria-hidden="true"></span></small> 会议室预约
              </router-link>
            </li>
            <li class="dropdown" :class="{ active: isItem3Selected }">
              <a class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
                <small><span class="glyphicon glyphicon-cog" aria-hidden="true"></span></small>
                设置
                <span class="caret"></span>
              </a>
              <ul class="dropdown-menu">
                <li>
                  <router-link to="/admin/setting/notification" @click.native="item3Click">
                    <small><span class="glyphicon glyphicon-comment" aria-hidden="true"></span></small> 通知公告编辑
                  </router-link>
                </li>
                <li>
                  <router-link to="/admin/setting/material" @click.native="item3Click">
                    <small><span class="glyphicon glyphicon-th-list" aria-hidden="true"></span></small> 物资管理
                  </router-link>
                </li>
                <li>
                  <router-link to="/admin/setting/material-book" @click.native="item3Click">
                    <small><span class="glyphicon glyphicon-th-large" aria-hidden="true"></span></small> 物资申请所有记录
                  </router-link>
                </li>
                <li>
                  <router-link to="/admin/setting/meeting-book" @click.native="item3Click">
                    <small><span class="glyphicon glyphicon-blackboard" aria-hidden="true"></span></small> 会议室预约所有记录
                  </router-link>
                </li>
                <li>
                  <router-link to="/admin/setting/user" @click.native="item3Click">
                    <small><span class="glyphicon glyphicon-user" aria-hidden="true"></span></small> 用户及管理员设置
                  </router-link>
                </li>
              </ul>
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
      isItem3Selected: false
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
    },
    item2Click () {
      this.isItem1Selected = false
      this.isItem2Selected = true
      this.isItem3Selected = false
    },
    item3Click () {
      this.isItem1Selected = false
      this.isItem2Selected = false
      this.isItem3Selected = true
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
