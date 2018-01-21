import Vue from 'vue'
import Router from 'vue-router'
import StartPayment from '@/components/StartPayment'
import MixingPayment from '@/components/MixingPayment'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'StartPayment',
      component: StartPayment,
    },
    {
      path: '/mixing/:id',
      name: 'MixingPayment',
      component: MixingPayment,
    },
  ],
})
