/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const materialRouter = {
  path: '/material',
  component: Layout,
  redirect: '/material/product-manage',
  name: 'Material',
  meta: {
    title: '物料管理',
    icon: 'el-icon-s-goods'
  },
  children: [
    {
      path: 'product-manage',
      component: () => import('@/views/material/product-manage'),
      name: 'ProductManage',
      meta: { title: '成品管理' }
    },
    {
      path: 'material-manage',
      component: () => import('@/views/material/material-manage'),
      name: 'MaterialManage',
      meta: { title: '原材料管理' }
    }
  ]
}
export default materialRouter
