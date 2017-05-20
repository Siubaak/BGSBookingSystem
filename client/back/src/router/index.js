import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'
import login from '../components/login'
import admin from '../components/admin'
import material from '../components/material'
import meeting from '../components/meeting'
import notification from '../components/notification'
import materialAll from '../components/material-all'
import meetingAll from '../components/meeting-all'
import user from '../components/user'

Vue.use(Router)

let router = new Router({
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
      name: 'material-book',
      component: material
    },
    {
      path: 'meeting',
      name: 'meeting-book',
      component: meeting
    },
    {
      path: 'setting/notification',
      name: 'notification',
      component: notification
    },
    {
      path: 'setting/material',
      name: 'material-all',
      component: materialAll
    },
    {
      path: 'setting/meeting',
      name: 'meeting-all',
      component: meetingAll
    },
    {
      path: 'setting/user',
      name: 'user',
      component: user
    }]
  }]
})

router.beforeEach(({ path }, from, next) => {
  let isLogin = Boolean(store.state.token)
  if (!isLogin && path !== '/login') {
    next('/login')
  } else if (isLogin && path === '/login') {
    next('/admin')
  } else {
    next()
  }
})

export default router
