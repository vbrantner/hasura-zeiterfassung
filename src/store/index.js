import Vue from "vue";
import Vuex from "vuex";
import firebase from "firebase";
import onLogin from "../vue-apollo"
import onLogout from "../vue-apollo"

const initialState = () => {
  return { user: null, error: null };
};

Vue.use(Vuex);

export default new Vuex.Store({
  state: initialState,
  getters: {
    getUser(state) {
      return state.user;
    },
    isUserAuth(state) {
      return !!state.user;
    },
    getError(state) {
      return state.error;
    },
  },
  mutations: {
    setUser(state, payload) {
      state.user = payload;
    },
    setError(state, payload) {
      state.error = payload;
    },
  },
  actions: {
    signInAction({ commit }, payload) {
      return firebase
        .auth()
        .signInWithEmailAndPassword(payload.email, payload.password)
        .then((response) => {
          commit("setUser", response.user);
          onLogin(Vue.$apollo.provider.defaultClient, response.user["ya"])
        })
        .catch((error) => {
          commit("setError", error.message);
        });
    },
    signUpAction({ commit }, payload) {
      firebase
        .auth()
        .createUserWithEmailAndPassword(payload.email, payload.password)
        .then((response) => {
          commit("setUser", response.user);
          localStorage.setItem("apollo-token", response.user["ya"]);
          firebase.firestore.collection("userCollection").add({
            uid: response.uid,
          });
        })
        .catch((error) => {
          commit("setError", error.message);
        });
    },
    signOutAction({ commit }) {
      firebase
        .auth()
        .signOut()
        .then(() => {
          commit("setUser", null);
          onLogout(Vue.$apollo.provider.defaultClient)
        })
        .catch((error) => {
          commit("setError", error.message);
        });
    },
    authAction({ commit }) {
      return new Promise(function(resolve, reject) {
        firebase.auth().onAuthStateChanged(function(user) {
          if (user) {
            commit("setUser", user);
            localStorage.setItem("apollo-token", user["ya"]);
            console.log(user["ya"]);
            resolve(user);
          } else {
            commit("setUser", null);
            console.log("no logg");
            reject(null);
          }
        });
      });
    }
  },
  modules: {},
});
