import { request } from './request'

export function login(username, password) {
  return request({
    method: 'POST',
    url: '/users/login',
    headers: {
      "Content-Type": 'application/json'
    },
    data: {
      username,
      password
    }
  })
}

export function register(username, password) {
  return request({
    method: 'post',
    url: '/users/register',
    headers: {
      "Content-Type": 'application/json'
    },
    data: {
      username,
      password
    }
  })
}

export function checkName(userName) {
  return request({
    method: 'post',
    url: '/users/register/'+userName,
    // params: {
    //   userName
    // }
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