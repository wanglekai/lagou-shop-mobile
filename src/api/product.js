import request from '../utils/request'

export const getProducts = params => request.get('/products', { params })

// 获取某个指定商品详情
export const getProductDetails = productId => request.get(`/product/detail/${productId}`)
