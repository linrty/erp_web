const Mock = require('mockjs')

const List = []
const count = 100

const baseContent = '<p>I am testing data, I am testing data.</p><p><img src="https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943"></p>'
const image_uri = 'https://wpimg.wallstcn.com/e4558086-631c-425c-9430-56ffb46e70b3'

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment',
    order_no:'@guid()',
    delivery_no:'@guid()',
    delivery_count:'@integer(300, 5000)',
    warehouse_no:'@guid()',
    delivery_time:+Mock.Random.date('T'),
    product_name:'@first',
    delivery_cost1:'@integer(300, 5000)',
    delivery_cost2:'@integer(300, 5000)',
    create_time: +Mock.Random.date('T')
  }))
}

module.exports = [
  {
    url: '/vue-element-admin/delivery/list',
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
    url: '/vue-element-admin/delivery/detail',
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
    url: '/vue-element-admin/delivery/create',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  {
    url: '/vue-element-admin/delivery/update',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  }
]

