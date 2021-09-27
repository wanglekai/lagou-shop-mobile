<template>
<div class="contaner">
    <van-nav-bar
        fixed
        title="订单详情"
        left-text="返回首页"
        left-arrow
        @click-left="onClickLeft"
    /> 
    <div class="content">
        <div class="content-item">
            <p><span class="desc">订单号：</span> {{ orderId }}</p>
            <p> <span class="desc">订单创建时间：</span> {{ defauleData._add_time }}</p>
        </div>
        <div class="content-item">
            <div class="status">
                <img :src="defauleData.status_pic" alt="">
                <div class="detail">
                    <p>{{ defauleData._status._msg }}</p>
                    <p> 
                        <span>{{ defauleData._status._title }}</span>, 
                        <span>金额: {{ defauleData.pay_price }}</span>
                    </p>
                </div>
            </div>
        </div>
        <div class="address content-item">
            <p>
                <span>收件人：{{ defauleData.user.name }}</span>， 
                <span>联系电话：{{ defauleData.user.phone }}</span>
            </p>
            <p>收货地址： {{ defauleData.user.address }}</p>
        </div>
        <ul class="order-cart-list content-item">
            <li v-for="item in cartList" :key="item.id">
                <img :src="item.productInfo.image" alt="image" />
                <div class="info">
                    <p>{{ item.productInfo.store_name }}</p>
                <p>
                    <span>数量： {{ item.cart_num }}</span>
                    <span>单价: {{ item.truePrice }}</span>
                </p>
                </div>
            </li>
        </ul>
    </div>
    <div class="footer-btns">
            <van-button round to="/">
                返回首页
            </van-button>
            <van-button type="danger" round to='/order'>
                查看购物车列表
            </van-button>
        </div>
</div>
</template>

<script setup>
import { computed, reactive } from '@vue/reactivity'
import { Toast } from 'vant'
import { useRouter } from 'vue-router'
import { getOrderById } from '../../api/order'

const router = useRouter()

const { orderId } = defineProps({
    orderId: {
        type: String,
        required: true
    }
})

const defauleData = reactive({
    status_pic: '',
    _status: {},
    cartInfo: [],
    user: {},
    _add_time: '',
    pay_price: ''
})
const cartList = computed(() => defauleData.cartInfo)

const onClickLeft = () => {
    router.push({name: 'home'})
}

const queryCurrentOrder = async () => {
    const { data } = await getOrderById(orderId)

    if (data.status !== 200) Toast.fail(data.msg)

    const result = data.data

    defauleData.status_pic = result.status_pic
    defauleData._status = result._status
    defauleData.cartInfo = result.cartInfo
    defauleData._add_time = result._add_time
    defauleData.user.name = result.real_name
    defauleData.user.phone = result.user_phone
    defauleData.user.address = result.user_address
    defauleData.pay_price = result.pay_price
}
queryCurrentOrder()

</script>

<style lang="scss" scoped>
.contaner {
    background-color: #efefef;
}
.content {
    margin-top: 50px;
    // padding: 10px;
    font-size: 14px; 
    .content-item {
        padding: 10px;
        margin: 10px 0;
        background-color: #fff;
    }

    .status {
        display: flex;
        img {
            width: 80px;
            height: 80px;
        }
        .detail {
            padding: 10px 0;
            margin-left: 10px;
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }
    }
    .address {

    }
    .order-cart-list {
        margin: 10px 0;
        li {
            display: flex;
            img {
                width: 80px;
                height: 80px;
            }
            p {
                @include line-clamp;
                span {
                    margin-right: 20px;
                }
            }
        }
    }
}
.footer-btns {
    // padding: 0 50px;
    width: 70%;
    margin: 0 auto;
    padding-bottom: 10px;
    display: flex;
    justify-content: space-between;
}
</style>
