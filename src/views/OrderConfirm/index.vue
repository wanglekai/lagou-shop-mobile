<template>
  <van-nav-bar
    title="确定订单"
    left-text="返回"
    left-arrow
  />
  <main class="container">
    <div class="default-address">
      <p>{{ currentUser }}</p>
      <p>{{ currentAddress }}</p>
    </div>
  </main>
</template>

<script setup>

const { cartId } = defineProps({
  cartId: {
    type: String,
    required: true
  }
})

import { computed, ref } from '@vue/reactivity'
import { Toast } from 'vant'
import { getAddressList } from '../../api/address'


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
.van-nav-bar {
  position: fixed;
  width: 100%;
}
main.container {
  padding: 50px 0;
  .default-address {
    border-bottom: 1px solid #ccc;
    p {
      padding: 5px 20px;
      font-size: 16px;
    }
  }
}
</style>