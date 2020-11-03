<template>
  <div class="employeeList">
    <v-row>
      <v-col class="d-flex align-center">
        <h1 class="text-h4 font-weight-bold">Mitarbeiterverwaltung</h1>
        <v-spacer></v-spacer>
        <v-btn color="primary" elevation="2" @click="formNewEmployee = true"
          >Neuer Mitarbeiter</v-btn
        >
      </v-col>
    </v-row>
    <v-row v-if="formNewEmployee">
      <v-col>
        <v-card>
          <v-card-title>Neuer Mitarbeiter</v-card-title>
          <v-card-text>
            <v-form>
              <v-text-field
                prepend-icon="mdi-account"
                v-model="formName"
                label="Name"
                required
              ></v-text-field>
              <v-text-field
                prepend-icon="mdi-key"
                v-model="formPin"
                label="Pin"
                required
              ></v-text-field>
              <v-text-field
                prepend-icon="mdi-sim"
                v-model="formGSheet"
                label="GSheets-ID"
                required
              ></v-text-field>
            </v-form>
            <v-card-actions>
              <v-btn
                @click="addEmployee()"
                :loading="loadingAddEmployee"
                color="primary"
                elevation="2"
                >Speichern</v-btn
              >
              <v-btn
                color="error"
                elevation="2"
                @click="formNewEmployee = false"
                >Abbrechen</v-btn
              >
            </v-card-actions>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card>
          <v-card-title>Liste aller Mitarbeiter</v-card-title>
          <v-card-text>
            <v-card outlined>
              <v-simple-table dense>
                <template v-slot:default>
                  <thead>
                    <tr>
                      <th class="text-left">
                        Name
                      </th>
                      <th class="text-center">
                        Löschen
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="employee in Employee" :key="employee.id">
                      <td>{{ employee.name }}</td>
                      <td>
                        <div class="py-2 text-center">
                          <v-btn small @click="deleteTableRow(employee.id)"
                            ><v-icon>mdi-delete</v-icon></v-btn
                          >
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-card>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>
<script>
// import gql from "graphql-tag";
import GetEmployee_QUERY from "../graphql/GetEmployees.gql";
import AddEmployee_QUERY from "../graphql/AddEmployee.gql";
import DeleteEmployee_QUERY from "../graphql/DeleteEmployee.gql";
import { mapGetters } from "vuex";
export default {
  created() {},
  computed: {
    ...mapGetters(["getUser", "isUserAuth"]),
  },
  mounted() {},
  methods: {
    deleteTableRow(rowId) {
      console.log(rowId);
      this.$apollo
        .mutate({
          mutation: DeleteEmployee_QUERY,
          variables: {
            id: rowId,
          },
        })
        .then(() => {
          this.$apollo.queries.Employee.refetch();
        });
    },
    addEmployee() {
      const Employee = {
        name: this.formName,
        pin: this.formPin,
        sheet_id: this.formGSheet
      };
      this.loadingAddEmployee = true;
      this.$apollo
        .mutate({
          mutation: AddEmployee_QUERY,
          variables: {
            name: Employee.name,
            pin: Employee.pin,
            sheet_id: this.formGSheet
          },
          // update: (store, { data: { insert_Employee } }) => {
          //   // Read the data from our cache for this query.
          //   const data = store.readQuery({
          //     query: Employees_QUERY,
          //   });
          //   console.log(insert_Employee.returning[0]);
          //   console.log(data);
          //   // Add our tag from the mutation to the end
          //   data.Employee.push(insert_Employee.returning[0]);
          //   // Write our data back to the cache.
          //   store.writeQuery({ query: Employees_QUERY, data });
          // },
        })
        .then(() => {
          this.$apollo.queries.Employee.refetch().then(() => {
            this.loadingAddEmployee = false;
            this.formName = "";
            this.formPin = "";
            this.formGSheet = ""
            this.formNewEmployee = false;
          });
        });
    },
  },
  apollo: {
    // Employees: {
    //   query: Employees_QUERY,
    // },
    Employee: {
      query: GetEmployee_QUERY,
    },
  },
  data: () => ({
    Employee: "",
    formNewEmployee: false,
    formName: "",
    formPin: "",
    Shifts: "",
    loadingAddEmployee: false,
    formGSheet: "",
  }),
};
</script>
