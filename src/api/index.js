import request from '../utils/request'

export const getDefalutData = () => {
    return request.get('/v2/diy/get_diy/moren')
}
