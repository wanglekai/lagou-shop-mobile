<template>
  <div class="setting-container">
    <top-bar title="设置" />

    <van-cell is-link to="/reset-password" title="重置登录密码" />
    <van-cell is-link title="退出登录" @click="logout" />
  </div>
</template>

<script setup>
import TopBar from "@/components/TopBar.vue";
import { Dialog } from "vant";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

const store = useStore()
const router = useRouter()

const logout = () => {
  Dialog.confirm({
    title: "提示",
    message: "再想想哦",
  }).then(() => {
        store.commit('User/setUser', '')
        router.push('/')
    })
    .catch(() => {
      // on cancel
      console.log('cancel logout~');
    });
};
</script>

<style lang="scss" scoped>
.setting-container {
  padding: 50px 0 10px;
}
</style>
