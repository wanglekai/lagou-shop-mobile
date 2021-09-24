<template>
    <top-bar title="" />
    <van-cell-group :border="false">
        <van-cell
            class="comments-title"
            title="商品评价"
            :value="`好评率 ${replyChance}`"
            :border="false"/>
        <van-cell class="tags-btns" :border="false">
            <van-button
                round
                size="small"
                v-for="(tag, index) in tagBtns"
                :key="tag.id"
                :class="{'active': state.type === tag.value}"
                @click="handleChangeTag(tag.value)">
                {{ `${tag.content} (${commentNums[index]})` }}
            </van-button>
        </van-cell>

        <div v-if="isEmpty">
            <comment-item
            v-for="roply in state.commentList"
            :key="roply.id"
            :reply="roply" />
        </div>

        <van-empty v-else description="暂无论哦~" />
    </van-cell-group>
</template>

<script setup>
import TopBar from '@/components/TopBar.vue'

import CommentItem from '@/components/CommentItem.vue'
import { computed, defineProps, reactive, ref } from 'vue'
import { getCommentCount, getCommentByTag } from '../../api/product'
import { useRouter } from 'vue-router'

const router = useRouter()

const state = reactive({
    type: '0',
    commentCount: {},
    commentList: []
})

const { productId } = defineProps({
    productId: {
        type: String,
        required: true
    }
})
const tagBtns = ref([
    { id: '10001', content: '全部', value: '0' },
    { id: '10002', content: '好评', value: '1' },
    { id: '10003', content: '中评', value: '2' },
    { id: '10004', content: '差评', value: '3' },
])

const currentActive = computed(() => {
    let idx = parseInt(state.type)
    return state.type === tagBtns.value[idx]
})

// console.log(productId.val);

const initCommentCount = async () => {
    const { data } = await getCommentCount(productId)
    if (data.status !== 200) return

    state.commentCount = data.data
    console.log(data);
}
initCommentCount()

// 好评率
const replyChance = computed(() => state.commentCount?.reply_chance || 0)
// 好评
// const replyChance = computed(() => state.commentCount?.good_count || 0)
// 中评
// const replyChance = computed(() => state.commentCount?.in_count || 0)
// 差评
// const replyChance = computed(() => state.commentCount?.poor_count || 0)

const commentNums = computed(() => {
    return [
        state.commentCount?.sum_count || 0,
        state.commentCount?.good_count || 0,
        state.commentCount?.in_count || 0,
        state.commentCount?.poor_count || 0
    ]
})


const initComments = async (type) => {
    const { data } = await getCommentByTag(productId, { type })
    // console.log(data);
    if (data.status !== 200) return

    state.commentList = data.data
}
initComments(state.type)

const isEmpty = computed(() => state.commentList.length !== 0)

// 切换评论
const handleChangeTag = (val) => {
    console.log(val);
    state.type = val
    initComments(val)
}

</script>

<style lang="scss" scoped>
:deep(.comments-title) {
    position: fixed;
    z-index: 9;
    
    top: 0;
    margin-left: 10%;
    width: 90%;
    box-sizing: border-box;
}
.tags-btns {
    margin-top: 50px;
}
.van-button {
    margin-right: 10px;
}
.van-button.active {
    background-color: #ff0000;
    color: #fff;
}
</style>