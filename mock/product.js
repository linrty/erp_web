const Mock = require('mockjs')

const List = []
const count = 100

const baseContent = '<p>I am testing data, I am testing data.</p><p><img src="https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943"></p>'
const image_uri = 'https://wpimg.wallstcn.com/e4558086-631c-425c-9430-56ffb46e70b3'

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment',
    page: 1+parseInt(parseInt(i)/20),
    limit:20,
    timestamp: +Mock.Random.date('T'),
    product_name: '@first',
    product_code: '@guid()',
    model: '@guid()',
    specification: "@integer(1, 20)*@integer(1, 20)*@integer(1, 20)",
    'product_unit|1': ['箱', '件','批'],
    content: '@integer(300, 5000)',
  }))
}

module.exports = [
  {
    url: '/vue-element-admin/product/list',
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
          items: pageList
        }
      }
    }
  },

  {
    url: '/vue-element-admin/product/detail',
    type: 'get',
    response: config => {
      const { id } = config.query
      for (const product of List) {
        if (product.id === +id) {
          return {
            code: 20000,
            data: product
          }
        }
      }
    }
  },

  {
    url: '/vue-element-admin/product/create',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  {
    url: '/vue-element-admin/product/update',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  }
]

