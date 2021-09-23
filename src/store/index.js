import { createStore } from 'vuex'

import User from './modules/user'
import Cart from './modules/cart'

export default createStore({
    modules: {
        User,
        Cart
    }
})
