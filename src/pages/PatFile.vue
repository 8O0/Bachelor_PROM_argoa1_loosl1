<script>
import { ref } from 'vue';

export default {
  // name: 'PageName',
  setup() {
    return {
      firstName: ref(''),
      lastName: ref(''),
      address: ref(''),
      patID: ref(''),
      caseID: ref(''),
      email: ref(''),
      birthdate: ref(''),
      text: ref(''),
      gender: ref(''),
      right: ref(false),
    };
  },
  data() {
    return {
      patient: this.$storage.getPatient(),
    };
  },
  mounted() {
    this.firstName = this.patient.name[0].given[0];
    this.lastName = this.patient.name[0].family;
    this.address = this.patient.address[0].country;
    this.patID = this.patient.identifier[0].value;
    this.caseID = this.$midata.getCaseID();
    this.birthdate = this.patient.birthDate;
  },
  methods: {
    /**
     * Updates the patient in the storage with the gender and the email     * 
     */
    async updatePatient() {
      this.patient.gender = this.gender;
      this.patient.telecom.email = this.email;
      this.patient = await this.$midata.createPatientMidata();
      this.$storage.updateCurrentPatient(
        this.email,
        this.gender,
        this.patient.id
      );
    },
  },
};
</script>


<template>
  <q-page class="wrapper">
    <div class="q-pa-md" style="max-width: 1000px">
      <div class="col-wrapper">
        <div class="column">
          <h3 class="lorem">Allgemeine Geschäftsbedingung</h3>
          <div class="lorem">
            <b>1. Anwendungsbereich</b><br />
            Alle Rechte an der SOFTWARE liegen bei der ANQ. Durch die Nutzung
            kommt zwischen den Patienten und ANQ ein Nutzungsvertrag zustande.
            <br /><br />
            <b>2. Leistungen und Pflichten von der ANQ</b><br />
            - Bereitstellung eines kostenfreien Accounts auf MIDATA mit welchem
            der Patient auf seine Daten zugreifen kann. - Support über die ANQ
            bezüglich des Accounts. - Zugriffssicherheit gewährleisten nach
            bestem Wissen und Gewissen. - Löschung auf Anfrage des Accounts
            <br /><br />
            <b>3. Applikation</b><br />
            Zentrales Hilfsmittel ist eine Webapplikation, mit welcher die
            Qualität des Gesundheitswesens verbessert werden soll.
            <br /><br />
            <b>4. Leistungen und Pflichten des Nutzenden</b><br />
            Die Nutzung dieser Applikation und das Ausfüllen dieses Fragebogens
            ist freiwillig.
            <br /><br />
          </div>
          <div>
            <q-checkbox v-model="right" label="Ich stimme zu" />
          </div>
        </div>
        <div class="column">
          <h3>Neuen Patienten registrieren</h3>
          <table>
            <tr class="t-row">
              <td>
                <q-input outlined v-model="firstName" label="Name" readonly />
              </td>
              <td class="col_">
                <q-input
                  outlined
                  v-model="lastName"
                  label="Nachname"
                  readonly
                />
              </td>
            </tr>
            <tr class="t-row">
              <td colspan="2">
                <div class="q-gutter-sm">
                  <q-radio v-model="gender" val="male" label="Männlich" />
                  <q-radio v-model="gender" val="female" label="Weiblich" />
                  <q-radio v-model="gender" val="other" label="Andere" />
                </div>
              </td>
            </tr>
            <tr class="t-row">
              <td class="col_">
                <q-input outlined v-model="email" label="email" />
              </td>
              <td class="col_">
                <q-input
                class=""
                  outlined
                  v-model="birthdate"
                  label="Geburtsdatum"
                  readonly
                />
              </td>
            </tr>
            <tr class="t-row">
              <td class="col_">
                <q-input outlined v-model="patID" label="Patient ID" readonly />
              </td>
              <td class="col_">
                <q-input outlined v-model="caseID" label="Case ID" readonly />
              </td>
            </tr>

            <tr class="t-row">
              <td class="col_">
                <q-btn
                  color="primary"
                  label="Patient Registrieren"
                  to="prom"
                  @click="updatePatient()"
                  class="button"
                />
              </td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  </q-page>
</template>

<style  lang="scss" scoped>
h2 {
  font-size: 40px;
  font-weight: 500;
}
.wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
}
.col-wrapper {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
}
.column {
  float: left;
  width: 100%;
}
.button {
  margin: 20px;
  margin-left: 0;
  height: 200%;
  font-size: 200%;
}
#q-input{
    height: 200%;
  font-size: 200%;
}

@media screen and (max-width: 800px) {
  .column {
    width: 100%;
  }
}
</style>
