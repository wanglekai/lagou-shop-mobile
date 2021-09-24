import axios from 'axios'
import router from '../router'
import store from '../store'

const request = axios.create({
    baseURL: 'https://shop.fed.lagou.com/api'
})

request.interceptors.request.use(config => {
    const { token } = store.state.User

    if (token) {
        config.headers.Authorization = 'Bearer ' + token
    }
    return config
})

request.interceptors.response.use(config => {
    const { data } = config

    if (data.status === 410000) {
        router.push({
            name: 'login',
            query: {
                redirect: router.currentRoute.fullPath
            }
        })
    }

    return config
})

export default request
