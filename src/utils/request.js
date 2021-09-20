import axios from 'axios'
import store from '../store'

const requset = axios.create({
    baseURL: 'https://shop.fed.lagou.com/api'
})

requset.interceptors.request.use(config => {
    const { token } = store.state.user

    if (token) {
        config.headers.Authorization = 'Bearer ' + token
    }
    return config
})

export default requset
