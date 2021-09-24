<template>
    <van-nav-bar
        :title="title"
        left-text="返回"
        left-arrow
        @click-left="handleBackClick"
    />
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const { title } = defineProps({
    title: {
        type: String,
        required: true
    }
})

// 返回按钮 
const handleBackClick = () => {
  let back = router.options.history.state.back
  if (back) return router.go(-1)
  return router.push({name: 'home'})
}
</script>

<style lang="scss" scoped>
.van-nav-bar {
    position: fixed;
    width: 100%;
    top: 0;
}
</style>
