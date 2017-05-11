import Vue from 'vue'
import Router from 'vue-router'
// import store from '../store'
import login from '../components/login'
import admin from '../components/admin'
import notification from '../components/notification'
import material from '../components/material'
import meeting from '../components/meeting'
import user from '../components/user'

Vue.use(Router)

var router = new Router({
  mode: 'history',
  routes: [{
    path: '/login',
    name: 'login',
    component: login
  },
  {
    path: '/admin',
    name: 'admin',
    component: admin,
    children: [{
      path: '',
      name: 'materail-book',
      component: material
    },
    {
      path: 'meeting',
      name: 'meeting-book',
      component: meeting
    },
    {
      path: 'notification',
      name: 'notification',
      component: notification
    },
    {
      path: 'user',
      name: 'user',
      component: user
    }]
  }]
})

/*
router.beforeEach(({ path }, from, next) => {
  var isLogin = Boolean(store.state.token)
  if (!isLogin && path !== '/login') {
    next('/login')
  } else if (isLogin && path === '/login') {
    next('/admin')
  } else {
    next()
  }
})
*/
export default router
