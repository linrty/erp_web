import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/admin/product/list',
    method: 'get',
    params: query
  })
}

export function fetchProduct(id) {
  return request({
    url: '/admin/product/detail',
    method: 'get',
    params: { id }
  })
}


export function createProduct(data) {
  return request({
    url: '/admin/product/create',
    method: 'post',
    data
  })
}

export function updateProduct(data) {
  return request({
    url: '/admin/product/update',
    method: 'post',
    data
  })
}

export function deleteProduct(query) {
  return request({
    url: '/admin/product/delete',
    method: 'get',
    params: query
  })
}
