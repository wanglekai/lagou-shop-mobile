import axios from 'axios'
import router from '../router'
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

requset.interceptors.response.use(config => {
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

export default requset
