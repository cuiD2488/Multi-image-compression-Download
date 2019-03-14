const state = {
  userInfo: null
}

const getters = {
  userInfo: state => state.userInfo
}

const action = {}

const mutations = {
  'GETUSERINFO' (state, data) {
    state.userInfo = data
    console.log(state)
  }
}
export default {
  state,
  getters,
  action,
  mutations
}
