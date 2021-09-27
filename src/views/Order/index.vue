<template>
  <!-- order - detail -->
  <div class="container">
    <top-bar title="订单列表" />

    <van-cell-group
      inset
      v-for="item in orderList"
      :key="item.id"
      >
      <van-cell is-link :to="'/order-status/' + item.order_id">
        <p class="title">订单编号:  {{ item.order_id }}</p>
        <p class="title">创建时间: {{ item._add_time }}</p>
        <p class="title">订单状态： {{ `${item._status._payType}, ${item._status._title}, ${item._status._msg}` }}</p>
        <p class="title">收货信息： {{ `${item.nickname}, ${item.user_phone}, ${item.user_address}` }}</p>
        <p class="title">支付金额：￥ {{ item.pay_price }}</p>

        <p class="title">商品列表: </p>
        <ul class="cart-list" v-for="product in item.cartInfo" :key="product.id">
          <li>
            <img :src="product.productInfo.image" alt="1">
            <p>{{product.productInfo.store_name}}</p>
          </li>
        </ul>
      </van-cell>
    </van-cell-group>

  </div>
</template>

<script setup>
import TopBar from '@/components/TopBar.vue'
import { ref } from '@vue/reactivity'
import { Toast } from 'vant'
import { getOrderList } from '../../api/order'

const orderList = ref([])

const initData = async () => {
  const { data } = await getOrderList()

  if (data.status !== 200) return Toast.fail(data.msg)

  orderList.value = data.data
}

initData()
</script>


<style lang="scss" scoped>
.container {
  padding: 50px 0 10px;
  background-color: #f0f0f0;

  .van-cell-group {
    margin-top: 10px;

    .cart-list {
      li {
        width: 33.33%;
        float: left;
        img {
          width: 100%;
        }
        p {
          @include line-clamp(2);
          font-size: 12px;
        }
      }
    }
  }
}
</style>
