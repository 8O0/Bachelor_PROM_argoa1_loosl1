<script>
import { PROM, ENCOUNTER, EPISODE_OF_CARE } from '../data/FHIRressources';
export default {
  name: 'Prom',

  data() {
    return {
      answer1: Number,
      answer2: Number,
      answer3: Number,
      answer4: Number,
      answer5: Number,
      answer6: Number,
      answer7: Number,
      answer8: Number,
      answer9: Number,
      answer10: Number,
      patient: this.$storage.getPatient(),
    };
  },
  setup() {
    return {};
  },
  methods: {
    /**
     * sets all the answers into the FHIR questionnaire ressource
     * also creates the FHIR ID for the questionnaire and the encounter
     * Then links the episode of care with the encounter
     */
    async setQuestionaire() {
      const questionnaireResponse = PROM;
      const encounterFHIRID = `${this.$midata.makeid(12)}`;
      const questionnaireFHIRID = `${this.$midata.makeid(12)}`;
      questionnaireResponse.id = questionnaireFHIRID;
      questionnaireResponse.encounter.reference = `Encounter/${encounterFHIRID}`;
      questionnaireResponse.status = 'completed';
      questionnaireResponse.subject.reference = `Patient/${this.patient.id}`;
      questionnaireResponse.subject.display = `${this.patient.name[0].family} ${this.patient.name[0].given[0]}`;
      questionnaireResponse.item[0].answer[0].valueInteger = this.answer1;
      questionnaireResponse.item[1].answer[0].valueInteger = this.answer2;
      questionnaireResponse.item[2].answer[0].valueInteger = this.answer3;
      questionnaireResponse.item[3].answer[0].valueInteger = this.answer4;
      questionnaireResponse.item[4].answer[0].valueInteger = this.answer5;
      questionnaireResponse.item[5].answer[0].valueInteger = this.answer6;
      questionnaireResponse.item[6].answer[0].valueInteger = this.answer7;
      questionnaireResponse.item[7].answer[0].valueInteger = this.answer8;
      questionnaireResponse.item[8].answer[0].valueInteger = this.answer9;
      questionnaireResponse.item[9].answer[0].valueInteger = this.answer10;

      const episodeOfCare = await this.getActiveEpisodeOfCare();
      const encounter = this.createEncounter(encounterFHIRID, episodeOfCare.id);

      console.log(
        `QuestionnaireResponse: ${JSON.stringify(
          questionnaireResponse
        )}\n\nEncounter: ${JSON.stringify(
          encounter
        )}\n\nEpisodeOfCare: ${JSON.stringify(
          episodeOfCare
        )}\n\nPatient: ${JSON.stringify(this.$storage.getPatient())}`
      );
      // Decides if the patient is filling out the questionnaire upon entry or upon exit
      if (episodeOfCare.status == 'planned') {
        episodeOfCare.status = 'active';
        this.$midata.createEpisodeOfCareMidata(episodeOfCare);
      } else {
        episodeOfCare.status = 'finished';
        this.$midata.updateEpisodeOfCareMidata(episodeOfCare);
      }
      this.$midata.createEncounterMidata(encounter);
      this.$midata.createQuestionnaireResponseMidata(questionnaireResponse);
    },
    /**
     * creates the enocunter ressource
     * @param encounterFHIRID the fhir id of the encounter as a string
     * @param episodeOfCareFHIRID the fhir id of the episode of care as a string
     * @returns an encounter object
     */
    createEncounter(encounterFHIRID, episodeOfCareFHIRID) {
      const encounter = ENCOUNTER;

      encounter.id = encounterFHIRID;
      encounter.episodeOfCare[0].reference = `EpisodeOfCare/${episodeOfCareFHIRID}`;
      encounter.subject.display = `${this.patient.name[0].family} ${this.patient.name[0].given[0]}`;
      encounter.subject.reference = `Patient/${this.patient.id}`;
      return encounter;
    },
    /**
     * gets the episode of care if there is an active one
     * if no active episode of care has been found, a new
     * episode of care will be created via getNewEpisodeOfCare().
     * @returns the episode of care as an object
     */
    async getActiveEpisodeOfCare() {
      const activeEOC = await this.$midata
        .getEpisodeOfCare(this.patient.id)
        .catch((e) => console.log(e));
      const episodeOfCare = activeEOC ? activeEOC : this.getNewEpisodeOfCare();
      episodeOfCare.patient.display = `${this.patient.name[0].family} ${this.patient.name[0].given[0]}`;
      episodeOfCare.patient.reference = `Patient/${this.patient.id}`;
      return episodeOfCare;
    },
    /**
     * a new episode of care is created and the id and case
     * identifier are being set as well as the organisation which is hardcorded as midata doesnt support
     * adjusting the practicioner ressource yet
     * @returns the episode of care as an object
     */
    getNewEpisodeOfCare() {
      const episodeOfCare = EPISODE_OF_CARE;
      this.fhirCaseID = this.$midata.makeid(12);
      episodeOfCare.status = 'planned';
      episodeOfCare.id = this.fhirCaseID;
      episodeOfCare.identifier[0].value = this.currentCaseID;

      // would be solved with this.getOrganization() but it isnt possible to reference an organization to a practicioner in midata, which is why its simulated here
      episodeOfCare.identifier[0].assigner.display = 'Reha Bern AG';
      episodeOfCare.identifier[0].assigner.reference =
        'Organization/63777a87ab51910677069bfe';
      return episodeOfCare;
    },
    /**
     * creates all the ressources cia the setQuestionnaire() function
     */
    completeBtnPressed() {
      this.setQuestionaire();
    },
  },
};
</script>
<template>
  <q-page padding>
    <table>
      <tr>
        <td style="background-color: rgb(255, 255, 255)">
          <h4>Bitte kreuzen Sie zu jeder Frage ein K??stchen an.</h4>
        </td>
        <td class="scale formtd">Ausgezeichnet</td>
        <td class="scale formtd">Sehr gut</td>
        <td class="scale formtd">Gut</td>
        <td class="scale formtd">Einigerma??en</td>
        <td class="scale formtd">Schlecht</td>
      </tr>
      <tr>
        <td class="question" id="answer1" name="answer1">
          Wie w??rden Sie Ihren Gesundheitszustand insgesamt beschreiben?<br />
        </td>
        <td class="col_form">
          <q-radio v-model="answer1" val="5" size="35px" /><br />5
        </td>
        <td class="col_form">
          <q-radio v-model="answer1" val="4" size="35px" /><br />4
        </td>
        <td class="col_form">
          <q-radio v-model="answer1" val="3" size="35px" /><br />3
        </td>
        <td class="col_form">
          <q-radio v-model="answer1" val="2" size="35px" /><br />2
        </td>
        <td class="col_form">
          <q-radio v-model="answer1" val="1" size="35px" /><br />1
        </td>
      </tr>
      <tr>
        <td colspan="6" class="separators"></td>
      </tr>
      <tr>
        <td class="answer">
          Wie w??rden Sie Ihre Lebensqualit??t insgesamt beschreiben?
        </td>
        <td class="col_form">
          <q-radio v-model="answer2" val="5" size="35px" /><br />5
        </td>
        <td class="col_form">
          <q-radio v-model="answer2" val="4" size="35px" /><br />4
        </td>
        <td class="col_form">
          <q-radio v-model="answer2" val="3" size="35px" /><br />3
        </td>
        <td class="col_form">
          <q-radio v-model="answer2" val="2" size="35px" /><br />2
        </td>
        <td class="col_form">
          <q-radio v-model="answer2" val="1" size="35px" /><br />1
        </td>
      </tr>
      <tr>
        <td colspan="6" class="separators"></td>
      </tr>
      <tr>
        <td class="answer">
          Wie w??rden Sie Ihren k??rperlichen Gesundheitszustand insgesamt
          beschreiben?
        </td>
        <td class="col_form">
          <q-radio v-model="answer3" val="5" size="35px" /><br />5
        </td>
        <td class="col_form">
          <q-radio v-model="answer3" val="4" size="35px" /><br />4
        </td>
        <td class="col_form">
          <q-radio v-model="answer3" val="3" size="35px" /><br />3
        </td>
        <td class="col_form">
          <q-radio v-model="answer3" val="2" size="35px" /><br />2
        </td>
        <td class="col_form">
          <q-radio v-model="answer3" val="1" size="35px" /><br />1
        </td>
      </tr>
      <tr>
        <td colspan="6" class="separators"></td>
      </tr>
      <tr>
        <td class="answer">
          Wie w??rden Sie Ihre psychische Verfassung insgesamt beschreiben? Dazu
          z??hlen Ihre Stimmung und Ihre F??higkeit, klar zu denken.
        </td>
        <td class="col_form">
          <q-radio v-model="answer4" val="5" size="35px" /><br />5
        </td>
        <td class="col_form">
          <q-radio v-model="answer4" val="4" size="35px" /><br />4
        </td>
        <td class="col_form">
          <q-radio v-model="answer4" val="3" size="35px" /><br />3
        </td>
        <td class="col_form">
          <q-radio v-model="answer4" val="2" size="35px" /><br />2
        </td>
        <td class="col_form">
          <q-radio v-model="answer4" val="1" size="35px" /><br />1
        </td>
      </tr>
      <tr>
        <td colspan="6" class="separators"></td>
      </tr>
      <tr>
        <td class="question">
          Wie zufrieden sind Sie insgesamt mit Ihren Aktivit??ten mit anderen
          Menschen und mit Ihren Beziehungen zu anderen?
        </td>
        <td class="col_form">
          <q-radio v-model="answer5" val="5" size="35px" /><br />5
        </td>
        <td class="col_form">
          <q-radio v-model="answer5" val="4" size="35px" /><br />4
        </td>
        <td class="col_form">
          <q-radio v-model="answer5" val="3" size="35px" /><br />3
        </td>
        <td class="col_form">
          <q-radio v-model="answer5" val="2" size="35px" /><br />2
        </td>
        <td class="col_form">
          <q-radio v-model="answer5" val="1" size="35px" /><br />1
        </td>
      </tr>
      <tr>
        <td colspan="6" class="separators"></td>
      </tr>
      <tr>
        <td class="question">
          Wie gut sind Sie insgesamt in der Lage, Aktivit??ten mit anderen
          Menschen nachzugehen und Ihre Rollen im Alltag und in der Gemeinschaft
          auszuf??llen? (Dazu z??hlen Aktivit??ten zu Hause, am Arbeitsplatz, in
          Ihrem Umfeld sowie Ihre Aufgaben als Elternteil, Sohn, Tochter,
          Lebenspartner/-in, im Berufsleben, in Ihrem Freundeskreis usw.)
          .........
        </td>
        <td class="col_form">
          <q-radio v-model="answer6" val="5" size="35px" /><br />5
        </td>
        <td class="col_form">
          <q-radio v-model="answer6" val="4" size="35px" /><br />4
        </td>
        <td class="col_form">
          <q-radio v-model="answer6" val="3" size="35px" /><br />3
        </td>
        <td class="col_form">
          <q-radio v-model="answer6" val="2" size="35px" /><br />2
        </td>
        <td class="col_form">
          <q-radio v-model="answer6" val="1" size="35px" /><br />1
        </td>
      </tr>
      <tr>
        <td colspan="6" class="separators"></td>
      </tr>
      <tr>
        <td style="background-color: rgb(255, 255, 255)"><strong></strong></td>
        <td class="scale">Vollst??ndig</td>
        <td class="scale">Gr????tenteils</td>
        <td class="scale">Halbwegs</td>
        <td class="scale">Ein wenig</td>
        <td class="scale">??berhaupt nicht</td>
      </tr>
      <tr>
        <td class="question">
          Inwieweit sind Sie in der Lage, allt??gliche k??rperliche Aktivit??ten
          auszuf??hren, z. B. Gehen, Treppensteigen, Eink??ufe tragen oder St??hle
          verschieben?
        </td>
        <td class="col_form">
          <q-radio v-model="answer7" val="5" size="35px" /><br />5
        </td>
        <td class="col_form">
          <q-radio v-model="answer7" val="4" size="35px" /><br />4
        </td>
        <td class="col_form">
          <q-radio v-model="answer7" val="3" size="35px" /><br />3
        </td>
        <td class="col_form">
          <q-radio v-model="answer7" val="2" size="35px" /><br />2
        </td>
        <td class="col_form">
          <q-radio v-model="answer7" val="1" size="35px" /><br />1
        </td>
      </tr>
      <tr>
        <td style="background-color: rgb(255, 255, 255)">
          <h4>In den letzten 7 Tagen:</h4>
        </td>
        <td class="scale">Nie</td>
        <td class="scale">Selten</td>
        <td class="scale">Manchmal</td>
        <td class="scale">Oft</td>
        <td class="scale">Immer</td>
      </tr>
      <tr>
        <td class="question">
          Wie oft haben Ihnen seelische Probleme zu schaffen gemacht, wie z. B.
          Angstgef??hle, Traurigkeit, Niedergeschlagenheit oder Reizbarkeit?
        </td>
        <td class="col_form">
          <q-radio v-model="answer8" val="5" size="35px" /><br />5
        </td>
        <td class="col_form">
          <q-radio v-model="answer8" val="4" size="35px" /><br />4
        </td>
        <td class="col_form">
          <q-radio v-model="answer8" val="3" size="35px" /><br />3
        </td>
        <td class="col_form">
          <q-radio v-model="answer8" val="2" size="35px" /><br />2
        </td>
        <td class="col_form">
          <q-radio v-model="answer8" val="1" size="35px" /><br />1
        </td>
      </tr>
      <tr>
        <td style="background-color: rgb(255, 255, 255)"></td>
        <td class="scale">Keine M??digkeit</td>
        <td class="scale">Schwach</td>
        <td class="scale">M????ig</td>
        <td class="scale">Stark</td>
        <td class="scale">Sehr stark</td>
      </tr>
      <tr>
        <td class="question">
          Wie ausgepr??gt war Ihre M??digkeit im Allgemeinen?
        </td>
        <td class="col_form">
          <q-radio v-model="answer9" val="5" size="35px" /><br />5
        </td>
        <td class="col_form">
          <q-radio v-model="answer9" val="4" size="35px" /><br />4
        </td>
        <td class="col_form">
          <q-radio v-model="answer9" val="3" size="35px" /><br />3
        </td>
        <td class="col_form">
          <q-radio v-model="answer9" val="2" size="35px" /><br />2
        </td>
        <td class="col_form">
          <q-radio v-model="answer9" val="1" size="35px" /><br />1
        </td>
      </tr>
      <tr>
        <td colspan="6" class="separators"></td>
      </tr>
    </table>
    <table width="100%">
      <tr>
        <td class="question">
          Wie w??rden Sie Ihre Schmerzen im Allgemeinen einsch??tzen?
        </td>
        <td rowspan="2" class="col_form">
          <q-radio v-model="answer10" val="0" size="35px" /><br />0
          <br /><strong>Keine Schmerzen</strong>
        </td>
        <td class="col_form">
          <q-radio v-model="answer10" val="1" size="35px" /><br />1
        </td>
        <td class="col_form">
          <q-radio v-model="answer10" val="2" size="35px" /><br />2
        </td>
        <td class="col_form">
          <q-radio v-model="answer10" val="3" size="35px" /><br />3
        </td>
        <td class="col_form">
          <q-radio v-model="answer10" val="4" size="35px" /><br />4
        </td>
        <td class="col_form">
          <q-radio v-model="answer10" val="5" size="35px" /><br />5
        </td>
        <td class="col_form">
          <q-radio v-model="answer10" val="6" size="35px" /><br />6
        </td>
        <td class="col_form">
          <q-radio v-model="answer10" val="7" size="35px" /><br />7
        </td>
        <td class="col_form">
          <q-radio v-model="answer10" val="8" size="35px" /><br />8
        </td>
        <td class="col_form">
          <q-radio v-model="answer10" val="9" size="35px" /><br />9
        </td>
        <td class="col_form">
          <q-radio v-model="answer10" val="10" size="35px" /><br />10
          <br /><strong>Schlimmste vorstellbare Schmerzen</strong>
        </td>
      </tr>
    </table>
    <br />
    <center>
      <q-btn
        color="primary"
        id="completeBtn"
        label="Beenden"
        size="20px"
        to="/ende"
        @click="completeBtnPressed()"
      />
    </center>
  </q-page>
</template>
