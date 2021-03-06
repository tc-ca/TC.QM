<template>
  <v-list-group
    v-show="displayComment"
  >
    <template v-slot:activator>
      <v-list-item-title
        class="subtitle-1"
        style="color:#757575"
      >
        <v-row>
          <v-col>
            {{ label }}
            <v-icon
              v-if="isCommentRequired"
              color="red"
              small
            >
              mdi-alpha-r-box-outline
            </v-icon>
            <v-icon
              v-else
              color="primary"
              small
            >
              mdi-alpha-o-box-outline
            </v-icon>
          </v-col>
        </v-row>
      </v-list-item-title>
      <v-list-item-action>
        <v-icon
          v-if="errorInComment"
          color="red"
        >
          mdi-exclamation
        </v-icon>
      </v-list-item-action>
    </template>
    <v-list-item>
      <v-list-item-content>
        <v-textarea
          v-if="isExternalComment"
          ref="textArea"
          v-model="result.externalComment"
          prepend-inner-icon="mdi-message-text-outline"
          auto-grow
          outlined
          filled
          clearable
          :disabled="readOnly"
          clear-icon="mdi-close-circle"
          :placeholder="placeholderText"
          rows="1"
          :hint="hint"
          :rules="rules"
        >
          <v-icon
            v-if="isCommentRequired"
            slot="append"
            small
            color="red"
          >
            mdi-exclamation
          </v-icon>
        </v-textarea>
        <v-textarea
          v-else
          ref="textArea"
          v-model="result.internalComment"
          prepend-inner-icon="mdi-message-text-outline"
          auto-grow
          outlined
          filled
          clearable
          :disabled="readOnly"
          clear-icon="mdi-close-circle"
          :placeholder="placeholderText"
          rows="1"
          :hint="hint"
          :rules="rules"
        >
          <v-icon
            v-if="isCommentRequired"
            slot="append"
            small
            color="red"
          >
            mdi-exclamation
          </v-icon>
        </v-textarea>
      </v-list-item-content>
    </v-list-item>
  </v-list-group>
</template>

<script>
import { mapState } from 'vuex'

export default {
  emits: ['error'],
  props: {
    isExternalComment: {
      type: Boolean,
      required: true
    },
    commentRequirement: {
      type: String,
      required: true
    },
    result: {
      type: Object,
      required: true
    },
    label: {
      type: String,
      required: true
    },
    hint: {
      type: String,
      required: false,
      default: ''
    },
    question: {
      type: Object,
      required: true
    },
    group: {
      type: Object,
      required: true
    },
    saveToProp: {
      type: String,
      required: true
    },
    readOnly: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
      rules: [
        value => !this.displayComment || !this.isCommentRequired ? true : !!this.commentRequirement || 'Required.'
      ],
      response: '',
      validationStatus: false,
      notification: null
    }
  },
  computed: {
    placeholderText () {
      return this.isCommentRequired ? this.$t('app.questionnaire.group.question.commentRequired') : this.$t('app.questionnaire.group.question.commentOptional')
    },
    isCommentRequired () {
      return this.commentRequirement === 'required'
    },
    displayComment () {
      return this.commentRequirement !== 'n/a'
    },
    errorInComment () {
      return this.displayComment && this.isCommentRequired && (this.isExternalComment ? !this.result.externalComment : !this.result.internalComment)
    },
    ...mapState({
      lang: state => {
        if (!state || !state.settings) {
          return 'en'
        }
        return state.settings.settings.lang
      }
    })
  }//,
  // watch: {
  //   'comment.display' (newValue) {
  //     if (!newValue) {
  //       this.onError(false)
  //     }
  //   }
  // },
  // mounted () {
  //   this.$watch(
  //     '$refs.textArea.validations',
  //     (newValue) => {
  //       this.onError(this.errorInComment)
  //     }
  //   )
  // }
}
</script>

<style scoped>
.v-expansion-panel-header {
  padding-left: 4px !important;
}
</style>

/*
  @change="handler($event)" on v-textarea
*/
