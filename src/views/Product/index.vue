<template>
  <top-bar title="" />
  <van-tabs v-model="active" class="product-container" scrollspy>
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
      <van-cell is-link class="user-select" @click="showPopup">
        <template #title> 已选择: {{ sku }}</template>
      </van-cell>
    </van-tab>
    <van-popup v-model:show="showSku" position="bottom" class="pop-sku-wrap">
      <van-cell>
          <div class="popup-header">
            <img :src="storeInfo?.image" alt="">
            <div class="info">
              <p class="title">{{ storeInfo?.store_name }}</p>
              <p class="price">￥ {{ currentPrice }}</p>
              <p class="stock">库存 {{ currntStock }}</p>
            </div>
          </div>
      </van-cell>
        
      <van-cell-group class="sku-list">
        <p>请选择商品属性</p>
        <van-cell v-for="(attr, index) in productAttr" :key="attr.id">
          <p>{{ attr.attr_name }}</p>

          <span
            v-for="tag in attr.attr_values" 
            :key="tag"
            :class="{ active: specState.spec[index] === tag }"
            @click="handleTagChange(tag, index)">
            {{ tag }}
          </span>

        </van-cell>
      </van-cell-group>

      <van-cell class="cart-count">
        <span>数量</span>
        <van-stepper v-model="specState.buyCount" :max="productValue?.stock" />
      </van-cell>
    </van-popup>
    <van-tab title="评价" >
      <van-cell-group v-if="reply.replyCount" class="comments-area">
        <van-cell
          :border="false" 
          title="用户评价(2)" 
          is-link
          value="100%好评率"
          :to="{ name: 'comments', params: { productId: storeInfo.id } }"/>
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
          v-for="item in defaultData?.good_list"
          :key="item.id"
          :to="{ name: 'product', params: { productId: item.id } }">
          <img :src="item.image" alt="">
          <p class="title">{{ item.store_name }}</p>
          <p class="price">￥ {{ item.price }}</p>
        </van-grid-item>
      </van-grid>
    </van-tab>
    <van-tab title="详情" class="product-detail">
      <h3>商品详情</h3>
      <div class="descripion" v-html="storeInfo?.description"></div>
    </van-tab>
  </van-tabs>

  <van-action-bar class="foot-bar">
    <van-action-bar-icon icon="chat-o" text="客服" color="#ee0a24" />
    <van-action-bar-icon icon="cart-o" text="购物车" to="/cart" />
    <van-action-bar-icon icon="star" text="已收藏" color="#ff5000" />
    <van-action-bar-button type="warning" text="加入购物车"  @click="handleAddCart" />
    <van-action-bar-button type="danger" text="立即购买" />
  </van-action-bar>
</template>

<script setup>
import TopBar from '@/components/TopBar.vue'

import CommentItem from '@/components/CommentItem.vue'
import { getProductDetails } from "@/api/product";
import { computed, reactive, ref } from "@vue/reactivity";
import {  onBeforeRouteUpdate ,useRouter } from "vue-router";
import ProductListVue from '../../components/ProductList.vue';

const router = useRouter();
const { productId } = defineProps({
  productId: {
    required: true,
    type: String,
  },
});
console.log(router);

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
  return defaultData.value?.storeInfo;
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

// 选择 商品 sku
let showSku = ref(false)

const showPopup = () => {
  showSku.value = true
}

const productAttr = computed(() => {
  return defaultData.value?.productAttr
})
const productValue = computed(() => {
  return defaultData.value?.productValue
})

const specState = reactive({
  spec: [],
  buyCount: 1
})

const sku = computed(() => specState.spec.toString())
const specDetail = computed(() => productValue.value?.[sku.value])

// 当前选中 sku 商品的金额
const currentPrice = computed(() => {
  let obj = JSON.parse(JSON.stringify(productValue.value))

  let prices = []
  // const prices = [...productValue.value]?.map(item => item.price)
  for(let key in obj) {
    prices.push(parseFloat(obj[key].price))
  }
  
  let min = Math.min(...prices)
  let max = Math.max(...prices)

  if ( productValue.value.hasOwnProperty(sku.value) ) {
    return specDetail.value.price
  }

  return `${min} ~ ${max}`
})

// 当前库存数量
const currntStock = computed(() => {
  if ( productValue.value.hasOwnProperty(sku.value) ) {
    return specDetail.value?.stock
  }
  return storeInfo.value?.stock

})

// 规格切换处理
const handleTagChange = (tag, specIndex) => {
  if (specState.spec[specIndex] === tag) {
    specState.spec[specIndex] = ''
    return false
  }
  specState.spec[specIndex] = tag
}

// **************** 加购**********************

import { useStore } from 'vuex'
import { addToCart } from '../../api/cart'
import { Dialog, Toast } from 'vant';
const store = useStore()

const handleAddCart = async () => {

  if (!store.state.User.token) return router.push({
    name: 'login',
    query: {
      redirect: router.currentRoute.value.fullPath
    }
  })

  if (sku.value in productValue.value) {

    let uniqueId = productValue.value[sku.value].unique
    // 发送请求，将数据加入购物车
    const { data } = await addToCart({
      new: 0, // 0 代表加入购物车操作，1 代表立即购买
      uniqueId,
      productId,
      cartNum: specState.buyCount
    })
    // console.log(data);
    if (data.status !== 200) return Toast.fail(data.msg)

    Dialog.confirm({
      title: '已加入购物车',
      message: '是否前去购物车看看？',
      cancelButtonText: '不了, 继续逛逛'
    }).then(() => {
      router.push('/cart')
    }).catch(() => {
      showSku.value = false
    })
  } else {
    showSku.value = true
  }
}

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

.product-container {
  padding-bottom: 50px;
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
      @include line-clamp(2);
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
        @include line-clamp(2);
        font-size: 14px;
      }
      .price {
        color: #f22b2b;
        font-size: 14px;
      }
    }
  }
  :deep(.product-detail) {
    width: 100%;
    margin-top: 10px;
    background-color: #fff;
    font-size: 16px;
    overflow: hidden;
    h3 {
      padding: 10px;
      font-size: 18px;
    }
  }
  :deep(.descripion) {
    width: 100%;
    img {
      width: 100%;
    }
  }

  :deep(.pop-sku-wrap) {
    border-radius: 10px 10px 0 0;
    margin-bottom: 50px;
    .popup-header {
      display: flex;
      img {
        width: 80px;
        height: 80px;
      }
      .info {
        margin-left: 10px;
        .title {
          @include line-clamp;
          font-size: 18px;
          font-weight: bold;
        }
        .price {
          padding: 6px 0;
          color: #f22b2b;
        }
        .stock {
          color: #ccc;
        }
      }
    }

    .sku-list {

      font-size: 16px;

      span {
        display: inline-block;
        padding: 0 10px;
        margin-right: 5px;
        border-radius: 8px;
        border: 1px solid #ccc;

        &.active {
          border-color: #f22b2b;
          color: #f22b2b;
          background-color: #f7dddd;
        }
      }
    }

    .cart-count .van-cell__value{
      display: flex;
      justify-content: space-between;
    }
  }
}
.foot-bar {
  z-index: 9999;
}
</style>
