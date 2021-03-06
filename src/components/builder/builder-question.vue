<template>
  <v-expansion-panel
    :class="{selected: question === selectedQuestion}"
  >
    <v-expansion-panel-header
      ripple
      @click="editQuestion($event)"
    >
      <template
        #actions
      />

      <div
        :style="{fontSize:'16px !important'}"
      >
        <span class="text-break">{{ questionText }}</span>
      </div>
    </v-expansion-panel-header>
    <v-expansion-panel-content eager>
      <v-row @click="editQuestion($event)">
        <v-col cols="12">
          <div class="mt-5">
            <response
              :question="question"
              :group="group"
            />
          </div>

          <div>
            <v-expansion-panels
              v-model="childQuestionPanels"
              hover
              focusable
              multiple
            >
              <builder-question
                v-for="(childQuestion, questionIndex) in question.childQuestions"
                ref="groupQuestion"
                :key="questionIndex"
                :question="childQuestion"
                :selected-question="selectedQuestion"
                :group="group"
                :questionnaire="questionnaire"
                :index="questionIndex"
                :title-style="{fontSize:'16px !important'}"
                @editQuestion="editChildQuestion"
                @childQuestionAdded="onChildQuestionAdded"
                @childQuestionRemoved="onChildQuestionRemoved"
                @removeQuestion="removeChildQuestion(childQuestion)"
              />
            </v-expansion-panels>
          </div>
          <v-row
            justify="center"
            align="center"
            class="ma-2"
          >
            <div v-if="isAddChildQuestionAllowed">
              <v-col
                class="col-auto"
              >
                <v-btn
                  :disabled="question.type === reference"
                  @click="addQuestion($event)"
                >
                  {{ $t('app.builder.group.question.addChildQuestion') }}
                </v-btn>
              </v-col>
            </div>
            <v-col
              class="col-auto"
            >
              <v-tooltip
                top
                open-delay="300"
              >
                <template #activator="{ on, attrs }">
                  <v-btn
                    small
                    icon
                    @click="confirmRemoveQuestion()"
                  >
                    <v-icon
                      small
                      v-bind="attrs"
                      v-on="on"
                    >
                      mdi-delete
                    </v-icon>
                  </v-btn>
                </template>
                <span>{{ $t('app.builder.group.question.removeQuestion') }}</span>
              </v-tooltip>
            </v-col>
          </v-row>

          <v-dialog
            v-model="confirmDialogOpen"
            max-width="290"
          >
            <v-card>
              <v-card-title class="headline">
                {{ $t('app.builder.group.question.delete') }}
              </v-card-title>

              <v-card-actions>
                <v-spacer />

                <v-btn
                  color="error"
                  text
                  @click="confirmDialogOpen = false; removeQuestion()"
                >
                  {{ $t('app.builder.group.question.yes') }}
                </v-btn>

                <v-btn
                  text
                  @click="confirmDialogOpen = false"
                >
                  {{ $t('app.builder.group.question.no') }}
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-col>
      </v-row>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
import { mapState } from 'vuex'
import Response from './response/response'
import BuilderService from '../../services/builderService'
import { QUESTION_TYPE } from '../../data/questionTypes'

export default {
  emits: ['childQuestionAdded', 'removeQuestion', 'childQuestionRemoved', 'editQuestion'],
  name: 'BuilderQuestion',
  components: {
    Response
  },
  props: {
    question: {
      type: Object,
      required: true
    },
    selectedQuestion: {
      type: Object,
      default: null
    },
    group: {
      type: Object,
      required: true
    },
    questionnaire: {
      type: Object,
      required: true
    },
    index: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      confirmDialogOpen: false,
      childQuestionPanels: [],
      reference: QUESTION_TYPE.REFERENCE
    }
  },
  computed: {
    isAddChildQuestionAllowed () {
      return BuilderService.isParentAGroup(this.group, this.question.guid)
    },
    questionText () {
      // return `${this.index + 1}. ${this.question.text[this.lang]}`
      return `${this.question.text[this.lang]}`
    },
    ...mapState({
      lang: state => {
        if (!state || !state.settings) {
          return 'en'
        }
        return state.settings.settings.lang
      }
      // selectedQuestion: state => state.builder.selectedQuestion
    })
  },
  methods: {
    addQuestion ($event) {
      $event.stopPropagation()

      const childQuestion = BuilderService.createQuestion(this.question)
      this.question.childQuestions.push(childQuestion)
      this.childQuestionPanels.push(childQuestion.sortOrder - 1)
      this.$emit('childQuestionAdded', childQuestion)
    },
    confirmRemoveQuestion () {
      this.confirmDialogOpen = true
    },
    removeQuestion () {
      this.$emit('removeQuestion', this.group, this.question)
    },
    removeChildQuestion (childQuestion) {
      const idx = this.question.childQuestions.findIndex(cq => cq.guid === childQuestion.guid)
      if (idx > -1) {
        this.question.childQuestions.splice(idx, 1)
      }
      this.$emit('childQuestionRemoved', childQuestion)
    },
    editQuestion ($event) {
      $event.stopPropagation()
      this.$emit('editQuestion', this.group, this.question)
    },
    editChildQuestion (question, group) {
      this.$emit('editQuestion', question, group)
    },
    onChildQuestionAdded (childQuestion) {
      this.$emit('childQuestionAdded', childQuestion)
    },
    onChildQuestionRemoved (childQuestion) {
      this.$emit('childQuestionRemoved', childQuestion)
    }
  }
}
</script>

<style scoped>
.selected {
    box-shadow: 0 0px 5px 0 rgba(255, 0, 0, 1);
  }
</style>
