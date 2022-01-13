/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const warehouseRouter = {
  path: '/warehouse',
  component: Layout,
  redirect: '/warehouse/warehousing-manage',
  name: 'Warehouse',
  meta: {
    title: '仓库管理',
    icon: 'el-icon-s-home'
  },
  children: [
    {
      path: 'warehousing-manage',
      component: () => import('@/views/warehouse/warehousing-manage'),
      name: 'WarehousingManage',
      meta: { title: '入库管理' }
    },
    {
      path: 'warehouse-manage',
      component: () => import('@/views/warehouse/warehouse-manage'),
      name: 'WarehouseManage',
      meta: { title: '库位管理' }
    }
  ]
}
export default warehouseRouter