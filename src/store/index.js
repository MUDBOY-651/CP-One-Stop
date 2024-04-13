import { createStore } from 'vuex';

const store = createStore({
  state() {
    return {
      isAuthenticated: false,
      // isAuthenticated: true,
      username: null,
      user_id: null,
      user_type: false,
    };
  },
  mutations: {
    login(state, { username, user_id, user_type}) {
      state.isAuthenticated = true;
      state.username = username;
      state.user_id = user_id;
      state.user_type = user_type;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.username = null;
      state.user_id = null;
      state.user_type = false;
    },
  },
  actions: {
    login({ commit }, { username, user_id, user_type }) {
      commit('login', { username, user_id, user_type });
    },
    logout({ commit }) {
      commit('logout');
    },
  },
});

export default store;
