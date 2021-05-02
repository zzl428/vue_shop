import { request } from './request'
// 获取分类信息列表
export function getCateList(queryInfo) {
  return request({
    method: 'get',
    url: '/categories',
    params: {
      queryInfo
    }
  })
}
// 添加商品分类数据
export function addCate(form) {
  return request({
    method: 'post',
    url: '/categories',
    params: {
      cat_name: form.cat_name,
      cat_pid: form.cat_pid,
      cat_level: form.cat_level
    }
  })
}

// 编辑商品分类数据
export function editCate(form) {
  return request({
    method: 'patch',
    url: '/categories',
    params: {
      cat_name: form.cat_name,
      cat_id: form.cat_id
    }
  })
}

// 按id获取商品分类信息
export function searchById(cat_id) {
  return request({
    method: 'get',
    url: `/categories/${cat_id}`,
  })
}