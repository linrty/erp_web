const Mock = require('mockjs')

const List = []
const count = 100

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment',
    page: 1+parseInt(parseInt(i)/20),
    limit:20,
    created_time: +Mock.Random.date('T'),
    username: '@cname()',
    'sex|1': ['男','女'],
    phone: '@integer(10000000000, 20000000000)',
    email: '@email()',
    'status|1': ['0','1']
  }))
}

module.exports = [
  {
    url: '/vue-element-admin/admin/list',
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
    url: '/vue-element-admin/admin/detail',
    type: 'get',
    response: config => {
      const { id } = config.query
      for (const admin of List) {
        if (admin.id === +id) {
          return {
            code: 20000,
            data: admin
          }
        }
      }
    }
  },

  {
    url: '/vue-element-admin/admin/create',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  {
    url: '/vue-element-admin/admin/update',
    type: 'post',
    response: _ => {
        return {
          code: 20000,
          data: 'success'
        }
    }
  }
]

