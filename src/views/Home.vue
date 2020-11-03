<template>
  <div class="home">
    <h1>Home View</h1>
    <div v-if="isUserAuth">
      <p>
        Sie sind angemeldet
      </p>
    </div>
    <div v-else>
      <p>
        Bitte anmelden
      </p>
    </div>
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
  methods: {},
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
