import request from '@/utils/request'

export function fetchAccountList(query) {
    return request({
      url: '/admin/warehouse/account-list',
      method: 'get',
      params: query
    })
}

export function fetchProductList(query) {
  return request({
    url: '/admin/warehouse/product-list',
    method: 'get',
    params: query
  })
}

export function fetchWarehousingList(query) {
  return request({
    url: '/admin/warehouse/warehousing-list',
    method: 'get',
    params: query
  })
}

export function createWarehousing(data) {
  return request({
    url: '/admin/warehouse/warehousing-create',
    method: 'post',
    data
  })
}

export function updateWarehousing(data) {
  return request({
    url: '/admin/warehouse/warehousing-update',
    method: 'post',
    data
  })
}

export function deleteWarehousing(query) {
  return request({
    url: '/admin/warehouse/warehousing-delete',
    method: 'get',
    params: query
  })
}

export function fetchWarehouseList(query) {
  return request({
    url: '/admin/warehouse/list',
    method: 'get',
    params: query
  })
}

export function createWarehouse(data) {
  return request({
    url: '/admin/warehouse/create',
    method: 'post',
    data
  })
}

export function updateWarehouse(data) {
  return request({
    url: '/admin/warehouse/update',
    method: 'post',
    data
  })
}

export function deleteWarehouse(query) {
  return request({
    url: '/admin/warehouse/delete',
    method: 'get',
    params: query
  })
}