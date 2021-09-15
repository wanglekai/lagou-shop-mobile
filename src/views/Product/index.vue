<template>
  <van-nav-bar left-arrow fixed @click-left="router.go(-1)"/>
  <van-tabs v-model="active" scrollspy>
    <van-tab title="商品">
      <van-swipe class="my-swipe" :autoplay="3000"  height="375">
        <van-swipe-item
          v-for="(item, index) in swipeImgs"
          :key="index">
            <img :src="item">
          </van-swipe-item>
      </van-swipe>
    </van-tab>
    <van-tab title="评价" style="height: 1000px">内容 2</van-tab>
    <van-tab title="推荐">内容 3</van-tab>
    <van-tab title="详情">内容 4</van-tab>
  </van-tabs>
</template>

<script setup>

import { getProductDetails } from '@/api/product'
import { computed, ref } from '@vue/reactivity'
import { useRouter } from 'vue-router'

const router = useRouter()

const { productId } = defineProps({
  productId: {
    required: true,
    type: String
  }
})

const defaultData = ref({})

const initGetData = async () => {
  const { data } = await getProductDetails(productId)
  if (data.status !== 200) {
    router.push({ name: 'home' })
  }
  // console.log(data);
  defaultData.value = data.data
}
initGetData()

const storeInfo = computed(() => {
  return defaultData.value.storeInfo
})
const swipeImgs = computed(() => {
  return storeInfo.value?.slider_image
})

</script>


<style lang="scss" scoped>
:deep(.van-tabs__wrap) {
  position: fixed;
  top: 0;
  right: 0;
  left: 30px;
  // padding-left: 10px;
  z-index: 2;
}
:deep(.van-tab__pane) {
  padding-top: 50px;
}
.van-swipe-item img {
  height: 375px;
}
</style>
