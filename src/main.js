import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import router from './plugins/router';
import firebase from 'firebase/app';
import store from './plugins/store';

Vue.config.productionTip = false;

// combined_firebase
var firebaseConfig = {
  apiKey: "AIzaSyCOhocij5OZSLlKqUOFYLdbhKLTZboQQAY",
  authDomain: "fastcart-cde6e.firebaseapp.com",
  databaseURL: "https://fastcart-cde6e.firebaseio.com",
  projectId: "fastcart-cde6e",
  storageBucket: "fastcart-cde6e.appspot.com",
  messagingSenderId: "933991335141",
  appId: "1:933991335141:web:fd9ae1eb8f5c72c05d800c"
};

// standalone_firebase
// var firebaseConfig = {
//   apiKey: "AIzaSyDwyJCQm6i1rD_nnjpkz0v6f9xGtGHxl8o",
//   authDomain: "infosys-admin-ea978.firebaseapp.com",
//   databaseURL: "https://infosys-admin-ea978.firebaseio.com",
//   projectId: "infosys-admin-ea978",
//   storageBucket: "infosys-admin-ea978.appspot.com",
//   messagingSenderId: "457467353530",
//   appId: "1:457467353530:web:2f14037849def8c659a583"
// };

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Auth State
firebase.auth().onAuthStateChanged(user => {
  store.dispatch("fetchUser", user);
});

new Vue({
  vuetify,router,store,
  render: h => h(App)
}).$mount('#app');
