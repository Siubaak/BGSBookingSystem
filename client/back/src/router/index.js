import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'
import login from '../components/login'
import admin from '../components/admin'
import materialBook from '../components/material-book'
import meetingBook from '../components/meeting-book'
import notification from '../components/notification'
import materialAll from '../components/material-all'
import materialBookAll from '../components/material-book-all'
import meetingBookAll from '../components/meeting-book-all'
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
      component: materialBook
    },
    {
      path: 'meeting-book',
      name: 'meeting-book',
      component: meetingBook
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
      path: 'setting/material-book',
      name: 'material-all',
      component: materialBookAll
    },
    {
      path: 'setting/meeting-book',
      name: 'meeting-all',
      component: meetingBookAll
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
