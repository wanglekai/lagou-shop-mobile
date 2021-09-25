import request from '../utils/request'

export const getAddressList = params => request.get('/address/list', {
    params
})

export const getCityList = params => request.get('/city_list', {
    params
})

export const addOrUpdateAddress = data => request.post('/address/edit', data)
