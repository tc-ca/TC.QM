<template>
  <div>
    <text-response
      v-if="question.type === text || question.type === reference"
      :question="question"
      :read-only="readOnly"
      @change="onChange"
      @error="onError"
    />

    <radio-response
      v-if="question.type === radio"
      :group="group"
      :question="question"
      :read-only="readOnly"
      @change="onChange"
      @error="onError"
    />

    <select-response
      v-if="question.type === select"
      :group="group"
      :question="question"
      :read-only="readOnly"
      @change="onChange"
      @error="onError"
    />

    <!-- <image-response
      v-if="question.type === image"
      :group="group"
      :question="question"
      :read-only="readOnly"
      @change="onChange"
      @error="onError"
    /> -->

    <number-response
      v-if="question.type === number"
      :group="group"
      :question="question"
      :read-only="readOnly"
      @change="onChange"
      @error="onError"
    />
  </div>
</template>

<script>

import TextResponse from './text-response.vue'
import RadioResponse from './radio-response.vue'
import SelectResponse from './select-response.vue'
// import ImageResponse from './image-response.vue'
import NumberResponse from './number-response.vue'
import { QUESTION_TYPE } from '../../../../../data/questionTypes'

export default {
  emits: ['change', 'error'],
  components: { TextResponse, RadioResponse, SelectResponse, NumberResponse },
  props: {
    question: {
      type: Object,
      required: true
    },
    group: {
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
      text: QUESTION_TYPE.TEXT,
      radio: QUESTION_TYPE.RADIO,
      select: QUESTION_TYPE.SELECT,
      // image: QUESTION_TYPE.IMAGE,
      number: QUESTION_TYPE.NUMBER,
      reference: QUESTION_TYPE.REFERENCE
    }
  },

  methods: {
    onChange (args) {
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
