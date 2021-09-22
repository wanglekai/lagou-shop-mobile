import { createStore } from 'vuex'

export default createStore({
    state () {
        return {
            user: {
                token: window.localStorage.USER_TOKEN || ''
            },
            cartList: []
        }
    },
    mutations: {
        setUser (state, playload) {
            state.user.token = playload
            window.localStorage.USER_TOKEN = playload
        },
        addCartItem (state, playload) {
            state.cartList.push(playload)
        },
        clearCart (state) {
            state.cartList = []
        }
    }
})
