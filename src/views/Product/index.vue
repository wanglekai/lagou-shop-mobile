<template>
  <van-nav-bar left-arrow fixed @click-left="router.go(-1)" />
  <van-tabs v-model="active" scrollspy>
    <van-tab title="商品">
      <van-swipe class="my-swipe" :autoplay="3000" height="375">
        <van-swipe-item v-for="(item, index) in swipeImgs" :key="index">
          <img :src="item" />
        </van-swipe-item>
      </van-swipe>

      <!-- 商品信息 -->
      <van-cell-group inset :border="false" class="product-info">
        <van-cell :border="false">
          <template #title>
            <span class="price">￥ {{storeInfo?.price}}</span>
            <span class="pro-name">{{ storeInfo?.store_name }}</span>
          </template>
          <template #right-icon>
            <van-icon name="share" class="share-icon" size="20" />
          </template>
        </van-cell>
        <van-cell :border="false">
          <div class="content">
            <span class="custom-title">原价: ￥ {{ storeInfo?.ot_price }}</span>
            <span class="custom-title">库存: {{ storeInfo?.stock }} {{ storeInfo?.unit_name }}</span>
            <span class="custom-title">销量: {{ storeInfo?.sales}}</span>
          </div>
        </van-cell>
      </van-cell-group>
      <van-cell is-link class="user-select">
        <template #title> 已选择: </template>
      </van-cell>
    </van-tab>
    <van-tab title="评价" >
      <van-cell-group v-if="reply.replyCount" class="comments-area">
        <van-cell :border="false" title="用户评价(2)" is-link  value="100%好评率" />
        <comment-item :reply="reply" />
      </van-cell-group>
      <van-cell v-else>
        暂无评论
      </van-cell>
    </van-tab>
    <!-- 推荐内容 -->
    <van-tab title="推荐" class="recommends">
      <van-cell title="推荐商品" title-style="font-weight:bold; font-size: 18px;" />
      <van-grid :column-num="3" class="list" :border="false">
        <van-grid-item
          v-for="item in defaultData.good_list"
          :key="item.id"
          :to="{ name: 'product', params: { productId: item.id } }">
          <img :src="item.image" alt="">
          <p class="title">{{ item.store_name }}</p>
          <p class="price">￥ {{ item.price }}</p>
        </van-grid-item>
      </van-grid>
    </van-tab>
    <van-tab title="详情">内容 4</van-tab>
  </van-tabs>
</template>

<script setup>
import CommentItem from '@/components/CommentItem.vue'
import { getProductDetails } from "@/api/product";
import { computed, ref } from "@vue/reactivity";
import {  onBeforeRouteUpdate ,useRouter } from "vue-router";

const router = useRouter();

const { productId } = defineProps({
  productId: {
    required: true,
    type: String,
  },
});

const defaultData = ref({});

const initGetData = async (productId) => {
  const { data } = await getProductDetails(productId);
  if (data.status !== 200) {
    router.push({ name: "home" });
  }
  // console.log(data);
  defaultData.value = data.data;
};
initGetData(productId);

const storeInfo = computed(() => {
  return defaultData.value.storeInfo;
});
const swipeImgs = computed(() => {
  return storeInfo.value?.slider_image;
});
const reply = computed(() => {
  return {
    ...defaultData.value?.reply,
    replyChance: defaultData.value?.replyChance,
    replyCount: defaultData.value?.replyCount
  }
})

/**
 * vue 会保存组件的状态，切换时会缓存
 * 使用 路由导航守卫，检测 路由参数的变化
 * 从新发生请求
 */
onBeforeRouteUpdate(to => {
  defaultData.value = {}

  document.documentElement.scrollTop = 0
  document.body.scrollTop = 0

  initGetData(to.params.productId)

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
:deep(.van-tabs__content) {
  padding-top: 50px;
}
.van-swipe-item img {
  // width: 375px;
  width: 100%;
  height: 375px;
}

.van-tabs {
  background-color: #f4f4f4;

  .my-swipe {
    margin-top: -4px;
  }

  .product-info {
    padding: 10px 0;
    margin: 0;
    border-radius: 0;
    // margin-top: 20px;
    .price {
      color: #f22b2b;
      font-size: 24px;
      font-weight: bold;
    }
    .pro-name {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      font-size: 16px;
    }
    :deep(.content) {
      display: flex;
      justify-content: space-between;
      font-size: 16px;
      color: rgb(168, 168, 168);
    }
  }
  :deep(.user-select) {
    margin: 10px 0;
  }
  .recommends {
    margin-top: 10px;

    .list {
      background-color: #fff;
    }

    .van-grid-item__content--center {
      align-items: flex-start;
      img {
        width: 100%;
      }
      .title {
        padding: 4px 0;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        font-size: 14px;
      }
      .price {
        color: #f22b2b;
        font-size: 14px;
      }
    }
  }

}
</style>
