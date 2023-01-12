<script>
import { ref } from 'vue';

export default {
  setup() {
    return {
      inputFirstName: ref(''),
      inputSurName: ref(''),
      inputBirthday: ref(''),
      inputPatientId: ref(''),
      inputCaseId: ref(''),
      inputEmail: ref(''),
      inputAddress: ref(''),
      namePracticioner: ref(''),
    };
  },
  data() {
    return {
      patients: [],
      foundFlag: false,
      showPatientList: true,
    };
  },
  methods: {
    /**
     * Removes the patient at the given position via the index
     * @param index the index of the position as a int
     */
    removePatient(index) {
      this.patients.splice(index, 1);
      localStorage.setItem('patientsArray', JSON.stringify(this.patients));
    },
    /**
     * Creates a patient object
     * @param firstName the first name of the patient as string
     * @param familyName the family name of the patient as a string
     * @param address the country of the patient as a string
     * @param birthdate the birthdate of the patient as a string
     * @param patID the id of the patient as a string
     * @param caseID the case id of the clinical case as a string
     * @param registered boolean which tracks if the patient has an account
     * @param fhirID the FHIR ID of the patient ressource as string
     * @param questionnaireCompletedFlag boolean which tracks if the patient has already
     *                                    completed the questionnaire
     */
    createPatient(
      firstName,
      familyName,
      address,
      birthdate,
      patID,
      caseID,
      registered,
      fhirID,
      questionnaireCompletedFlag
    ) {
      const patient = {
        firstName: firstName,
        familyName: familyName,
        address: address,
        birthdate: birthdate,
        patID: patID,
        caseID: caseID,
        registered: registered,
        patFHIRID: fhirID,
        questionnaireCompletedFlag: questionnaireCompletedFlag,
      };
      return patient;
    },

    /**
     * fetches the patient and if the patient wasnt found, returns a empty patient
     * ressource which creates and pushes the new patient into the patients array
     */
    async enterPatient() {
      const patient = await this.$midata
        .getPatient(this.inputFirstName) // Search the patients in midata based on the Name surname and Birthday given in the frontend.
        .catch((e) => {
          e.name[0].given[0] = this.inputFirstName;
          e.name[0].family = this.inputSurName;
          e.birthDate = this.inputBirthday.substring(0, 4);
          e.identifier[0].value = this.inputPatientId;
          console.log(
            `The patient ${e.name[0].given[0]} was addedd to patients[]`
          );

          this.patients.push(
            this.createPatient(
              e.name[0].given[0],
              e.name[0].family,
              e.address[0].country,
              e.birthDate,
              e.identifier[0].value,
              this.inputCaseId,
              false,
              this.$midata.makeid,
              false
            )
          );
        });

      if (patient) {
        if (patient.name[0].given == this.inputFirstName) {
          this.foundFlag = true;
          this.patients.push(
            this.createPatient(
              patient.name[0].given[0],
              patient.name[0].family,
              patient.address[0].country,
              this.inputBirthday,
              this.inputPatientId,
              this.inputCaseId,
              true,
              patient.id,
              false
            )
          );
        } else {
          console.log('Bundle not delivered. no patient added');
        }

        this.inputFirstName = '';
        this.inputSurName = '';
        this.inputBirthday = '';
        this.inputPatientId = '';
        this.inputCaseId = '';
        this.inputEmail = '';
        this.inputAddress = '';
      }

      localStorage.setItem('patientsArray', JSON.stringify(this.patients));
    },
    /**
     * Proceeds to the next screen
     * also saves the list of patients to the localstorage session and removes the selected patient
     * from the list as he has already done the questionnaire
     */
    savePatientToStorage(item) {
      this.$storage.setCurrentPatient(item);
      this.$midata.setCaseID(item.caseID);

      const patientIndex = this.patients.findIndex((patient) => {
        return patient.firstName === item.firstName;
      });

      if (patientIndex !== -1) {
        this.patients[patientIndex].questionnaireCompletedFlag = true;
      }

      localStorage.setItem('patientsArray', JSON.stringify(this.patients));
      this.removePatient(item);
    },
  },
  updated() {
    const namePracticioner = [
      this.$storage.getPractitioner()?.name[0]?.family,
      this.$storage.getPractitioner()?.name[0]?.given[0],
    ].join(' ');
    localStorage.setItem('namePracticioner', JSON.stringify(namePracticioner));
    this.namePracticioner = namePracticioner;
  },
  mounted() {
    const stringiFiedPatients = localStorage.getItem('patientsArray');

    if (stringiFiedPatients != null) {
      this.patients = JSON.parse(stringiFiedPatients);
    }
    this.namePracticioner = localStorage.getItem(
      'namePracticioner',
      JSON.stringify(this.namePracticioner)
    );
  },
};
</script>

<template>
  <div class="wrapper">
    <div>
      <H2>Patient Search</H2>
      <div class="q-pa-md" style="max-width: 700px">
        <table width="100%" border="0">
          <tr>
            <td>
              <div class="q-pa-md q-gutter-y-md">
                <q-chip size="30px">
                  <q-avatar size="90px">
                    <img src="../assets/digitalprom/stet.png" />
                  </q-avatar>
                  <td>
                    <h5>{{ this.namePracticioner }}</h5>
                  </td>
                </q-chip>
              </div>
            </td>
          </tr>

          <tr>
            <td>
              <q-input
                outlined
                v-model="inputFirstName"
                label="Vorname"
                id="name"
                @input="enterPatient()"
              />
            </td>
          </tr>
          <tr>
            <td>
              <q-input
                outlined
                v-model="inputSurName"
                label="Familienname"
                id="surname"
              />
            </td>
          </tr>

          <tr>
            <td>
              <q-input
                outlined
                v-model="inputPatientId"
                label="Patienten ID"
                id="patientId"
              />
            </td>
          </tr>
          <tr>
            <td>
              <q-input
                outlined
                v-model="inputCaseId"
                label="Fall ID"
                id="caseID"
              />
            </td>
          </tr>
          <tr>
            <td>
              <q-input
                outlined
                v-model="inputBirthday"
                mask="date"
                :rules="['date']"
                label="Geburtstagsdatum"
              >
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy
                      cover
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-date v-model="inputBirthday">
                        <div class="row items-center justify-end">
                          <q-btn
                            class="button"
                            v-close-popup
                            label="Close"
                            color="primary"
                            flat
                          />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </td>
          </tr>
        </table>
        <q-btn
          class="button button-font"
          color="primary"
          label="Erfassen"
          @click="enterPatient()"
        />
      </div>
    </div>
    <div class="result" v-show="showPatientList">
      <q-list bordered separator>
        <q-item
          clickable
          v-for="item in patients"
          :key="item.familyName"
          class="item-wrapper"
        >
          <q-item-section>
            <q-item-label overline> Patient </q-item-label>
            <q-item-label>
              {{ item.firstName }} {{ item.familyName }}
            </q-item-label>

            <q-item-label overline> Pat.ID </q-item-label>
            <q-item-label>
              {{ item.patID }}
            </q-item-label>

            <q-item-label overline> Fall ID </q-item-label>
            <q-item-label>
              {{ item.caseID }}
            </q-item-label>
          </q-item-section>

          <q-item-section class="button">
            <q-btn
              class="button-font"
              push
              color="primary"
              v-bind:label="
                item.registered ? 'PROM beantworten' : 'Patient registrieren'
              "
              size="10px"
              v-bind:to="item.registered ? '/prom' : 'patfile'"
              @click="savePatientToStorage(item)"
            />
          </q-item-section>
          <q-item-section class="button">
            <q-btn-dropdown color="primary" label="Verzicht">
              <q-list>
                <q-item clickable v-close-popup @click="removePatient(index)">
                  <q-item-section>
                    <q-item-label>Sprache</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item clickable v-close-popup @click="removePatient(index)">
                  <q-item-section>
                    <q-item-label>Gesundheitszustand</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item clickable v-close-popup @click="removePatient(index)">
                  <q-item-section>
                    <q-item-label>Patient will nicht</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item clickable v-close-popup @click="removePatient(index)">
                  <q-item-section>
                    <q-item-label>Versäumnis der Klinik</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item clickable v-close-popup @click="removePatient(index)">
                  <q-item-section>
                    <q-item-label>Entlassung</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>
          </q-item-section>
        </q-item>
      </q-list>
    </div>
  </div>
</template>

<style lang="scss" scoped>
h2 {
  margin: 0;
  padding-top: 30px;
}
.wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
}
.item-wrapper {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  grid-gap: 10px;
}

.button {
  max-width: 150px;
  margin-left: 50%;
  transform: translateX(-50%);
}
.button-font {
  font-size: 120%;
}
.result {
  width: 500px;
  margin: 0;
  margin-bottom: 30px;
  padding: 40px;
  font-size: 20px;
  @media only screen and (max-width: 520px) {
    width: 100%;
  }
}
</style>