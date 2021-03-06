<template>
  <div class="mt-4">
    <v-text-field
      ref="textControl"
      v-model="value"
      outlined
      filled
      :disabled="readOnly"
      dense
      validate-on-blur
      clearable
      clear-icon="mdi-close-circle"
      :rules="validationRulesFuncs"
      @change="onChange($event)"
      @update:error="onError($event)"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {

  props: {
    question: {
      type: Object,
      required: true
    },
    readOnly: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
      value: null,
      validationRulesFuncs: [
        value => {
          if (this.question.isVisible) {
            for (let i = 0; i < this.question.validationRules.length; i++) {
              let ruleDefinition = this.question.validationRules[i]
              if (!ruleDefinition.enabled) {
                continue
              }
              let errorMessage = ruleDefinition.errorMessage[this.lang]
              if (ruleDefinition.type === 'require') {
                if (!value) {
                  return errorMessage
                }
              } else if (ruleDefinition.type === 'minLength') {
                if (!value || value.length < ruleDefinition.value) {
                  return errorMessage.replace('{0}', ruleDefinition.value)
                }
              } else if (ruleDefinition.type === 'maxLength') {
                if (!value || value.length > ruleDefinition.value) {
                  return errorMessage.replace('{0}', ruleDefinition.value)
                }
              }
            }
          }
          return true
        }
      ]
    }
  },
  computed: {
    ...mapState({
      lang: state => {
        if (!state || !state.settings) {
          return 'en'
        }
        return state.settings.settings.lang
      }
    })
  },
  mounted () {
    this.$watch(
      '$refs.textControl.validations.length',
      (newValue) => {
        this.onError(!!newValue)
      }
    )

    if (this.question.result && this.question.result.responses.length > 0) {
      this.value = this.question.result.responses[0].value
      this.onChange()
    }
  },
  methods: {
    onChange () {
      let args = {
        value: this.value
      }
      if (!args.value) {
        args.value = null
      }

      this.$emit('change', args)
    },
    onError (error) {
      this.$emit('error', error)
    }
  }
}
</script>

<style>

</style>
