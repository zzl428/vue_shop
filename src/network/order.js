import { request } from './request'

// 获取订单列表
export function getOrderList(queryInfo) {
  return request({
    method: 'get',
    url: `/orders`,
    params: {
      queryInfo
    }
  })
}