<template>
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh" class="home-main">
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
        <van-list
            v-model:loading="state.loading"
            :finished="state.finished"
            finished-text="没有更多了"
            @load="loadProducts">
            <product-list :products="productList" />
        </van-list>
    </van-pull-refresh>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import { getDefalutData } from '@/api/index.js'
import { getProducts } from '@/api/product.js'
import ProductList from '@/components/ProductList.vue'

let defaultData = ref({})
let refreshing  = ref(false)

const getData = async () => {
    const { data } = await getDefalutData()
    if (data.status !== 200) return
    defaultData.value = data.data
    
    return Promise.resolve()
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
const state = reactive({
  loading: false,
  finished: false
})

let page = 1, limit = 4

const loadProducts = async () => {
    
    const { data } = await getProducts({ limit, page })
    if (data.status !== 200) return
    productList.value.push(...data.data)

    // 加载状态结束
    state.loading = false

    // 数据全部加载完成
    if (data.data.length < limit) {
        state.finished = true
        return
    }
    page++
    return Promise.resolve()
}
// loadProducts()

// 下拉刷新

const onRefresh = () => {
    defaultData.value = {}
    productList.value = []

    page = 1

    Promise.all([getData(), loadProducts()]).then(()=>{
        // console.log('111');
        state.finished = false
        refreshing.value =false
    })
    // getData().then(() => {
    //     state.finished = false
    //     loadProducts()
    //     refreshing.value =false
    // })
    // loadProducts()
    
}

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
