<template>
    <van-nav-bar
        fixed
        title="订单详情"
        left-text="返回首页"
        left-arrow
        @click-left="onClickLeft"
    /> 
    <div class="content">
        <div>
            <p> 订单创建时间： {{ defauleData._add_time }}</p>
            <p>{{ defauleData._status._title }} </p>
            <div class="status">
                <img :src="defauleData.status_pic" alt="">
                <p>{{ defauleData._status._msg }}</p>
            </div>
        </div>
        <div class="address">
            <p>
                <span>{{ defauleData.user.name }}</span>
                <span>{{ defauleData.user.phone }}</span>
            </p>
            <p>{{ defauleData.user.address }}</p>
        </div>
        <ul class="order-cart-list">
            <li v-for="item in cartList" :key="item.id">
                <img :src="item.productInfo.image" alt="image" />
                <!-- <p>{{ item.productInfo.re }}</p> -->
            </li>
        </ul>
        <p>内容很长</p>
        <p>内容很长</p>
        <p>内容很长</p>
        <p>内容很长</p>
        <p>内容很长</p>
        <p>内容很长</p>
        <p>内容很长</p>
        <p>内容很长</p>
        <p>内容很长</p>
        <p>内容很长</p>
        <p>内容很长</p>
    </div>
</template>

<script setup>
import { computed, reactive } from '@vue/reactivity'
import { Toast } from 'vant'
import { getOrderById } from '../../api/order'

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
    _add_time: ''
})
const cartList = computed(() => defauleData.cartInfo)

const onClickLeft = () => {

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
}
queryCurrentOrder()

</script>

<style lang="scss" scoped>
.content {
    margin-top: 50px;
    padding: 10px;
    font-size: 16px; 
    .status {
        img {
            width: 100px;
            height: 100px;
        }
    }
}
</style>
