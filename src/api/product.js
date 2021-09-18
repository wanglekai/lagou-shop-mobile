import request from '../utils/request'

export const getProducts = params => request.get('/products', { params })

// 获取某个指定商品详情
export const getProductDetails = productId => request.get(`/product/detail/${productId}`)

// 商品评价数量请接口
export const getCommentCount = productId => request.get(`/reply/config/${productId}`)

// 请求不同类型的评论数据
export const getCommentByTag = (productId, params) => request
    .get(`/reply/list/${productId}`, { params })
