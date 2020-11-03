<template>
  <div class="login">
    <h1>
      Login
    </h1>
    <v-row>
      <v-col cols="6"
        ><v-text-field label="E-Mail" v-model="email"></v-text-field
      ></v-col>
    </v-row>
    <v-row>
      <v-col cols="6"
        ><v-text-field
          v-model="password"
          password
          label="Password"
        ></v-text-field>
        <v-btn @click="submit()">Login</v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <p>firebase auth</p>
        <section id="firebaseui-auth-container"></section>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapActions } from "vuex";
var firebaseui = require('firebaseui');
import "firebaseui/dist/firebaseui.css";
import firebase from "firebase";
export default {
  mounted() {
    var ui = new firebaseui.auth.AuthUI(firebase.auth());
    var uiConfig = {
      signInSuccessUrl: "/profile",
      signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID],
    };
    ui.start("#firebaseui-auth-container", uiConfig);
  },
  methods: {
    ...mapActions(["signInAction"]),
    submit() {
      this.signInAction({ email: this.email, password: this.password });
    },
  },
  data: () => ({
    email: "",
    password: "",
  }),
};
</script>

<style></style>
