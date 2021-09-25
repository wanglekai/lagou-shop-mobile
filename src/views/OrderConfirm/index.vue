<template>
  <top-bar title="确认订单" />
  <main class="container">
    <div class="default-address" @click="showAddress">
      <p>收货地址：</p>
      <p v-if="isEmpty">点击添加收货地址</p>
      <p>
        <span v-text="currentAddress?.name"></span>
        <span v-text="currentAddress?.tel"></span>
      </p>
      <p>
        <span class="default-txt" v-if="currentAddress?.isDefault">默认</span> 
        {{ currentAddress?.address }}
      </p>
    </div>

    <!-- 地址选择 -->
    <van-popup v-model:show="showAddressPop" position="bottom">
      <van-address-list
        v-model="chosenAddressId"
        :list="addressList"
        default-tag-text="默认"
        @click-item="selectAddress"
        @add="onAdd"
        @edit="onEdit">
        <template #top>
          <van-empty v-if="isEmpty" description="还没添加过地址哦~" />
        </template>
      </van-address-list>
    </van-popup>

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
import { computed, ref, toRaw } from '@vue/reactivity'
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

// ******************地址选择***************

const showAddressPop = ref(false)
const showAddress = () => showAddressPop.value = true

// 当前收件人信息
const addressList = ref([])
const currentAddress = ref({})

const isEmpty = computed(() => addressList.value.length === 0)
// const currentAddress = computed({
//   get: () => addressList.value?.find(item => item.isDefault),
//   set (value) {
//     this.value = value
//   }
// })
const chosenAddressId = computed(() => currentAddress.value.id);

const converData = data => ({
  id: data.id,
  name: data.real_name,
  tel: data.phone,
  address: `${data.province}, ${data.district}, ${data.detail}`,
  isDefault: data.is_default === 1
})

const selectAddress = item => {
  // toRaw
  currentAddress.value = toRaw(item)
  showAddressPop.value = false
} 

// 获取用户地址列表
const initAddressList = async () => {
  const { data } = await getAddressList({
    page: 1,
    limit: 4
  })

  // console.log(data);
  if (data.status !== 200) return Toast.fail(data.msg)

  const defaultData = data.data.find(item => item.is_default)

  currentAddress.value = converData(defaultData)

  addressList.value = data.data.map(item => converData(item))
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
      font-size: 14px;
      span {
        margin-right: 10px;
      }
    }
    p:not(:first-child) {
      padding-left: 30px;
    }
    .default-txt {
      background-color: $theme-color;
      color: #fff;
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
        font-size: 14px;
        @include line-clamp;
      }
      .other {
        display: flex;
        justify-content: space-between;
        .price {
          color: $theme-color;
        }
      }
    }
  }
}
</style>
