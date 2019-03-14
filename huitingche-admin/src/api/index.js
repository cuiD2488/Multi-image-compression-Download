// 所有接口写在这个文件
// 导出接口名：URL+后端给过来的接口名，方法名Api+后端给过来的接口名，驼峰式命名

import Axios from 'axios'
// const qs = require('qs')
export const env = process.env.NODE_ENV
// 测试服务器要加pdshop
// Axios.defaults.baseURL = env === 'development' ? '/api/' : '/'
Axios.defaults.baseURL = env === 'development' ? '/api' : '/park'
// 设置响应拦截
Axios.interceptors.response.use((response) => {
  // console.log(response)
  if (response.status === 200 || response.status === 304) {
    return response.data
  } else if (response.status === 400) {
    return response.statusText
  } else {
    return false
  }
})
export default Axios

// 获取停车记录列表
export const QUERYPkORDER = '/queryPkOrder.json'
/**
 * @param {Any} data json
 */
// export const ApiQueryPkOrder = async (data, page, num) => {
//   try {
//     const res = await Axios.post(QUERYPkORDER, data, {page: page, num: num})
//     return res
//   } catch (error) {
//     throw new Error(error)
//   }
// }
// 登录
export const URLmanagerLogin = '/managerLogin.json'
export const ApiManagerLogin = async (data) => {
  try {
    const res = await Axios.post(URLmanagerLogin, data)
    return res
  } catch (error) {
    throw new Error(error)
  }
}
// 查询停车场
export const URLfindParkingLotByCondition = '/findParkingLotByCondition.json'
export const ApiFindParkingLotByCondition = async (data) => {
  try {
    const res = await Axios.post(URLfindParkingLotByCondition, data)
    return res
  } catch (error) {
    throw new Error(error)
  }
}
