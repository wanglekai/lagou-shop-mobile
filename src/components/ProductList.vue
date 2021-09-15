<template>
    <van-grid
        class="product-list"
        :gutter="10"
        column-num="2"
        :center="false">
        <van-grid-item
            v-for="item in products"
            :key="item.id"
            :to="{name: 'product', params: { productId: item.id }}">
            <img :src="item.image" />
            <h3 class="title">{{ item.store_name }} </h3>
            <p class="price">￥ {{ item.price }}</p>
            <p class="info">已售 {{ item.sales }} 件</p>
        </van-grid-item>
    </van-grid>
</template>

<script>
// <script setup>
export default {
    props: {
        products: {
            required: true,
            type: Array
        }
    }
}
// import { defineProps } from 'vue'
// const { products } = defineProps({
//     products: {
//         required: true,
//         type: Array
//     }
// })

</script>


<style scoped lang="scss">
.product-list {
    box-sizing: border-box;
    margin-top: 10px;
    :deep(.van-grid-item__content) {
        overflow: hidden;
        padding: 0;
        border-radius: 10px;
    }
    .van-grid-item {
        width: 50%;
    }
    .title {
        padding: 5px 8px 0;
        text-overflow: ellipsis;
        font-size: 14px;
        font-weight: normal;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
      p.price, p.info {
          padding-left: 8px;
      }
      p.price {
          color: #f55929;
          font-size: 18px;
          font-weight: bold;
      }
      p.info {
          padding-bottom: 10px;
          font-size: 14px;
          color: #ccc;
      }
}
</style>
