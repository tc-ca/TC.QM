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
      type="number"
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
      value: '',
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
                if (value.length <= 0) {
                  return errorMessage
                }
              } else if (ruleDefinition.type === 'min') {
                if (Number(value) < ruleDefinition.value) {
                  return errorMessage.replace('{0}', ruleDefinition.value)
                }
              } else if (ruleDefinition.type === 'max') {
                if (Number(value) > ruleDefinition.value) {
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
      if (args.value === '') {
        args.value = null
      } else {
        args.value = Number(args.value)
      }

      this.$emit('change', args)
    },
    onError (error) {
      this.$emit('error', error)
    }
  }
}
</script>

<style scoped>

</style>
