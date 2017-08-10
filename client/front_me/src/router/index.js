import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'
import main from '@/components/main'
import notification from '@/components/notification'
import meeting from '@/components/meeting'
import account from '@/components/account'
import log from '@/components/log'
import logmsg from '@/components/logmsg'
import authmsg from '@/components/authmsg'
import notmainmsg from '@/components/notmainmsg'

Vue.use(Router)

let router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/me',
      name: 'main',
      component: main,
      children: [
        {
          path: '',
          name: 'meeting',
          component: meeting
        },
        {
          path: '/notification',
          name: 'notification',
          component: notification
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
        },
        {
          path: '/authmsg',
          name: 'authmsg',
          component: authmsg
        },
        {
          path: '/notmainmsg',
          name: 'notmainmsg',
          component: notmainmsg
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
  let { isAuth, isMain } = (() => {
    if (isLogin) {
      return {
        isAuth: Boolean(JSON.parse(window.atob(store.state.token.split('.')[1])).isAuth),
        isMain: Boolean(JSON.parse(window.atob(store.state.token.split('.')[1])).isMain)
      }
    } else {
      return {
        isAuth: false,
        isMain: false
      }
    }
  })()
  if (!isLogin && path !== '/logmsg' && path !== '/log' && path !== '/notification') {
    next('/logmsg')
  } else if (isLogin && !isAuth && path === '/me') {
    next('/authmsg')
  } else if (isLogin && isAuth && !isMain && path === '/meeting') {
    next('/notmainmsg')
  } else if (isLogin && (path === '/logmsg' || path === '/log')) {
    next('/account')
  } else {
    next()
  }
})

export default router
