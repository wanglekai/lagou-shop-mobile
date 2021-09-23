import { Toast } from 'vant'
import { changeCartItemNum } from '@/api/cart'

const state = {
    cartList: []
}
const getters = {
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
}
const mutations = {
    // 加入购物车
    addCartItem (state, playload) {
        state.cartList.push(playload)
    },
    // 清空购物车数据
    clearCart (state) {
        state.cartList = []
    },
    // 购物车单个商品的 选中状态
    changeChecked (state, { id, checked }) {
        const currentIitem = state.cartList.find(item => item.id === id)

        if (currentIitem) {
            currentIitem.checked = checked
        } else {
            Toast.fail('选中状态异常')
        }
    },
    // 更改购物车数量
    changeCartNum (state, { id,  cart_num}) {
        const currentIitem = state.cartList.find(item => item.id === id)

        if (currentIitem) {
            currentIitem.cart_num = cart_num
        } else {
            Toast.fail('修改购物车数量异常')
        }
    },
    // 购物车 全选或取消全选
    checkAllOrNot (state, checked) {
        state.cartList.forEach(item => item.checked = checked)
    }
}
const actions = {
    async changeCartNum({ commit }, {id, cart_num}) {

        commit('changeCartNum', { id, cart_num })

        const { data } = await changeCartItemNum({ id, number: cart_num })

        if (data.status !== 200) return Toast.fail('修改购物车数量异常: ', data.msg)

    }
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}
