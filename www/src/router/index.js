import Vue from 'vue'
import Router from 'vue-router'
import ExecutePayment from '@/components/ExecutePayment'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'ExecutePayment',
      component: ExecutePayment,
    },
  ],
})
