import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/admin/sales/order-list',
    method: 'get',
    params: query
  })
}

export function fetchReturnList(query) {
  return request({
    url: '/admin/order/return-list',
    method: 'get',
    params: query
  })
}

export function createReturn(data) {
  return request({
    url: '/admin/order/return-create',
    method: 'post',
    data
  })  
}

export function updateReturn(data) {
  return request({
    url: '/admin/order/return-update',
    method: 'post',
    data
  })
}

export function deleteReturn(query) {
  return request({
    url: '/admin/order/return-delete',
    method: 'get',
    params: query
  })
}


export function fetchOrder(id) {
  return request({
    url: '/admin/order/detail',
    method: 'get',
    params: { id }
  })
}


export function createOrder(data) {
  return request({
    url: '/admin/sales/order-create',
    method: 'post',
    data
  })
}

export function updateOrder(data) {
  return request({
    url: '/admin/sales/order-update',
    method: 'post',
    data
  })
}

export function deleteOrder(query) {
  return request({
    url: '/admin/sales/order-delete',
    method: 'get',
    params: query
  })
}