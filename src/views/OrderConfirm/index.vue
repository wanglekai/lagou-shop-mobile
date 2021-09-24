<template>
  <top-bar title="确认订单" />
  <main class="container">
    <div class="default-address">
      <p>{{ currentUser }}</p>
      <p>{{ currentAddress }}</p>
    </div>

    <p class="total-num">共计 {{ totalNum }} 件</p>

    <van-cell-group>
      <van-cell class="order-item" 
        v-for="item in confirmOrders"
        :key="item.id" >
        <img :src="item.image" alt="product-img" />

        <div class="info">
          <p class="title">{{ item.store_name }}</p>
          <p class="other">
            <span class="price">￥ {{ item.price }}</span>
            <span class="num">× {{ item.cart_num }}</span>
          </p>
        </div>
      </van-cell>
    </van-cell-group>
  </main>
</template>

<script setup>
import TopBar from '@/components/TopBar.vue'
import { computed, ref } from '@vue/reactivity'
import { Toast } from 'vant'
import { getAddressList } from '../../api/address'
import { useStore } from 'vuex'

const store = useStore()

// 待确认订单列表
const confirmOrders = computed(() => {
  if (store.getters['Cart/checkedItem'].length !== 0) {
    return store.getters['Cart/checkedItem']
  } else {
    return JSON.parse(window.localStorage.getItem('curOrder'))
  }
})
// 总计件数
const totalNum = computed(() => confirmOrders.value?.reduce((sum, item) => {
  return sum + item.cart_num
}, 0))

console.log(confirmOrders.value);

const { cartId } = defineProps({
  cartId: {
    type: String,
    required: true
  }
})


// 当前收件人信息
const addressList = ref([])
const defaultAddress = computed(() => addressList.value?.find(item => item.is_default === 1))
const currentUser = computed(() => defaultAddress.value?.real_name + ' ' +  defaultAddress.value?.phone)
const currentAddress = computed(() => `${defaultAddress.value?.province}, ${defaultAddress.value?.city}, ${defaultAddress.value?.district}, ${defaultAddress.value?.detail}`)

// 获取用户地址列表
const initAddressList = async () => {
  const { data } = await getAddressList()

  // console.log(data);
  if (data.status !== 200) return Toast.fail(data.msg)

  addressList.value = data.data
}
initAddressList()

</script>

<style lang="scss" scoped>
main.container {
  padding: 50px 0;
  .default-address {
    border-bottom: 1px solid #ccc;
    p {
      padding: 5px 20px;
      font-size: 16px;
    }
  }
  .total-num {
    padding: 10px;
    font-size: 14px;
  }
  .order-item {
    // display: flex;
    :deep(.van-cell__value) {
      display: flex;
    }
    img {
      width: 60px;
      height: 60px;
    }
    .info {
      flex: 1;
      margin-left: 10px;
      .title {
        font-size: 16px;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
      .other {
        display: flex;
        justify-content: space-between;
        .price {
          color: #ee0a24;
        }
      }
    }
  }
}
</style>
