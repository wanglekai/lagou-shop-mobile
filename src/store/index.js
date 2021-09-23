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
    getters: {
        // 选中状态的 购物车列表
        checkedItem (state) {
            return state.cartList.filter(item => item.checked)
        },
        // 选中商品的 总价
        totalPrice (state, getters) {
            return getters.checkedItem.reduce((sum, item) => { 
                return sum + parseFloat(item.price) * item.cart_num
             }, 0)
        },
        // 是否全选
        isCheckAll (state, getters) {
            return getters.checkedItem.length === state.cartList.length
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
        },
        checkAllOrNot (state, checked) {
            state.cartList.forEach(item => item.checked = checked)
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
