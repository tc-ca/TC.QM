<template>
  <div>
    <v-text-field
      ref="textControl"
      v-model="value"
      outlined
      filled
      dense
      validate-on-blur
      type="number"
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
    }
  },
  data () {
    return {
      value: ''
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
  }
}
</script>

<style scoped>

</style>
