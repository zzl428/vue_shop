import { request } from './request'
// 获取权限数据（列表）
export function getRightsList() {
  return request({
    method: 'get',
    url: '/data/rights',
  })
}

// 获取权限数据（树结构）
export function getRightsTree() {
  return request({
    method: 'get',
    url: '/auth/rights/tree',
  })
}

// 删除角色权限数据
export function removeRoleRight(roleId, rightId) {
  return request({
    method: 'delete',
    url: `/auth/roles/${roleId}/rights/${rightId}`,
  })
}

// 设置角色权限
export function setRights(roleId, rids) {
  return request({
    method: 'post',
    url: `/auth/${roleId}/rights`,
    headers: {
      "Content-Type": 'application/json'
    },
    data: {
      rids
    }
  })
}