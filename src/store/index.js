import { createStore } from 'vuex'

export default createStore({
    state () {
        return {
            user: {
                token: window.localStorage.USER_TOKEN || ''
            }
        }
    },
    mutations: {
        setUser (state, playload) {
            state.user.token = playload
            window.localStorage.USER_TOKEN = playload
        }
    }
})
