<template>
  <van-nav-bar title="购物车" />
  <div class="cart-list">
    <cart-item v-for="cart in cartList" :key="cart.id" :cart="cart" />
  </div>
  <van-submit-bar :price="3050" button-text="提交订单" @submit="onSubmit">
    <van-checkbox v-model="checked" checked-color="#ee0a24">全选</van-checkbox>
  </van-submit-bar>
  <layout-footer />
</template>

<script setup>
import LayoutFooter from "@/components/LayoutFooter.vue";
import CartItem from './CartIitem.vue'
import { ref } from "@vue/reactivity";
import { getCartList } from "../../api/cart";
import { Toast } from "vant";

const cartList = ref([])

const initCartList = async () => {
  const { data } = await getCartList();

  if (data.status !== 200) return Toast.fail(data.msg)

  cartList.value = data.data.valid
};

initCartList();

const checked = ref(true)
</script>

<style lang="scss" scoped>
.van-submit-bar {
  bottom: 50px;
}
.cart-list {
  padding-bottom: 100px;
}
</style>
