import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        user: {
            authenticated: false,
            data: null
        }
    },
    getters: {
        user: state => state.user,
        authenticated: state => state.user.authenticated,
    },
    mutations: {
        SET_AUTHENTICATION(state, value) {
            state.user.authenticated = value;
        },
        SET_USER(state, data) {
            state.user.data = data;
        }
    },
    actions: {
        fetchUser({ commit }, user) {
            commit("SET_AUTHENTICATION", user!==null);
            if (user) {
                commit("SET_USER", {
                    displayName: user.displayName,
                    email: user.email
                });
            } else {
                commit("SET_USER", null);
            }
        }
    }
});
