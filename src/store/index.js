import { createStore } from 'vuex';

const store = createStore({
  state() {
    return {
      isAuthenticated: false,
      user: null, // 用户信息
    };
  },
  mutations: {
    login(state, user) {
      state.isAuthenticated = true;
      state.user = user;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
    },
  },
  actions: {
    login({ commit }, user) {
      commit('login', user);
    },
    logout({ commit }) {
      commit('logout');
    },
  },
});

export default store;
