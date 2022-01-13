/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const searchRouter = {
  path: '/search',
  component: Layout,
  redirect: '/search/account-month',
  name: 'Search',
  meta: {
    title: '查询统计',
    icon: 'search'
  },
  children: [
    {
      path: 'account',
      name: 'Menu1',
      component: () => import('@/views/search/index'), 
      meta: { title: '台账' },
      redirect: '/search/account/account-month',
      children: [
          {
            path: 'account-month',
            component: () => import('@/views/search/account-month'),
            name: 'AccountMonth',
            meta: { title: '月度台账' }
          },
          {
            path: 'account-quarter',
            component: () => import('@/views/search/account-quarter'),
            name: 'AccountQuarter',
            meta: { title: '季度台账' }
          },
          {
            path: 'account-year',
            component: () => import('@/views/search/account-year'),
            name: 'AccountYear',
            meta: { title: '年度台账' }
          }
      ]
    },
    {
      path: 'warehouse-statistics',
      component: () => import('@/views/search/warehouse-statistics'),
      name: 'WarehouseStatistics',
      meta: { title: '仓库盘点' }
    }
  ]
}
export default searchRouter
