import Axios from 'axios'

export const env = process.env.NODE_ENV
Axios.defaults.baseURL = env === 'development' ? '/api/park' : '/park'
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
// 查询收费规则
export const URLqueryChargingRules = '/queryChargingRules.json'
export const ApiqueryChargingRules = async (data) => {
  try {
    const res = await Axios.post(URLqueryChargingRules, data)
    return res
  } catch (err) {
    console.log(err)
  }
}

// 钱包支付车费
export const URLpayFree = '/payFree.json'
export const ApipayFree = async (data) => {
  try {
    const res = await Axios.post(URLpayFree, data)
    return res
  } catch (err) {
    console.log(err)
  }
}
// 微信充值到钱包
/**
 * money 充值金额
 * openId 用户openID
 * userNumber 用户编号
 */
export const URLweiXinPay = '/weiXinPay.json'
export const ApiWeiXinPay = async (data) => {
  try {
    const res = await Axios.post(URLweiXinPay, data)
    return res
  } catch (err) {
    console.log(err)
  }
}

// 获取原支付密码用于修改支付密码时校验
/**
 * payPassword 原支付密码(前端MD5加密)
 * userNumber 用户编号
 */
export const URLupdatePassword = '/updatePassword.json'
export const ApiUpdatePassword = async (data) => {
  try {
    const res = await Axios.post(URLupdatePassword, data)
    return res
  } catch (err) {
    console.log(err)
  }
}

// 根据条件查询停车位信息接口
export const URLfindPositionByCondition = '/checkPositionNumber.json'
export const ApifindPositionByCondition = async (data) => {
  try {
    const res = await Axios.get(URLfindPositionByCondition, {params: data})
    return res
  } catch (err) {
    console.log(err)
  }
}

// 修改支付状态
/**
 * payNumber 订单编号
 * payStatus 交易状态 (状态码未知)
 */
export const URLupdatePkPayStatus = '/updatePkPayStatus.json'
export const ApiUpdatePkPayStatus = async (data) => {
  try {
    const res = await Axios.get(URLupdatePkPayStatus, {params: data})
    return res
  } catch (err) {
    console.log(err)
  }
}

// 查询停车记录(全部，欠费)
/**
 * 以下参数均为非必传
 * userNumber 用户编号
 * orderStatus 订单状态 0:待支付 1:支付成功 2:待补缴
 * userId 手机号
 * parkingLotNumber 停车场编号
 * positionNumber 车位编号
 * orderNumber 订单编号
 * orderCreateTime 创建时间
 * startTime 查询起始时间
 * endTime 查询结束时间
 */
export const URLqueryPkOrder = '/queryPkOrder.json'
export const ApiQueryPkOrder = async (data) => {
  try {
    const res = await Axios.post(URLqueryPkOrder, data)
    return res
  } catch (err) {
    console.log(err)
  }
}

// 移动端删除停车记录
/**
 * orderNumber 订单编号
 */
export const URLdeletePkOrder = '/deletePkOrder.json'
export const ApiDeletePkOrder = async (data) => {
  try {
    const res = await Axios.post(URLdeletePkOrder, data)
    return res
  } catch (err) {
    console.log(err)
  }
}

// 查询账单明细(充值/停车)
/**
 * userNumber  用户编号
 * type 类型(0:停车 1:充值) 非必传
 */
export const URLqueryBill = '/queryBill.json?page=1&num=1000'
export const ApiQueryBill = async (data) => {
  try {
    const res = await Axios.post(URLqueryBill, data)
    return res
  } catch (err) {
    console.log(err)
  }
}
// 查询余额
export const URLqueryPkUser = '/queryPkUser.json'
export const ApiQueryPkUser = async (data) => {
  try {
    const res = await Axios.post(URLqueryPkUser, data)
    return res
  } catch (err) {
    console.log(err)
  }
}

// 查询违停记录
/**
 * vendorId  厂商Id
 * numberPlate 车牌号(移动端查询违停是输入车牌号查询，简称可不输入)
 * positionNumber 车位编号
 * abbreviation 简称(如：粤B)
 * page 页
 * num 条数
 */
export const URLqueryPkViolationl = '/queryPkViolation.json'
export const ApiQueryPkViolation = async (data) => {
  try {
    const res = await Axios.post(URLqueryPkViolationl, data)
    return res
  } catch (err) {
    console.log(err)
  }
}

// 新增违章记录
export const URLaddPkViolation = '/addPkViolation.json'
export const ApiAddPkViolation = async (data) => {
  try {
    const res = await Axios.post(URLaddPkViolation, data)
    return res
  } catch (err) {
    console.log(err)
  }
}

// 图片上传
export const URLuploadBanner = 'http://cyc8.cn/uploadBanner.json'
export const ApiUploadBanner = async (data) => {
  const config = {
    headers: {'Content-Type': 'multipart/form-data'}
  }
  try {
    const res = await Axios.post(URLuploadBanner, data, config)
    return res
  } catch (err) {
    console.log(err)
  }
}

// 查询车牌信息
/**
 * vendorId  厂商Id
 * carNumber 车牌号(后六位)
 * userNumber 用户编号
 * abbreviation 简称(如：粤B)
 */
export const URLqueryPkCar = '/queryPkCar.json'
export const ApiQueryPkCar = async (data) => {
  try {
    const res = await Axios.post(URLqueryPkCar, data)
    return res
  } catch (err) {
    console.log(err)
  }
}

// 解绑车牌信息
/**
 * vendorId  厂商Id
 * carNumber 车牌号(后六位)
 * userNumber 用户编号
 * abbreviation 简称(如：粤B)
 */
export const URLdeletePkCar = '/deletePkCar.json'
export const ApiDeletePkCar = async (data) => {
  try {
    const res = await Axios.post(URLdeletePkCar, data)
    return res
  } catch (err) {
    console.log(err)
  }
}

// 订单钱包补缴支付
/**
 * orderNumber  订单编号
 * payPassword 支付密码(MD5加密)
 */
export const URLmakeUpMoney = '/makeUpMoney.json'
export const ApMakeUpMoney = async (data) => {
  try {
    const res = await Axios.post(URLmakeUpMoney, data)
    return res
  } catch (err) {
    console.log(err)
  }
}

// 系统管理员分享的注册码，填写表单注册成为停车场管理员
/**
 * parkingLotNumber 停车场编号
 * manageName 管理员姓名
 * phone 电话号码
 * password 登录密码
 * openId 用户openId
 * wxNickName 用户微信昵称
 * headImageUrl 微信头像
 */
export const URLregisterByAdminQrCode = '/registerByAdminQrCode.json'
export const ApiRegisterByAdminQrCode = async (data) => {
  try {
    const res = await Axios.post(URLregisterByAdminQrCode, data)
    return res
  } catch (error) {
    throw new Error(error)
  }
}

// 停车场管理员分享的注册码，填写表单注册成为路段管理员
/**
 * parkingLotNumber 停车场编号
 * manageName 管理员姓名
 * phone 电话号码
 * password 登录密码
 * openId 用户openId
 * wxNickName 用户微信昵称
 * headImageUrl 微信头像
 */
export const URLregisterByManageNumberQrCode = '/registerByManageNumberQrCode.json'
export const ApiRegisterByManageNumberQrCode = async (data) => {
  try {
    const res = await Axios.post(URLregisterByManageNumberQrCode, data)
    return res
  } catch (error) {
    throw new Error(error)
  }
}

// 停车场管理员分享的注册码，填写表单注册成为路段管理员
/**
 * parkingLotNumber 停车场编号
 * manageName 管理员姓名
 * phone 电话号码
 * password 登录密码
 * openId 用户openId
 * wxNickName 用户微信昵称
 * headImageUrl 微信头像
 */
export const URLfindParkingLotNumberLByLot = '/findParkingLotNumberLByLot.json'
export const ApiFindParkingLotNumberLByLot = async (data) => {
  try {
    const res = await Axios.get(URLfindParkingLotNumberLByLot, {params: data})
    return res
  } catch (error) {
    throw new Error(error)
  }
}

// 使用管理员编号获取vendorId
/**
 * managerNumber 管理员编号
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

// 上传图片
export const UPLOADPIC = 'https://test.cyc8.cn/addPictures.json'
// export const API_UPLOADPIC = env === 'development' ? `${UPLOADPIC}` : `/pdShop${UPLOADPIC}`

export const ApiAddPictures = async (data) => {
  const config = {
    headers: {'Content-Type': 'multipart/form-data'}
  }
  try {
    const res = await Axios.post(UPLOADPIC, data, config)
    return res
  } catch (err) {
    console.log(err)
  }
}
