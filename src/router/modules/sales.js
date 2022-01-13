/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const salesRouter = {
  path: '/sales',
  component: Layout,
  redirect: '/sales/customer-manage',
  name: 'Sales',
  meta: {
    title: '销售管理',
    icon: 'shopping'
  },
  children: [
    {
      path: 'customer-manage',
      component: () => import('@/views/sales/customer-manage'),
      name: 'CustomerManage',
      meta: { title: '客户管理' }
    },
    {
      path: 'order-manage',
      component: () => import('@/views/sales/order-manage'),
      name: 'OrderManage',
      meta: { title: '订单管理' }
    },
    {
      path: 'delivery-manage',
      component: () => import('@/views/sales/delivery-manage'),
      name: 'DeliveryManage',
      meta: { title: '销售出库' }
    },
    {
      path: 'return-manage',
      component: () => import('@/views/sales/return-manage'),
      name: 'ReturnManage',
      meta: { title: '退货订单' }
    }
  ]
}
export default salesRouter
