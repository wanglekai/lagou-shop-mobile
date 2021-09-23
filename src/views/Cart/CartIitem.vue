<template>
    <div class="cart-item">
        <van-checkbox class="check-box" v-model="itemChecked" checked-color="#ee0a24" />
        <div class="cart-info"  @click="toDetail">
            <img :src="cart.image" alt="">
            <div class="cart-detail">
                <p class="title">{{ cart.store_name }}</p>
                <div class="cart-num">
                    <span class="price">￥ {{ currentPrice }}</span>
                    <van-stepper
                        @click.stop
                        v-model="cartNum" 
                        :max="cart.stock" 
                        button-size="24" />
                </div>
                <div class="other">
                    <span class="sku">{{ cart.sku }}</span>
                    <span class="btn-delete">删除</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import store from '../../store'
// import { computed, reactive } from "@vue/reactivity";
export default {
    props: {
        cart: {
            type: Object,
            required: true
        }
    },
    computed: {
        currentPrice () {
            let res = parseFloat(this.cart.price) * this.cart.cart_num
            return parseFloat(res.toFixed(2))
        },
        // 选择状态 
        itemChecked: {
            get () {
                 return this.cart.checked
            },
            set (value) {
                store.commit('changeChecked', {
                    id: this.cart.id,
                    checked: value
                })
            }
        },
        // 购物车数量
        cartNum: {
            get () {
                return this.cart.cart_num
            },
            set (value) {
                store.dispatch('changeCartNum', {
                    id: this.cart.id,
                    cart_num: value
                })
            }
        }
    },
    methods: {
        toDetail () {
            // console.log(this.$router);
            this.$router.push({
                name: 'product',
                params: {
                    productId: this.cart.productId
                }
            })
        }
    }
}

</script>

<style lang="scss" scoped>
.cart-item {
    display: flex;
    padding: 0 10px;
    :deep(.check-box) {
        padding-left: 10px;
        padding-right: 10px;
    }
    .cart-info {
        display: flex;
        flex: 1;
        .cart-detail {
            margin-top: 20px;
            flex: 1;
        }
        img {
            width: 100px;
            height: 100px;
        }
        p.title {
            display: -webkit-box;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
            overflow: hidden;
            font-size: 14px;
        }
        span.price {
            font-size: 12px;
            color: #fd5332;
        }
    }
    .cart-num {
        margin-top: 10px;
        display: flex;
        justify-content: space-between;
    }
    .other {
        display: flex;
        justify-content: space-between;
        font-size: 14px;
        span {
            display: inline-block;
            padding: 5px 10px;
        }
    }
}
</style>
