<template>
  <van-nav-bar
    title="登录"
    left-text="返回"
    left-arrow
    @click-left="handleBackClick"
  />
  <van-form @submit="onSubmit">
    <van-field
      v-model="state.phone"
      name="phone"
      label="手机号"
      placeholder="手机号"
      clearable
    />
    <van-field
      class="input-password"
      v-show="currentMode"
      v-model="state.password"
      type="password"
      name="password"
      clearable
      label="密码"
      placeholder="密码"
    />
    <van-field
      v-show="!currentMode"
      v-model="state.captcha"
      center
      clearable
      label="短信验证码"
      name="captcha"
      placeholder="请输入短信验证码"
    >
      <template #button>
        <van-button
          class="count-down-btn"
          size="small"
          type="primary"
          @click="countDownStart"
          :disabled="isSend">
          <span v-if="isSend">{{ current.seconds }}</span>
          <span v-else>发送验证码</span>
        </van-button>
      </template>
    </van-field>
    <div style="margin: 16px">
      <van-button
        round block type="primary" native-type="submit"
        :disabled="isLogin">
        登录</van-button>
    </div>
    <p class="toggle-mode-btn" @click="handleToggleMode">
      {{ currentBtnTxt }}
    </p>
  </van-form>
</template>

<script setup>
import { computed, reactive, ref } from "@vue/reactivity";
import { useRouter, useRoute } from 'vue-router'
import { Toast } from 'vant'
import { useCountDown } from '@vant/use';
import * as userApi from '../../api/user'
import { useStore } from 'vuex'
import { onBeforeMount } from "@vue/runtime-core";
// onBeforeMount
const store = useStore()
const router = useRouter()
const route = useRoute()

onBeforeMount(() => {
  // console.log();
  if (store.state.user && store.state.user.token) {
    // console.log(route);
    
    Toast.success('以登录过了')
    setTimeout(() => {
      router.push('/user')
    }, 1000);
  }
})

const state = reactive({
  mode: "psd",
  phone: "17201234567",
  password: "qwer1234",
  captcha: "", // 验证码
});

const currentBtnTxt = computed(() => {
  if (state.mode === 'psd') return '切换短信验证码登录'
  return '使用密码登录'
})
const currentMode = computed(() => state.mode === 'psd')

// 登录按钮是否禁用
const isLogin = computed(() => {
  if (state.phone.trim() === '') return true

  if (state.mode === 'psd' && state.password.trim() !== '') {
    return false
  }
  if (state.mode === 'captcha' && state.captcha.trim() !== '') {
    return false
  }
  return true
})

// 切换登录方式
const handleToggleMode = () => {
  if (state.mode === 'psd') {
    state.mode = 'captcha'
  } else {
    state.mode = 'psd'
  }
  state.password = ''
  state.captcha = ''
}
// 返回按钮 
const handleBackClick = () => {
  let back = router.options.history.state.back
  if (back) return router.go(-1)
  return router.push({name: 'home'})
}

// 登录提交操作
const onSubmit = async (dataInfo) => {
  // console.log(data);
  let { password, phone, captcha } = dataInfo

  if ( phone.trim() === '' ) return Toast.fail('请输入手机号')
  phone = parseInt(phone)
  if ( !/1\d{10}$/.test(phone) ) return Toast.fail('手机号码格式不正确')

  if (state.mode === 'psd' && password.trim() === '') return Toast.fail('请输入密码')
  if (state.mode === 'captcha' && captcha.trim() === '') return Toast.fail('请填写验证码')


  let data = ''
  if (state.mode === 'psd') {
    // 密码登录
    ({ data } = await userApi.loginByPassword({
      account: phone, password 
    }))
  } else {
    // 验证码登录
    ({ data } = await userApi.loginByCaptcha({ phone, captcha }))
  }
  if (data.status !== 200) return Toast.fail(data.msg)
  // console.log(data);
  try {
    store.commit('setUser', data.data.token)
    // console.log(route.query.redirect);
    router.push(route.query.redirect)
    // router.push('/')
  } catch {
    Toast.fail('抱歉，出现异常，请稍后重试')
  }
};

// 倒计时
let isSend = ref(false)
const countDown = useCountDown({
  time: 10 * 1000,
  onFinish: () => {
    countDown.reset()
    isSend.value = false
  }
})
const current = countDown.current

const countDownStart = async () => {

  if ( state.phone.trim() === '' ) return Toast.fail('请输入手机号')

  const { data: v1 } = await userApi.getVerifyCode()
  // console.log(data);
  if (v1.status !== 200) return Toast.fail(data.msg)

  const { data: v2 } = await userApi.getVerify({
    type: 'login',
    phone: state.phone,
    key: v1.data.key
  })

  console.log(v2);

  isSend.value = true
  countDown.start()
}

</script>

<style scoped>
.toggle-mode-btn {
  color: rgb(119, 119, 119);
  font-size: 16px;
  text-align: center;
}
:deep(.input-password) {
  min-height: 33px;
  line-height: 33px;
}
:deep(.count-down-btn) {
  min-width: 80px;
}
</style>
