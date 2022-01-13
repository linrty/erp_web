import request from '@/utils/request'

export function fetchAccount(query) {
    return request({
      url: '/vue-element-admin/account',
      method: 'get',
      params: query
    })
  }