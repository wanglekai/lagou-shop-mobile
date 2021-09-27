<template>
  <div class="container">
    <header class="user-header">
      <img
        :src="avatar"
        alt=""
      />
      <div class="user-info">
        <p class="nick-name">{{nickname}}</p>
        <p class="u-id">{{uid}}</p>
      </div>
      <van-icon name="setting-o" @click="router.push('/setting')" />
    </header>

    <main>
      <van-cell-group inset>
        <van-cell class="user-detail">
          <van-grid :border="false">
            <van-grid-item :text="collectCount">
              <template #icon>收藏</template>
            </van-grid-item>
            <van-grid-item :text="integral">
              <template #icon>积分</template>
            </van-grid-item>
            <van-grid-item :text="couponCount">
              <template #icon>优惠券</template>
            </van-grid-item>
            <van-grid-item :text="now_money">
              <template #icon>余额</template>
            </van-grid-item>
          </van-grid>
        </van-cell>
      </van-cell-group>

      <van-cell-group inset class="order-center">
        <van-cell
          title="订单中心"
          value="查看全部"
          is-link
          to="/order"
        />
        <van-grid :border="false" column-num="5">
          <van-grid-item icon="bill-o" text="待付款" />
          <van-grid-item icon="tosend" text="待发货" />
          <van-grid-item icon="logistics" text="待收货" />
          <van-grid-item icon="comment-o" text="待评价" />
          <van-grid-item icon="sign" text="已完成" />
        </van-grid>
      </van-cell-group>
    </main>

    <layout-footer />
  </div>
</template>

<script setup>
import LayoutFooter from "@/components/LayoutFooter.vue";
import { computed, ref } from "@vue/reactivity";
import { Toast } from "vant";
import { useRouter } from "vue-router";
import { getUserInfo } from '../../api/user'

const router = useRouter()

const userInfo = ref({})
const switchUserInfo = computed(() => userInfo.value?.switchUserInfo)
const nickname = computed(() => userInfo.value?.nickname)
const uid = computed(() => userInfo.value?.uid)
const avatar = computed(() => switchUserInfo.value?.[0].avatar || 'https://img-operation.csdnimg.cn/csdn/silkroad/img/1607569674685.png')

// 用户详情信息
const collectCount = computed(() => userInfo.value?.collectCount?.toString() || '')
const integral = computed(() => userInfo.value?.integral?.toString() || '')
const couponCount = computed(() => userInfo.value?.couponCount?.toString() || '')
const now_money = computed(() => userInfo.value?.now_money?.toString() || '')

const initUserInfo = async () => {
  const { data } = await getUserInfo()

  if (data.status !== 200) return Toast.fail(data.msg)

  userInfo.value = data.data
}
initUserInfo()

</script>

<style lang="scss" scoped>
.container {
  height: 600px;
  padding: 15px 0;
  background: radial-gradient(circle at 50% -10%, #FBC546 72%, #F6F7F9 72%) #F6F7F9 0 -300px no-repeat;
}
.user-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  img {
    width: 60px;
    height: 60px;
    border-radius: 50%;
  }
  .user-info {
    height: 40px;
    flex: 1;
    margin-left: 10px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .nick-name {
      font-weight: bold;
      font-size: 14px;
    }
    .u-id {
      font-size: 12px;
    }
  }
}
main {
  .user-detail {
    padding: 0;
  }
  .order-center {
    margin-top: 10px;
  }
}
</style>