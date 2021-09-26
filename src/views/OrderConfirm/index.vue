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
        @add="addNewAddress(0)"
        @edit="(item)=>{ addNewAddress(item.id, item) }">
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
        <img :src="item.productInfo?.image" alt="product-img" />

        <div class="info">
          <p class="title">{{ item.productInfo?.store_name }}</p>
          <p class="other">
            <span class="price">￥ {{ item.truePrice }}</span>
            <span class="num">× {{ item.cart_num }}</span>
          </p>
        </div>
      </van-cell>
    </van-cell-group>
    <van-submit-bar :price="totalPrice * 100" button-text="提交订单" @submit="onSubmit" />

    <!-- 弹出付款区域 -->
  <van-action-sheet
    v-model:show="showPayPanel"
    title="请选择支付方式"
    cancel-text="取消"
    close-on-click-action
  >
    <!-- 付款列表区域 -->
    <template #default>
      <van-radio-group v-model="state.paymentMethod">
        <van-cell-group>
          <!-- 余额支付 -->
          <van-cell
            clickable
            title="微信支付"
            label="微信快捷支付"
            @click="state.paymentMethod = 'wechat'"
            size="large"
            center
          >
            <template #icon>
              <van-icon
                name="http://www.lgstatic.com/lg-app-fed/pay/images/wechat_b787e2f4.png"
                size="30"
                :style="{ marginRight: '12px' }"
              ></van-icon>
            </template>
            <template #right-icon>
              <van-radio
                name="wechat"
                checked-color="#ee0a24"
              />
            </template>
          </van-cell>
          <!-- 支付宝 -->
          <van-cell
            clickable
            title="支付宝"
            label="支付宝快捷支付"
            @click="state.paymentMethod = 'alipay'"
            size="large"
            center
          >
            <template #icon>
              <van-icon
                name="http://www.lgstatic.com/lg-app-fed/pay/images/ali_ed78fdae.png"
                size="30"
                :style="{ marginRight: '12px' }"
              ></van-icon>
            </template>
            <template #right-icon>
              <van-radio
                name="alipay"
                checked-color="#ee0a24"
              />
            </template>
          </van-cell>
          <!-- 余额支付 -->
          <van-cell
            clickable
            title="余额支付"
            :label="`可用余额为：${ state.balance }元`"
            @click="state.paymentMethod = 'yue'"
            size="large"
            center
          >
            <template #icon>
              <van-icon
                name="gold-coin"
                color="#FF9900"
                size="30"
                :style="{ marginRight: '12px' }"
              ></van-icon>
            </template>
            <template #right-icon>
              <van-radio
                name="yue"
                checked-color="#ee0a24"
              />
            </template>
          </van-cell>
          <van-cell>
            <van-button
              round
              type="danger"
              block
              @click="handlePay"
            >去支付</van-button>
          </van-cell>
        </van-cell-group>
      </van-radio-group>
    </template>
  </van-action-sheet>
  </main>
</template>

<script setup>
import TopBar from '@/components/TopBar.vue'
import { computed, reactive, ref, toRaw } from '@vue/reactivity'
import { Toast } from 'vant'
import { getAddressList } from '../../api/address'
import { confirmOrder, createOrder } from '../../api/order'
import { useStore } from 'vuex'
import { areaList } from "@vant/area-data";

const store = useStore()


// 总计件数
const totalNum = computed(() => confirmOrders.value?.reduce((sum, item) => {
  return sum + item.cart_num
}, 0))

const { cartId } = defineProps({
  cartId: {
    type: String,
    required: true
  }
})

const findAreaCode = county => {
  for (let key in areaList.county_list) {
    if (areaList.county_list[key] === county) {
      return key
    }
  }
}

import { useRouter } from 'vue-router'
const router = useRouter()

const addNewAddress = (id, address = {}) => {
  console.log(address);
  router.push({
    name: 'address',
    params: { 
      addressId: id, 
      address: JSON.stringify(address),
      areaCode: findAreaCode(address.address?.split(',')[2])
    }
  })
}

// ******************地址选择***************

const showAddressPop = ref(false)
const showAddress = () => showAddressPop.value = true

// 当前收件人信息
const addressList = ref([])
const currentAddress = ref({})

const isEmpty = computed(() => addressList.value.length === 0)
const chosenAddressId = computed(() => currentAddress.value.id);

const converData = data => ({
  id: data.id,
  name: data.real_name,
  tel: data.phone,
  address: `${data.province},${data.city},${data.district},${data.detail}`,
  isDefault: data.is_default === 1
})

const selectAddress = item => {
  // toRaw
  currentAddress.value = toRaw(item)
  showAddressPop.value = false
} 


const state = reactive({
  paymentMethod: 'yue',  // 支付方式
  balance: '', // 用户余额
  orderKey: ''  // 待确认订单 ID

})

// 待确认订单列表
const confirmOrders = ref([])
const totalPrice = computed(() => confirmOrders.value?.reduce((sum, item) => {
  return sum + parseFloat(item.truePrice) * item.cart_num
}, 0))
const showPayPanel = ref(false)
const onSubmit = () => {
  showPayPanel.value = true
}

// const balance = ref('')
// const paymentMethod = ref('yue')

const handlePay = async () => {
  const { data } = await createOrder(state.orderKey, {
    addressId: currentAddress.value.id,
    payType: state.paymentMethod
  })
  // console.log(data);
  if (data.status !== 200) return Toast.fail(data.msg)

  router.push({
    name: 'order-status',
    params: {
      orderId: data.data.result.orderId
    }
  })
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

// 获取确定订单信息
const initConfirmOrder = async () => {
  const { data } = await confirmOrder({
    cartId,
    new: 0
  })
  // console.log(data);
  if (data.status !== 200) return Toast.fail(data.msg)

  confirmOrders.value = data.data.cartInfo
  state.balance = data.data.userInfo.brokerage_price
  state.orderKey = data.data.orderKey
}

initConfirmOrder()

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
