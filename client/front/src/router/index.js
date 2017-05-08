import Vue from 'vue'
import Router from 'vue-router'
import main from '@/components/main'
import notification from '@/components/notification'
import material from '@/components/material'
import meeting from '@/components/meeting'
import account from '@/components/account'
import log from '@/components/log'

Vue.use(Router)

export default new Router({
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
