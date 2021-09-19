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
      v-model="state.verifCode"
      center
      clearable
      label="短信验证码"
      name="verifCode"
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
import { useRouter } from 'vue-router'
import { Toast } from 'vant'
import { useCountDown } from '@vant/use';

const router = useRouter()

const state = reactive({
  mode: "psd",
  phone: "",
  password: "",
  verifCode: "", // 验证码
});

const currentBtnTxt = computed(() => {
  if (state.mode === 'psd') return '切换短信验证码登录'
  return '使用密码登录'
})
const currentMode = computed(() => state.mode === 'psd')

const isLogin = computed(() => {
  if (state.phone.trim() === '') return true

  if (state.mode === 'psd' && state.password.trim() !== '') {
    return false
  }
  if (state.mode === 'captcha' && state.verifCode.trim() !== '') {
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
  state.verifCode = ''
}
// 返回按钮 
const handleBackClick = () => {
  let back = router.options.history.state.back
  if (back) return router.go(-1)
  return router.push({name: 'home'})
}


const onSubmit = (data) => {
  // console.log(data);
  let { password, phone, verifCode } = data

  if ( phone.trim() === '' ) return Toast.fail('请输入手机号')
  phone = parseInt(phone)
  if ( !/1\d{10}$/.test(phone) ) return Toast.fail('手机号码格式不正确')

  if (state.mode === 'psd' && password.trim() === '') return Toast.fail('请输入密码')
  if (state.mode === 'captcha' && verifCode.trim() === '') return Toast.fail('请填写验证码')


  // console.log(password);
  if (state.mode === 'psd') {
    console.log('手机号: ', phone);
    console.log('密码: ', password);
  } else {
    console.log('手机号: ', phone);
    console.log('验证码', verifCode)
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

const countDownTxt = computed(() => {
  return isSend.value ? current.seconds : '发送验证码'
})
const countDownStart = () => {
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
