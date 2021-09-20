import { createStore } from 'vuex'

export default createStore({
    state () {
        return {
            user: window.localStorage.user || ''
        }
    },
    mutations: {
        setUser (state, playload) {
            state.user = playload
        }
    }
})
