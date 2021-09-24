<template>
  <van-nav-bar title="购物车" />
  <div class="cart-list" v-if="notEmpty">
    <cart-item v-for="cart in cartList" :key="cart.id" :cart="cart" />
  </div>
  <van-empty v-else description="购物车空空如也~" />
  <van-submit-bar
    :price="store.getters['Cart/totalPrice'] * 100"
    button-text="提交订单" @submit="onSubmit">
    <van-checkbox v-model="isCheckedAll" checked-color="#ee0a24">全选</van-checkbox>
  </van-submit-bar>
  <layout-footer />
</template>

<script setup>
import LayoutFooter from "@/components/LayoutFooter.vue";
import CartItem from './CartIitem.vue'
import { computed } from "@vue/reactivity";
import { getCartList } from "../../api/cart";
import { Toast } from "vant";
import { useStore } from 'vuex'
import { nextTick } from "@vue/runtime-core";
import { useRouter } from "vue-router";

const store = useStore()

const cartList = computed(() => store.state.Cart.cartList)

const notEmpty = computed(() => cartList.value.length  > 0)

const isCheckedAll = computed({
  get: () => store.getters['Cart/isCheckAll'],
  set (value) {
    store.commit('Cart/checkAllOrNot', value)
  }
})

const initCartList = async () => {
  const { data } = await getCartList();

  if (data.status !== 200) return Toast.fail(data.msg)

  store.commit('Cart/clearCart')
  
  await nextTick()

  const result = data.data

  result.valid.forEach(item => {
    store.commit('Cart/addCartItem', {
      id: item.id,
      productId: item.product_id,
      cart_num: item.cart_num,
      image: item.productInfo.image,
      price: item.truePrice,
      stock: item.trueStock,
      store_name: item.productInfo.store_name,
      checked: item.attrStatus,
      sku: item.productInfo.attrInfo.sku
    })
  })
};

initCartList();

// 提交订单
const router = useRouter()
const onSubmit = () => {
  router.push({
    name: 'order-confirm',
    params: {
      cartId: store.getters['Cart/checkedItem'].map(item => item.id).toString()
    }
  })
}

</script>

<style lang="scss" scoped>
.van-submit-bar {
  bottom: 50px;
}
.cart-list {
  padding-bottom: 100px;
}
</style>
