import request from '../utils/request'

export const addToCart = data => request.post('/cart/add', data)

export const getCartList = params => request.get('/cart/list', { params })

export const changeCartItemNum = data => request.post('/cart/num', data)
