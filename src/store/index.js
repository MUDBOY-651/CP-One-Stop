import { createStore } from 'vuex';

const store = createStore({
  state() {
    return {
      isAuthenticated: false,
      username: null,
      user_id: null,
    };
  },
  mutations: {
    login(state, { username, user_id }) {
      state.isAuthenticated = true;
      state.username = username;
      state.user_id = user_id;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.username = null;
      state.user_id = null;
    },
  },
  actions: {
    login({ commit }, {username, user_id}) {
      commit('login', {username, user_id});
    },
    logout({ commit }) {
      commit('logout');
    },
  },
});

export default store;
