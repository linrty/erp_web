import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/admin/admin/list',
    method: 'get',
    params: query
  })
}

export function fetchAdmin(id) {
  return request({
    url: '/admin/admin/detail',
    method: 'get',
    params: { id }
  })
}

export function createAdmin(data) {
  return request({
    url: '/admin/admin/create',
    method: 'post',
    data
  })
}

export function updateAdmin(data) {
  return request({
    url: '/admin/admin/update',
    method: 'post',
    data
  })
}

export function deleteAdmin(query) {
  return request({
    url: '/admin/admin/delete',
    method: 'get',
    params: query
  })
}

export function ModifyAdminStatus(query) {
  return request({
    url: '/admin/admin/ban',
    method: 'get',
    params: query
  })
}
