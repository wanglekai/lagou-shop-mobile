import { Toast } from 'vant'
import { createStore } from 'vuex'
import { changeCartItemNum } from '../api/cart'

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
        },
        changeChecked (state, { id, checked }) {
            const currentIitem = state.cartList.find(item => item.id === id)

            if (currentIitem) {
                currentIitem.checked = checked
            } else {
                Toast.fail('选中状态异常')
            }
        },
        changeCartNum (state, { id,  cart_num}) {
            const currentIitem = state.cartList.find(item => item.id === id)

            if (currentIitem) {
                currentIitem.cart_num = cart_num
            } else {
                Toast.fail('修改购物车数量异常')
            }
        }
    },
    actions: {
        async changeCartNum({ commit }, {id, cart_num}) {

            commit('changeCartNum', { id, cart_num })

            const { data } = await changeCartItemNum({ id, number: cart_num })

            if (data.status !== 200) return Toast.fail('修改购物车数量异常: ', data.msg)

        }
    }
})
