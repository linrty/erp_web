import request from '@/utils/request'

export function fetchAccount(query) {
    return request({
      url: '/admin/account',
      method: 'get',
      params: query
    })
  }