import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/vue-element-admin/delivery/list',
    method: 'get',
    params: query
  })
}

export function fetchDelivery(id) {
  return request({
    url: '/vue-element-admin/delivery/detail',
    method: 'get',
    params: { id }
  })
}


export function createDelivery(data) {
  return request({
    url: '/vue-element-admin/delivery/create',
    method: 'post',
    data
  })
}

export function updateDelivery(data) {
  return request({
    url: '/vue-element-admin/delivery/update',
    method: 'post',
    data
  })
}

export function deleteDelivery(query) {
  return request({
    url: '/vue-element-admin/delivery/delete',
    method: 'get',
    params: query
  })
}
