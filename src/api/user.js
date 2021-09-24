import request from '../utils/request'

// 获取验证码，避免重复发送
export const getVerifyCode = () => request.get('/verify_code')

// 获取验证码
export const getVerify = data => request.post('/register/verify', data)

// 验证码登录
export  const loginByCaptcha = data => request.post('/login/mobile', data)

// 密码登录
export const loginByPassword = data => request.post('/login', data)

// 获取用户信息
export const getUserInfo = () => request.get('/user')
