import request from '../utils/request'

// 待确认订单信息
export const confirmOrder = data => request.post('/order/confirm', data)

// 创建订单
export const createOrder = (orderKey, data) => request.post(`/order/create/${orderKey}`, data)

//获取订单列表 
export const getOrderList = () => request.get('/order/list')

// 根据 ID 获取订单详情
export const getOrderById = orderId => request.get(`/order/detail/${orderId}`)
