import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/admin/material/list',
    method: 'get',
    params: query
  })
}

export function fetchMaterial(id) {
  return request({
    url: '/admin/material/detail',
    method: 'get',
    params: { id }
  })
}


export function createMaterial(data) {
  return request({
    url: '/admin/material/create',
    method: 'post',
    data
  })
}

export function updateMaterial(data) {
  return request({
    url: '/admin/material/update',
    method: 'post',
    data
  })
}

export function deleteMaterial(query) {
  return request({
    url: '/admin/material/update',
    method: 'post',
    params: query
  })
}
