import { request } from './request'

export function login(form) {
  return request({
    method: 'POST',
    url: '/users/login',
    headers: {
      "Content-Type": 'application/json'
    },
    data: {
      form
    }
  })
}

export function register(form) {
  return request({
    method: 'post',
    url: '/users/register',
    headers: {
      "Content-Type": 'application/json'
    },
    data: {
      form
    }
  })
}

// 按字段查找
export function searchByField(table, field, value) {
  return request({
    method: 'get',
    url: '/data/search',
    params: {
      table,
      field,
      value
    }
  })
}

// export function getHomeGoods(type,page) {
//   return request({
//     url:'/home/data',
//     params:{
//       type,
//       page
//     }
//   })
// }