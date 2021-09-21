import requset from '../utils/request'

export const addToCart = data => requset.post('/cart/add', data)

export const getCartList = params => requset.get('/cart/list', { params })

export const changeCartItemNum = data => requset.post('/cart/num', data)
