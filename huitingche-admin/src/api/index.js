// 所有接口写在这个文件
// 导出接口名：URL+后端给过来的接口名，方法名Api+后端给过来的接口名，驼峰式命名

import Axios from 'axios'
// const qs = require('qs')
export const env = process.env.NODE_ENV
// 测试服务器要加pdshop
// Axios.defaults.baseURL = env === 'development' ? '/api/' : '/'
Axios.defaults.baseURL = env === 'development' ? '/api/park' : '/park'
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
export const URLqueryPkOrder = '/queryPkOrder.json'

// 查询违停记录
export const URLqueryPkViolation = '/queryPkViolation.json'

// 编辑违停记录
export const URLupdatePkViolation = '/updatePkViolation.json'
export const ApiUpdatePkViolation = async (data) => {
  try {
    const res = await Axios.post(URLupdatePkViolation, data)
    return res
  } catch (error) {
    throw new Error(error)
  }
}
// 删除违停记录
export const URLdeletePkViolation = '/deletePkViolation.json'
export const ApiDeletePkViolation = async (data) => {
  try {
    // const res = await Axios.post('/deletePkViolation.json?violationNumber=' + data.violationNumber)
    const res = await Axios.post(URLdeletePkViolation, data)
    return res
  } catch (error) {
    throw new Error(error)
  }
}
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
// 查询停车场
export const URLaddParkingLot = '/addParkingLot.json'
export const ApiAddParkingLot = async (data) => {
  try {
    const res = await Axios.post(URLaddParkingLot, data)
    return res
  } catch (error) {
    throw new Error(error)
  }
}
// 查询车位
export const URLfindPositionByCondition = '/findPositionByCondition.json'
export const ApifindPositionByCondition = async (data) => {
  try {
    const res = await Axios.post(URLfindPositionByCondition, data)
    return res
  } catch (error) {
    throw new Error(error)
  }
}
// 停车场管理员授权
export const URLgetQrCode = '/getQrCode.json'
export const ApigetQrCode = async (data) => {
  try {
    const res = await Axios.get(URLgetQrCode, {params: data})
    return res
  } catch (error) {
    throw new Error(error)
  }
}
// 授权路段管理员
export const URLgetQrCodeByManageNumber = '/getQrCodeByManageNumber.json'
export const ApigetQrCodeByManageNumber = async (data) => {
  try {
    const res = await Axios.get(URLgetQrCodeByManageNumber, {params: data})
    return res
  } catch (error) {
    throw new Error(error)
  }
}
// 设置停车场规则
export const URLaddChargingRules = '/addChargingRules.json'
export const ApiAddChargingRules = async (data) => {
  try {
    const res = await Axios.post(URLaddChargingRules, data)
    return res
  } catch (error) {
    throw new Error(error)
  }
}
// 查看停车场规则 updateChargingRules
export const URLqueryChargingRules = '/queryChargingRules.json'
export const ApiQueryChargingRules = async (data) => {
  try {
    const res = await Axios.post(URLqueryChargingRules, data)
    return res
  } catch (error) {
    throw new Error(error)
  }
}
// 编辑停车场规则
export const URLupdateChargingRules = '/updateChargingRules.json'
export const ApiUpdateChargingRules = async (data) => {
  try {
    const res = await Axios.post(URLupdateChargingRules, data)
    return res
  } catch (error) {
    throw new Error(error)
  }
}

// 根据vendorId查询用户信息
/**
 * vendorId 企业编号
 */
export const URLfindVendorIdByPkUser = '/findVendorIdByPkUser.json'
export const ApiFindVendorIdByPkUser = async (data) => {
  try {
    const res = await Axios.post(URLfindVendorIdByPkUser, data)
    return res
  } catch (error) {
    throw new Error(error)
  }
}

// 删除停车场
export const URLdeleteParkingLot = '/deleteParkingLot.json'
export const ApiDeleteParkingLot = async (data) => {
  try {
    const res = await Axios.post('/deleteParkingLot.json?vendorId=' + data.vendorId + '&parkingLotNumber=' + data.parkingLotNumber)
    return res
  } catch (error) {
    throw new Error(error)
  }
}
// 编辑停车场
export const URLupdateParkingLot = '/updateParkingLot.json'
export const ApiUpdateParkingLot = async (data) => {
  try {
    const res = await Axios.post(URLupdateParkingLot, data)
    return res
  } catch (error) {
    throw new Error(error)
  }
}

// 查询体制内人员信息
/**
 * 系统管理员 仅传vendorId
 * 停车场管理员 传 vendorId  superiorNumber(传自己的编号)
 */
export const URLqueryParkingLotManager = '/queryParkingLotManager.json'
export const ApiQueryParkingLotManager = async (data) => {
  try {
    const res = await Axios.post(URLqueryParkingLotManager, data)
    return res
  } catch (error) {
    throw new Error(error)
  }
}
// 分配车位
export const URLaddPositionManager = '/addPositionManager.json'
export const ApiaddPositionManager = async (data) => {
  try {
    const res = await Axios.get(URLaddPositionManager, {params: data})
    return res
  } catch (error) {
    throw new Error(error)
  }
}

// 停用管理员
/**
 * vendorId 商户id
 * managerNumber 管理员编号
 * status 默认传1
 */
export const URLdisableParkingLotManager = '/disableParkingLotManager.json'
export const ApiDisableParkingLotManager = async (data) => {
  try {
    const res = await Axios.post(URLdisableParkingLotManager, data)
    return res
  } catch (error) {
    throw new Error(error)
  }
}
// 删除车位
export const URLupdateParkingPosition = '/updateParkingPosition.json'
export const ApiUpdateParkingPosition = async (data) => {
  try {
    const res = await Axios.post(URLupdateParkingPosition, data)
    return res
  } catch (error) {
    throw new Error(error)
  }
}
// 编辑车位
// export const URLupdateParkingPosition = '/updateParkingPosition.json'
// export const ApiUpdateParkingPosition = async (data) => {
//   try {
//     const res = await Axios.post(URLupdatePkViolation, data)
//     return res
//   } catch (error) {
//     throw new Error(error)
//   }
// }
// 新增车位
export const URLaddParkingPosition = '/addParkingPosition.json'
export const ApiAddParkingPosition = async (data) => {
  try {
    const res = await Axios.post(URLaddParkingPosition, data)
    return res
  } catch (error) {
    throw new Error(error)
  }
}
