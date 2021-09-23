const state = {
    token: window.localStorage.USER_TOKEN || ''
}
const getters = {}
const mutations = {
    setUser (state, playload) {
        state.token = playload
        window.localStorage.USER_TOKEN = playload
    }
}
const actions = {}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}
