const Mock = require('mockjs')

const List = []
const productList = []
const products = []
const customers = []
const count = 100
const count2 = 20
const warehousingList = []
const returnList = []

const baseContent = '<p>I am testing data, I am testing data.</p><p><img src="https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943"></p>'
const image_uri = 'https://wpimg.wallstcn.com/e4558086-631c-425c-9430-56ffb46e70b3'

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
      id: '@increment',
      create_time:+Mock.Random.date('T'),
      product_name: '@first',
      product_code: '@guid()',
      count: '@integer(1,1000)',
      product_price: '@integer(1,1000)',
      'order_status|1': ['0','1'],
      customer_name: '@cname()',
      order_no: '@guid()',
      'delivery_status|1': ['0','1']
  }))
}

for (let i = 0; i < count; i++) {
  returnList.push(Mock.mock({
      id: '@increment',
      create_time:+Mock.Random.date('T'),
      product_name: '@first',
      product_code: '@guid()',
      return_count: '@integer(1,1000)',
      return_no: '@guid()',
      customer_name: '@cname()',
      delivery_no: '@guid()'
  }))
}


  for (let i = 0; i < count2; i++) {
    products.push(Mock.mock({
      product_name: '@first',
      product_code: '@guid()'
    }))
  }

  for (let i = 0; i < count2; i++) {
    customers.push(Mock.mock({
      customer_name: '@cname()',
      phone: '@integer(10000000000,20000000000)',
    }))
  }

module.exports = [

  {
    url: '/vue-element-admin/sales/order-list',
    type: 'get',
    response: config => {
      const { product_name, product_code,  page = 1, limit = 20, sort } = config.query

      let mockList = List.filter(item => {
        return true
      })


      const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))

      return {
        code: 20000,
        data: {
          total: mockList.length,
          items: pageList,
          products: products,
          customers: customers
        }
      }
    }
  },

  {
    url: '/vue-element-admin/warehouse/warehousing-create',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  {
    url: '/vue-element-admin/warehouse/warehousing-update',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  {
    url: '/vue-element-admin/order/return-list',
    type: 'get',
    response: config => {
      const { product_name, product_code,  page = 1, limit = 20, sort } = config.query

      let mockList = returnList.filter(item => {
        return true
      })


      const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))

      return {
        code: 20000,
        data: {
          total: mockList.length,
          items: pageList,
        }
      }
    }
  },

  {
    url: '/vue-element-admin/order/return-create',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  {
    url: '/vue-element-admin/order/return-update',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },
  {
    url: '/vue-element-admin/order/return-delete',
    type: 'get',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  }

]

