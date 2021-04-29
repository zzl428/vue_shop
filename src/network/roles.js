import { request } from './request'

// 获取角色数据
export function getRolesList() {
  return request({
    method: 'get',
    url: '/data/roles',
  })
}

// 按角色id搜索角色
export function searchRoleByRoleId(id) {
  return request({
    method: 'get',
    url: '/auth/roles',
    params: {
      id
    }
  })
}

// 删除角色
export function removeRole(id) {
  return request({
    method: 'delete',
    url: '/auth/roles',
    params: {
      id
    }
  })
}

// 添加角色
export function addRole(form) {
  return request({
    method: 'post',
    url: '/auth/roles',
    headers: {
      "Content-Type": 'application/json'
    },
    data: {
      form
    }
  })
}

// 修改角色
export function editRole(id, form) {
  return request({
    method: 'patch',
    url: '/auth/roles',
    headers: {
      "Content-Type": 'application/json'
    },
    data: {
      id,
      form
    }
  })
}