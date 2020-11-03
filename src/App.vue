<template>
  <v-app>
    <Nav></Nav>
    <!-- Sizes your content based upon application components -->
    <v-main>
      <!-- Provides the application the proper gutter -->
      <v-container fluid>
        <!-- If using vue-router -->
        <router-view></router-view>
      </v-container>
    </v-main>

    <v-footer app>
      <!-- -->
    </v-footer>
  </v-app>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import Nav from "./components/Nav";

export default {
  name: "App",
  components: {
    Nav,
  },
  mounted() {
    this.authAction();
  },
  methods: {
    ...mapActions(["authAction"]),
  },
  computed: {
    ...mapGetters(["getUser", "isUserAuth"]),
  },

  data: () => ({
    //
  }),
};
</script>
