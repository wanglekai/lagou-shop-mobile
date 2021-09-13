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
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { getDefalutData } from '@/api/index.js'

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

</script>

<style lang="scss" scoped>
.home-main {
    padding: 50px 0;
    font-size: 18px;
    background-color: #e4e4e4;

    .my-swipe img{
        width: 100%;
        height: 170px;
    }
}
</style>
