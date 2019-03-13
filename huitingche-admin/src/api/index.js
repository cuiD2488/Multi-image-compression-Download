// 所有接口写在这个文件
// 导出接口,使用全大写命名
// 接口命名统一Api为开头,驼峰式命名

import Axios from 'axios'
const qs = require('qs')
export const env = process.env.NODE_ENV
// 测试服务器要加pdshop
// Axios.defaults.baseURL = env === 'development' ? '/api/' : '/'
Axios.defaults.baseURL = env === 'development' ? '/api/huipaking' : '/huipaking'   // 名字待确定
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
