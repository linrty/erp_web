import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/admin/customer/list',
    method: 'get',
    params: query
  })
}

export function fetchCustomer(id) {
  return request({
    url: '/admin/customer/detail',
    method: 'get',
    params: { id }
  })
}


export function createCustomer(data) {
  return request({
    url: '/admin/customer/create',
    method: 'post',
    data
  })
}

export function updateCustomer(data) {
  return request({
    url: '/admin/customer/update',
    method: 'post',
    data
  })
}

export function deleteCustomer(query) {
  return request({
    url: '/admin/customer/delete',
    method: 'get',
    params: query
  })
}
