<template>
  <div class="timeclock">
    <v-row>
      <v-col>
        <h1 class="text-h4 font-weight-bold">Stempeluhr</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <div class="pb-3">
          <v-card>
            <v-card-text>
              <div class="pa-1">
                <v-btn color="light-green lighten-1">
                  Grün hintelegt, bedeutet Nutzer ist angemeldet.
                </v-btn>
              </div>
              <div class="pa-1">
                <v-btn>
                  Keine Farbe, bedeutet Nutzer ist abgemeldet.
                </v-btn>
              </div>
            </v-card-text>
          </v-card>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col v-if="selectedEmployee" cols="4">
        <v-card>
          <v-card-title>Mitarbeiter</v-card-title>
          <v-card-text>
            <v-card outlined>
              <v-data-table
                :headers="headers"
                :items="Shifts"
                hide-default-footer
                disable-sort
                :item-class="colorRow"
                single-select
                disable-pagination
                @click:row="rowClick"
              ></v-data-table>
            </v-card>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col v-else cols="6">
        <v-card>
          <v-card-title>Mitarbeiter</v-card-title>
          <v-card-text>
            <v-card outlined>
              <v-data-table
                :headers="headers"
                :items="Shifts"
                hide-default-footer
                disable-sort
                :item-class="colorRow"
                single-select
                disable-pagination
                @click:row="rowClick"
              ></v-data-table>
            </v-card>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col v-if="selectedEmployee" cols="8">
        <v-card>
          <v-card-title>{{ selectedEmployee.name }}</v-card-title>
          <!-- Show when Pin successfully wrong or not entered-->
          <template v-if="pinSuccess">
            <v-card-text class="justify-center">
              <h1 class="text-center text-h4 font-weight-normal">
                {{ datenow }}
              </h1>
            </v-card-text>
            <v-card-actions class="justify-center">
              <v-spacer></v-spacer>
              <v-btn
                :disabled="startBtnDisabled"
                @click="addShift()"
                :loading="loadingAddShift"
                depressed
                color="primary"
                large
                >Start<v-icon right>mdi-clock-start</v-icon></v-btn
              >
              <v-spacer></v-spacer>
              <v-btn
                @click="closeShift"
                :disabled="outBtnDisabled"
                :loading="loadingCloseShift"
                depressed
                color="warning"
                large
                >Ende<v-icon right>mdi-clock-end</v-icon></v-btn
              >
              <v-spacer></v-spacer>
            </v-card-actions>
          </template>
          <!-- Show when Pin successfully entered -->
          <template v-if="!pinSuccess">
            <v-card-text>
              <h1 class="title">Bitte PIN eingeben</h1>
              <v-form @submit="pinCheck()" @submit.prevent>
                <v-text-field
                  v-model="pinInput"
                  type="number"
                  prepend-icon="mdi-key"
                  label="PIN"
                ></v-text-field>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-btn
                @click="pinCheck()"
                :loading="loadingPinCheck"
                @keypress.enter="pinCheck()"
                @keydown.enter="pinCheck()"
                color="success"
                >Weiter</v-btn
              >
              <v-btn color="error"
                >Abbrechen
                <v-icon right>mdi-cancel</v-icon>
              </v-btn>
            </v-card-actions>
          </template>
        </v-card>
      </v-col>
    </v-row>

    <v-snackbar timeout="2000" color="success" v-model="pinSnackbar">
      <div class="justify-center align-center">
        <h3 class="justify-center text-title font-weight-bold">
          Pin erfolgreich
        </h3>
      </div>
      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="pinSnackbar = false">
          Close
          <v-icon right>mdi-cancel</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
    <v-snackbar timeout="2000" color="error" v-model="pinSnackbarWrong">
      <div class="justify-center align-center">
        <h3 class="justify-center text-title font-weight-bold">
          Falscher Pin
        </h3>
      </div>
      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="pinSnackbar = false">
          Close
          <v-icon right>mdi-cancel</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
// import gql from "graphql-tag";
import GetShifts from "../graphql/GetShifts.gql";
import AddShift from "../graphql/AddShift.gql";
import CloseShift from "../graphql/CloseShift.gql";
import moment from "moment";
export default {
  beforeDestroy() {
    clearInterval(this.interval);
  },
  mounted() {
    this.interval = setInterval(this.time, 1000);
  },
  methods: {
    colorRow(item) {
      if (item.Shifts[0]) {
        if (item.Shifts[0].time_in != null && item.Shifts[0].time_out == null) {
          return "light-green lighten-1";
        }
      }
    },
    time() {
      this.datenow = moment()
        .locale("de")
        .format("LLLL");
    },
    pinCheck() {
      this.loadingPinCheck = true;
      const pinInput = this.pinInput;
      const userPin = this.selectedEmployee.pin;
      this.$apollo.queries.Shifts.refetch().then(() => {
        this.loadingPinCheck = false;
        if (this.selectedEmployee.Shifts[0]) {
          if (
            this.selectedEmployee.Shifts[0].time_in != null &&
            this.selectedEmployee.Shifts[0].time_out == null
          ) {
            this.startBtnDisabled = true;
            this.outBtnDisabled = false;
          } else {
            this.startBtnDisabled = false;
            this.outBtnDisabled = true;
          }
        } else {
          this.startBtnDisabled = false;
          this.outBtnDisabled = true;
        }
        this.pinInput = "";
        if (pinInput == userPin) {
          console.log("success");
          this.pinSnackbar = true;
          this.pinSuccess = true;
        } else {
          this.pinSnackbarWrong = true;
          console.log("Wrong PIN");
        }
      });
    },
    rowClick: function(item, row) {
      row.select(!row.isSelected);
      this.selectedEmployee = row.isSelected == true ? "" : item;
      this.pinSuccess = false;
    },
    generateTableData(resultData) {
      console.log(resultData);
      for (const entry in resultData.Shifts) {
        console.log(resultData.Shifts[entry]);
      }
    },
    addShift() {
      this.formNewEmployee = false;
      this.loadingAddShift = true;
      this.$apollo
        .mutate({
          mutation: AddShift,
          variables: {
            employee_id: this.selectedEmployee.id,
            time_in: new Date().toUTCString(),
          },
        })
        .then(() => {
          this.selectedEmployee = "";
          this.pinInput = "";
          this.loadingAddShift = false;
          this.$apollo.queries.Shifts.refetch();
        });
    },
    closeShift() {
      this.loadingCloseShift = true;
      this.$apollo
        .mutate({
          mutation: CloseShift,
          variables: {
            shift_id: this.selectedEmployee.Shifts[0].id,
            time_out: new Date().toUTCString(),
          },
        })
        .then(() => {
          this.selectedEmployee = "";
          this.loadingCloseShift = false;
          this.pinInput = "";
          this.$apollo.queries.Shifts.refetch();
        });
    },
  },
  apollo: {
    // Employees: {
    //   query: Employees_QUERY,
    // },
    Shifts: {
      query: GetShifts,
      // result({ data }) {
      //   this.generateTableData(data);
      // },
    },
  },
  data: () => ({
    headers: [
      {
        text: "Name",
        value: "name",
      },
    ],
    pinInput: "",
    selectedEmployee: "",
    pinSuccess: false,
    pinSnackbar: false,
    pinSnackbarWrong: false,
    datenow: "",
    startBtnDisabled: true,
    outBtnDisabled: true,
    loadingPinCheck: false,
    loadingAddShift: false,
    loadingCloseShift: false,
  }),
};
</script>

<style>
.theme--light.v-data-table tbody tr.v-data-table__selected {
  background: #1976d2 !important;
  color: white;
  font-weight: 700;
}
.theme--light.v-data-table tbody tr.v-data-table__selected:hover {
  background: #1976d2 !important;
  color: white;
}
</style>
