<template>
    <div class="cart-item">
        <van-checkbox v-model="checked" checked-color="#ee0a24" />
        <div class="cart-info">
            <img :src="productInfo.image" alt="">
            <div class="cart-detail">
                <p class="title">{{ productInfo.store_name }}</p>
                <div class="cart-num">
                    <span class="price">￥ {{ currentPrice }}</span>
                    <van-stepper v-model="cart.cart_num" :max="productInfo.stock" button-size="24" />
                </div>
                <div class="other">
                    <span class="sku">{{ productInfo.attrInfo.sku }}</span>
                    <span class="btn-delete">删除</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
// import { computed, reactive } from "@vue/reactivity";
export default {
    props: {
        cart: {
            type: Object,
            required: true
        }
    },
    computed: {
        productInfo () {
            return this.cart.productInfo
        },
        currentPrice () {
            return parseFloat(this.cart.productInfo.attrInfo.price) * this.cart.cart_num
        }
    },
    data () {
        return {
            checked: true,
            count: 1
        }
    }
}

</script>

<style lang="scss" scoped>
.cart-item {
    display: flex;
    padding: 0 10px;
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
