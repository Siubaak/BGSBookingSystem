import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'
import main from '@/components/main'
import notification from '@/components/notification'
import material from '@/components/material'
import meeting from '@/components/meeting'
import account from '@/components/account'
import log from '@/components/log'
import logmsg from '@/components/logmsg'

Vue.use(Router)

let router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'main',
      component: main,
      children: [
        {
          path: '',
          name: 'notification',
          component: notification
        },
        {
          path: '/material',
          name: 'material',
          component: material
        },
        {
          path: '/meeting',
          name: 'meeting',
          component: meeting
        },
        {
          path: '/account',
          name: 'account',
          component: account
        },
        {
          path: '/logmsg',
          name: 'logmsg',
          component: logmsg
        }
      ]
    },
    {
      path: '/log',
      name: 'log',
      component: log
    }
  ]
})

router.beforeEach(({ path }, from, next) => {
  let isLogin = Boolean(store.state.token)
  if (!isLogin && path !== '/logmsg' && path !== '/log' && path !== '/') {
    next('/logmsg')
  } else if (isLogin && (path === '/logmsg' || path === '/log')) {
    next('/')
  } else {
    next()
  }
})

export default router
