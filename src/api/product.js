import request from '../utils/request'

export const getProducts = params => {
    return request.get('/products', { params })
}
