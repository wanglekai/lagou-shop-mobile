<template>
    <div>评论</div>
</template>

<script setup>

import { defineProps } from 'vue'

const productId = defineProps({
    productId: {
        type: String,
        required: true
    }
})

</script>
