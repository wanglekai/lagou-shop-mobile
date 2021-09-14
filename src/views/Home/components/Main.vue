<template>
    <div class="home-main">
        <!-- 轮播图区域 -->
        <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
            <van-swipe-item
                v-for="item in swipeList"
                :key="item.img">
                <img :src="item.img" />    
            </van-swipe-item>
        </van-swipe>

        <!-- 菜单列表 -->
        <van-grid column-num="4" icon-size="36" :border="false">
            <van-grid-item
                v-for="(item, index) in menusList"
                :key="index"
                :icon="item.img" :text="item.info[0].value" />
        </van-grid>

        <!-- 通知栏 -->
        <van-notice-bar left-icon="volume-o" :scrollable="false">
            <p>热点资讯公告：</p>
            <van-swipe
                vertical
                class="notice-swipe"
                :touchable="false"
                :autoplay="3000"
                :show-indicators="false">
                <van-swipe-item
                    v-for="(item, index) in newsList"
                    :key="index"
                    v-text="item.chiild[0].val"
                />
            </van-swipe>
        </van-notice-bar>

        <!-- 商品列表 -->
        <product-list :products="productList" />
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { getDefalutData } from '@/api/index.js'
import { getProducts } from '@/api/product.js'
import ProductList from '@/components/ProductList.vue'

let defaultData = ref({})

const getData = async () => {
    const { data } = await getDefalutData()
    if (data.status !== 200) return
    defaultData.value = data.data
}
getData()

const swipeList = computed(() => {
    return defaultData.value.swiperBg?.default.imgList.list
})
const menusList = computed(() => {
    return defaultData.value.menus?.default.imgList.list
})
const newsList = computed(() => {
    return defaultData.value.news?.default.newList.list
})

// 商品列表
const productList = ref([])

let page = 1, limit = 8
const getProductsData = async () => {
    const { data } = await getProducts({ page, limit })
    if (data.status !== 200) return

    productList.value.push(...data.data)
}
getProductsData()

</script>

<style lang="scss" scoped>
.home-main {
    padding: 50px 0 60px;
    font-size: 18px;
    background-color: #e4e4e4;

    .my-swipe img{
        width: 100%;
        height: 170px;
    }

    // ::v-deep .van-notice-bar__content {
    :deep(.van-notice-bar__content) {
        display: flex;
        align-items: center;
    }

    .notice-swipe {
        height: 40px;
        line-height: 40px;
    }
}
</style>
