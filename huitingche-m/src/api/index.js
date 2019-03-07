import Axios from 'axios'

export const env = process.env.NODE_ENV
Axios.defaults.baseURL = env === 'development' ? '/api' : '/park'
Axios.interceptors.response.use((response) => {
  if (response.status === 200 || response.status === 304) {
    return response.data
  } else if (response.status === 400) {
    return response.statusText
  } else {
    return false
  }
})

export default Axios

// 编码规则： 链接命名为URL+接口名, 暴露于组件的名， Api+接口名
export const URLbindingPhone = '/bindingPhone.json'
export const ApibindingPhone = async (data) => {
  try {
    const res = await Axios.post(URLbindingPhone, data)
    return res
  } catch (err) {
    console.log(err)
  }
}

// 发送短信验证码
export const getVerificationCode = '/getVerificationCode.json'
export const ApiGetVerificationCode = async (data) => {
  try {
    const res = await Axios.get(getVerificationCode, {params: data})
    return res
  } catch (error) {
    throw new Error(error)
  }
}

// 绑定手机号/设置支付密码
export const updatePhone = '/updatePhone.json'
/**
 * id 进入系统时分配的id
 * userId 手机号码（修改手机时传新的手机）
 * payPassword 支付密码(设置支付密码时传,前端MD5)
 */
export const ApiUpdatePhone = async (data) => {
  try {
    const res = await Axios.post(updatePhone, data)
    return res
  } catch (err) {
    console.log(err)
  }
}

// 微信登录
export const wxLogin = '/wxLogin.json'
/**
 * code 微信登录参数 String
 * state 厂商ID Integer
 */
export const ApiWxLogin = async (data) => {
  try {
    const res = await Axios.get(wxLogin, {params: data})
    return res
  } catch (error) {
    throw new Error(error)
  }
}

// 绑定车牌号
export const insertPkCar = '/insertPkCar.json'
/**
 * userNumber 进入系统时分配的id
 * frameNumber 车架号
 * carNumber 车牌号
 */
export const ApiInsertPkCar = async (data) => {
  try {
    const res = await Axios.post(insertPkCar, data)
    return res
  } catch (err) {
    console.log(err)
  }
}
// 查询用户范围内的车位坐标
export const URLfindPkLotListByLngLat = '/findPkLotListByLngLat.json'
export const ApifindPkLotListByLngLat = async (data) => {
  try {
    const res = await Axios.post(URLfindPkLotListByLngLat, {params: data})
    return res
  } catch (err) {
    console.log(err)
  }
}
// 根据条件查询停车场信息接口
export const URLfindParkingLotByCondition = '/findParkingLotByCondition.json'
export const ApifindParkingLotByCondition = async (data) => {
  try {
    const res = await Axios.post(URLfindParkingLotByCondition, data)
    return res
  } catch (err) {
    console.log(err)
  }
}
