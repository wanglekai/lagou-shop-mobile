<template>
  <div class="reset-container">
    <top-bar title="重置密码" />

    <van-form @submit="onSubmit">
      <van-field
        v-model="state.phone"
        name="phone"
        label="手机号"
        placeholder="手机号"
        clearable
      />
      <van-field
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
            :disabled="isSend"
          >
            <span v-if="isSend">{{ current.seconds }}</span>
            <span v-else>发送验证码</span>
          </van-button>
        </template>
      </van-field>
      <van-field
        class="input-password"
        v-model="state.password"
        type="password"
        name="password"
        clearable
        label="密码"
        placeholder="密码"
      />
      <div style="margin: 16px">
        <van-button
          round
          block
          type="primary"
          native-type="submit"
          :disabled="isLogin"
        >
          确定重置</van-button
        >
      </div>
    </van-form>
  </div>
</template>

<script setup>
import TopBar from "@/components/TopBar.vue";
import { computed, reactive, ref } from "@vue/reactivity";
import { useRouter, useRoute } from "vue-router";
import { Toast } from "vant";
import { useCountDown } from "@vant/use";
import * as userApi from "../../api/user";
import { useStore } from "vuex";
// import { onBeforeMount } from "@vue/runtime-core";
// onBeforeMount
const store = useStore();
const router = useRouter();
const route = useRoute();

const state = reactive({
  phone: "",
  password: "",
//   confirm: "",
  captcha: "", // 验证码
});

// 登录按钮是否禁用
const isLogin = computed(() => {
  if (state.password.trim() === "") return true;
  if (state.phone.trim() === "") return true;

  if (state.captcha.trim() !== "") return false;
  return true;
});

// 登录提交操作
const onSubmit = async (dataInfo) => {
  // console.log(data);
  let { password, phone, captcha } = dataInfo;

  if (password.trim() === "") return Toast.fail("请输入密码");
  if (phone.trim() === "") return Toast.fail("请输入确定密码");
  if (captcha.trim() === "") return Toast.fail("请填写验证码");

  const { data } = await userApi.resetPassword({
    account: phone,
    password,
    captcha,
  });
  if (data.status !== 200) return Toast.fail(data.msg);
  console.log(data);
};

// 倒计时
let isSend = ref(false);
const countDown = useCountDown({
  time: 10 * 1000,
  onFinish: () => {
    countDown.reset();
    isSend.value = false;
  },
});
const current = countDown.current;

const countDownStart = async () => {
  //   if ( state.phone.trim() === '' ) return Toast.fail('请输入手机号')

  const { data: v1 } = await userApi.getVerifyCode();
  // console.log(data);
  if (v1.status !== 200) return Toast.fail(data.msg);

  const { data: v2 } = await userApi.getVerify({
    type: "login",
    phone: 18792743390,
    key: v1.data.key,
  });

  console.log(v2);

  isSend.value = true;
  countDown.start();
};
</script>

<style lang="scss" scoped>
.reset-container {
  padding: 50px 0 10px;
}
</style>
