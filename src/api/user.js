import requset from '../utils/request'

// 获取验证码，避免重复发送
export const getVerifyCode = () => requset.get('/verify_code')

// 获取验证码
export const getVerify = data => requset.post('/register/verify', data)

// 验证码登录
export  const loginByCaptcha = data => requset.post('/login/mobile', data)

// 密码登录
export const loginByPassword = data => requset.post('/login', data)

// 获取用户信息
export const getUserInfo = () => requset.get('/user')
