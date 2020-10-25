<template>
  <div class="home">
    <h1>Home View</h1>
    <section v-if="isUserAuth" class="section">
      <div class="columns">
        <div class="column is-half is-offset-one-quarter">
          Welcome {{ getUser.email }}
          <v-btn @click="getToken()">GetToken</v-btn>
          <p>{{ Employee }}</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
// @ is an alias to /src
import { mapGetters } from "vuex";
import gql from "graphql-tag";
export default {
  name: "Home",
  computed: {
    ...mapGetters(["getUser", "isUserAuth"]),
  },
  components: {},
  methods: {
    async getToken() {
      console.log(await this.getUser["ya"]);
    },
  },
  apollo: {
    Employee: gql`
      query {
        Employee {
          id
          name
        }
      }
    `,
  },
  data() {
    return {
      kaas: true,
    };
  },
};
</script>
