<template>
  <div class="signup">
    <h1>
      Signup
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
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  methods: {
    ...mapActions(["signUpAction"]),
    submit() {
      this.signUpAction({ email: this.email, password: this.password });
    },
  },
  data: () => ({
    email: "",
    password: "",
  }),
};
</script>

<style></style>
