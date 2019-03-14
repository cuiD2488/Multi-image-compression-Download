const state = {
  userInfo: localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null
}

const getters = {
  userInfo: state => state.userInfo
}

const actions = {}

const mutations = {
  'GETUSERINFO' (state, data) {
    state.userInfo = data
    localStorage.setItem('userInfo', JSON.stringify(data))
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
