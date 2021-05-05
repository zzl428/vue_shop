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

// 参数列表
export function attrList(cat_id, sel) {
  return request({
    method: 'get',
    url: `/categories/${cat_id}/attributes`,
    params: {
      sel
    }
  })
}

// 添加参数
export function addAttr(cat_id, form) {
  return request({
    method: 'post',
    url: `/categories/${cat_id}/attributes`,
    params: {
      attr_name: form.attr_name,
      attr_sel: form.attr_sel
    }
  })
}

// 获取参数数据
export function getAttr(cat_id, attr_id, attr_sel, attr_vals) {
  return request({
    method: 'get',
    url: `/categories/${cat_id}/attributes/${attr_id}`,
    params: {
      attr_sel,
      attr_vals: attr_vals || ''
    }
  })
}

// 修改参数数据
export function editAttr(cat_id, attr_id, attr_name, attr_sel, attr_vals) {
  return request({
    method: 'put',
    url: `/categories/${cat_id}/attributes/${attr_id}`,
    params: {
      attr_name,
      attr_sel,
      attr_vals: attr_vals || ''
    }
  })
}

// 删除参数属性
export function deleteAttr(cat_id, attr_id) {
  return request({
    method: 'delete',
    url: `/categories/${cat_id}/attributes/${attr_id}`,
  })
}