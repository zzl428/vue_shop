import { request } from './request'
// 获取菜单栏数据
export function getMenuList() {
  return request({
    method: 'get',
    url: '/data/menus',
  })
}
// 按用户名搜索
export function searchUserByName(user) {
  return request({
    method: 'get',
    url: '/users/username',
    params: {
      user
    }
  })
}

// 按id搜索
export function searchUserById(id) {
  return request({
    method: 'get',
    url: '/users/id',
    params: {
      id
    }
  })
}

// 按字段删除
export function deleteByField(table, field, value) {
  return request({
    method: 'delete',
    url: '/data/delete',
    params: {
      table,
      field,
      value
    }
  })
}

// 获取用户列表
export function getUserList(pagenum, pagesize) {
  return request({
    method: 'get',
    url: '/data/users',
    params: {
      pagenum,
      pagesize
    }
  })
}
// 修改用户数据
export function alterUser(id, data) {
  return request({
    method: 'patch',
    url: '/users',
    params: {
      id,
      data
    }
  })
}