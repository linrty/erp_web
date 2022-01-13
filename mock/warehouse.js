const Mock = require('mockjs')

const List = []
const productList = []
const products = []
const warehouses = []
const count = 100
const count2 = 20
const warehousingList = []
const warehouseList = []

const baseContent = '<p>I am testing data, I am testing data.</p><p><img src="https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943"></p>'
const image_uri = 'https://wpimg.wallstcn.com/e4558086-631c-425c-9430-56ffb46e70b3'

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    warehouse_name: '@first',
    warehouse_no: '@guid()',
    warehouse_count: '@integer(1,1000)',
    warehouse_out_count: '@integer(1,1000)'
  }))
}

for (let i = 0; i < count; i++) {
  warehouseList.push(Mock.mock({
    id: '@increment',
    warehouse_name: '@first',
    warehouse_no: '@guid()',
    warehouse_desc: '',
    create_by: '@cname()',
    create_time: +Mock.Random.date('T')
  }))
}

for (let i = 0; i < count; i++) {
  warehousingList.push(Mock.mock({
    id: '@increment',
    product_name: '@first',
    product_code: '@guid()',
    create_time: +Mock.Random.date('T'),
    warehouse_name: '@first',
    warehouse_no: '@guid()',
    receipt_count: '@integer(1,1000)',
    create_by: '@cname()'
  }))
}

for (let i = 0; i < count2; i++) {
    productList.push(Mock.mock({
      product_name: '@first',
      product_code: '@guid()',
      count: '@integer(1,1000)',
      out_count: '@integer(1,1000)'
    }))
  }

  for (let i = 0; i < count2; i++) {
    products.push(Mock.mock({
      product_name: '@first',
      product_code: '@guid()'
    }))
  }

  for (let i = 0; i < count2; i++) {
    warehouses.push(Mock.mock({
      warehouse_name: '@first',
      warehouse_no: '@guid()',
    }))
  }

module.exports = [
  {
    url: '/vue-element-admin/warehouse/account-list',
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
    url: '/vue-element-admin/warehouse/product-list',
    type: 'get',
    response: _ => {
      return {
        code: 20000,
        data: {
          items: productList
        }
      }
    }
  },

  {
    url: '/vue-element-admin/warehouse/warehousing-list',
    type: 'get',
    response: config => {
      const { product_name, product_code,  page = 1, limit = 20, sort } = config.query

      let mockList = warehousingList.filter(item => {
        return true
      })


      const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))

      return {
        code: 20000,
        data: {
          total: mockList.length,
          items: pageList,
          products: products,
          warehouses: warehouses
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
    url: '/vue-element-admin/warehouse/list',
    type: 'get',
    response: config => {
      const { product_name, product_code,  page = 1, limit = 20, sort } = config.query

      let mockList = warehouseList.filter(item => {
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
    url: '/vue-element-admin/warehouse/create',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  {
    url: '/vue-element-admin/warehouse/update',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  }

]

